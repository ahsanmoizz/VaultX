// apps/src/hooks/useSlackOptIn.ts
import { useEffect, useState } from "react";

export function useSlackOptIn(): [boolean, (val: boolean) => void] {
  const [optIn, setOptIn] = useState<boolean>(() => {
    const saved = localStorage.getItem("slack-opt-in");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("slack-opt-in", String(optIn));
  }, [optIn]);

  return [optIn, setOptIn];
}
