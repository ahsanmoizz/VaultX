// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC20Receiver is Ownable {
    event ERC20Received(address indexed token, address indexed from, uint256 amount);

    function receiveERC20(address token, uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        require(token != address(0), "Invalid token");

        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        emit ERC20Received(token, msg.sender, amount);
    }

    function balanceOf(address token) public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }
}
