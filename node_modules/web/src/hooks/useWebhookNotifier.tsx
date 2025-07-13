// ✅ useWebhookNotifier.ts — frontend-only hook
// 📁 apps/src/hooks/useWebhookNotifier.ts

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useSlackOptIn } from "./useSlackOptIn"; // ✅ Added
interface WebhookPayload {
  type: "transaction" | "role-update";
  wallet: string;
  actor: string;
  action: string;
  txId?: number;
  timestamp: number;

  // ✅ Add optional analytics fields
  value?: number;
  vault?: string;
  gasUsed?: number;
}

export function useWebhookNotifier(
  trigger: boolean,
  payload: Omit<WebhookPayload, "actor" | "timestamp">
) {
  const { address } = useAccount();
  const [optIn] = useSlackOptIn(); // ✅ Respect user's opt-in

  useEffect(() => {
    if (!trigger || !address || !optIn) return;

    const fullPayload: WebhookPayload = {
      ...payload,
      actor: address,
      timestamp: Date.now(),
    };

    fetch("http://localhost:4000/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullPayload),
    })
      .then(() => console.log("✅ Webhook sent", fullPayload))
      .catch((err) => console.warn("❌ Webhook error", err));
  }, [trigger, address, optIn]);
}
