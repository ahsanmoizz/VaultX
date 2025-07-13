// 📁 src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import AuditLogViewer from "./components/logs/AuditLogViewer";
import AnalyticsDashboard from "./pages/AnalyticsDashbord";
import MultisigViewer from "./pages/MultisigViewer";
import NotFound from "./pages/NotFound";
import Sidebar from "./layout/Sidebar";
import Home from "./pages/Home";
import "./index.css"; // Tailwind styles
import Landing from "./pages/Landing";
import VaultAccess from "./pages/VaultAccess";
function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex">
      {/* Sidebar shown only on non-landing pages */}
      {location.pathname !== "/" && <Sidebar />}

      <div className="flex-1 overflow-y-auto bg-black min-h-screen">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* All other routes */}
          <Route path="/deploy" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/logviewer" element={<AuditLogViewer />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/wallets/:address" element={<MultisigViewer />} />
           <Route path="/vault" element={<VaultAccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>)
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
