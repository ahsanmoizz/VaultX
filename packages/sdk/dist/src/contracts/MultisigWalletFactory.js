import { ethers } from "ethers";
import abi from "../../abi/MultisigWalletFactory.json";
import { getSigner } from "../utils/providers";
const FACTORY_ADDRESS = "0x113dB25dB0400cE1Bd8a307E6980e5D10e669cD1";
export const getFactoryContract = async () => {
    const signer = await getSigner();
    return new ethers.Contract(FACTORY_ADDRESS, abi, signer);
};
export const deployMultisig = async (owners, required) => {
    const factory = await getFactoryContract();
    const tx = await factory.deployMultisigWallet(owners, required);
    const receipt = await tx.wait();
    const event = receipt.logs.find((log) => {
        return log.fragment?.name === "MultisigWalletCreated";
    });
    return event?.args?.wallet;
};
