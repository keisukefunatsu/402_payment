# Firestore セットアップ（環境変数不要）

## Firebase App Hosting環境

App Hosting環境では、**環境変数の設定は一切不要**です。自動的に認証されます。

```typescript
// lib/firebase-admin.ts
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// 環境変数不要で初期化
const app = initializeApp();
export const adminDb = getFirestore(app);
```

## ローカル開発環境

### 方法1: Firebase Emulatorを使用（推奨）

```bash
# Firebase CLIをインストール
npm install -g firebase-tools

# エミュレータを起動
firebase emulators:start --only firestore

# 環境変数を設定
export FIRESTORE_EMULATOR_HOST="localhost:8080"
```

### 方法2: Application Default Credentials

```bash
# Firebase CLIでログイン
firebase login

# アプリケーションのデフォルト認証を設定
gcloud auth application-default login
```

### 方法3: Service Accountファイル（チーム開発向け）

```bash
# 1. Firebase Console > プロジェクト設定 > サービスアカウント
# 2. 新しい秘密鍵を生成してダウンロード
# 3. 環境変数に設定
export GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"
```

## まとめ

- **本番環境（App Hosting）**: 環境変数設定不要
- **ローカル開発**: Emulator使用が最も簡単
- **環境変数なし**でFirestoreに読み書き可能