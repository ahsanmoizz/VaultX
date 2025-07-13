import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [auth, setAuth] = useState(false);

  const [feeBP, setFeeBP] = useState("10");
  const [recipient, setRecipient] = useState("");

  // Auto-load token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) {
      setToken(stored);
      setAuth(true);
    }
  }, []);

  const handleLogin = () => {
    if (!token.trim()) {
      alert("Admin token is required.");
      return;
    }

    localStorage.setItem("admin_token", token);
    setAuth(true);
  };

  const handleSubmit = async () => {
    if (!feeBP || !recipient) {
      alert("Both fee and recipient are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/admin/update-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, feeBP, recipient }),
      });

      if (!res.ok) throw new Error("Server returned error");

      const json = await res.json();
      alert("Fee updated successfully: " + JSON.stringify(json));
    } catch (err) {
      console.error("Fee update failed", err);
      alert("Fee update failed. Check the console for details.");
    }
  };

  if (!auth) {
    return (
      <div className="p-6 max-w-sm mx-auto text-white font-sans bg-brand.bg rounded-lg shadow-md animate-fade-in border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-brand.primary tracking-tight">
          Admin Access
        </h2>

        <input
          className="w-full p-3 mb-4 bg-brand.muted border border-gray-600 rounded text-white focus:ring-2 focus:ring-brand.primary transition"
          placeholder="Enter Admin Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm hover:shadow-blue-500/30"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-white font-sans bg-brand.bg rounded-lg shadow-md animate-fade-in border border-gray-700">
      <h2 className="text-3xl font-bold mb-6 text-brand.primary tracking-tight">
        Admin Panel
      </h2>

      <input
        className="w-full p-3 mb-4 bg-brand.muted border border-gray-600 rounded text-white focus:ring-2 focus:ring-brand.primary transition"
        placeholder="Fee Basis Points (e.g. 10 = 0.1%)"
        value={feeBP}
        onChange={(e) => setFeeBP(e.target.value)}
      />

      <input
        className="w-full p-3 mb-6 bg-brand.muted border border-gray-600 rounded text-white focus:ring-2 focus:ring-brand.primary transition"
        placeholder="Fee Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 px-5 py-3 rounded-md text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-green-500/30"
      >
        Update Fee
      </button>
    </div>
  );
}
