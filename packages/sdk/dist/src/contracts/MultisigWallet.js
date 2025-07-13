// packages/sdk/src/contracts/MultisigWallet.ts
import { ethers } from "ethers";
import { getProvider, getSigner } from "../utils/providers";
import abi from "../../abi/MultisigWallet.json";
export const getMultisigWallet = (address) => {
    const provider = getProvider();
    return new ethers.Contract(address, abi, provider);
};
export const getMultisigWalletWithSigner = async (address) => {
    const signer = await getSigner();
    return new ethers.Contract(address, abi, signer);
};
// ✅ Updated to support vaultLabel
export async function proposeTransaction(walletAddress, to, value, data, vaultLabel) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.submitTransaction(to, BigInt(value), data, vaultLabel);
    const receipt = await tx.wait();
    const log = receipt.logs.find((l) => l.topics?.[0]?.startsWith("0x") && l.topics.length >= 2);
    if (!log)
        throw new Error("SubmitTransaction event not found");
    const txId = parseInt(log.topics[1], 16);
    return txId;
}
export async function fetchTransactions(walletAddress) {
    const contract = getMultisigWallet(walletAddress);
    const count = await contract.getTransactionCount?.() ?? 0;
    const requiredConfirmations = await contract.requiredConfirmations();
    const txs = [];
    for (let i = 0; i < count; i++) {
        const tx = await contract.transactions(i);
        txs.push({
            id: i,
            ...tx,
            confirmations: Number(tx.numConfirmations),
            requiredConfirmations: Number(requiredConfirmations),
        });
    }
    return txs;
}
export async function signTransaction(walletAddress, txId) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.confirmTransaction(BigInt(txId));
    return tx.hash;
}
export async function executeTransaction(walletAddress, txId) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.executeTransaction(BigInt(txId));
    return tx.hash;
}
export async function revokeTransaction(walletAddress, txId) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.revokeConfirmation(BigInt(txId));
    return tx.hash;
}
export async function cancelTransaction(walletAddress, txId) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.cancelTransaction(BigInt(txId));
    return tx.hash;
}
export async function addOwner(walletAddress, newOwner) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.addOwner(newOwner);
    return tx.hash;
}
export async function removeOwner(walletAddress, owner) {
    const contract = await getMultisigWalletWithSigner(walletAddress);
    const tx = await contract.removeOwner(owner);
    return tx.hash;
}
export async function assignSessionDelegate(walletAddr, delegate) {
    const contract = getMultisigWallet(walletAddr);
    return await contract.assignSessionDelegate(delegate);
}
export async function isSessionDelegate(walletAddr, addr) {
    const contract = getMultisigWallet(walletAddr);
    return await contract.sessionDelegates(addr);
}
