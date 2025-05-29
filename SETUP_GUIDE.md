# 環境セットアップガイド

## 1. Pimlico セットアップ

### アカウント作成
1. https://dashboard.pimlico.io/ にアクセス
2. Sign upでアカウント作成
3. ダッシュボードにログイン

### APIキー作成
1. Dashboard → API Keys
2. "Create API Key" をクリック
3. 名前を入力（例：402-payment-app）
4. ネットワークで「Base Sepolia」を選択
5. APIキーをコピー（後で使用）

### 重要な情報をメモ
- API Key: `pm_xxxx...`
- Bundler URL: `https://api.pimlico.io/v2/base-sepolia/rpc`

## 2. Firebase セットアップ

### プロジェクト作成
1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを作成」をクリック
3. プロジェクト名：`payment-402-app`（例）
4. Google Analytics は無効でOK

### Firestore 有効化
1. 左メニュー → Firestore Database
2. 「データベースを作成」
3. 本番環境モードで開始
4. ロケーション：`asia-northeast1`（東京）

### サービスアカウントキー取得
1. プロジェクト設定（歯車アイコン）
2. 「サービスアカウント」タブ
3. 「新しい秘密鍵を生成」
4. JSONファイルがダウンロードされる

### Firestore セキュリティルール設定
Firestore → ルール タブで以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Temporarily allow all reads/writes for development
    // TODO: Restrict in production
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 3. 環境変数設定

`application/.env.local` を作成：

```bash
# Pimlico
PIMLICO_API_KEY=pm_xxxx... # ← Pimlicoでコピーしたキー

# Firebase (ダウンロードしたJSONから)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# その他
SESSION_SECRET=your-random-32-chars-secret-here-change-this
NEXT_PUBLIC_RPC_URL=https://base-sepolia.publicnode.com

# Base Sepolia Contracts
NEXT_PUBLIC_ENTRY_POINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS=0x4e1580000277394E855bBCE9b3f3BF3b8dFBa8AC
```

## 4. テスト実行

```bash
cd application
pnpm dev
```

アクセス: http://localhost:3000/api/user/wallet

正常なレスポンスが返ればセットアップ完了！