// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

library RoleHelper {
    /// @notice Get all members for a specific role
    function getRoleMembers(
        AccessControlEnumerable ac,
        bytes32 role
    ) external view returns (address[] memory) {
        uint256 count = ac.getRoleMemberCount(role);
        address[] memory members = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            members[i] = ac.getRoleMember(role, i);
        }
        return members;
    }

    /// @notice Check if an address has a role
    function has(
        AccessControl ac,
        bytes32 role,
        address account
    ) external view returns (bool) {
        return ac.hasRole(role, account);
    }
}
