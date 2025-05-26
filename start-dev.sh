#!/bin/bash

echo "🚀 402 Payment PoC 統合開発環境を起動します..."

# 依存関係チェック
check_dependencies() {
    echo "🔍 依存関係をチェック中..."
    
    # Firebase CLI
    if ! command -v firebase &> /dev/null; then
        echo "⚠️  Firebase CLIがインストールされていません"
        echo "npm install -g firebase-tools でインストールしてください"
        exit 1
    fi
    
    # Node dependencies
    if [ ! -d "application/node_modules" ]; then
        echo "📦 application依存関係をインストール中..."
        cd application
        npm install
        cd ..
    fi
    
    if [ ! -d "web3/node_modules" ]; then
        echo "📦 web3依存関係をインストール中..."
        cd web3
        npm install
        cd ..
    fi
    
    # 環境変数ファイル
    if [ ! -f application/.env.local ]; then
        echo "📝 環境変数ファイルを作成中..."
        if [ -f application/.env.local.example ]; then
            cp application/.env.local.example application/.env.local
            echo "⚠️  .env.localファイルを編集して、必要なAPIキーを設定してください"
        fi
    fi
}

# 依存関係チェック実行
check_dependencies

# 1. Firebase Emulator起動
echo "🔥 Firebase Emulatorを起動中..."
firebase emulators:start --only firestore,hosting &
FIREBASE_PID=$!

# 2. Hardhatローカルネットワーク起動
echo "⛓️  Hardhatローカルネットワークを起動中..."
cd web3
npx hardhat node &
HARDHAT_PID=$!
cd ..

# 少し待機してネットワークが起動するのを待つ
echo "⏳ ネットワークの起動を待っています..."
sleep 5

# 3. スマートコントラクトのデプロイ
echo "📜 スマートコントラクトをデプロイ中..."
cd web3
npm run deploy
cd ..

# 4. Next.js開発サーバーを起動
echo "📦 Next.js開発サーバーを起動中..."
cd application
FIRESTORE_EMULATOR_HOST=localhost:8080 npm run dev &
DEV_PID=$!
cd ..

# サーバーが起動するまで待機
echo "⏳ アプリケーションサーバーの起動を待っています..."
sleep 8

# 動作確認
echo ""
echo "🧪 統合テストを実行中..."
echo "========================================"

# 1. Frontend確認
echo "1. Frontend API Test:"
curl -s http://localhost:3000/api/test | jq '.' 2>/dev/null || echo "❌ Frontend APIが応答しません"

# 2. Contract deployment確認
echo ""
echo "2. Smart Contract Deployment:"
if [ -f "web3/deployments.json" ]; then
    echo "✅ スマートコントラクトデプロイ済み"
    echo "   PaymentManager: $(cat web3/deployments.json | jq -r '.contracts.PaymentManager' 2>/dev/null || echo 'N/A')"
    echo "   AccountFactory: $(cat web3/deployments.json | jq -r '.contracts.AccountFactory' 2>/dev/null || echo 'N/A')"
else
    echo "❌ デプロイメント情報が見つかりません"
fi

# 3. Firebase Emulator確認
echo ""
echo "3. Firebase Emulator:"
if curl -s http://localhost:4000 >/dev/null 2>&1; then
    echo "✅ Firebase Emulator UI起動中"
else
    echo "❌ Firebase Emulatorが応答しません"
fi

echo ""
echo "========================================"
echo "✅ 統合開発環境が起動完了！"
echo ""
echo "🌐 アプリケーション:    http://localhost:3000"
echo "🔥 Firebase Emulator:  http://localhost:4000"
echo "⛓️  Hardhat Network:   http://localhost:8545"
echo "📝 TODO:               web3/TODO.md"
echo "📋 Commands History:   .ai/COMMANDS_HISTORY.md"
echo ""
echo "🛠️  開発リソース:"
echo "   - コントラクトアドレス: web3/deployments.json"
echo "   - 型定義: web3/typechain-types/"
echo "   - テスト: web3/test/"
echo ""
echo "⏹️  停止するには:"
echo "   すべて停止: kill $DEV_PID $HARDHAT_PID $FIREBASE_PID"
echo "   個別停止:"
echo "     Frontend:  kill $DEV_PID"
echo "     Hardhat:   kill $HARDHAT_PID" 
echo "     Firebase:  kill $FIREBASE_PID"