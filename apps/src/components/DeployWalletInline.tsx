// src/components/DeployWalletInline.tsx
import { useState } from "react";
import { deployMultisig } from "../../../packages/sdk/src/contracts/MultisigWalletFactory";

export default function DeployWalletInline({ onDeployed }: { onDeployed: () => void }) {
  const [owners, setOwners] = useState([""]);
  const [required, setRequired] = useState(1);
  const [txHash, setTxHash] = useState("");

  const handleAddOwner = () => setOwners([...owners, ""]);
  const handleOwnerChange = (i: number, value: string) => {
    const copy = [...owners];
    copy[i] = value;
    setOwners(copy);
  };

  const handleDeploy = async () => {
    const filtered = owners.filter((o) => o);
    if (filtered.length < required) return alert("Not enough owners");
    try {
      const wallet = await deployMultisig(filtered, required);
      setTxHash(wallet);
      alert("Wallet created successfully");
      onDeployed(); // 👈 callback to reload dashboard
    } catch (err) {
      console.error("Deployment failed", err);
      alert("Multisig deployment failed. See console.");
    }
  };

  return (
  <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center px-4 font-sans animate-fade-in">
  <div className="w-full max-w-md mt-40 space-y-5 bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-yellow-500/10 transition">
    <h1 className="text-3xl font-bold text-brand-primary text-center">Create Multisig Wallet</h1>

    {owners.map((owner, i) => (
      <input key={i} value={owner} onChange={(e) => handleOwnerChange(i, e.target.value)} placeholder={`Owner #${i + 1}`} className="w-full bg-black border border-brand-primary p-3 rounded text-white focus:ring-2 focus:ring-brand-primary" />
    ))}

    <button onClick={handleAddOwner} className="text-brand-primary text-sm underline hover:text-white transition">
      + Add Owner
    </button>

    <input type="number" min={1} value={required} onChange={(e) => setRequired(parseInt(e.target.value))} placeholder="Confirmations Required" className="w-full bg-black border border-gray-600 p-3 rounded text-white focus:ring-2 focus:ring-brand-primary" />

    <button onClick={handleDeploy} className="w-full bg-brand-primary text-black hover:bg-white font-semibold p-3 rounded transition-all transform hover:scale-105 shadow-md">
      Deploy Multisig
    </button>

    {txHash && <p className="mt-4 text-green-400 text-sm break-all text-center">Wallet Deployed at: {txHash}</p>}
  </div>
</div>
  );
}
