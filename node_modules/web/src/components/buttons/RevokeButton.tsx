import { revokeTransaction } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { Address } from "viem";
import { useState } from "react";
import { useWebhookNotifier } from "../../hooks/useWebhookNotifier";

export default function RevokeButton({
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
    action: "revoked",
    txId,
  });

  const handleRevoke = async () => {
    try {
      await revokeTransaction(walletAddress, txId);
      alert("Revoked!");
      setTriggerWebhook(true);
    } catch (e) {
      console.error("Revoke error", e);
    }
  };

  return (
    <button
      onClick={handleRevoke}
      className="bg-yellow-600 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
    >
      Revoke
    </button>
  );
}
