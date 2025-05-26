// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PaymentManager is Ownable, ReentrancyGuard {
    struct Content {
        string id;
        address payable creator;
        uint256 price;
        bool isActive;
    }

    struct Payment {
        address payer;
        string contentId;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(string => Content) public contents;
    mapping(address => mapping(string => bool)) public hasAccess;
    mapping(address => Payment[]) public userPayments;
    
    uint256 public platformFeePercentage = 500; // 5%
    uint256 public totalPayments;
    
    event ContentCreated(string indexed contentId, address indexed creator, uint256 price);
    event PaymentMade(address indexed payer, string indexed contentId, uint256 amount);
    event AccessGranted(address indexed user, string indexed contentId);
    event ContentUpdated(string indexed contentId, uint256 newPrice, bool isActive);
    
    constructor() Ownable(msg.sender) {}
    
    function createContent(
        string memory contentId,
        uint256 price
    ) external {
        require(bytes(contentId).length > 0, "Content ID cannot be empty");
        require(contents[contentId].creator == address(0), "Content already exists");
        require(price > 0, "Price must be greater than 0");
        
        contents[contentId] = Content({
            id: contentId,
            creator: payable(msg.sender),
            price: price,
            isActive: true
        });
        
        emit ContentCreated(contentId, msg.sender, price);
    }
    
    function purchaseAccess(string memory contentId) external payable nonReentrant {
        Content memory content = contents[contentId];
        require(content.creator != address(0), "Content does not exist");
        require(content.isActive, "Content is not active");
        require(msg.value >= content.price, "Insufficient payment");
        require(!hasAccess[msg.sender][contentId], "Already has access");
        
        uint256 platformFee = (msg.value * platformFeePercentage) / 10000;
        uint256 creatorPayment = msg.value - platformFee;
        
        hasAccess[msg.sender][contentId] = true;
        totalPayments += msg.value;
        
        userPayments[msg.sender].push(Payment({
            payer: msg.sender,
            contentId: contentId,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        content.creator.transfer(creatorPayment);
        
        emit PaymentMade(msg.sender, contentId, msg.value);
        emit AccessGranted(msg.sender, contentId);
    }
    
    function updateContent(
        string memory contentId,
        uint256 newPrice,
        bool isActive
    ) external {
        Content storage content = contents[contentId];
        require(content.creator == msg.sender, "Only creator can update content");
        require(newPrice > 0, "Price must be greater than 0");
        
        content.price = newPrice;
        content.isActive = isActive;
        
        emit ContentUpdated(contentId, newPrice, isActive);
    }
    
    function checkAccess(address user, string memory contentId) external view returns (bool) {
        return hasAccess[user][contentId];
    }
    
    function getContent(string memory contentId) external view returns (Content memory) {
        return contents[contentId];
    }
    
    function getUserPaymentHistory(address user) external view returns (Payment[] memory) {
        return userPayments[user];
    }
    
    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 2000, "Fee cannot exceed 20%");
        platformFeePercentage = newFeePercentage;
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}