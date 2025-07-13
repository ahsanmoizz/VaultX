// packages/sdk/src/contracts/MultisigWallet.ts

import { ethers } from "ethers";
import { getProvider, getSigner } from "../utils/providers";
import abi from "../../abi/MultisigWallet.json";
import { Address } from "viem";

export const getMultisigWallet = (address: Address) => {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
};

export const getMultisigWalletWithSigner = async (address: Address) => {
  const signer = await getSigner();
  return new ethers.Contract(address, abi, signer);
};

// ✅ Updated to support vaultLabel

/*export async function proposeTransaction(
  walletAddress: Address,
  to: Address,
  value: string,
  data: string,
  vaultLabel: string
): Promise<number> {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.submitTransaction(to, BigInt(value), data, vaultLabel);
  const receipt = await tx.wait();

  const log = receipt.logs.find((l: any) =>
    l.topics?.[0]?.startsWith("0x") && l.topics.length >= 2
  );

  if (!log) throw new Error("SubmitTransaction event not found");
  const txId = parseInt(log.topics[1], 16);
  return txId;
}
*/
export async function proposeTransaction(
  walletAddress: Address,
  to: Address,
  value: string,
  data: string,
  vaultLabel: string
): Promise<number> {
  const contract = await getMultisigWalletWithSigner(walletAddress);

  // estimate fee (same as backend)
  const parsedValue = BigInt(value);
  const feeBasisPoints = 10n;
  const fee = (parsedValue * feeBasisPoints) / 10000n;

  const tx = await contract.submitTransaction(to, parsedValue, data, vaultLabel, {
    value: fee,
  });

  const receipt = await tx.wait();

  const log = receipt.logs.find((l: any) =>
    l.topics?.[0]?.startsWith("0x") && l.topics.length >= 2
  );

  if (!log) throw new Error("SubmitTransaction event not found");
  const txId = parseInt(log.topics[1], 16);
  return txId;
}


export async function fetchTransactions(walletAddress: Address) {
  const contract = getMultisigWallet(walletAddress);
  const count = await contract.getTransactionCount?.() ?? 0;
  const requiredConfirmations = await contract.requiredConfirmations();

  const txs = [];

  for (let i = 0; i < count; i++) {
    const tx = await contract.transactions(i);

    let confirmations: string[] = [];
    try {
      const raw = await contract.getConfirmations(i);
      confirmations = Array.isArray(raw) ? raw : [...raw]; // in case proxy result
    } catch (e) {
      console.error(`❌ getConfirmations failed for TX ${i}:`, e);
    }

    txs.push({
      id: i,
      ...tx,
      confirmations: confirmations.length,         // ✅ used in UI
      confirmedBy: confirmations,                  // ✅ for future enhancements
      requiredConfirmations: Number(requiredConfirmations),
    });
  }

  return txs;
}

export async function signTransaction(walletAddress: Address, txId: number) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.confirmTransaction(BigInt(txId));
   console.log("🔁 Signed TX:", tx.hash); // ✅ Add this
  return tx.hash;
}

export async function executeTransaction(walletAddress: Address, txId: number) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.executeTransaction(BigInt(txId));
  return tx.hash;
}

export async function revokeTransaction(walletAddress: Address, txId: number) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.revokeConfirmation(BigInt(txId));
  return tx.hash;
}

export async function cancelTransaction(walletAddress: Address, txId: number) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.cancelTransaction(BigInt(txId));
  return tx.hash;
}

export async function addOwner(walletAddress: Address, newOwner: Address) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.addOwner(newOwner);
  return tx.hash;
}

export async function debugConfirmations(walletAddress: Address, txId: number) {
  const contract = getMultisigWallet(walletAddress);
  const confirmations = await contract.getConfirmations(txId);
  console.log(`🧪 Confirmations for TX ${txId}:`, confirmations);
  return confirmations;
}


export async function removeOwner(walletAddress: Address, owner: Address) {
  const contract = await getMultisigWalletWithSigner(walletAddress);
  const tx = await contract.removeOwner(owner);
  return tx.hash;
}
export async function assignSessionDelegate(walletAddr: Address, delegate: Address) {
  const contract = await getMultisigWalletWithSigner(walletAddr); // ✅ get signer-enabled instance
  const tx = await contract.assignSessionDelegate(delegate);
  await tx.wait();
  return tx.hash;
}

export async function isSessionDelegate(walletAddr: Address, addr: Address) {
  const contract = getMultisigWallet(walletAddr);
  return await contract.sessionDelegates(addr);
}
