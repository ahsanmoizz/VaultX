// 📁 apps/src/components/buttons/ExecuteButton.tsx
import { useState } from "react";
import { executeTransaction } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { verifyFace } from "../../utils/faceAuth";
import { useWebhookNotifier } from "../../hooks/useWebhookNotifier";
import { Address } from "viem";

export default function ExecuteButton({
  walletAddress,
  txId,
  vaultLabel,
  value,
  manualSigners,
  requiredConfirmations,
}: {
  walletAddress: Address;
  txId: number;
  vaultLabel?: string;
  value?: bigint;
  manualSigners: string[];
  requiredConfirmations: number;
}) {
  const [executed, setExecuted] = useState(false);
  const [loading, setLoading] = useState(false);

  useWebhookNotifier(executed, {
    type: "transaction",
    wallet: walletAddress,
    action: "executed",
    txId,
    value: Number(value ?? 0),
    vault: vaultLabel ?? "General",
    gasUsed: 21000,
  });

  const handleExecute = async () => {
    if (manualSigners.length < requiredConfirmations) {
      alert("Not enough signer confirmations.");
      return;
    }

    if ((value && value > 100n * 10n ** 18n) || vaultLabel?.toLowerCase() === "emergency") {
      const ok = await verifyFace();
      if (!ok) {
        alert("Face verification failed. Cannot execute.");
        return;
      }
    }

    try {
      setLoading(true);
      await executeTransaction(walletAddress, txId);
      setExecuted(true);

      // ✅ Remove from localStorage
      const key = `txs-${walletAddress}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((t: any) => t.id !== txId);
        localStorage.setItem(key, JSON.stringify(filtered));
      }

      alert("✅ Transaction Executed!");
    }  catch (err: any) {
  const msg = err?.message || String(err);
  if (msg.includes("not enough")) {
    alert("⚠️ Not enough confirmations to execute.");
  } else {
    alert(`❌ Execution failed: ${msg}`);
  }
} finally {
  setLoading(false);
}
  };
  return (
    <button
      onClick={handleExecute}
      disabled={loading}
      className="bg-yellow-600 text-black font-bold px-4 py-2 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow hover:shadow-yellow-400/30"
    >
      {loading ? "Executing..." : "Execute"}
    </button>
  );
}
