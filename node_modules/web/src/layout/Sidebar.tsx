// 📁 layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaChartBar, FaClipboardList, FaTools, FaRocket, FaAccessibleIcon } from "react-icons/fa";

const links = [
  { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
  { label: "Analytics", path: "/analytics", icon: <FaChartBar /> },
  { label: "Audit Logs", path: "/logviewer", icon: <FaClipboardList /> },
  { label: "Admin Panel", path: "/admin", icon: <FaTools /> },
  { label: "Deploy Wallet", path: "/deploy", icon: <FaRocket /> },
   { label: "Vault Access", path: "/vault", icon: <FaAccessibleIcon /> },
  

];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`bg-black text-white h-screen p-4 transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
  {/* Logo & Toggle */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2">
      <img src="/logo1.png" alt="VaultX Logo" className={`h-10 w-10 ${collapsed ? "mx-auto" : ""}`} />
      {!collapsed && <span className="text-lg font-bold text-brand-primary">VaultX</span>}
    </div>
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="text-gray-400 hover:text-white text-xl"
    >
      {collapsed ? "☰" : "←"}
    </button>
  </div>

  <nav className="space-y-2">
    {links.map(({ label, path, icon }) => (
      <Link
        key={path}
        to={path}
        className={`flex items-center gap-2 px-3 py-2 rounded-md hover:bg-brand-primary hover:text-black font-medium transition ${
          location.pathname === path ? "bg-brand-primary text-black" : "text-white"
        }`}
      >
        <span className="text-lg">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    ))}
  </nav>
</aside>

  );
}
