#!/bin/bash

echo "🚀 402 Payment PoC セットアップを開始します..."

# 1. Firebase CLIの確認
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLIがインストールされていません"
    echo "npm install -g firebase-tools でインストールしてください"
    exit 1
fi

# 2. 環境変数ファイルの準備
if [ ! -f application/.env.local ]; then
    echo "📝 環境変数ファイルを作成中..."
    cp application/.env.local.example application/.env.local
    echo "⚠️  .env.localファイルを編集して、必要なAPIキーを設定してください"
fi

# 3. 依存関係のインストール
echo "📦 依存関係をインストール中..."
cd application
npm install
npm install firebase-admin

echo "✅ セットアップ完了！"
echo ""
echo "🔥 Firebase Emulatorでローカル開発を開始:"
echo ""
echo "ターミナル1:"
echo "  npm run emulator"
echo ""
echo "ターミナル2:"
echo "  cd application"
echo "  npm run dev"
echo ""
echo "📱 Emulator UI: http://localhost:4000"
echo "🌐 アプリ: http://localhost:3000"