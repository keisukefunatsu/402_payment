# AI引き継ぎドキュメント

## プロジェクト情報
- **名称**: 402 Payment Microblog
- **概要**: ウォレットアプリ不要のガスレスマイクロペイメントシステム
- **技術**: HTTP 402 Payment Required + Account Abstraction (ERC-4337)

## 現在の状態サマリー

### 🟢 動作中
- Firestore データベース接続
- セッション管理（Cookie ベース）
- コンテンツ作成・一覧API
- AAウォレット生成

### 🔴 要対応
- 支払い処理（Paymaster エラー）
- フロントエンドUI（未実装）

## 即座に実行可能なコマンド

```bash
# プロジェクトディレクトリ
cd /Users/pyon/Projects/personal/402_payment/application

# 開発サーバー起動
pnpm dev

# APIテスト実行
./test-api.sh

# ビルド確認
pnpm build
```

## 重要ファイルの場所

### 設定・ドキュメント
- `.ai/DESIGN.md` - システム設計書
- `.claude/settings.json` - Claude権限設定
- `PROJECT_STATUS.md` - 詳細な進捗状況
- `application/.env.local` - 環境変数（要確認）

### 主要実装ファイル
- `application/lib/aa-wallet.ts` - AAウォレット実装
- `application/lib/session.ts` - セッション管理
- `application/app/api/payment/process/route.ts` - 支払いAPI（エラー中）

## 現在のエラーと対処法

### 1. 支払い処理エラー
```
UserOperation reverted during simulation with reason: 0x
```

**原因**: Paymaster未設定または資金不足

**対処法**:
1. Pimlico ダッシュボードにログイン
2. Base Sepolia のPaymaster確認
3. `.env.local` の `PIMLICO_API_KEY` 確認

### 2. 環境変数チェック
```bash
# 必須環境変数の確認
curl http://localhost:3000/api/health
```

## 次の作業

### 優先度高
1. **Paymaster修正**
   - Pimlico設定確認
   - テストネット資金確認
   - `lib/aa-wallet.ts` のPaymaster設定調整

2. **フロントエンド基本実装**
   ```typescript
   // app/page.tsx に追加
   - ContentList コンポーネント
   - 支払いボタン
   - 402エラーハンドリング
   ```

### 優先度中
3. **402 Payment Requiredフロー**
   - コンテンツアクセス時に402返却
   - 支払い後にコンテンツ表示

4. **UI/UX改善**
   - ローディング状態
   - エラーメッセージ
   - 支払い成功通知

## コードベースの特徴

### 重要な実装判断
1. **ウォレット接続なし** - Cookieベースのセッション管理
2. **Firestore使用** - PostgreSQLではない
3. **permissionless.js v0.2** - 最新版ではない
4. **Safe Account Factory** - AA実装に使用

### 命名規則
- API routes: `app/api/[resource]/[action]/route.ts`
- Components: PascalCase
- Utilities: camelCase

## デバッグTips

```bash
# Firestore接続確認
curl http://localhost:3000/api/health | jq .

# セッション付きAPIテスト
./test-api.sh

# ウォレットアドレス確認（Base Sepoliaエクスプローラー）
# 例: https://sepolia.basescan.org/address/0x1E86F417735465c72A28B7f2E5AB22568396bEF3
```

## Git状態

### 最新コミット
```
a7a0d1c - feat: implement API endpoints and testing infrastructure for 402 payment system
```

### 未コミットの変更
- `.claude/settings.json` - コミットルール追加
- `application/lib/aa-wallet.ts` - ビルドエラー修正

### コミット用コマンド
```bash
git add -A
git commit -m "fix: resolve build errors and add commit rules

- Fix EntryPoint address import issue
- Remove unused variable warnings
- Add commit rules to .claude/settings.json (no co-author, always build/test/lint)"
```

## 注意事項

1. **SESSION_SECRET** は64文字以上必須
2. **PIMLICO_API_KEY** なしでは支払い不可
3. コミット時 Co-Author 不要（ユーザー希望）
4. `pnpm` 使用（npm/yarnではない）

---
このドキュメントで別のAIセッションが作業を完全に引き継げます。