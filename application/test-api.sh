#!/bin/bash

# Test API endpoints with session support
# Usage: ./test-api.sh

COOKIE_JAR="/tmp/402-payment-cookies.txt"
BASE_URL="http://localhost:3000"

echo "🧪 Testing 402 Payment API Endpoints"
echo "===================================="

# Health check
echo -e "\n1️⃣ Health Check"
HEALTH_RESPONSE=$(curl -s -w "\nHTTP Status: %{http_code}" -c "$COOKIE_JAR" "$BASE_URL/api/health")
echo "$HEALTH_RESPONSE" | grep -v "HTTP Status:" | jq . 2>/dev/null || echo "Raw response: $HEALTH_RESPONSE"

# Create/Get user wallet
echo -e "\n2️⃣ User Wallet"
WALLET_RESPONSE=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$BASE_URL/api/user/wallet")
echo "$WALLET_RESPONSE" | jq . 2>/dev/null || echo "Raw response: $WALLET_RESPONSE"

# Create content
echo -e "\n3️⃣ Create Content"
CONTENT_RESPONSE=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" -X POST "$BASE_URL/api/content" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "preview": "This is a preview of the test article",
    "content": "This is the full content that requires payment to access.", 
    "price": 0.001
  }')
echo "$CONTENT_RESPONSE" | jq . 2>/dev/null || echo "Raw response: $CONTENT_RESPONSE"

# List contents
echo -e "\n4️⃣ List Contents"
CONTENTS=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$BASE_URL/api/content")
echo "$CONTENTS" | jq . 2>/dev/null || echo "Raw response: $CONTENTS"

# Attempt payment (will fail due to paymaster issues)
echo -e "\n5️⃣ Payment Process"
CONTENT_ID=$(echo "$CONTENTS" | jq -r '.contents[0].id' 2>/dev/null)
echo "Attempting to purchase content ID: $CONTENT_ID"

PAYMENT_RESPONSE=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" -X POST "$BASE_URL/api/payment/process" \
  -H "Content-Type: application/json" \
  -d "{\"contentId\": \"$CONTENT_ID\"}")
echo "$PAYMENT_RESPONSE" | jq . 2>/dev/null || echo "Raw response: $PAYMENT_RESPONSE"

# Cleanup
rm -f "$COOKIE_JAR"

echo -e "\n✅ API tests completed"
echo "Note: Payment will fail until Paymaster is properly configured"