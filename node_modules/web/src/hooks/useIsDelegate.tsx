// apps/src/hooks/useIsDelegate.ts
import { useEffect, useState } from "react";
import { isSessionDelegate } from "../../../packages/sdk/src/contracts/MultisigWallet";
import { useAccount } from "wagmi";
import { Address } from "viem";

export function useIsDelegate(walletAddress: Address) {
  const { address } = useAccount();
  const [isDelegate, setIsDelegate] = useState(false);

  useEffect(() => {
    if (!address) return;
    (async () => {
      const result = await isSessionDelegate(walletAddress, address);
      setIsDelegate(result);
    })();
  }, [address, walletAddress]);

  return isDelegate;
}
