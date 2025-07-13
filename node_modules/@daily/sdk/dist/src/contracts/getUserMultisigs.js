import { getFactoryContract } from "./MultisigWalletFactory";
export async function getUserMultisigs(user) {
    const factory = await getFactoryContract();
    return factory.getUserMultisigs(user); // ✅ correct fn name
}
