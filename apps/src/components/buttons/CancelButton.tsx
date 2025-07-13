import { useState } from "react";
import { cancelTransaction } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { Address } from "viem";

import { useWebhookNotifier } from "../../hooks/useWebhookNotifier";

export default function CancelButton({
  walletAddress,
  txId,
}: {
  walletAddress: Address;
  txId: number;
}) {
  const [triggerWebhook, setTriggerWebhook] = useState(false);

  const webhookPayload = {
    type: "transaction",
    wallet: walletAddress,
    action: "cancelled",
    txId,
  } as const; // ✅ Fix applied here

  useWebhookNotifier(triggerWebhook, webhookPayload);

  const handleCancel = async () => {
    try {
      await cancelTransaction(walletAddress, txId);
      alert("Transaction cancelled!");
      setTriggerWebhook(true); // ✅ Webhook will now trigger
    } catch (e) {
      console.error("Cancel error", e);
    }
  };

  return (
  <button onClick={handleCancel} className="bg-yellow-600 hover:bg-yellow-400 text-black px-3 py-1 rounded-md font-medium transition-all duration-300 transform hover:scale-105">Cancel</button>
);

}
