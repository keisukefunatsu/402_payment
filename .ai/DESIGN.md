# X402 Payment App 設計書

## 1. システム概要
HTTP 402 Payment Requiredステータスを使用した支払いシステムのモック実装。
ERC-4337アカウントアブストラクションの概念を簡略化して実装。

## 2. アーキテクチャ

### 2.1 技術スタック
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- State: In-memory (モック実装)
- Crypto: ethers.js v6

### 2.2 データフロー
```
1. ユーザーがアカウント作成
   → POST /api/account/create
   → AAウォレット生成（初期残高: 1000）

2. 保護されたリソースへアクセス
   → GET /api/resource/{id}
   → 402ステータスとpaymentRequest返却

3. 支払い実行
   → POST /api/payment/execute
   → UserOperation検証
   → 残高減算
   → リソースコンテンツ返却
```

## 3. データモデル

### 3.1 Account
```typescript
{
  id: string              // アカウント識別子
  address: string         // ウォレットアドレス
  balance: number         // 残高
  nonce: number          // トランザクションカウンタ
  owner: string          // 所有者名
}
```

### 3.2 PaymentRequest
```typescript
{
  id: string              // 支払い要求ID
  resourceId: string      // リソースID
  amount: number          // 必要金額
  recipient: string       // 受取人アドレス
  timestamp: number       // タイムスタンプ
  status: string          // pending | completed | failed
}
```

### 3.3 UserOperation (簡略版)
```typescript
{
  sender: string          // 送信者アドレス
  nonce: bigint          // ノンス
  callData: string       // 実行データ
  signature: string      // 署名（モックでは未使用）
}
```

## 4. API仕様

### 4.1 POST /api/account/create
**リクエスト:**
```json
{ "owner": "string" }
```
**レスポンス:**
```json
{
  "success": true,
  "account": { /* Account object */ }
}
```

### 4.2 GET /api/resource/{id}
**レスポンス (402):**
```json
{
  "error": "Payment Required",
  "paymentRequest": {
    "id": "string",
    "amount": number,
    "recipient": "string",
    "message": "string"
  }
}
```

### 4.3 POST /api/payment/execute
**リクエスト:**
```json
{
  "paymentId": "string",
  "accountId": "string",
  "userOperation": { /* UserOperation fields */ }
}
```
**レスポンス:**
```json
{
  "success": true,
  "receipt": { /* PaymentReceipt */ },
  "resource": { /* ProtectedResource */ }
}
```

## 5. UI設計

### 5.1 コンポーネント構成
- **AccountManager**: アカウント作成・表示
  - 入力: 所有者名
  - 表示: アカウントID、アドレス、残高
  
- **ResourceList**: リソース一覧と支払いフロー
  - リソース一覧表示
  - 402エラー時の支払い要求表示
  - 支払い実行ボタン
  - アクセス後のコンテンツ表示

### 5.2 画面フロー
1. アカウント作成画面
2. リソース一覧表示
3. 402支払い要求モーダル
4. 支払い完了後のコンテンツ表示

## 6. セキュリティ考慮事項（モック実装）
- 実際の暗号署名は実装しない
- プライベートキーは生成しない
- 全データはインメモリ保存

## 7. 拡張計画

### Phase 1 (現在)
- [x] 基本的な402フロー
- [x] モックAA実装
- [x] シンプルUI

### Phase 2 (将来)
- [ ] 実際のスマートコントラクト連携
- [ ] Paymaster実装
- [ ] 署名検証
- [ ] データベース統合

### Phase 3
- [ ] マルチチェーン対応
- [ ] WebAuthn認証
- [ ] より複雑なUserOperation

## 8. テスト計画
- ユニットテスト: API routes
- 統合テスト: 支払いフロー全体
- E2Eテスト: ユーザーシナリオ

## 9. 既知の制限事項
- データは永続化されない
- 実際のブロックチェーンと接続していない
- 署名検証はモック
- 単一ユーザーのみ対応