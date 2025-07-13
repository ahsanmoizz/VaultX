// 📁 apps/src/hooks/useCachedTxs.ts
import { useEffect, useState } from "react";

export function useCachedTxs(walletAddress: string) {
  const [cachedTxs, setCachedTxs] = useState<any[]>([]);

  useEffect(() => {
    const key = `txs-${walletAddress}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setCachedTxs(JSON.parse(saved));
      } catch {
        localStorage.removeItem(key);
      }
    }
  }, [walletAddress]);

  const saveTx = (tx: any) => {
    const key = `txs-${walletAddress}`;
    const updated = [tx, ...cachedTxs];
    setCachedTxs(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { cachedTxs, saveTx };
}
