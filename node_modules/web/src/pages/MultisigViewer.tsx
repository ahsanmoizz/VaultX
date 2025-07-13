import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TxForm from "../components/tx/TxForm";
import TxList from "../components/tx/TxList";
import { ActivityLog } from "../components/logs/ActivityLog";
import ExportLog from "../components/logs/ExportLogs";
import { useAccount, usePublicClient } from "wagmi";
import { Address } from "viem";
import MultisigWalletABI from "../../../packages/sdk/abi/MultisigWallet.json";
import { useIsDelegate } from "../hooks/useIsDelegate";
import ActivityTimeline from "../components/logs/ActivityTimeLine";
import { fetchTransactions } from "../../../packages/sdk/src/contracts/MultisigWallet";
import { useUserRoles } from "../hooks/useUserRoles";
import VaultBalance from "../components/vault/VaultBalance";
import TeamManager from "../components/vault/TeamManager";

export default function MultisigViewer() {
  const { address } = useParams();
  const { address: connectedAddr, isConnected } = useAccount();
  const publicClient = usePublicClient();

  const [walletAddr, setWalletAddr] = useState<`0x${string}` | null>(null);
  const [isValidContract, setIsValidContract] = useState<boolean>(false);
  const [confirmations, setConfirmations] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const { isOwner } = useUserRoles(walletAddr as Address);
  const isDelegate = useIsDelegate(walletAddr as Address);

  useEffect(() => {
    const validateAndFetch = async () => {
      if (!address || !isConnected || !publicClient) return;

      try {
        const normalized = address.toLowerCase() as `0x${string}`;
        setWalletAddr(normalized);
        localStorage.setItem("last-vault", normalized);

        const bytecode = await publicClient.getBytecode({ address: normalized });
        if (!bytecode) {
          setIsValidContract(false);
          return;
        }

        setIsValidContract(true);

        const result = await publicClient.readContract({
          address: normalized,
          abi: MultisigWalletABI,
          functionName: "requiredConfirmations",
        }).catch(() => 1);

        setConfirmations(Number(result));

       const fetchedTxs = await fetchTransactions(normalized);

// 🧠 Load cached TXs from localStorage
const stored = localStorage.getItem(`txs-${normalized}`);
const cachedTxs = stored ? JSON.parse(stored) : [];

// 🔀 Merge cached and on-chain txs (avoid duplicates by ID)
const allTxs = [...cachedTxs, ...fetchedTxs];
const uniqueTxs = allTxs.filter(
  (tx, idx, arr) => arr.findIndex((t) => t.id === tx.id) === idx
);

setTransactions(uniqueTxs);

      } catch (err) {
        console.error("❌ Failed to validate multisig contract:", err);
        setIsValidContract(false);
      }
    };

    validateAndFetch();
  }, [address, isConnected, publicClient]);

  // ✅ Notify signer once per session if they are involved
 useEffect(() => {
  if (!walletAddr) return;

  const notified = localStorage.getItem(`notify-${walletAddr}`);
  const executed = transactions.some((tx) => tx.executed);

  if (notified && !executed) {
    alert(`⚠️ A transaction is awaiting signature on ${walletAddr}`);
  }

  if (executed && notified) {
    localStorage.removeItem(`notify-${walletAddr}`);
  }
}, [walletAddr, transactions]);

  if (!isConnected) return <p className="text-white">🔌 Please connect your wallet.</p>;
  if (!publicClient) return <p className="text-white">⚠️ Network error — please refresh.</p>;
  if (!walletAddr || !isValidContract) return <p className="text-white">🚫 Invalid contract address.</p>;
  if (confirmations === null) return <p className="text-yellow-300">⏳ Loading wallet info...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold text-brand.primary mb-4">Multisig Wallet: {walletAddr}</h2>

      {isDelegate && (
        <p className="text-sm text-green-400 font-mono mb-4">Session Key Active</p>
      )}

         <VaultBalance walletAddress={walletAddr} />
      <TeamManager vault={walletAddr} />
      <TxForm
        walletAddress={walletAddr}
        onTxProposed={(tx) => setTransactions((prev) => [tx, ...prev])}
      />

      <TxList
        walletAddress={walletAddr}
        requiredConfirmations={confirmations}
        txs={transactions}
        onTxUpdate={async () => {
          const refreshed = await fetchTransactions(walletAddr);
          setTransactions(refreshed);
        }}
      />

      <div className="mt-6 space-y-6">
        <ActivityLog walletAddress={walletAddr} />
        <ExportLog walletAddress={walletAddr} />
        <ActivityTimeline walletAddress={walletAddr} />
      </div>
    </>
  );
}
