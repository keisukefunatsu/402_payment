# Firebase App Hosting デプロイガイド

## セットアップ手順

### 1. Firebaseプロジェクトの作成
1. [Firebase Console](https://console.firebase.google.com/)でプロジェクトを作成
2. プロジェクトIDをメモ

### 2. Firebase CLIのインストール
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### 3. GitHubシークレットの設定
GitHubリポジトリの Settings > Secrets and variables > Actions で以下を追加：

- `FIREBASE_SERVICE_ACCOUNT`: Firebaseサービスアカウントキー
  ```bash
  # サービスアカウントキーの生成
  firebase projects:list
  firebase use your-project-id
  firebase init hosting:github
  ```

### 4. 設定ファイルの更新
1. `.firebaserc`の`your-project-id`を実際のプロジェクトIDに変更
2. `.github/workflows/*.yml`の`your-project-id`を実際のプロジェクトIDに変更

### 5. 環境変数の設定
1. `.env.example`を`.env`にコピー
2. Firebase設定値を入力

## デプロイフロー

### 自動デプロイ
- **mainブランチへのpush**: 本番環境に自動デプロイ
- **Pull Request**: プレビュー環境に自動デプロイ

### 手動デプロイ
```bash
npm run build
firebase deploy --only hosting
```

## 確認事項
- [ ] Firebaseプロジェクトが作成済み
- [ ] GitHubシークレットが設定済み
- [ ] プロジェクトIDが正しく設定済み
- [ ] 環境変数が設定済み

## トラブルシューティング

### ビルドエラー
```bash
# ローカルでビルド確認
npm run build
```

### デプロイエラー
```bash
# Firebase CLIでログイン確認
firebase login:ci
```