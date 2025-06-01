#!/bin/bash

# Check Pimlico Paymaster status
echo "🔍 Checking Pimlico Paymaster Status"
echo "===================================="

PIMLICO_API_KEY="pim_CtQtca5ce55fKWnFtVeHJQ"

# Check paymaster balance and status via Pimlico API
echo -e "\n1️⃣ Checking Paymaster Info..."
curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pimlico_getUserOperationGasPrice",
    "params": [],
    "id": 1
  }' | jq .

echo -e "\n2️⃣ API Key Status..."
echo "API Key: ${PIMLICO_API_KEY:0:10}..."
echo "Paymaster Address: 0x777777777777AeC03fd955926DbF81597e66834C"
echo "Network: Base Sepolia"

echo -e "\n📝 Next Steps:"
echo "1. Check your Pimlico dashboard at https://dashboard.pimlico.io"
echo "2. Ensure your API key has credits"
echo "3. Or fund the paymaster directly with Base Sepolia ETH"