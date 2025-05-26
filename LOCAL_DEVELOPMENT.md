# ローカル開発環境（Firebase Emulator）

## セットアップ

### 1. Firebase CLIインストール
```bash
npm install -g firebase-tools
```

### 2. 初回セットアップ
```bash
./setup-poc.sh
```

## 開発の開始

### ターミナル1: Firestore Emulatorを起動
```bash
npm run emulator
```

### ターミナル2: Next.jsアプリを起動
```bash
cd application
npm run dev
```

## アクセスURL
- **アプリ**: http://localhost:3000
- **Emulator UI**: http://localhost:4000

## Emulatorの特徴
- **データ永続化なし**: 再起動するとデータは消える
- **本番環境と同じAPI**: コードの変更不要
- **デバッグUI**: データの確認・編集が可能

## トラブルシューティング

### ポート競合エラー
```bash
# 使用中のポートを確認
lsof -i :8080
lsof -i :4000

# プロセスを終了
kill -9 [PID]
```

### Emulatorが起動しない
```bash
# Firebase CLIを最新版に更新
npm update -g firebase-tools

# Java確認（Emulatorに必要）
java -version
```