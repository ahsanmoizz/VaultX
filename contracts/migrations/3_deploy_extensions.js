const ERC20Receiver = artifacts.require("ERC20Receiver");
const ERC721Receiver = artifacts.require("ERC721Receiver");
const ERC1155Receiver = artifacts.require("ERC1155Receiver");

module.exports = async function (deployer) {
  await deployer.deploy(ERC20Receiver);
  console.log("✅ ERC20Receiver deployed:", ERC20Receiver.address);

  await deployer.deploy(ERC721Receiver);
  console.log("✅ ERC721Receiver deployed:", ERC721Receiver.address);

  await deployer.deploy(ERC1155Receiver);
  console.log("✅ ERC1155Receiver deployed:", ERC1155Receiver.address);
};
