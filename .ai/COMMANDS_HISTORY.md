# コマンド実行履歴

## セッション: 2025/5/25

### プロジェクト初期化
```bash
# Next.jsプロジェクトの作成を試行（既存ファイルのため手動セットアップに変更）
cd /Users/pyon/Projects/personal/402_payment && rm package.json
```

### ファイル作成コマンド
```bash
# .ai ディレクトリの作成
cd /Users/pyon/Projects/personal/402_payment && mkdir -p .ai

# GitHub Actionsワークフローディレクトリの作成
mkdir -p /Users/pyon/Projects/personal/402_payment/.github/workflows
```

### Firebase App Hostingセットアップ
```bash
# Firebase CLIインストール（グローバル）
npm install -g firebase-tools

# Firebaseログイン
firebase login

# Firebase初期化
firebase init hosting

# GitHubとの連携
firebase init hosting:github

# デプロイテスト
firebase deploy --only hosting
```

### 今後の実行コマンド記録方法
新しいコマンドを実行するたびに、以下の形式で追記：

```markdown
### [実行内容の説明]
\```bash
# 実行したコマンド
\```
```

## よく使うコマンド

### 開発サーバー起動
```bash
npm install  # 初回のみ
npm run dev
```

### ビルド
```bash
npm run build
```

### 型チェック
```bash
npx tsc --noEmit
```

### テスト実行
```bash
# ユニットテスト
npm test

# インテグレーションテスト
npm run test:integration

# E2Eテスト
npm run test:e2e
```