// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IRelayer - Interface for gas sponsoring and meta-transactions
interface IRelayer {
    /// @notice Called by a relayer to execute a transaction on user's behalf
    /// @param user The address of the user who signed the meta-TX
    /// @param to The target contract
    /// @param value ETH to send
    /// @param data Calldata payload
    /// @param nonce User nonce to prevent replay
    /// @param signature Signed message from user
    function executeMetaTx(
        address user,
        address to,
        uint256 value,
        bytes calldata data,
        uint256 nonce,
        bytes calldata signature
    ) external payable;

    /// @notice Returns the expected hash to be signed for a given meta-TX
    function getMetaTxHash(
        address user,
        address to,
        uint256 value,
        bytes calldata data,
        uint256 nonce
    ) external view returns (bytes32);

    /// @notice Get relayer's current trusted status
    function isRelayerApproved(address relayer) external view returns (bool);
}
