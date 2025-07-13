import { Address } from "viem";
import { useState } from "react";
import { useWebhookNotifier } from "../../hooks/useWebhookNotifier";

export default function RelayButton({
  walletAddress,
  txId,
}: {
  walletAddress: Address;
  txId: number;
}) {
  const [triggerWebhook, setTriggerWebhook] = useState(false);

  useWebhookNotifier(triggerWebhook, {
    type: "transaction",
    wallet: walletAddress,
    action: "relayed",
    txId,
  });

  const handleRelay = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/relay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: walletAddress, txId }),
      });
      const json = await res.json();
      alert(`✅ Relayed TX: ${json.txHash}`);
      setTriggerWebhook(true);
    } catch (err) {
      console.error("Relay failed", err);
      alert("⚠️ Relay failed");
    }
  };

  return (
    <button
      onClick={handleRelay}
      className="bg-yellow-600 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
    >
      Gasless
    </button>
  );
}
