import { ethers } from "ethers";

export const getProvider = (): ethers.JsonRpcProvider => {
  return new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/Nq-nTYmUhOerjB-IqkyR79beASpksuBg");
};

export const getSigner = async (): Promise<ethers.JsonRpcSigner> => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner(); // ✅ resolved Signer
};
