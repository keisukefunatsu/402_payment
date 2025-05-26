// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AccountAbstraction.sol";

interface IPaymaster {
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData);

    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external;
}

enum PostOpMode {
    opSucceeded,
    opReverted,
    postOpReverted
}

contract PaymentPaymaster is Ownable, IPaymaster {
    IEntryPoint public immutable entryPoint;
    address public paymentManager;
    
    mapping(address => uint256) public sponsoredGasBalance;
    mapping(address => bool) public approvedSpenders;
    
    uint256 public constant MAX_GAS_LIMIT = 500000;
    uint256 public constant GAS_OVERHEAD = 50000;
    
    event GasSponsored(address indexed user, uint256 actualCost);
    event SponsorshipDeposited(address indexed sponsor, uint256 amount);
    event PaymentManagerUpdated(address indexed newPaymentManager);
    
    modifier onlyEntryPoint() {
        require(msg.sender == address(entryPoint), "Only EntryPoint");
        _;
    }
    
    constructor(IEntryPoint _entryPoint, address _paymentManager) Ownable(msg.sender) {
        entryPoint = _entryPoint;
        paymentManager = _paymentManager;
    }
    
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external override onlyEntryPoint returns (bytes memory context, uint256 validationData) {
        // Check if this is a payment operation
        bytes4 selector = bytes4(userOp.callData);
        
        // Verify it's calling our payment manager
        address target = address(uint160(bytes20(userOp.callData[16:36])));
        
        if (target != paymentManager) {
            return ("", 1); // Invalid operation
        }
        
        // Check if user has enough sponsored balance
        if (sponsoredGasBalance[userOp.sender] < maxCost) {
            return ("", 1); // Insufficient sponsored balance
        }
        
        // Check gas limits
        uint256 totalGas = userOp.callGasLimit + userOp.verificationGasLimit + userOp.preVerificationGas;
        if (totalGas > MAX_GAS_LIMIT) {
            return ("", 1); // Gas limit exceeded
        }
        
        // Deduct from sponsored balance
        sponsoredGasBalance[userOp.sender] -= maxCost;
        
        // Return context for postOp
        return (abi.encode(userOp.sender, maxCost), 0);
    }
    
    function postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) external override onlyEntryPoint {
        if (mode == PostOpMode.postOpReverted) {
            return; // Don't revert to allow EntryPoint to continue
        }
        
        (address user, uint256 maxCost) = abi.decode(context, (address, uint256));
        
        // Refund unused gas
        if (actualGasCost < maxCost) {
            sponsoredGasBalance[user] += (maxCost - actualGasCost);
        }
        
        emit GasSponsored(user, actualGasCost);
    }
    
    function depositSponsorshipFor(address user) external payable {
        require(msg.value > 0, "Must deposit something");
        sponsoredGasBalance[user] += msg.value;
        emit SponsorshipDeposited(user, msg.value);
    }
    
    function addSponsorshipForNewUsers(address[] calldata users, uint256 amountPerUser) external onlyOwner {
        uint256 totalRequired = users.length * amountPerUser;
        require(address(this).balance >= totalRequired, "Insufficient paymaster balance");
        
        for (uint256 i = 0; i < users.length; i++) {
            sponsoredGasBalance[users[i]] += amountPerUser;
        }
    }
    
    function updatePaymentManager(address _paymentManager) external onlyOwner {
        require(_paymentManager != address(0), "Invalid payment manager");
        paymentManager = _paymentManager;
        emit PaymentManagerUpdated(_paymentManager);
    }
    
    function withdrawTo(address payable recipient, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        (bool success,) = recipient.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    function addDepositFor(address account) external payable {
        sponsoredGasBalance[account] += msg.value;
    }
    
    function getDeposit(address account) external view returns (uint256) {
        return sponsoredGasBalance[account];
    }
    
    receive() external payable {}
}