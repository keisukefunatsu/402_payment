#!/bin/bash

echo "📋 Pimlico Paymaster テストネット設定手順"
echo "======================================="

echo -e "\n✅ ステップ1: Pimlicoダッシュボードで確認"
echo "1. https://dashboard.pimlico.io にアクセス"
echo "2. API KEYセクションで残高を確認"
echo "3. 無料クレジットがない場合："
echo "   - クレジットカードを登録（$1000のオーバードラフト枠）"
echo "   - または無料クレジットを申請"

echo -e "\n✅ ステップ2: API KEYの動作確認"
PIMLICO_API_KEY="pim_CtQtca5ce55fKWnFtVeHJQ"
echo "API Key: ${PIMLICO_API_KEY:0:10}..."

# ガス価格の取得テスト
echo -e "\nガス価格取得テスト..."
GAS_RESPONSE=$(curl -s -X POST "https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "pimlico_getUserOperationGasPrice",
    "params": [],
    "id": 1
  }')

if echo "$GAS_RESPONSE" | jq -e '.result' > /dev/null 2>&1; then
  echo "✅ API KEY有効 - ガス価格取得成功"
  echo "$GAS_RESPONSE" | jq '.result'
else
  echo "❌ API KEY問題あり"
  echo "$GAS_RESPONSE" | jq .
fi

echo -e "\n✅ ステップ3: コード修正完了"
echo "- ガス推定をPimlicoの動的値に変更済み"

echo -e "\n✅ ステップ4: 最終テスト"
echo "以下のコマンドで支払いAPIをテスト:"
echo "./test-api.sh"

echo -e "\n📝 トラブルシューティング:"
echo "1. 'insufficient funds'エラー → Pimlicoダッシュボードでクレジット確認"
echo "2. 'UserOperation reverted' → スマートアカウントの初回デプロイが必要な可能性"
echo "3. その他のエラー → Pimlicoダッシュボードのログを確認"