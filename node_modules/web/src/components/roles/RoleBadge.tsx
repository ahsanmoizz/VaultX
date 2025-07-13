// apps/src/components/RoleBadge.tsx
import { useUserRoles } from "../../hooks/useUserRoles";
import { Address } from "viem";

export default function RoleBadge({ walletAddress }: { walletAddress: Address }) {
  const { isOwner, isExecutor, isAuditor } = useUserRoles(walletAddress);

  let label = "Viewer";
  if (isOwner) label = "Owner";
  else if (isExecutor) label = "Executor";
  else if (isAuditor) label = "Auditor";

  return (
  <span className="bg-black-700 text-white px-3 py-1 text-sm rounded-md font-medium transition-all duration-300">
  Role: {label}
</span>
);
}
