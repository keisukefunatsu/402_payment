// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

contract PaymentToken is Ownable {
    using ECDSA for bytes32;
    
    struct PaymentReceipt {
        string contentId;
        address payer;
        uint256 amount;
        uint256 timestamp;
        uint256 expiresAt;
        bytes32 receiptHash;
        bool isUsed;
    }
    
    struct PaymentChallenge {
        string contentId;
        uint256 amount;
        uint256 nonce;
        uint256 expiresAt;
    }
    
    mapping(bytes32 => PaymentReceipt) public receipts;
    mapping(address => mapping(string => bytes32)) public userContentReceipts;
    mapping(bytes32 => bool) public usedChallenges;
    mapping(address => uint256) public userNonces;
    
    address public paymentManager;
    uint256 public constant RECEIPT_VALIDITY_PERIOD = 24 hours;
    uint256 public constant CHALLENGE_VALIDITY_PERIOD = 5 minutes;
    
    event ReceiptIssued(
        bytes32 indexed receiptHash,
        address indexed payer,
        string contentId,
        uint256 expiresAt
    );
    
    event ReceiptVerified(
        bytes32 indexed receiptHash,
        address indexed verifier
    );
    
    event ChallengeCreated(
        bytes32 indexed challengeHash,
        string contentId,
        uint256 amount
    );
    
    modifier onlyPaymentManager() {
        require(msg.sender == paymentManager, "Only payment manager");
        _;
    }
    
    constructor(address _paymentManager) Ownable(msg.sender) {
        require(_paymentManager != address(0), "Invalid payment manager");
        paymentManager = _paymentManager;
    }
    
    function issueReceipt(
        string memory contentId,
        address payer,
        uint256 amount
    ) external onlyPaymentManager returns (bytes32) {
        uint256 timestamp = block.timestamp;
        uint256 expiresAt = timestamp + RECEIPT_VALIDITY_PERIOD;
        
        bytes32 receiptHash = keccak256(
            abi.encodePacked(
                contentId,
                payer,
                amount,
                timestamp,
                expiresAt,
                blockhash(block.number - 1)
            )
        );
        
        receipts[receiptHash] = PaymentReceipt({
            contentId: contentId,
            payer: payer,
            amount: amount,
            timestamp: timestamp,
            expiresAt: expiresAt,
            receiptHash: receiptHash,
            isUsed: false
        });
        
        userContentReceipts[payer][contentId] = receiptHash;
        
        emit ReceiptIssued(receiptHash, payer, contentId, expiresAt);
        
        return receiptHash;
    }
    
    function verifyReceipt(bytes32 receiptHash) external view returns (bool, PaymentReceipt memory) {
        PaymentReceipt memory receipt = receipts[receiptHash];
        
        if (receipt.timestamp == 0) {
            return (false, receipt); // Receipt doesn't exist
        }
        
        if (block.timestamp > receipt.expiresAt) {
            return (false, receipt); // Receipt expired
        }
        
        if (receipt.isUsed) {
            return (false, receipt); // Receipt already used
        }
        
        return (true, receipt);
    }
    
    function createPaymentChallenge(
        string memory contentId,
        uint256 amount
    ) external view returns (bytes32, PaymentChallenge memory) {
        uint256 nonce = userNonces[msg.sender];
        uint256 expiresAt = block.timestamp + CHALLENGE_VALIDITY_PERIOD;
        
        PaymentChallenge memory challenge = PaymentChallenge({
            contentId: contentId,
            amount: amount,
            nonce: nonce,
            expiresAt: expiresAt
        });
        
        bytes32 challengeHash = keccak256(
            abi.encode(challenge)
        );
        
        return (challengeHash, challenge);
    }
    
    function verifyPaymentSignature(
        bytes32 challengeHash,
        bytes memory signature,
        address expectedSigner
    ) external view returns (bool) {
        bytes32 messageHash = MessageHashUtils.toEthSignedMessageHash(challengeHash);
        address recoveredSigner = ECDSA.recover(messageHash, signature);
        
        return recoveredSigner == expectedSigner;
    }
    
    function markReceiptUsed(bytes32 receiptHash) external onlyPaymentManager {
        require(receipts[receiptHash].timestamp != 0, "Receipt doesn't exist");
        require(!receipts[receiptHash].isUsed, "Receipt already used");
        
        receipts[receiptHash].isUsed = true;
        emit ReceiptVerified(receiptHash, msg.sender);
    }
    
    function getUserReceipt(address user, string memory contentId) external view returns (bytes32) {
        return userContentReceipts[user][contentId];
    }
    
    function generatePaymentHeaders(
        string memory contentId,
        uint256 price
    ) external pure returns (string memory) {
        return string(
            abi.encodePacked(
                "Payment-Required: true\n",
                "Payment-Amount: ", uint2str(price), "\n",
                "Payment-Content-ID: ", contentId, "\n",
                "Payment-Network: base-sepolia\n",
                "Payment-Token: ETH"
            )
        );
    }
    
    function updatePaymentManager(address _paymentManager) external onlyOwner {
        require(_paymentManager != address(0), "Invalid payment manager");
        paymentManager = _paymentManager;
    }
    
    function incrementNonce(address user) external onlyPaymentManager {
        userNonces[user]++;
    }
    
    // Helper function to convert uint to string
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}