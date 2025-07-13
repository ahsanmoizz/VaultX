import { getFactoryContract } from "./MultisigWalletFactory";
import { Address } from "viem";

/**
 * Fetches all multisig wallets created by a user.
 * Ensures the result is a plain array of addresses.
 */
export async function getUserMultisigs(user: Address): Promise<Address[]> {
  const factory = await getFactoryContract();
  const result = await factory.getUserMultisigs(user);

  // ✅ Ensure it's a plain array
  return Array.isArray(result) ? [...result] : [];
}
