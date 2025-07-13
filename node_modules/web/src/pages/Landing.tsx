import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white font-sans min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center px-10 py-6">
        <div className="text-[#FDB813] text-3xl font-extrabold tracking-tight">
               <img src="/logo1.png" alt="VaultX Logo" className="h-16 w-auto" />
            VaultX
            
    <p className="mt-2 text-white text-lg font-medium tracking-tight">Governance. Reimagined.</p>
            </div>
        <div className="space-x-4">
          <button
            onClick={() => window.open("https://vaultx-docs.example.com", "_blank")}
            className="border border-[#FDB813] text-white px-5 py-2 rounded hover:bg-[#FDB813] hover:text-black transition"
          >
            Documentation
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#FDB813] text-black px-6 py-2 rounded font-semibold hover:bg-white transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-br from-black via-[#0a0a0a] to-[#111]">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          The Future of <span className="text-[#FDB813]">Multisig</span> Security
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
          VaultX empowers teams, DAOs, and enterprises to manage crypto securely — with real-time auditing, roles, and AI assistance.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#FDB813] text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white transition"
        >
          Launch Vault
        </button>
      </section>

      {/* Demo Video */}
      <section className="flex justify-center items-center my-20 px-4">
        <video
          src="/demo-vaultx.mp4"
          className="rounded-xl border border-[#FDB813] shadow-2xl w-full max-w-5xl"
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* Features */}
      <section className="py-24 px-8 bg-[#0c0c0c]">
        <h2 className="text-4xl font-bold text-center text-white mb-16">
          Built for Modern Crypto Teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Multisig Governance",
              desc: "Protect your assets with customizable confirmations and role-based approvals.",
              icon: "🛡️",
            },
            {
              title: "Delegated Session Keys",
              desc: "Assign temporary, scoped access to trusted agents without compromising the wallet.",
              icon: "🔑",
            },
            {
              title: "Real-Time Analytics",
              desc: "Visualize transaction flows, gas usage, and signer stats — all in one place.",
              icon: "📊",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#111] border border-gray-800 p-6 rounded-lg hover:border-[#FDB813] transition"
            >
              <div className="text-3xl mb-4 text-[#FDB813]">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-t from-[#111] to-black">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Launch Your Secure Vault?
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          Start managing your funds securely in less than 60 seconds.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-[#FDB813] text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white transition"
        >
          Get Started
        </button>
      </section>

      {/* 🔁 Marquee Footer */}
      <div className="w-full py-3 bg-[#FDB813] overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap text-black font-semibold text-lg">
          VaultX now supports AI Audit · Delegate Roles · Multichain Support · Analytics Dashboard · Secure & Scalable · VaultX&nbsp;&nbsp;&nbsp;&nbsp;
          VaultX now supports AI Audit · Delegate Roles · Multichain Support · Analytics Dashboard · Secure & Scalable · VaultX
        </div>
      </div>

      {/* Footer Bottom */}
      <footer className="bg-black border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Daily Network Team. All rights reserved.
      </footer>
    </div>
  );
}
