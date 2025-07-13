// 📁 apps/src/hooks/useVaultLabels.ts
export function useVaultLabel(wallet: string, txId: number) {
  const key = `vault-${wallet}-${txId}`;
  const label = localStorage.getItem(key) ?? "General";
  return label;
}

export function setVaultLabel(wallet: string, txId: number, label: string) {
  const key = `vault-${wallet}-${txId}`;
  localStorage.setItem(key, label);
}