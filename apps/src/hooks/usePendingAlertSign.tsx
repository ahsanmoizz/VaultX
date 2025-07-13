// 📁 apps/src/hooks/usePendingSignAlert.ts
import { useEffect } from "react";
import { useAccount } from "wagmi";

export function usePendingSignAlert(walletAddress: string) {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected || !walletAddress) return;

    const key = `pending-sign-${walletAddress}`;
    const shouldAlert = localStorage.getItem(key);

    if (shouldAlert === "true") {
      alert("📝 A transaction needs your signature for vault: " + walletAddress);
      localStorage.removeItem(key);
    }
  }, [walletAddress, isConnected]);
}
