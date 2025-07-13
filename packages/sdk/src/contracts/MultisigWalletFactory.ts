import { ethers } from "ethers";
import abi from "../../abi/MultisigWalletFactory.json";
import { getSigner } from "../utils/providers";

const FACTORY_ADDRESS = "0x0DA32bA8bEfc73cCfD978c6ed3Ae33c0f825B13B";

export const getFactoryContract = async () => {
  const signer = await getSigner();
  return new ethers.Contract(FACTORY_ADDRESS, abi, signer);
};

export const deployMultisig = async (
  owners: string[],
  required: number
): Promise<string> => {
  const factory = await getFactoryContract();
  const tx = await factory.deployMultisigWallet(owners, required);
  const receipt = await tx.wait();

  const event = receipt.logs.find((log: any) => {
    return log.fragment?.name === "MultisigWalletCreated";
  });

  return event?.args?.wallet;
};
