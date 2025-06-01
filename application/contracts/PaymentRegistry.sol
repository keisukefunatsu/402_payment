// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PaymentRegistry
 * @dev Simple contract to record 402 payment events on-chain
 */
contract PaymentRegistry {
    event PaymentRecorded(
        address indexed payer,
        string contentId,
        uint256 amount,
        uint256 timestamp
    );

    /**
     * @dev Record a payment for content access
     * @param contentId The ID of the content being accessed
     * @param amount The payment amount (not transferred, just recorded)
     */
    function recordPayment(string calldata contentId, uint256 amount) external {
        emit PaymentRecorded(msg.sender, contentId, amount, block.timestamp);
    }
}