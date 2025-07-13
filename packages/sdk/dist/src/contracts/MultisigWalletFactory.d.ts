import { ethers } from "ethers";
export declare const getFactoryContract: () => Promise<ethers.Contract>;
export declare const deployMultisig: (owners: string[], required: number) => Promise<string>;
