// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

interface IEntryPoint {
    function handleOps(UserOperation[] calldata ops, address payable beneficiary) external;
}

struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

contract SimpleAccount is Initializable {
    using ECDSA for bytes32;
    
    address public owner;
    uint256 public nonce;
    IEntryPoint public immutable entryPoint;
    
    event AccountInitialized(address indexed owner);
    event UserOperationExecuted(address indexed target, uint256 value, bytes data);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlyEntryPoint() {
        require(msg.sender == address(entryPoint), "Only EntryPoint");
        _;
    }
    
    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;
    }
    
    function initialize(address _owner) external initializer {
        require(_owner != address(0), "Invalid owner");
        owner = _owner;
        emit AccountInitialized(_owner);
    }
    
    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyEntryPoint {
        _call(target, value, data);
    }
    
    function executeBatch(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata datas
    ) external onlyEntryPoint {
        require(
            targets.length == values.length && values.length == datas.length,
            "Array length mismatch"
        );
        
        for (uint256 i = 0; i < targets.length; i++) {
            _call(targets[i], values[i], datas[i]);
        }
    }
    
    function _call(
        address target,
        uint256 value,
        bytes memory data
    ) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
        emit UserOperationExecuted(target, value, data);
    }
    
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external onlyEntryPoint returns (uint256 validationData) {
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(userOpHash);
        address signer = ECDSA.recover(hash, userOp.signature);
        
        if (signer != owner) {
            return 1; // Invalid signature
        }
        
        if (userOp.nonce != nonce++) {
            return 1; // Invalid nonce
        }
        
        if (missingAccountFunds > 0) {
            (bool success,) = payable(msg.sender).call{value: missingAccountFunds}("");
            require(success, "Failed to prefund");
        }
        
        return 0; // Valid
    }
    
    function addDeposit() external payable {
        require(msg.value > 0, "Deposit must be greater than 0");
    }
    
    function getDeposit() external view returns (uint256) {
        return address(this).balance;
    }
    
    function withdrawTo(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}