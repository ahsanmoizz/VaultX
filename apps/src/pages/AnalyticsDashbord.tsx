// 📁 apps/src/pages/AnalyticsDashboard.tsx

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
type TopTx = { value: string; to: string; hash: string };
type Signer = { user: string; count: number };
type VaultStat = { label: string; totalValue: string };
type GasStat = { gasUsed: number; txHash: string };

type AnalyticsData = {
  topTxs: TopTx[];
  topSigners: Signer[];
  vaultStats: VaultStat[];
  gasUsage: GasStat[];
};

type Section<T> = {
  title: string;
  items: T[];
  render: (item: T) => string;
  tag?: (item: T) => string;
  tagColor?: string;
  canSummarize?: boolean;
};

export default function AnalyticsDashboard() {
  const { address: walletAddress } = useAccount();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!walletAddress) return; // 🛡️ Guard: avoid empty fetch

    fetch(`http://localhost:4000/api/analytics?wallet=${walletAddress}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => console.error("Analytics error", err));
  }, [walletAddress]);

  if (!data) {
    return <p className="text-white">Loading analytics...</p>;
  }

  const summarizeTx = async (tx: TopTx | GasStat) => {
    const cacheKey = `summary-${"hash" in tx ? tx.hash : tx.txHash}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      alert(`AI Summary:\n${cached}`);
      return;
    }

    const res = await fetch("http://localhost:4000/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "to" in tx ? tx.to : undefined,
        value: "value" in tx ? tx.value : undefined,
        data: "0x",
      }),
    });

    const json = await res.json();
    localStorage.setItem(cacheKey, json.summary);
    alert(`AI Summary:\n${json.summary}`);
  };

  const sections: Section<any>[] = [
    {
      title: "Top Transactions",
      items: data.topTxs,
      render: (tx: TopTx) => `${tx.value} to ${tx.to}`,
      tag: (tx: TopTx) => tx.hash,
      tagColor: "text-blue-400",
      canSummarize: true,
    },
    {
      title: "Most Active Signers",
      items: data.topSigners,
      render: (s: Signer) => `${s.user} — ${s.count} signatures`,
    },
    {
      title: "Vault Stats",
      items: data.vaultStats,
      render: (v: VaultStat) => `${v.label}: ${v.totalValue}`,
    },
    {
      title: "Gas Usage",
      items: data.gasUsage,
      render: (g: GasStat) => `${g.gasUsed} gas`,
      tag: (g: GasStat) => g.txHash,
      tagColor: "text-purple-400",
      canSummarize: true,
    },
  ];

  return (
    <div className="p-6 text-white bg-brand.bg min-h-screen font-sans animate-fade-in">
      <h1 className="text-4xl font-bold text-brand.primary mb-10 tracking-tight">
        Analytics Dashboard
      </h1>

      {sections.map((section, idx) => (
        <section key={idx} className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-3">{section.title}</h2>
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li
                key={i}
                className="bg-brand.muted p-4 rounded-md border border-gray-800 hover:shadow-md hover:scale-[1.01] transition-all text-sm"
              >
                <div className="flex items-center justify-between">
                  <span>
                    {section.render(item)}
                    {section.tag && (
                      <code className={`${section.tagColor} ml-2`}>
                        {section.tag(item)}
                      </code>
                    )}
                  </span>
                  {section.canSummarize && (
                    <button
                      onClick={() => summarizeTx(item)}
                      className="ml-4 text-xs text-blue-400 underline hover:text-blue-300 transition"
                    >
                      Summarize
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
