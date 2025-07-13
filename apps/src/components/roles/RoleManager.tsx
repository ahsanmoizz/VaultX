// apps/src/components/RoleManager.tsx
import { useState } from "react";
import { addOwner, removeOwner, assignSessionDelegate } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { Address } from "viem";
import { useUserRoles } from "../../hooks/useUserRoles";

interface Props {
  walletAddress: Address;
}

export default function RoleManager({ walletAddress }: Props) {
  const [newAddress, setNewAddress] = useState("");
  const [removalAddress, setRemovalAddress] = useState("");
  const [delegateAddress, setDelegateAddress] = useState(""); // ✅ new
  const [loading, setLoading] = useState(false);

  const { isOwner } = useUserRoles(walletAddress);

  const handleAdd = async () => {
    if (!newAddress) return;
    setLoading(true);
    try {
      await addOwner(walletAddress, newAddress as Address);
      alert("Owner added.");
      setNewAddress("");
    } catch (err) {
      console.error("Add failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!removalAddress) return;
    setLoading(true);
    try {
      await removeOwner(walletAddress, removalAddress as Address);
      alert("Owner removed.");
      setRemovalAddress("");
    } catch (err) {
      console.error("Remove failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDelegate = async () => {
    if (!delegateAddress) return;
    setLoading(true);
    try {
      await assignSessionDelegate(walletAddress, delegateAddress as Address);
      alert("Delegate assigned.");
      setDelegateAddress("");
    } catch (err) {
      console.error("Delegate assign failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return <p className="text-white">Only owners can manage roles.</p>;
  }
return (
  <div className="space-y-6 font-sans mt-6">
  <h2 className="text-2xl font-bold text-brand-primary">Manage Roles</h2>

  <div className="flex gap-2">
    <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="0x... New Owner" className="p-3 bg-black border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-brand-primary" />
    <button onClick={handleAdd} disabled={loading} className="bg-brand-primary hover:bg-white hover:text-black px-4 py-2 rounded-md transition font-medium">
      Add
    </button>
  </div>

  <div className="flex gap-2">
    <input value={removalAddress} onChange={(e) => setRemovalAddress(e.target.value)} placeholder="0x... Remove Owner" className="p-3 bg-black border border-gray-600 rounded-md w-full focus:ring-2 focus:ring-brand-primary" />
    <button onClick={handleRemove} disabled={loading} className="bg-brand-primary hover:bg-white hover:text-black px-4 py-2 rounded-md transition font-medium">
      Remove
    </button>
  </div>

  <div className="flex gap-2">
    <input value={delegateAddress} onChange={(e) => setDelegateAddress(e.target.value)} placeholder="0x... Session Delegate" className="p-3 bg-black border border-brand-primary rounded-md w-full focus:ring-2 focus:ring-brand-primary" />
    <button onClick={handleAssignDelegate} disabled={loading} className="bg-brand-primary hover:bg-white hover:text-black px-4 py-2 rounded-md transition font-medium">
      Assign
    </button>
  </div>
</div>
);
}
