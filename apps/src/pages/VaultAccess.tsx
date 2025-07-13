// 📁 apps/src/components/vault/VaultAccess.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VaultAccess() {
  const [vault, setVault] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vault.startsWith("0x") || vault.length !== 42) {
      alert("Invalid address");
      return;
    }

    // ✅ FIX: navigate to the correct route
    navigate(`/wallets/${vault.toLowerCase()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={vault}
        onChange={(e) => setVault(e.target.value)}
        placeholder="Enter vault address"
        className="bg-gray-800 text-white px-4 py-2 rounded w-full"
      />
      <button
        type="submit"
        className="bg-yellow-600 hover:bg-yellow-500 px-4 py-2 rounded text-black font-semibold"
      >
        Access
      </button>
    </form>
  );
}
