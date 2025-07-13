import { ethers } from "ethers";
export const getProvider = () => {
    return new ethers.JsonRpcProvider(import.meta.env.VITE_RPC_URL);
};
export const getSigner = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return await provider.getSigner(); // ✅ resolved Signer
};
