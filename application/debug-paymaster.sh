#!/bin/bash

# Debug Pimlico Paymaster issues
echo "🔍 Debugging Pimlico Paymaster"
echo "=============================="

PIMLICO_API_KEY="pim_CtQtca5ce55fKWnFtVeHJQ"

# Check if API key is valid
echo -e "\n1️⃣ Testing API Key..."
RESPONSE=$(curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pimlico_getUserOperationGasPrice",
    "params": [],
    "id": 1
  }')

if echo "$RESPONSE" | jq -e '.result' > /dev/null 2>&1; then
  echo "✅ API Key is valid"
else
  echo "❌ API Key issue detected"
  echo "$RESPONSE" | jq .
fi

# Try to get sponsorship policies
echo -e "\n2️⃣ Checking Sponsorship Policies..."
curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pm_sponsorUserOperation",
    "params": [
      {
        "sender": "0x7a640cA3C022d7D607cc0EF62B2D077FD14881d6",
        "nonce": "0x0",
        "initCode": "0x",
        "callData": "0x",
        "paymasterAndData": "0x",
        "signature": "0x",
        "callGasLimit": "0x5208",
        "verificationGasLimit": "0x5208",
        "preVerificationGas": "0x5208",
        "maxFeePerGas": "0x3b9aca00",
        "maxPriorityFeePerGas": "0x3b9aca00"
      },
      "0x0000000071727De22E5E9d8BAf0edAc6f37da032"
    ],
    "id": 2
  }' | jq .

echo -e "\n3️⃣ Common Issues:"
echo "- If you see 'insufficient funds': Your Pimlico account needs credits"
echo "- If you see 'invalid apikey': Check your API key in the dashboard"
echo "- If you see policy errors: The paymaster might have restrictions"
echo ""
echo "📝 Solutions:"
echo "1. Go to https://dashboard.pimlico.io and check your credits"
echo "2. Use a test paymaster instead of production one"
echo "3. Or deploy your own paymaster contract"