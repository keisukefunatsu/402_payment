# 402 Payment Microblog - TODO

## 🚀 プロジェクト現状（2025/05/27）

### 完了済み ✅
- [x] 開発環境セットアップ（Next.js + TypeScript + Tailwind）
- [x] モックデータベース実装
- [x] モックウォレット接続
- [x] アカウント作成API（`/api/account/create`）
- [x] コンテンツ一覧API（`/api/content/list`）
- [x] 基本UIコンポーネント作成
- [x] APIテストスクリプト作成

### 現在動作するもの
```bash
# 開発サーバー起動
cd application && pnpm dev

# APIテスト実行
./test-api.sh

# 動作確認
curl http://localhost:3000/api/health
curl http://localhost:3000/api/content/list
```

## 📝 残りのタスク

### Step 3: コンテンツ管理機能の完成
- [ ] **コンテンツ作成APIのテスト**
  - `/api/content/create`の動作確認
  - 投稿データの検証
  - エラーケースのテスト

- [ ] **投稿UIの動作確認**
  - CreateContentコンポーネントの統合テスト
  - フォームバリデーション
  - 投稿後のリスト更新確認

### Step 4: 402 Payment フローの実装
- [ ] **402レスポンスの実装確認**
  - `/api/resource/[id]`のテスト
  - 有料コンテンツへのアクセス制御
  - 適切なヘッダー情報の返却

- [ ] **支払い処理の実装**
  - `/api/payment/execute`の動作確認
  - モック残高の更新
  - アクセス権限の付与

- [ ] **支払いUIフロー**
  - 402エラー時の支払いダイアログ
  - 支払い確認画面
  - 支払い後のコンテンツ表示

### Step 5: フロントエンド統合
- [ ] **全体動作確認**
  - ウォレット接続 → アカウント作成 → 投稿 → 閲覧 → 支払い
  - エラーハンドリング
  - ローディング状態

- [ ] **UI/UXの改善**
  - レスポンシブデザイン
  - エラーメッセージの表示
  - 成功/失敗のフィードバック

## 🔧 技術的課題

### 解決済み
- ✅ Firebase Admin SDK初期化エラー → モックDBに切り替え
- ✅ 環境変数の管理 → 最小限の設定に簡素化

### 未解決
- ⚠️ Firestore Emulatorとの統合（現在は無効化）
- ⚠️ 実際のウォレット接続（現在はモック）
- ⚠️ データの永続化（現在はインメモリ）

## 🎯 次のアクション

### 1. コンテンツ作成機能のテスト（30分）
```bash
# コンテンツ作成APIテスト
curl -X POST http://localhost:3000/api/content/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テスト投稿",
    "preview": "これはテストです",
    "content": "テストコンテンツの本文",
    "price": 0.002,
    "tier": 1,
    "creatorAddress": "0x123..."
  }'
```

### 2. 402フローのテスト（45分）
```bash
# 有料コンテンツへのアクセステスト
curl -v http://localhost:3000/api/resource/[CONTENT_ID] \
  -H "x-user-id: [USER_ID]"

# 支払い実行テスト
curl -X POST http://localhost:3000/api/payment/execute \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "[CONTENT_ID]",
    "amount": 0.002,
    "from": "0x123..."
  }'
```

### 3. フロントエンド統合テスト（60分）
- ブラウザで http://localhost:3000 を開く
- `test-frontend.md`の手順に従って動作確認
- 問題があれば修正

## 📊 進捗状況
- 全体進捗: **60%**
- API実装: **80%**
- UI実装: **70%**
- 統合テスト: **20%**

## 💡 Tips for Next Session
1. `pnpm dev`でサーバーを起動してから作業開始
2. `./test-api.sh`で基本的なAPIの動作確認
3. ブラウザの開発者ツールでネットワークタブを確認
4. モックデータは`lib/mockDatabase.ts`で管理