#!/bin/bash

echo "🧪 APIエンドポイントをテスト中..."
echo "================================"

# Health check
echo "1. Health Check:"
curl -s http://localhost:3000/api/health || echo "❌ サーバーが起動していません"

echo ""
echo "2. Simple Test:"
curl -s http://localhost:3000/api/simple-test

echo ""
echo "3. Account Create API:"
curl -s -X POST http://localhost:3000/api/account/create \
  -H "Content-Type: application/json" \
  -d '{"owner":"0x1234567890123456789012345678901234567890"}'

echo ""
echo "4. Content List API:"
curl -s http://localhost:3000/api/content/list

echo ""
echo "================================"
echo "✅ テスト完了"