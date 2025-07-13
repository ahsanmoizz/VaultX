// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MultisigWallet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultisigWalletFactory is Ownable {
    // Track all created multisigs
    address[] public allMultisigs;

    // Map deployer → their wallets
    mapping(address => address[]) public userWallets;

    // Emitted when new wallet is deployed
    event MultisigWalletCreated(
        address indexed wallet,
        address indexed creator,
        uint256 ownersCount,
        uint256 requiredConfirmations
    );

    constructor() {}

    function deployMultisigWallet(
        address[] calldata owners,
        uint256 requiredConfirmations
    ) external returns (address) {
        require(owners.length > 0, "No owners provided");
        require(
            requiredConfirmations > 0 && requiredConfirmations <= owners.length,
            "Invalid threshold"
        );

        MultisigWallet wallet = new MultisigWallet(owners, requiredConfirmations);

        allMultisigs.push(address(wallet));
        userWallets[msg.sender].push(address(wallet));

        emit MultisigWalletCreated(address(wallet), msg.sender, owners.length, requiredConfirmations);
        return address(wallet);
    }

    function getAllMultisigs() external view returns (address[] memory) {
        return allMultisigs;
    }

    function getUserMultisigs(address user) external view returns (address[] memory) {
        return userWallets[user];
    }
}
