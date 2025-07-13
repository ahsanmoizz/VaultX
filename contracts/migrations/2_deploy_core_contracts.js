const MultisigWalletFactory = artifacts.require("MultisigWalletFactory");
const MultisigModuleManager = artifacts.require("MultisigModuleManager");

module.exports = async function (deployer, network, accounts) {
  const admin = accounts[0];

  await deployer.deploy(MultisigWalletFactory);
  console.log("✅ MultisigWalletFactory deployed:", MultisigWalletFactory.address);

  await deployer.deploy(MultisigModuleManager, admin);
  console.log("✅ MultisigModuleManager deployed:", MultisigModuleManager.address);
};
