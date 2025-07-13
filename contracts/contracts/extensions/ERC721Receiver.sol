// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Receiver is IERC721Receiver, Ownable {
    event ERC721Received(address indexed operator, address indexed from, uint256 tokenId, address token);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        emit ERC721Received(operator, from, tokenId, msg.sender);
        return this.onERC721Received.selector;
    }
}
