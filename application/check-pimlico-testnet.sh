#!/bin/bash

echo "🔍 Pimlico Base Sepolia テストネット診断"
echo "========================================"

PIMLICO_API_KEY="pim_CtQtca5ce55fKWnFtVeHJQ"

# 1. チェーンIDとネットワーク確認
echo -e "\n1️⃣ ネットワーク設定確認"
echo "Chain: Base Sepolia"
echo "Chain ID: 84532"
echo "RPC URL: https://sepolia.base.org"

# 2. Pimlicoエンドポイント確認
echo -e "\n2️⃣ Pimlico API エンドポイント"
echo "Bundler URL: https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}"

# 3. チェーンがサポートされているか確認
echo -e "\n3️⃣ サポートチェーン確認"
curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pimlico_getUserOperationGasPrice",
    "params": [],
    "id": 1
  }' | jq .

# 4. EntryPoint確認
echo -e "\n4️⃣ EntryPoint アドレス確認"
echo "EntryPoint v0.7: 0x0000000071727De22E5E9d8BAf0edAc6f37da032"

# 5. テスト用UserOperation送信
echo -e "\n5️⃣ Paymasterテスト"
TEST_RESPONSE=$(curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pm_sponsorUserOperation",
    "params": [{
      "sender": "0x5991A2dF15A8F6A256D3Ec51E99254Cd3fb576A9",
      "nonce": "0x0",
      "factory": "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
      "factoryData": "0x",
      "callData": "0x",
      "callGasLimit": "0x7530",
      "verificationGasLimit": "0x7530",
      "preVerificationGas": "0x186a0",
      "maxFeePerGas": "0x3b9aca00",
      "maxPriorityFeePerGas": "0xf4240",
      "signature": "0x"
    },
    "0x0000000071727De22E5E9d8BAf0edAc6f37da032"],
    "id": 2
  }')

echo "$TEST_RESPONSE" | jq .

echo -e "\n📋 診断結果:"
if echo "$TEST_RESPONSE" | jq -e '.result' > /dev/null 2>&1; then
  echo "✅ Paymaster接続成功"
else
  echo "❌ Paymaster接続エラー"
  ERROR_MSG=$(echo "$TEST_RESPONSE" | jq -r '.error.message // "Unknown error"')
  echo "エラー: $ERROR_MSG"
  
  if [[ "$ERROR_MSG" == *"AA21"* ]]; then
    echo "→ Paymasterに資金がありません"
  elif [[ "$ERROR_MSG" == *"invalid apikey"* ]]; then
    echo "→ API Keyが無効です"
  elif [[ "$ERROR_MSG" == *"insufficient"* ]]; then
    echo "→ クレジット不足です"
  fi
fi

echo -e "\n📝 解決策:"
echo "1. Pimlicoダッシュボードでクレジットを確認"
echo "2. Base Sepoliaがサポートされているか確認"
echo "3. API Keyの権限を確認"