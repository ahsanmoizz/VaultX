// 📁 apps/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getUserMultisigs } from "../../../packages/sdk/src/contracts/getUserMultisigs";
import { Address } from "viem";
import { useSlackOptIn } from "../hooks/useSlackOptIn";
import RoleBadge from "../components/roles/RoleBadge";
import { Link } from "react-router-dom";
import RoleManager from "../components/roles/RoleManager";
import DeployWalletInline from "../components/DeployWalletInline"; // ✅ Add this
import { useWalletActivityLogs } from "../hooks/useWalletActivityLogs";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [wallets, setWallets] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [slackOptIn, setSlackOptIn] = useSlackOptIn();

  const logs = useWalletActivityLogs(address as Address);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const getRoleSuggestion = async () => {
    setLoadingSuggestion(true);
    try {
      const res = await fetch("http://localhost:4000/api/suggest-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: address,
          logs,
        }),
      });
      const json = await res.json();
      setSuggestion(json.suggestion);
    } catch (err) {
      console.error("Suggestion error", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };



  useEffect(() => {
    if (!address) return;

    console.log("📍 Connected address:", address);

    const fetchWallets = async () => {
      try {
        const userWallets = await getUserMultisigs(address as Address);
        console.log(
          "📦 Found wallets:",
          Array.isArray(userWallets) ? userWallets : "Not an array"
        );
        setWallets(userWallets);
      } catch (error) {
        console.error("❌ Failed to fetch wallets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [address]);

  if (!isConnected) {
    return (
      <>
        <p className="text-white">Please connect your wallet! or click connect in Deploy Wallet</p>
      </>
    );
  }

  return (
    <>
  <h2 className="text-3xl font-bold text-brand.primary mb-6">My Multisig Wallets</h2>

  <div className="mb-6">
    <button
      onClick={getRoleSuggestion}
      disabled={loadingSuggestion}
      className="bg-brand.primary text-black px-5 py-2 rounded-md font-medium hover:bg-white transition duration-300"
    >
      {loadingSuggestion ? "Analyzing Role..." : "Suggest Role Based on Activity"}
    </button>
    {suggestion && (
      <p className="mt-3 text-sm italic text-gray-400 whitespace-pre-line">
        {suggestion}
      </p>
    )}
  </div>

  <div className="flex items-center mb-6 gap-2">
    <input
      type="checkbox"
      checked={slackOptIn}
      onChange={(e) => setSlackOptIn(e.target.checked)}
      className="accent-brand.primary focus:ring-2 focus:ring-brand.primary"
    />
    <label className="text-white text-sm font-medium">
      Enable Slack Alerts for My Actions
    </label>
  </div>

  {loading ? (
    <p className="text-white">Loading wallets...</p>
  ) : wallets.length === 0 ? (
    <div className="text-white text-lg font-semibold mt-10">
      You don’t have any multisig wallets yet.
      <DeployWalletInline onDeployed={() => window.location.reload()} />
    </div>
  ) : (
    <div className="space-y-6">
      {wallets.map((wallet, index) => (
        <div
          key={index}
          className="bg-brand.muted p-4 rounded-lg border border-brand.primary shadow-md hover:shadow-yellow-400/30 transition-transform hover:scale-[1.01]"
        >
          <p className="text-white break-all">{wallet}</p>

          <Link
            to={`/wallets/${wallet}`}
            className="inline-block mt-3 bg-brand.primary text-black px-4 py-2 rounded-md hover:bg-white transition font-semibold"
          >
            Open
          </Link>

          <div className="mt-4">
            <RoleManager walletAddress={wallet as Address} />
          </div>
          <div className="mt-2">
            <RoleBadge walletAddress={wallet as Address} />
          </div>
        </div>
      ))}
    </div>
  )}
</>
  );
}
