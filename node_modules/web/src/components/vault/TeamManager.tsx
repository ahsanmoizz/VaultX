import { useState } from "react";
import { useTeamRoles } from "../../hooks/useTeamRoles";

export default function TeamManager({ vault }: { vault: string }) {
  const { roles, setRole } = useTeamRoles(vault);
  const [addr, setAddr] = useState("");
  const [role, setRoleVal] = useState("OWNER");

  const handleAdd = () => {
    if (!addr.startsWith("0x") || addr.length !== 42) {
      alert("Invalid address");
      return;
    }
    setRole(addr, role as "OWNER" | "SIGNER" | "VIEWER");
    setAddr("");
  };

  return (
  <div className="bg-brand.muted p-6 rounded-lg text-white border border-gray-700 mt-6 shadow-md font-sans">
    <h3 className="font-semibold text-xl text-brand.primary mb-4 tracking-tight">Team Access Control</h3>

    <div className="flex flex-wrap gap-3 mb-4">
      <input
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="0xAddress"
        className="flex-1 min-w-[200px] bg-black text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand.primary transition"
      />
      <select
        value={role}
        onChange={(e) => setRoleVal(e.target.value)}
        className="bg-black text-white p-3 rounded-md border border-gray-600 focus:ring-2 focus:ring-brand.primary transition"
      >
        <option value="OWNER">Owner</option>
        <option value="SIGNER">Signer</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <button
        onClick={handleAdd}
        className="bg-brand.primary text-black px-5 py-3 rounded-md font-semibold hover:bg-white transition-all duration-300 hover:scale-105"
      >
        Add
      </button>
    </div>

    <ul className="text-sm space-y-2 text-gray-300">
      {Object.entries(roles).map(([addr, r]) => (
        <li key={addr} className="flex justify-between items-center bg-black/30 p-2 rounded-md border border-gray-700">
          <span className="text-blue-400 font-mono">{addr.slice(0, 10)}...</span>
          <span className="text-white font-medium">{r}</span>
        </li>
      ))}
    </ul>
  </div>
);

}
