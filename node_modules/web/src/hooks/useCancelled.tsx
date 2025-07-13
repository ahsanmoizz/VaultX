// apps/src/hooks/useCancelledTxs.ts
import { useState } from "react";
import { useWatchContractEvent } from "wagmi";
import type { Address } from "viem";
import type { Log } from "viem";
import MultisigWalletABI from "../../../packages/sdk/abi/MultisigWallet.json"; // ✅ adjust if needed

export function useCancelledTxs(walletAddress: Address): Set<number> {
  const [cancelledTxs, setCancelledTxs] = useState<Set<number>>(new Set());

  useWatchContractEvent({
    address: walletAddress,
    abi: MultisigWalletABI,
    eventName: "TransactionCancelled",
    onLogs: (logs: Log[]) => {
      for (const log of logs) {
        const decoded = log as unknown as { args: { txId: bigint } }; // ✅ fix args type
        const txId = Number(decoded.args.txId);
        setCancelledTxs((prev) => new Set(prev).add(txId));
      }
    },
  });

  return cancelledTxs;
}
