// 📁 apps/src/components/tx/TxForm.tsx
import { useEffect, useState } from "react";
import { proposeTransaction } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { Address, parseEther } from "viem";
import { useCachedTxs } from "../../hooks/useCachedTxs";

export default function TxForm({
  walletAddress,
  onTxProposed,
}: {
  walletAddress: string;
  onTxProposed?: (tx: any) => void;
}) {
  const storageKey = `formState-${walletAddress}`;
  const [formState, setFormState] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved
      ? JSON.parse(saved)
      : { to: "", value: "0", data: "", vault: "" };
  });

  const { saveTx } = useCachedTxs(walletAddress);

  // ✅ Show one-time alert about delay after action
 useEffect(() => {
  if (!sessionStorage.getItem("tx-alert-shown")) {
    alert("⚠️ Please wait a moment after any action. Confirmations may take a few seconds. Avoid refreshing.");
    sessionStorage.setItem("tx-alert-shown", "true");
  }
}, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(formState));
  }, [formState, storageKey]);

  const handleChange = (key: string, val: string) => {
    setFormState((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    if (!formState.to || !formState.value) {
      alert("Recipient and Value are required");
      return;
    }

    try {
      alert("Submitting transaction... please confirm in wallet.");

      const txId = await proposeTransaction(
        walletAddress as Address,
        formState.to as Address,
        parseEther(formState.value).toString(),
        formState.data.trim() || "0x",
        formState.vault.trim() || "General"
      );

     const txKey = `txs-${walletAddress}`;
const existingRaw = localStorage.getItem(txKey);
const existing = existingRaw ? JSON.parse(existingRaw) : [];

const newTx = {
  id: txId,
  to: formState.to,
  value: parseEther(formState.value).toString(),
  data: formState.data || "0x",
  confirmations: 0,
  executed: false,
  confirmedBy: [],
};

localStorage.setItem(`vault-${walletAddress}-${txId}`, formState.vault || "General");
localStorage.setItem(txKey, JSON.stringify([newTx, ...existing]));
      alert("✅ Transaction submitted. It will appear shortly.");

      onTxProposed?.({
        id: txId,
        to: formState.to,
        value: parseEther(formState.value).toString(),
        data: formState.data || "0x",
        confirmations: 0,
        executed: false,
      });

      setFormState({ to: "", value: "0", data: "", vault: "" });
    } catch (e) {
      alert("❌ Error proposing transaction.");
      console.error(e);
    }
  };

  return (
    <div className="mb-10 space-y-5 animate-fade-in">
      <h3 className="text-2xl font-bold text-brand-primary">Propose New Transaction</h3>

      <input
        className="w-full p-3 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
        placeholder="Recipient Address"
        value={formState.to}
        onChange={(e) => handleChange("to", e.target.value)}
      />
      <input
        className="w-full p-3 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
        placeholder="ETH Value (e.g. 0.01)"
        value={formState.value}
        onChange={(e) => handleChange("value", e.target.value)}
      />
      <textarea
        className="w-full p-3 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
        placeholder="Calldata (optional)"
        value={formState.data}
        onChange={(e) => handleChange("data", e.target.value)}
      />
      <label className="text-sm text-gray-400 font-medium">Vault Label (optional)</label>
      <input
        value={formState.vault}
        onChange={(e) => handleChange("vault", e.target.value)}
        placeholder="e.g. Ops, Emergency"
        className="w-full p-3 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
      />

      <button
        onClick={handleSubmit}
        className="bg-brand-primary hover:bg-white text-black px-5 py-3 rounded-md font-semibold transition"
      >
        Submit Transaction
      </button>
    </div>
  );
}
