// 📁 apps/src/components/buttons/NotifySignerButton.tsx
import { useAccount } from "wagmi";

export default function NotifySignerButton({
  txId,
  walletAddress,
}: {
  txId: number;
  walletAddress: `0x${string}`;
}) {
  const { address } = useAccount();

  const handleNotify = () => {
    const message = `📢 Sign Request:
Signer: ${address}
Vault: ${walletAddress}
TX ID: ${txId}

Paste this address in Vault Access: ${walletAddress}`;

    alert(message);
  };

  return (
    <button
      onClick={handleNotify}
      className="ml-3 text-sm px-3 py-1 bg-blue-700 text-white rounded hover:bg-blue-500 transition"
    >
      Notify Signer
    </button>
  );
}
