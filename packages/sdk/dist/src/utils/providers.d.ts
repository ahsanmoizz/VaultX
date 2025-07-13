import { ethers } from "ethers";
export declare const getProvider: () => ethers.JsonRpcProvider;
export declare const getSigner: () => Promise<ethers.JsonRpcSigner>;
