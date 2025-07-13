// hooks/useUserRoles.ts
import { useEffect, useState } from "react";
import { getMultisigWallet } from "../../../packages/sdk/src/contracts/MultisigWallet";
import { useAccount } from "wagmi";
import { Address } from "viem";

export interface UserRoles {
  isOwner: boolean;
  isExecutor: boolean;
  isAuditor: boolean;
}

export function useUserRoles(walletAddress: Address) {
  const { address } = useAccount();
  const [roles, setRoles] = useState<UserRoles>({
    isOwner: false,
    isExecutor: false,
    isAuditor: false,
  });

  const [refresh, setRefresh] = useState(0); // 👈 Add refresh trigger

  const refreshRoles = () => setRefresh(prev => prev + 1); // 👈 Exportable

  useEffect(() => {
    if (!address) return;
    (async () => {
      const contract = getMultisigWallet(walletAddress);
      const [isOwner, isExecutor, isAuditor] = await Promise.all([
        contract.hasRole(await contract.OWNER_ROLE(), address),
        contract.hasRole(await contract.EXECUTOR_ROLE(), address),
        contract.hasRole(await contract.AUDITOR_ROLE(), address),
      ]);
      setRoles({ isOwner, isExecutor, isAuditor });
    })();
  }, [walletAddress, address, refresh]);

  return { ...roles, refreshRoles }; // ✅ Return trigger
}
