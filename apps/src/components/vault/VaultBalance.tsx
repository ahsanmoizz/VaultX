// 📁 apps/src/components/vault/VaultBalance.tsx

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Address, formatEther } from "viem";

export default function VaultBalance({ walletAddress }: { walletAddress: Address }) {
  const client = usePublicClient();
  const [balance, setBalance] = useState<string>("...");
  const [tokenSymbol, setTokenSymbol] = useState("ETH");

  useEffect(() => {
    if (!client) return;

    // Try to detect the native token symbol
    const chainSymbolMap: Record<number, string> = {
      1: "ETH", // Ethereum Mainnet
      5: "ETH", // Goerli
      11155111: "ETH", // Sepolia
      137: "MATIC",
      80001: "MATIC",
      56: "BNB",
      42161: "ETH", // Arbitrum
      10: "ETH", // Optimism
      43114: "AVAX",
      250: "FTM",
    };

    const chainId = client.chain?.id ?? 1;
    const symbol = chainSymbolMap[chainId] || "ETH";
    setTokenSymbol(symbol);

    const fetchBalance = async () => {
      try {
        const bal = await client.getBalance({ address: walletAddress });
        setBalance(formatEther(bal));
      } catch (err) {
        console.error("❌ Failed to fetch balance:", err);
        setBalance("0");
      }
    };

    fetchBalance();
  }, [client, walletAddress]);

  
    return (
  <div className="bg-brand.muted border border-brand.primary p-5 rounded-lg shadow-md text-white mt-6 font-sans">
    <h3 className="text-lg font-semibold text-brand.primary mb-2">Vault Balance</h3>
    <p className="text-2xl font-bold tracking-tight text-white">
      {balance} <span className="text-brand.primary">{tokenSymbol}</span>
    </p>
  </div>
);

  
}
