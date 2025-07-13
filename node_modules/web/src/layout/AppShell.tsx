// 📁 layout/AppShell.tsx
import Sidebar from "./Sidebar";
import ChainSwitcher from "../components/ChainSwitcher";
import type { ReactNode } from "react";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
  <div className="flex-shrink-0 h-screen overflow-hidden">
    <Sidebar />
  </div>
  <div className="flex-1 overflow-y-auto relative p-6">
    <div className="absolute top-4 right-6 z-10">
      <ChainSwitcher />
    </div>
    <main className="max-w-6xl mx-auto">{children}</main>
  </div>
</div>
  );
}
