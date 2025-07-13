// FINAL TxList.tsx
import { Address, formatEther } from "viem";
import { useState } from "react";
import RelayButton from "../buttons/RelayButton";
import SignButton from "../buttons/SignButton";
import RevokeButton from "../buttons/RevokeButton";
import ExecuteButton from "../buttons/ExecuteButton";
import CancelButton from "../buttons/CancelButton";
import { useUserRoles } from "../../hooks/useUserRoles";
import { useCancelledTxs } from "../../hooks/useCancelled";
import { useIsDelegate } from "../../hooks/useIsDelegate";
import { useVaultLabel } from "../../hooks/useVaultLabel";

export default function TxList({
  walletAddress,
  requiredConfirmations,
  txs,
  onTxUpdate,
}: {
  walletAddress: string;
  requiredConfirmations: number;
  txs: any[];
  onTxUpdate?: () => void;
}) {
  const { isOwner, isExecutor } = useUserRoles(walletAddress as Address);
  const isDelegate = useIsDelegate(walletAddress as Address);
  const cancelledTxs = useCancelledTxs(walletAddress as Address);

  const [manualSignersMap, setManualSignersMap] = useState<Record<number, string[]>>({});
  const [summaries, setSummaries] = useState<Record<string, string | null>>({});
  const [loadingSummaries, setLoadingSummaries] = useState<Record<string, boolean>>({});

  const fetchSummary = async (tx: any) => {
    setLoadingSummaries((prev) => ({ ...prev, [tx.id]: true }));
    try {
      const res = await fetch("http://localhost:4000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: tx.to,
          value: tx.value,
          data: tx.data,
        }),
      });
      const json = await res.json();
      setSummaries((prev) => ({ ...prev, [tx.id]: json.summary }));
    } catch (e) {
      alert("Failed to summarize TX");
    } finally {
      setLoadingSummaries((prev) => ({ ...prev, [tx.id]: false }));
    }
  };

  const grouped = txs.reduce((acc: Record<string, any[]>, tx) => {
    const label = localStorage.getItem(`vault-${walletAddress}-${tx.id}`) || "General";
    if (!acc[label]) acc[label] = [];
    acc[label].push(tx);
    return acc;
  }, {});

  return (
    <div className="bg-brand.muted border border-brand.primary rounded-md p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-brand.primary mb-4">Transactions</h3>

      {txs.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        Object.entries(grouped).map(([vault, groupTxs]) => (
          <div key={vault} className="space-y-6 mt-6">
            <h4 className="text-lg font-semibold text-brand.primary">{vault}</h4>
            {groupTxs.map((tx) => {
              const isCancelled = cancelledTxs.has(tx.id);
              const isExecuted = tx.executed;
              const currentSigners = tx.confirmedBy?.length ?? 0;
              const vaultLabel = useVaultLabel(walletAddress, tx.id);

            const pastedSigners = manualSignersMap[tx.id] ?? [];
const canExecute =
  !isExecuted &&
  !isCancelled &&
  pastedSigners.length >= requiredConfirmations &&
  (isOwner || isExecutor || isDelegate);

              return (
                <div key={tx.id} className="bg-[#111] p-4 rounded border border-gray-700 space-y-3">
                  <div className="text-xs text-gray-400 mb-1">Vault: {vaultLabel}</div>
                  <div className="space-y-1 text-sm">
                    <p><strong className="text-white">To:</strong> {tx.to}</p>
                    <p><strong className="text-white">Value:</strong> {formatEther(BigInt(tx.value || 0))} ETH</p>
                    <p><strong className="text-white">Status:</strong> 
                      {isCancelled ? "❌ Cancelled" : isExecuted ? "✅ Executed" : "🕒 Pending"}
                    </p>
                  <p className="flex flex-col">
  <strong className="text-white">Signatures:</strong>
  {tx.confirmedBy?.length > 0 && (
    <span className="text-xs text-gray-400 mt-1">
      Signed by:{" "}
      {tx.confirmedBy.map((addr: string, idx: number) => (
        <span key={addr} className="font-mono">
          {addr.slice(0, 6)}...{addr.slice(-4)}
          {idx < tx.confirmedBy.length - 1 ? ", " : ""}
        </span>
      ))}
    </span>
  )}
<span className={`text-xs mt-1 ${pastedSigners.length < requiredConfirmations ? "text-red-400" : "text-green-400"}`}>
  {pastedSigners.length < requiredConfirmations ? "More signatures required" : "Ready to execute"}
</span>
</p>

                  </div>

                  {!isExecuted && !isCancelled && (
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 flex-wrap">
                        <SignButton
                          walletAddress={walletAddress}
                          txId={tx.id}
                          onSigned={async () =>
                            alert("Signed! Now paste signer address to proceed.")
                          }
                        />
                        <RevokeButton walletAddress={walletAddress as `0x${string}`} txId={tx.id} />
                      </div>

                      <textarea
                        className="w-full bg-gray-800 text-white p-2 rounded text-sm"
                        rows={2}
                        placeholder="Paste signer addresses\n0xAbc...\n0xDef..."
                        onChange={(e) => {
                          const lines = e.target.value
                            .split("\n")
                            .map((l) => l.trim())
                            .filter(Boolean);
                          setManualSignersMap((prev) => ({ ...prev, [tx.id]: lines }));
                        }}
                      />

                      {canExecute && (
                        <div className="flex gap-2">
                          <ExecuteButton
                            walletAddress={walletAddress as `0x${string}`}
                            txId={tx.id}
                            value={BigInt(tx.value || 0)}
                            vaultLabel={vaultLabel}
                            manualSigners={manualSignersMap[tx.id] ?? []}
                            requiredConfirmations={requiredConfirmations}
                          />
                          <RelayButton walletAddress={walletAddress as `0x${string}`} txId={tx.id} />
                        </div>
                      )}

                      {isOwner && (
                        <CancelButton walletAddress={walletAddress as `0x${string}`} txId={tx.id} />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => fetchSummary(tx)}
                    className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
                    disabled={loadingSummaries[tx.id]}
                  >
                    {loadingSummaries[tx.id] ? "Loading Summary..." : "Summarize Transaction"}
                  </button>

                  {summaries[tx.id] && (
                    <p className="text-sm text-gray-400 italic mt-1">{summaries[tx.id]}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
}
