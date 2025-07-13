// 📁 apps/src/components/buttons/SignButton.tsx
import { useState } from "react";
import { signTransaction } from "../../../../packages/sdk/src/contracts/MultisigWallet";
import { Address } from "viem";
import { useWebhookNotifier } from "../../hooks/useWebhookNotifier";
import NotifySignerButton from "./NotifySignerButton";

export default function SignButton({
  walletAddress,
  txId,
  onSigned,
}: {
  walletAddress: string;
  txId: number;
  onSigned?: () => Promise<void>;
}) {
  const [triggerWebhook, setTriggerWebhook] = useState(false);

  useWebhookNotifier(triggerWebhook, {
    type: "transaction",
    wallet: walletAddress,
    action: "signed",
    txId,
  });

  const handleSign = async () => {
    try {
      alert("Signing... Please confirm in wallet and don't refresh.");
      await signTransaction(walletAddress as Address, txId);
      alert("✅ Signed!");
      setTriggerWebhook(true);
      localStorage.setItem(`pending-sign-${walletAddress}`, "true");
      await onSigned?.();
    }   catch (err: any) {
  const msg = err?.message || String(err);
  if (msg.includes("already confirmed")) {
    alert("⚠️ You have already confirmed this transaction.");
  } else {
    alert(`❌ Signing failed: ${msg}`);
  }
}
  };
  const notify = () => {
    localStorage.setItem(`pending-sign-${walletAddress}`, "true");
    alert(
      "🔔 Notified! Other owners/delegates will see this when they connect."
    );
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSign}
        className="bg-yellow-600 text-black px-4 py-2 rounded-md hover:bg-yellow-500 transition duration-300 transform hover:scale-105 font-semibold"
      >
        Sign
      </button>

      {/* ✅ Embed Notify Button beside Sign */}
      <div onClick={notify}>
        <NotifySignerButton
          walletAddress={walletAddress as `0x${string}`}
          txId={txId}
        />
      </div>
    </div>
  );
}
