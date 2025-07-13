import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Address, decodeEventLog, Hex } from "viem";
import MultisigWalletABI from "../../../packages/sdk/abi/MultisigWallet.json";

const BLOCK_CHUNK_SIZE = 500;

interface ActivityLogEntry {
  type: string;
  txId?: string;
  user?: string;
  timestamp: number;
}

let debounceTimer: NodeJS.Timeout;

export function useWalletActivityLogs(walletAddress: Address) {
  const client = usePublicClient();
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    if (!client || !walletAddress) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        const latestBlock = await client.getBlockNumber();
        const allLogs: ActivityLogEntry[] = [];

        // ✅ 1. Onchain logs
        for (let from = BigInt(0); from <= latestBlock; from += BigInt(BLOCK_CHUNK_SIZE)) {
          const to = from + BigInt(BLOCK_CHUNK_SIZE - 1);

          try {
            const chunkLogs = await client.getLogs({
              address: walletAddress,
              fromBlock: from,
              toBlock: to > latestBlock ? latestBlock : to,
            });

            for (const log of chunkLogs) {
              try {
                const decoded = decodeEventLog({
                  abi: MultisigWalletABI,
                  data: log.data as Hex,
                  topics: log.topics as [Hex, ...Hex[]],
                });

                const args = decoded.args as Record<string, any>;
                const txId = args?.txId?.toString();
                const user =
                  args?.sender ||
                  args?.executor ||
                  args?.removedOwner ||
                  args?.newOwner;

                allLogs.push({
                  type: decoded.eventName ?? "Unknown",
                  txId,
                  user: user?.toString(),
                  timestamp: Number(log.blockNumber),
                });
              } catch {
                // Skip invalid logs
              }
            }
          } catch (chunkErr) {
            console.warn("⏭️ Skipping chunk due to error:", chunkErr);
          }

          // ⏱️ Delay to avoid RPC rate limits
          await new Promise((res) => setTimeout(res, 300));
        }

        // ✅ 2. Webhook logs from backend (signed, executed, etc.)
        try {
          const res = await fetch("http://localhost:4000/api/logs");
          const webhookLogs = await res.json();

          const filteredWebhookLogs: ActivityLogEntry[] = webhookLogs
            .filter((log: any) => log.wallet?.toLowerCase() === walletAddress.toLowerCase())
            .map((log: any) => ({
              type: log.action ?? log.type,
              txId: log.txId?.toString(),
              user: log.actor,
              timestamp: log.timestamp ?? Date.now(),
            }));

          // ✅ Merge both
          const combined = [...allLogs, ...filteredWebhookLogs];
          combined.sort((a, b) => b.timestamp - a.timestamp); // newest first

          setLogs(combined);
        } catch (err) {
          console.warn("⚠️ Failed to fetch webhook logs:", err);
          // fallback to just on-chain logs
          setLogs(allLogs.reverse());
        }

      } catch (err) {
        console.error("❌ Failed to fetch logs", err);
      }
    }, 1500); // Debounced 1.5s

    return () => clearTimeout(debounceTimer);
  }, [walletAddress, client]);

  return logs;
}
