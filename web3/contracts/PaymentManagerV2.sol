// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PaymentToken.sol";
import "./ContentRegistry.sol";

contract PaymentManagerV2 is Ownable, ReentrancyGuard {
    struct Content {
        string id;
        address payable creator;
        uint256 price;
        bool isActive;
        SubscriptionTier subscriptionTier;
    }
    
    struct Payment {
        address payer;
        string contentId;
        uint256 amount;
        uint256 timestamp;
        PaymentType paymentType;
    }
    
    struct Subscription {
        address subscriber;
        address creator;
        SubscriptionTier tier;
        uint256 startTime;
        uint256 endTime;
        uint256 paidAmount;
    }
    
    enum PaymentType {
        OneTime,
        Subscription,
        Tip
    }
    
    enum SubscriptionTier {
        None,
        Basic,
        Premium,
        Exclusive
    }
    
    PaymentToken public paymentToken;
    ContentRegistry public contentRegistry;
    
    mapping(string => Content) public contents;
    mapping(address => mapping(string => bool)) public hasAccess;
    mapping(address => mapping(string => uint256)) public accessExpiry;
    mapping(address => Payment[]) public userPayments;
    mapping(address => mapping(address => Subscription)) public subscriptions;
    mapping(address => uint256) public creatorEarnings;
    
    uint256 public platformFeePercentage = 500; // 5%
    uint256 public totalPayments;
    
    uint256 public constant BASIC_MULTIPLIER = 100; // 100% of base price
    uint256 public constant PREMIUM_MULTIPLIER = 200; // 200% of base price
    uint256 public constant EXCLUSIVE_MULTIPLIER = 500; // 500% of base price
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    
    event ContentCreated(string indexed contentId, address indexed creator, uint256 price);
    event PaymentMade(address indexed payer, string indexed contentId, uint256 amount, PaymentType paymentType);
    event AccessGranted(address indexed user, string indexed contentId, uint256 expiresAt);
    event SubscriptionCreated(address indexed subscriber, address indexed creator, SubscriptionTier tier);
    event SubscriptionRenewed(address indexed subscriber, address indexed creator);
    event TipSent(address indexed tipper, address indexed creator, uint256 amount);
    
    constructor(address _paymentToken, address _contentRegistry) Ownable(msg.sender) {
        paymentToken = PaymentToken(_paymentToken);
        contentRegistry = ContentRegistry(_contentRegistry);
    }
    
    function createContent(
        string memory contentId,
        uint256 price,
        SubscriptionTier tier
    ) external {
        require(bytes(contentId).length > 0, "Content ID cannot be empty");
        require(contents[contentId].creator == address(0), "Content already exists");
        require(price > 0, "Price must be greater than 0");
        require(contentRegistry.getContentCreator(contentId) == msg.sender, "Not content owner");
        
        contents[contentId] = Content({
            id: contentId,
            creator: payable(msg.sender),
            price: price,
            isActive: true,
            subscriptionTier: tier
        });
        
        emit ContentCreated(contentId, msg.sender, price);
    }
    
    function purchaseAccess(string memory contentId) external payable nonReentrant {
        Content memory content = contents[contentId];
        require(content.creator != address(0), "Content does not exist");
        require(content.isActive, "Content is not active");
        require(contentRegistry.isContentActive(contentId), "Content deactivated in registry");
        
        // Check if user has active subscription
        if (hasActiveSubscription(msg.sender, content.creator, content.subscriptionTier)) {
            _grantAccess(msg.sender, contentId, block.timestamp + SUBSCRIPTION_DURATION);
            return;
        }
        
        require(msg.value >= content.price, "Insufficient payment");
        require(!hasAccess[msg.sender][contentId] || block.timestamp > accessExpiry[msg.sender][contentId], "Already has active access");
        
        _processPayment(msg.sender, contentId, msg.value, PaymentType.OneTime, content.creator);
        
        // Grant 24-hour access for one-time purchase
        _grantAccess(msg.sender, contentId, block.timestamp + 24 hours);
        
        // Issue payment receipt
        bytes32 receiptHash = paymentToken.issueReceipt(contentId, msg.sender, msg.value);
    }
    
    function purchaseSubscription(address creator, SubscriptionTier tier) external payable nonReentrant {
        require(tier != SubscriptionTier.None, "Invalid subscription tier");
        
        uint256 subscriptionPrice = calculateSubscriptionPrice(creator, tier);
        require(msg.value >= subscriptionPrice, "Insufficient payment");
        
        Subscription storage sub = subscriptions[msg.sender][creator];
        
        if (sub.endTime > block.timestamp) {
            // Extend existing subscription
            sub.endTime += SUBSCRIPTION_DURATION;
            sub.paidAmount += msg.value;
            emit SubscriptionRenewed(msg.sender, creator);
        } else {
            // Create new subscription
            subscriptions[msg.sender][creator] = Subscription({
                subscriber: msg.sender,
                creator: creator,
                tier: tier,
                startTime: block.timestamp,
                endTime: block.timestamp + SUBSCRIPTION_DURATION,
                paidAmount: msg.value
            });
            emit SubscriptionCreated(msg.sender, creator, tier);
        }
        
        _processPayment(msg.sender, "", msg.value, PaymentType.Subscription, payable(creator));
    }
    
    function sendTip(address payable creator) external payable nonReentrant {
        require(creator != address(0), "Invalid creator");
        require(msg.value > 0, "Tip must be greater than 0");
        
        _processPayment(msg.sender, "", msg.value, PaymentType.Tip, creator);
        emit TipSent(msg.sender, creator, msg.value);
    }
    
    function _processPayment(
        address payer,
        string memory contentId,
        uint256 amount,
        PaymentType paymentType,
        address payable creator
    ) internal {
        uint256 platformFee = (amount * platformFeePercentage) / 10000;
        uint256 creatorPayment = amount - platformFee;
        
        totalPayments += amount;
        creatorEarnings[creator] += creatorPayment;
        
        userPayments[payer].push(Payment({
            payer: payer,
            contentId: contentId,
            amount: amount,
            timestamp: block.timestamp,
            paymentType: paymentType
        }));
        
        creator.transfer(creatorPayment);
        
        emit PaymentMade(payer, contentId, amount, paymentType);
    }
    
    function _grantAccess(address user, string memory contentId, uint256 expiresAt) internal {
        hasAccess[user][contentId] = true;
        accessExpiry[user][contentId] = expiresAt;
        emit AccessGranted(user, contentId, expiresAt);
    }
    
    function hasActiveSubscription(
        address subscriber,
        address creator,
        SubscriptionTier requiredTier
    ) public view returns (bool) {
        Subscription memory sub = subscriptions[subscriber][creator];
        return sub.endTime > block.timestamp && sub.tier >= requiredTier;
    }
    
    function calculateSubscriptionPrice(address creator, SubscriptionTier tier) public view returns (uint256) {
        // Get average content price for creator
        uint256 basePrice = 0.001 ether; // Default base price
        
        uint256 multiplier;
        if (tier == SubscriptionTier.Basic) {
            multiplier = BASIC_MULTIPLIER;
        } else if (tier == SubscriptionTier.Premium) {
            multiplier = PREMIUM_MULTIPLIER;
        } else if (tier == SubscriptionTier.Exclusive) {
            multiplier = EXCLUSIVE_MULTIPLIER;
        }
        
        return (basePrice * multiplier) / 100;
    }
    
    function checkAccess(address user, string memory contentId) external view returns (bool) {
        if (hasAccess[user][contentId] && block.timestamp <= accessExpiry[user][contentId]) {
            return true;
        }
        
        Content memory content = contents[contentId];
        if (content.creator != address(0) && hasActiveSubscription(user, content.creator, content.subscriptionTier)) {
            return true;
        }
        
        return false;
    }
    
    function getSubscription(address subscriber, address creator) external view returns (Subscription memory) {
        return subscriptions[subscriber][creator];
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
    
    function setPaymentToken(address _paymentToken) external onlyOwner {
        paymentToken = PaymentToken(_paymentToken);
    }
    
    function setContentRegistry(address _contentRegistry) external onlyOwner {
        contentRegistry = ContentRegistry(_contentRegistry);
    }
}