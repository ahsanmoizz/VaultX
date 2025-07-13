import { useState, useEffect } from "react";

type Role = "OWNER" | "SIGNER" | "VIEWER";

export function useTeamRoles(vault: string) {
  const storageKey = `team-${vault}`;
  const [roles, setRoles] = useState<Record<string, Role>>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      setRoles(JSON.parse(raw));
    }
  }, [vault]);

  const setRole = (address: string, role: Role) => {
    const updated = { ...roles, [address]: role };
    setRoles(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const getRole = (address: string): Role | undefined => roles[address.toLowerCase()];

  return { roles, setRole, getRole };
}
