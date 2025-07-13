// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library SignatureUtils {
    /// @notice Recover signer from hash and signature
    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        require(signature.length == 65, "Invalid sig length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        // EIP-2: signature decomposition
        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        require(v == 27 || v == 28, "Invalid sig v");
        return ecrecover(hash, v, r, s);
    }

    /// @notice Returns the prefixed hash used for eth_sign (EIP-191)
    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    /// @notice Verifies signature is from expected signer
    function verify(
        address signer,
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (bool) {
        return recoverSigner(toEthSignedMessageHash(hash), signature) == signer;
    }
}
