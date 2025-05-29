#!/bin/bash

# Test API endpoints with session support
# Usage: ./test-api.sh

COOKIE_JAR="/tmp/402-payment-cookies.txt"
BASE_URL="http://localhost:3000"

echo "🧪 Testing 402 Payment API Endpoints"
echo "===================================="

# Health check
echo -e "\n1️⃣ Health Check"
curl -s -c "$COOKIE_JAR" "$BASE_URL/api/health" | jq .

# Create/Get user wallet
echo -e "\n2️⃣ User Wallet"
curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$BASE_URL/api/user/wallet" | jq .

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
echo "$CONTENT_RESPONSE" | jq .

# List contents
echo -e "\n4️⃣ List Contents"
CONTENTS=$(curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" "$BASE_URL/api/content")
echo "$CONTENTS" | jq .

# Attempt payment (will fail due to paymaster issues)
echo -e "\n5️⃣ Payment Process"
CONTENT_ID=$(echo "$CONTENTS" | jq -r '.contents[0].id')
echo "Attempting to purchase content ID: $CONTENT_ID"

curl -s -b "$COOKIE_JAR" -c "$COOKIE_JAR" -X POST "$BASE_URL/api/payment/process" \
  -H "Content-Type: application/json" \
  -d "{\"contentId\": \"$CONTENT_ID\"}" | jq .

# Cleanup
rm -f "$COOKIE_JAR"

echo -e "\n✅ API tests completed"
echo "Note: Payment will fail until Paymaster is properly configured"