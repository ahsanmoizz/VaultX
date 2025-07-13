// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MultisigWallet is AccessControlEnumerable, ReentrancyGuard {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Counters for Counters.Counter;

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    uint256 public requiredConfirmations;
    uint256 public minDelay = 1 hours; // ⏳ Cooldown time
    mapping(address => uint256) public lastSubmitTime; // ⏳ Track per-user
uint256 public feeBasisPoints = 10; // 0.1% (1 basis point = 0.01%)
address public feeRecipient;

    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        uint256 numConfirmations;
        uint256 timestamp;
        string vaultLabel; // ✅ New: On-chain vault label
    }

    Counters.Counter private _txIdTracker;
    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public confirmations;

    EnumerableSet.AddressSet private owners;
    mapping(address => bool) public sessionDelegates;

    event SubmitTransaction(uint256 indexed txId, address indexed sender);
    event ConfirmTransaction(uint256 indexed txId, address indexed sender);
    event RevokeConfirmation(uint256 indexed txId, address indexed sender);
    event ExecuteTransaction(uint256 indexed txId, address executor);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);
    event DelegateAssigned(address indexed sessionKey);
    event TransactionCancelled(uint256 indexed txId);

    modifier onlyOwner() {
        require(hasRole(OWNER_ROLE, msg.sender), "Not an owner");
        _;
    }

    modifier txExists(uint256 txId) {
        require(txId < _txIdTracker.current(), "TX does not exist");
        _;
    }

    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "TX already executed");
        _;
    }

    modifier notConfirmed(uint256 txId) {
        require(!confirmations[txId][msg.sender], "Already confirmed");
        _;
    }

    modifier cooldown() {
        require(block.timestamp - lastSubmitTime[msg.sender] >= minDelay, "Cooldown active");
        _;
    }
  modifier chargeFee(uint256 value) {
    if (feeBasisPoints > 0 && feeRecipient != address(0)) {
        uint256 fee = (value * feeBasisPoints) / 10000;
        require(msg.value >= fee, "Insufficient fee sent");
        payable(feeRecipient).transfer(fee);
    }
    _;
}
    constructor(address[] memory _owners, uint256 _requiredConfirmations) {
        require(_owners.length > 0, "No owners");
        require(_requiredConfirmations > 0 && _requiredConfirmations <= _owners.length, "Invalid threshold");

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);

        for (uint256 i = 0; i < _owners.length; i++) {
            _grantRole(OWNER_ROLE, _owners[i]);
            owners.add(_owners[i]);
        }

        requiredConfirmations = _requiredConfirmations;
    }

    function getOwners() public view returns (address[] memory) {
        return owners.values();
    }

   function submitTransaction(
    address to,
    uint256 value,
    bytes calldata data,
    string calldata vaultLabel
) external payable onlyOwner cooldown chargeFee(value) returns (uint256) {
        lastSubmitTime[msg.sender] = block.timestamp;

        uint256 txId = _txIdTracker.current();
        _txIdTracker.increment();

        transactions[txId] = Transaction({
            destination: to,
            value: value,
            data: data,
            executed: false,
            numConfirmations: 0,
            timestamp: block.timestamp,
            vaultLabel: vaultLabel
        });

        emit SubmitTransaction(txId, msg.sender);
        return txId;
    }

    function confirmTransaction(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) notConfirmed(txId) {
        confirmations[txId][msg.sender] = true;
        transactions[txId].numConfirmations++;

        emit ConfirmTransaction(txId, msg.sender);
    }

    function revokeConfirmation(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        require(confirmations[txId][msg.sender], "Not yet confirmed");
        confirmations[txId][msg.sender] = false;
        transactions[txId].numConfirmations--;

        emit RevokeConfirmation(txId, msg.sender);
    }

    function executeTransaction(uint256 txId) external nonReentrant txExists(txId) notExecuted(txId) {
        Transaction storage txn = transactions[txId];
        require(txn.numConfirmations >= requiredConfirmations, "Insufficient confirmations");

        txn.executed = true;

        (bool success, ) = txn.destination.call{value: txn.value}(txn.data);
        require(success, "Execution failed");

        emit ExecuteTransaction(txId, msg.sender);
    }
      
      function getConfirmations(uint256 txId) public view returns (address[] memory) {
    address[] memory allOwners = getOwners();
    uint256 count = 0;

    for (uint256 i = 0; i < allOwners.length; i++) {
        if (confirmations[txId][allOwners[i]]) {
            count++;
        }
    }

    address[] memory confirmed = new address[](count);
    uint256 idx = 0;

    for (uint256 i = 0; i < allOwners.length; i++) {
        if (confirmations[txId][allOwners[i]]) {
            confirmed[idx] = allOwners[i];
            idx++;
        }
    }

    return confirmed;
}


    function cancelTransaction(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        transactions[txId].executed = true;
        emit TransactionCancelled(txId);
    }

    function addOwner(address newOwner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!owners.contains(newOwner), "Already owner");
        owners.add(newOwner);
        _grantRole(OWNER_ROLE, newOwner);
        emit OwnerAdded(newOwner);
    }

    function removeOwner(address owner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(owners.contains(owner), "Not an owner");
        owners.remove(owner);
        _revokeRole(OWNER_ROLE, owner);
        emit OwnerRemoved(owner);
    }

    function assignSessionDelegate(address delegate) external onlyOwner {
        sessionDelegates[delegate] = true;
        emit DelegateAssigned(delegate);
    }

    receive() external payable {}
}
