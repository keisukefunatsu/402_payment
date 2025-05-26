// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AccountAbstraction.sol";
import "./PaymentManagerV2.sol";
import "./PaymentToken.sol";

interface IIntegratedPaymentSystem {
    function executePaymentViaAA(
        string calldata contentId,
        uint256 amount
    ) external;
    
    function batchPurchase(
        string[] calldata contentIds,
        uint256[] calldata amounts
    ) external payable;
}

contract IntegratedPaymentSystem is IIntegratedPaymentSystem {
    PaymentManagerV2 public immutable paymentManager;
    PaymentToken public immutable paymentToken;
    address public immutable accountFactory;
    
    mapping(address => bool) public isRegisteredAccount;
    
    event AAPaymentExecuted(
        address indexed account,
        string contentId,
        uint256 amount
    );
    
    event BatchPurchaseCompleted(
        address indexed buyer,
        uint256 totalAmount,
        uint256 itemCount
    );
    
    constructor(
        address _paymentManager,
        address _paymentToken,
        address _accountFactory
    ) {
        paymentManager = PaymentManagerV2(_paymentManager);
        paymentToken = PaymentToken(_paymentToken);
        accountFactory = _accountFactory;
    }
    
    function executePaymentViaAA(
        string calldata contentId,
        uint256 amount
    ) external override {
        require(isRegisteredAccount[msg.sender], "Not a registered AA wallet");
        
        // Encode the payment function call
        bytes memory paymentCall = abi.encodeWithSelector(
            PaymentManagerV2.purchaseAccess.selector,
            contentId
        );
        
        // Execute via the AA wallet
        SimpleAccount(payable(msg.sender)).execute(
            address(paymentManager),
            amount,
            paymentCall
        );
        
        emit AAPaymentExecuted(msg.sender, contentId, amount);
    }
    
    function batchPurchase(
        string[] calldata contentIds,
        uint256[] calldata amounts
    ) external payable override {
        require(contentIds.length == amounts.length, "Array length mismatch");
        require(contentIds.length > 0, "Empty purchase list");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(msg.value >= totalAmount, "Insufficient payment");
        
        // For AA wallets, prepare batch execution
        if (isRegisteredAccount[msg.sender]) {
            address[] memory targets = new address[](contentIds.length);
            uint256[] memory values = new uint256[](contentIds.length);
            bytes[] memory calls = new bytes[](contentIds.length);
            
            for (uint256 i = 0; i < contentIds.length; i++) {
                targets[i] = address(paymentManager);
                values[i] = amounts[i];
                calls[i] = abi.encodeWithSelector(
                    PaymentManagerV2.purchaseAccess.selector,
                    contentIds[i]
                );
            }
            
            SimpleAccount(payable(msg.sender)).executeBatch(
                targets,
                values,
                calls
            );
        } else {
            // For regular wallets, execute purchases directly
            for (uint256 i = 0; i < contentIds.length; i++) {
                paymentManager.purchaseAccess{value: amounts[i]}(contentIds[i]);
            }
        }
        
        emit BatchPurchaseCompleted(msg.sender, totalAmount, contentIds.length);
        
        // Refund excess payment
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
    }
    
    function registerAAWallet(address wallet) external {
        require(wallet != address(0), "Invalid wallet address");
        // In production, verify this is actually an AA wallet from our factory
        isRegisteredAccount[wallet] = true;
    }
    
    function generatePaymentProof(
        string calldata contentId,
        address payer
    ) external view returns (bytes32, bytes memory) {
        // Get payment receipt
        bytes32 receiptHash = paymentToken.getUserReceipt(payer, contentId);
        
        // Generate proof data
        bytes memory proofData = abi.encode(
            receiptHash,
            contentId,
            payer,
            block.timestamp
        );
        
        return (receiptHash, proofData);
    }
    
    function verifyAndExecutePayment(
        bytes32 receiptHash,
        bytes calldata signature
    ) external {
        // Verify the payment receipt
        (bool isValid, PaymentToken.PaymentReceipt memory receipt) = 
            paymentToken.verifyReceipt(receiptHash);
        
        require(isValid, "Invalid receipt");
        require(receipt.payer == msg.sender, "Not the payer");
        
        // Mark receipt as used
        paymentToken.markReceiptUsed(receiptHash);
        
        // Grant access via payment manager
        paymentManager.purchaseAccess{value: receipt.amount}(receipt.contentId);
    }
}