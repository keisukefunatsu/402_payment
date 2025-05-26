#!/bin/bash

echo "🚀 開発環境を起動します..."

# 開発サーバーをバックグラウンドで起動
cd application
echo "📦 Next.js開発サーバーを起動中..."
FIRESTORE_EMULATOR_HOST=localhost:8080 pnpm dev &
DEV_PID=$!

# サーバーが起動するまで待機
echo "⏳ サーバーの起動を待っています..."
sleep 5

# 動作確認
echo ""
echo "🧪 APIテストを実行中..."
echo "================================"

# Test endpoint
echo "1. Test API:"
curl -s http://localhost:3000/api/test | jq '.' || echo "❌ サーバーが応答しません"

echo ""
echo "================================"
echo "✅ 開発サーバーが起動しました"
echo "🌐 http://localhost:3000"
echo ""
echo "停止するには: kill $DEV_PID"