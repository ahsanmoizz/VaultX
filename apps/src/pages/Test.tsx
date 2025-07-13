// 📁 apps/src/pages/TestConfirmations.tsx
import { useState } from "react";
import { debugConfirmations } from "../../../packages/sdk/src/contracts/MultisigWallet";
import { Address } from "viem";

export default function Test() {
  const [walletAddress, setWalletAddress] = useState("");
  const [txId, setTxId] = useState("");
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    try {
      setError(null);
      const confirmations = await debugConfirmations(walletAddress as Address, Number(txId));
      setResult(confirmations);
    } catch (err: any) {
      setError(err.message || "Error occurred");
      setResult(null);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto text-white font-sans">
      <h2 className="text-2xl font-bold text-[#FDB813] mb-4">🔍 Test Transaction Confirmations</h2>

      <input
        type="text"
        placeholder="Multisig Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-900 border border-gray-600"
      />

      <input
        type="number"
        placeholder="Transaction ID (e.g. 0, 1, 2)"
        value={txId}
        onChange={(e) => setTxId(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-900 border border-gray-600"
      />

      <button
        onClick={handleCheck}
        className="bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-400 transition"
      >
        Check Confirmations
      </button>

      {result && (
        <div className="mt-4 bg-gray-800 p-3 rounded border border-green-500">
          <p className="font-semibold text-green-400">Confirmed by:</p>
          <ul className="list-disc ml-5 text-sm">
            {result.map((addr, idx) => (
              <li key={idx}>{addr}</li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-4">❌ Error: {error}</p>
      )}
    </div>
  );
}
