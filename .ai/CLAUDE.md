# CLAUDE.md

## Project Permissions (Permanent - All Sessions)

- allowed list
  - `mv`
  - `rm -rf`
  - `echo`
  - `curl`
  - `git` (except `git push`)
  - `cd`
  - `ls`
  - `cat`
  - `pnpm`
  - `npm`
  - `yarn`
- Execute commands without asking for permission
- Make necessary changes proactively
- All file operations (create, edit, delete, move) are allowed without permission
- File creation is allowed without asking for permission
- Editing settings.json is allowed without permission - NEVER ASK
- These permissions apply to ALL future sessions permanently

## Restrictions (Always Ask Permission)

- `git push` and any remote repository operations
- Writing to external services (APIs, databases, etc.)
- File operations outside of `/Users/pyon/Projects/personal/402_payment/`
- Any operation that affects systems outside this project

## Project Structure

- `/application/` - Next.js application code
- `/web3/` - Smart contracts and blockchain-related code

---

# X402 Payment App - Project Status

## プロジェクト概要
HTTP 402 Payment Requiredとアカウントアブストラクション（ERC-4337）を使用したガスレスマイクロペイメントシステム

## 完了した作業
1. ✅ Next.js + TypeScript環境のセットアップ
2. ✅ 依存関係のインストール（viem, wagmi, permissionless.js）
3. ✅ セッション管理（Cookie ベース）の実装
4. ✅ Firebase/Firestore連携の実装
5. ✅ AAウォレット生成ロジックの実装
6. ✅ 402 Payment Required APIの実装
7. ✅ 支払い処理APIの実装
8. ✅ バックエンドのテスト作成（15テスト全て成功）
9. ✅ ビルドの成功確認

## ビルド＆テスト状態
- **ビルド**: ✅ 成功（`pnpm build`）
- **テスト**: ✅ 全15テスト成功（`pnpm test`）
- **テストカバレッジ**: 
  - Firebase Admin: 100%
  - Session管理: 100%
  - Content API: 83-92%

## 現在のプロジェクト構造
```
402_payment/
├── application/          # Next.js frontend application
│   ├── app/
│   │   ├── api/
│   │   │   ├── account/create/route.ts  # アカウント作成API
│   │   │   ├── resource/[id]/route.ts   # 402レスポンスを返すAPI
│   │   │   └── payment/execute/route.ts # 支払い実行API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                     # メインページ
│   ├── components/
│   │   ├── AccountManager.tsx           # アカウント管理UI
│   │   └── ResourceList.tsx             # リソース一覧と支払いUI
│   ├── lib/
│   │   ├── types.ts                     # TypeScript型定義
│   │   └── mockAccountAbstraction.ts    # AA実装
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
├── web3/                 # Smart contracts and blockchain code (to be implemented)
├── .ai/                  # AI-related documentation and project management
│   ├── CLAUDE.md         # This file - consolidated project documentation
│   ├── PROJECT_DESIGN.md
│   ├── DESIGN.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── COMMANDS_HISTORY.md
│   └── architecture/
│       └── overview.md
└── README.md             # Public project documentation
```

## 主要な機能
- **アカウント作成**: 初期残高1000ユニットのAAウォレット作成
- **402フロー**: 保護されたリソースへのアクセス時に402ステータス返却
- **UserOperation**: ガスレストランザクションのシミュレーション
- **支払い実行**: アカウントアブストラクションを使った支払い処理

## 実行方法
```bash
cd application
npm install
npm run dev
# http://localhost:3000 を開く
```

## 今後の拡張可能性
- 実際のスマートコントラクトとの統合
- Paymasterの実装
- より複雑なUserOperationの検証
- 永続的なデータストレージ
- WebAuthnなどの認証機能