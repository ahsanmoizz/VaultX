// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract MultisigModuleManager is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Approved modules
    mapping(address => bool) public isModuleEnabled;

    // Events
    event ModuleEnabled(address indexed module);
    event ModuleDisabled(address indexed module);
    event ModuleExecuted(address indexed module, bytes data, bytes result);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    function enableModule(address module) external onlyRole(ADMIN_ROLE) {
        require(module != address(0), "Invalid module");
        require(!isModuleEnabled[module], "Already enabled");
        isModuleEnabled[module] = true;
        emit ModuleEnabled(module);
    }

    function disableModule(address module) external onlyRole(ADMIN_ROLE) {
        require(isModuleEnabled[module], "Module not enabled");
        isModuleEnabled[module] = false;
        emit ModuleDisabled(module);
    }

    function execModule(
        address module,
        bytes calldata data
    ) external onlyRole(ADMIN_ROLE) returns (bytes memory result) {
        require(isModuleEnabled[module], "Module not enabled");

        (bool success, bytes memory res) = module.delegatecall(data);
        require(success, "Module execution failed");

        emit ModuleExecuted(module, data, res);
        return res;
    }

    function isEnabled(address module) external view returns (bool) {
        return isModuleEnabled[module];
    }
}
