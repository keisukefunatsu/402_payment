# 402 Payment Microblog Application

## 開発環境のセットアップ

### 1. 依存関係のインストール
```bash
cd application
pnpm install
```

### 2. 開発サーバーの起動

**ターミナル1: Firebase Emulator（オプション）**
```bash
# Firebase Emulatorを使う場合
firebase emulators:start --only firestore --project demo-project
```

**ターミナル2: Next.js開発サーバー**
```bash
cd application
pnpm dev
```

### 3. 動作確認
```bash
# APIテスト
./test-api.sh
```

## API エンドポイント

- `GET /api/test` - 接続テスト
- `POST /api/account/create` - アカウント作成
- `GET /api/content/list` - コンテンツ一覧
- `POST /api/content/create` - コンテンツ作成
- `GET /api/resource/[id]` - コンテンツ取得（402対応）
- `POST /api/payment/execute` - 支払い実行

## 開発フロー

### Step 1: 基本セットアップ
- Firebase Admin SDK設定
- 環境変数不要（App Hosting用）
- Emulatorはオプション

### Step 2: ユーザー管理
- アカウント作成
- Firestoreへの保存

### Step 3: コンテンツ管理
- 投稿作成
- 一覧表示
- アクセス制御

### Step 4: 402 Payment
- 支払い要求
- アクセス権限付与

### Step 5: UI統合
- React コンポーネント
- リアルタイム更新