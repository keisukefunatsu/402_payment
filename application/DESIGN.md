# TECHNICAL DESIGN SPECIFICATION

## Core Vision & Goals

### 実現したいこと

**「ウォレットアプリ不要で、誰でも簡単にマイクロペイメントでコンテンツを購入できるシステム」**

#### 主要目標
1. **ウォレットインストール不要** - ブラウザだけで完結
2. **ガスレス決済** - ユーザーはガス代を意識しない
3. **シームレスなUX** - 通常のWebサービスと同等の体験
4. **マイクロペイメント対応** - 小額決済でも手数料が現実的

### なぜこれが重要か

```mermaid
graph LR
    subgraph "従来のWeb3決済"
        A[ウォレット<br/>インストール] --> B[ETH購入] --> C[ガス代支払い] --> D[コンテンツ購入]
    end
    
    subgraph "本システム"
        E[ブラウザアクセス] --> F[コンテンツ購入]
    end
```

## System Overview

402 Payment Requiredを利用したマイクロペイメントシステムの設計仕様書。
アカウントアブストラクション（ERC-4337）を活用し、ガスレストランザクションを実現する。

## User Experience Requirements

### 必須要件

1. **ウォレットアプリ不要**
   - MetaMask等のインストール不要
   - ブラウザ内で完結する体験
   - Social Login（Google/Email）でアカウント作成

2. **ガスレス体験**
   - ユーザーはETHを持つ必要がない
   - ガス代はPaymasterが負担
   - 支払いはコンテンツ料金のみ

3. **シンプルな支払いフロー**
   - 1クリックで支払い完了
   - 402エラー → 支払いボタン → 完了
   - 決済確認の待ち時間を最小化

### システム要件

```mermaid
graph TB
    subgraph "ユーザーが見える部分"
        A[ブラウザでアクセス]
        B[コンテンツ選択]
        C[支払いボタンクリック]
        D[コンテンツ閲覧]
    end
    
    subgraph "ユーザーが意識しない部分"
        E[AAウォレット自動生成]
        F[UserOperation作成]
        G[Paymaster署名]
        H[Bundler送信]
        I[オンチェーン実行]
    end
    
    A --> B --> C --> D
    C -.-> E -.-> F -.-> G -.-> H -.-> I -.-> D
```

## Customer Journey Map

### シンプルなユーザージャーニー

```mermaid
journey
    title ガスレス決済の体験
    section コンテンツ閲覧
      サイトアクセス: 5: ユーザー
      有料コンテンツ発見: 4: ユーザー
      購入ボタンクリック: 5: ユーザー
    section 自動処理
      AAウォレット自動作成: 5: システム
      ガスレス決済実行: 5: システム
      コンテンツ表示: 5: ユーザー
```

## Core System Components

### 実現に必要な要素

```mermaid
graph TD
    subgraph "Frontend Components"
        A1[認証システム<br/>Social Login対応]
        A2[402ハンドラー<br/>支払いUI自動表示]
        A3[ウォレット管理<br/>AA自動作成]
    end
    
    subgraph "Backend Components"
        B1[セッション管理<br/>ウォレット紐付け]
        B2[402レスポンス生成<br/>支払い情報付与]
        B3[決済検証<br/>アクセス権管理]
    end
    
    subgraph "Blockchain Components"
        C1[Account Factory<br/>ウォレット生成]
        C2[Paymaster<br/>ガス代負担]
        C3[Content Registry<br/>アクセス制御]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> C1
    B2 --> C3
    B3 --> C3
    C1 --> C2
```

### 技術選定の理由

| コンポーネント | 技術選択 | 理由 |
|---|---|---|
| 認証 | NextAuth + Social Login | ウォレット不要でユーザー識別 |
| データベース | Firestore | リアルタイム同期、スケーラブル、サーバーレス |
| 状態管理 | Zustand | シンプルで軽量 |
| ブロックチェーン接続 | Viem + Wagmi | AA対応、TypeScript完全対応 |
| スマートコントラクト | ERC-4337準拠 | 標準化されたAA実装 |
| Bundler | Pimlico/Stackup | 実績のあるサービス |
| Paymaster | Pimlico Paymaster | 簡単な統合、柔軟な設定 |

## System Architecture

### 1. High-Level Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend Layer"]
        UI[Next.js App]
        WC[Wallet Connector]
        SC[State Cache]
    end
    
    subgraph API["API Layer"]
        AUTH[Auth Handler]
        CONTENT[Content API]
        PAYMENT[Payment API]
        H402[402 Handler]
    end
    
    subgraph Blockchain["Blockchain Layer"]
        AA[Account Abstraction]
        PM[Paymaster]
        CR[Content Registry]
        PT[Payment Token]
    end
    
    subgraph Storage["Storage Layer"]
        DB[(Firestore)]
        IPFS[IPFS Storage]
        CACHE[Memory Cache]
    end
    
    UI --> WC
    WC --> AUTH
    UI --> CONTENT
    CONTENT --> H402
    H402 --> PAYMENT
    PAYMENT --> AA
    AA --> PM
    CONTENT --> CR
    AUTH --> DB
    CONTENT --> DB
    CONTENT --> IPFS
    API --> CACHE
```

## User Flow Diagrams

### 1. 402 Payment Flow

```mermaid
flowchart TD
    Start([ユーザーがコンテンツをクリック])
    Start --> CheckAccess{アクセス権確認}
    
    CheckAccess -->|あり| ShowContent[コンテンツ表示]
    CheckAccess -->|なし| Return402[402レスポンス返却]
    
    Return402 --> ShowPaymentUI[支払いUI表示]
    ShowPaymentUI --> UserConfirm{ユーザー確認}
    
    UserConfirm -->|キャンセル| End1([終了])
    UserConfirm -->|承認| CreateUserOp[UserOperation作成]
    
    CreateUserOp --> CheckBalance{残高確認}
    CheckBalance -->|不足| ShowError[エラー表示]
    CheckBalance -->|十分| SignUserOp[署名]
    
    SignUserOp --> SendToBundler[Bundlerへ送信]
    SendToBundler --> ValidateOp{検証}
    
    ValidateOp -->|失敗| ShowError
    ValidateOp -->|成功| ExecuteOnChain[オンチェーン実行]
    
    ExecuteOnChain --> UpdateAccess[アクセス権更新]
    UpdateAccess --> ShowContent
    
    ShowContent --> End2([終了])
    ShowError --> End3([終了])
```

### 2. Automatic AA Wallet Creation Flow

```mermaid
flowchart TD
    Start([ユーザーアクセス])
    Start --> CheckSession{セッション確認}
    
    CheckSession -->|初回| CreateUser[ユーザー作成]
    CheckSession -->|既存| LoadUser[ユーザー読込]
    
    CreateUser --> GenerateAA[AAウォレット自動生成]
    GenerateAA --> SaveFirestore[Firestore保存]
    SaveFirestore --> Ready[準備完了]
    
    LoadUser --> Ready
    Ready --> End([コンテンツ表示])
```

## Class Diagrams

### 1. Simplified Domain Model

```mermaid
classDiagram
    class User {
        +userId: string
        +aaWalletAddress: Address
    }
    
    class Content {
        +contentId: string
        +preview: string
        +content: string
        +price: number
    }
    
    class Access {
        +userId: string
        +contentId: string
        +grantedAt: Date
    }
    
    User "1" --> "*" Access : has
    Content "1" --> "*" Access : grants
```

### 2. Smart Contract Architecture

```mermaid
classDiagram
    class IAccount {
        <<interface>>
        +validateUserOp(userOp, userOpHash, missingFunds)
    }
    
    class AccountAbstraction {
        +owner: address
        +nonce: uint256
        +validateUserOp(userOp, userOpHash, missingFunds)
        +execute(dest, value, func)
        +executeBatch(dest[], func[])
    }
    
    class AccountFactory {
        +accountImplementation: address
        +createAccount(owner, salt)
        +getAddress(owner, salt)
    }
    
    class IPaymaster {
        <<interface>>
        +validatePaymasterUserOp(userOp, userOpHash, maxCost)
        +postOp(mode, context, actualGasCost)
    }
    
    class Paymaster {
        +deposit: uint256
        +validatePaymasterUserOp(userOp, userOpHash, maxCost)
        +postOp(mode, context, actualGasCost)
        +addDeposit()
        +withdrawTo(withdrawAddress, amount)
    }
    
    class ContentRegistry {
        +contents: mapping
        +userAccess: mapping
        +createContent(ipfsHash, price, tier)
        +purchaseAccess(contentId)
        +hasAccess(user, contentId)
        +updateContent(contentId, newData)
    }
    
    class PaymentProcessor {
        +platformFee: uint256
        +processPayment(creator, amount)
        +withdrawPlatformFees()
        +updateFee(newFee)
    }
    
    IAccount <|.. AccountAbstraction
    IPaymaster <|.. Paymaster
    AccountFactory ..> AccountAbstraction : creates
    ContentRegistry --> PaymentProcessor : uses
    AccountAbstraction --> Paymaster : funded by
```

## Sequence Diagrams

### 1. 402 Payment Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API Server
    participant BC as Blockchain
    participant B as Bundler
    participant PM as Paymaster
    
    U->>F: Click premium content
    F->>API: GET /api/content/{id}
    API->>API: Check access rights
    API-->>F: 402 Payment Required
    Note over API,F: Headers include payment details
    
    F->>U: Show payment modal
    U->>F: Confirm payment
    F->>F: Create UserOperation
    F->>PM: Request sponsorship
    PM-->>F: Return paymasterAndData
    
    F->>F: Sign UserOperation
    F->>B: Send UserOperation
    B->>B: Validate UserOp
    B->>BC: Execute on-chain
    BC-->>B: Transaction receipt
    B-->>F: Confirmation
    
    F->>API: GET /api/content/{id}
    API->>API: Verify payment
    API-->>F: 200 OK with content
    F->>U: Display content
```

### 2. AA Wallet Creation Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API Server
    participant AF as AccountFactory
    participant B as Bundler
    
    U->>F: Connect wallet
    F->>API: POST /api/auth/connect
    API->>API: Check AA wallet
    API-->>F: No AA wallet found
    
    F->>U: Suggest AA wallet
    U->>F: Approve creation
    F->>API: POST /api/account/create
    
    API->>API: Generate salt
    API->>AF: Calculate address
    AF-->>API: Predicted address
    
    API->>B: Create deployment UserOp
    B->>AF: Deploy account
    AF-->>B: Account deployed
    B-->>API: Deployment receipt
    
    API->>API: Store in database
    API-->>F: AA wallet details
    F->>U: Show success
```

## Firestore Collection Design

### 最小構成のコレクション設計

| コレクション | ドキュメントID | フィールド | 説明 |
|---|---|---|---|
| **users** | {userId} | aaWalletAddress | AAウォレットアドレス |
| **contents** | {contentId} | preview | 無料プレビュー |
| | | content | 有料本文 |
| | | price | 価格（Wei単位） |
| **accessList** | {userId} | - | 存在確認のみ |

### インデックス設計

```yaml
# Composite Indexes
- collection: contents
  fields:
    - creatorId: ASC
    - createdAt: DESC
    
- collection: contents
  fields:
    - isActive: ASC
    - tier: ASC
    - createdAt: DESC
    
- collection: payments
  fields:
    - payerId: ASC
    - createdAt: DESC
    
- collection: payments
  fields:
    - creatorId: ASC
    - status: ASC
    - createdAt: DESC
```

### Firestore設計の考慮事項

1. **NoSQLデータモデリング**
   - 非正規化を活用（例：creatorAddressをcontentドキュメントに含める）
   - 読み取り最適化のため、集約データをドキュメント内に保持
   - JOINが不要な設計

2. **リアルタイム同期**
   - 支払い状態の変更をリアルタイムで反映
   - コンテンツアクセス権の即時更新
   - onSnapshot()を活用したUI更新

3. **スケーラビリティ**
   - ドキュメントサイズ制限（1MB）を考慮
   - サブコレクションで大量データを分離
   - シャーディングカウンタパターンで高頻度更新に対応

4. **セキュリティルール**
   
   **Firestore Security Rulesの設定**
   - contents: 認証ユーザーは読み取り可
   - accessList: 本人のみ読み取り可
   - 書き込みはサーバー側からのみ

## AA Infrastructure Services

### 使用するサービス選定

#### 1. Bundler Service
**選択: Pimlico**
- API: `https://api.pimlico.io/v2/base-sepolia/rpc`
- 理由:
  - 安定性が高い
  - ドキュメントが充実
  - 無料枠あり（テスト用）
  - TypeScript SDKあり

#### 2. Paymaster Service
**選択: Pimlico Paymaster**
- VerifyingPaymaster契約を使用
- スポンサーシップポリシー設定可能
- 理由:
  - Bundlerと同じプロバイダーで統合が簡単
  - 柔軟なガス代スポンサー設定

#### 3. Account Factory
**選択: Safe (Gnosis) Account Factory**
- 実績のあるスマートウォレット実装
- ERC-4337完全準拠
- 監査済みコード

### 実装フロー

```mermaid
flowchart LR
    subgraph "Client"
        A[ユーザーアクセス]
        B[セッションID生成]
    end
    
    subgraph "Backend"
        C[AAアドレス計算]
        D[UserOp作成]
    end
    
    subgraph "Pimlico"
        E[Bundler API]
        F[Paymaster API]
    end
    
    subgraph "Blockchain"
        G[Account Factory]
        H[AA Wallet]
    end
    
    A --> B --> C
    C --> D --> E
    E --> F
    F --> G
    G --> H
```

### SDK/ライブラリ選定

| 用途 | ライブラリ | 理由 |
|---|---|---|
| AA操作 | permissionless.js | Pimlico推奨、TypeScript対応 |
| Ethereum接続 | viem | 軽量、TypeScript完全対応 |
| ウォレット管理 | @safe-global/safe-core-sdk | Safe wallet操作 |

### 環境変数設定

| 環境変数 | 値 | 説明 |
|---|---|---|
| PIMLICO_API_KEY | (取得必要) | Pimlico APIキー |
| PIMLICO_BUNDLER_URL | https://api.pimlico.io/v2/base-sepolia/rpc | Bundlerエンドポイント |
| PIMLICO_PAYMASTER_URL | https://api.pimlico.io/v2/base-sepolia/rpc | Paymasterエンドポイント |
| ACCOUNT_FACTORY_ADDRESS | (ネットワークごと) | Safe Factoryアドレス |
| PAYMASTER_ADDRESS | (ネットワークごと) | Paymasterアドレス |
| ENTRY_POINT_ADDRESS | 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789 | ERC-4337 EntryPoint |

## 外部サービス依存関係

### 依存サービス一覧

| サービス種別 | プロバイダー | 用途 | 代替可能性 | 停止時の影響 |
|---|---|---|---|---|
| **Bundler** | Pimlico | UserOperation送信・実行 | 高（Stackup, Alchemy等） | 新規決済不可 |
| **Paymaster** | Pimlico | ガス代スポンサー | 高（自前Paymaster可） | ユーザーがガス代負担必要 |
| **RPC Node** | Alchemy/Infura | ブロックチェーン接続 | 高（複数プロバイダー） | 全機能停止 |
| **Database** | Firestore | ユーザー・コンテンツ管理 | 中（他NoSQL可） | アプリ停止 |
| **Hosting** | Vercel | フロントエンド配信 | 高（Netlify等） | UI表示不可 |

### 自前実装 vs 外部依存

| 機能 | 自前実装 | 外部サービス | 選択理由 |
|---|---|---|---|
| **AAウォレット生成** | Smart Contract作成必要 | Safe Factory利用 | 監査済み・実績あり |
| **UserOp実行** | Bundler開発必要 | Pimlico Bundler | 開発コスト大 |
| **ガス代スポンサー** | Paymaster契約必要 | Pimlico Paymaster | 運用が複雑 |
| **署名管理** | 自前実装 ✓ | - | セキュリティ上重要 |
| **セッション管理** | 自前実装 ✓ | - | アプリ固有ロジック |

### サービス停止時の対策

```mermaid
flowchart TD
    subgraph "Primary Services"
        P1[Pimlico Bundler]
        P2[Pimlico Paymaster]
        P3[Alchemy RPC]
    end
    
    subgraph "Fallback Services"
        F1[Stackup Bundler]
        F2[自前Paymaster]
        F3[Infura RPC]
    end
    
    subgraph "Monitoring"
        M[Health Check]
    end
    
    M --> P1
    M --> P2
    M --> P3
    
    P1 -.失敗時.-> F1
    P2 -.失敗時.-> F2
    P3 -.失敗時.-> F3
```

### コスト構造

| サービス | 料金体系 | 想定月額 | 備考 |
|---|---|---|---|
| Pimlico | 従量課金 | $0-100 | 初期は無料枠内 |
| Firestore | 読み書き回数 | $0-50 | 少量なら無料枠内 |
| Vercel | 帯域・ビルド時間 | $0-20 | Hobbyプラン |
| Alchemy | API呼び出し数 | $0 | 無料枠300M CU/月 |

## スマートコントラクト開発の必要性

### 結論：最小限のコントラクトで実現可能

| コントラクト | 必要性 | 理由 |
|---|---|---|
| **Account Factory** | ❌ 不要 | Safe等の既存Factory使用 |
| **AA Wallet実装** | ❌ 不要 | Safe Account使用 |
| **Paymaster** | ❌ 不要 | Pimlico Paymaster使用 |
| **EntryPoint** | ❌ 不要 | ERC-4337標準を使用 |
| **Content Registry** | ⚠️ 検討 | オンチェーン決済記録が必要な場合 |
| **Payment Token** | ❌ 不要 | ETH決済で十分 |

### アプローチ：既存インフラを最大活用

```mermaid
flowchart TD
    subgraph "既存コントラクト利用"
        A[Safe Account Factory<br/>0x4e15...] 
        B[Safe Account実装<br/>監査済み]
        C[Pimlico Paymaster<br/>ガス代スポンサー]
        D[EntryPoint<br/>0x5FF1...]
    end
    
    subgraph "自前実装"
        E[なし]
    end
    
    subgraph "アプリケーション"
        F[Next.js Backend]
        G[Firestore]
    end
    
    F --> A
    F --> C
    F --> D
    F --> G
```

### メリット・デメリット

#### 既存コントラクト利用のメリット
1. **開発コスト削減** - 実装・テスト・監査不要
2. **セキュリティ** - 実績のある監査済みコード
3. **メンテナンス不要** - アップデートは提供側
4. **即座に利用可能** - デプロイ不要

#### デメリット
1. **カスタマイズ制限** - 独自機能追加困難
2. **外部依存** - 仕様変更の影響
3. **手数料** - Paymasterの利用料

### 将来的な拡張時の検討

オンチェーンコンテンツ管理が必要になった場合：
- コンテンツ価格のマッピング
- アクセス権のオンチェーン管理
- 購入関数の実装

### 推奨アプローチ

1. **Phase 1（現在）**: コントラクト開発なし
   - 既存インフラのみで実装
   - Firestore でアクセス管理
   - 決済履歴もオフチェーン

2. **Phase 2（将来）**: 必要に応じて追加
   - オンチェーン決済証明が必要な場合
   - 分散型を強調したい場合
   - トークンゲートが必要な場合

## Coinbase x402 ライブラリの検討

### x402 vs 独自実装

| 項目 | Coinbase x402 | 独自実装（AA） |
|---|---|---|
| **決済方法** | ステーブルコイン（USDC等） | ETH |
| **ガス代** | ユーザー負担 | Paymaster負担（ガスレス） |
| **ウォレット** | 既存ウォレット必要 | AAウォレット自動生成 |
| **実装の簡単さ** | 1行で実装可能 | カスタム実装必要 |
| **最小決済額** | $0.001 | 制限なし |
| **決済時間** | 2秒 | 5-10秒 |

### 結論：独自実装を選択

**理由：**
1. **ウォレット不要** - x402は既存ウォレット必要、我々はウォレット不要を目指す
2. **完全ガスレス** - x402はガス代ユーザー負担、我々はPaymaster使用
3. **ETH決済** - 日本ユーザーにはETHの方が馴染みあり
4. **カスタマイズ性** - AA統合により柔軟な実装可能

ただし、x402の設計思想（HTTPヘッダー利用等）は参考にする。

## API設計

### 402 Payment Required レスポンス仕様

#### 未購入時（402）
- ステータスコード: 402
- ヘッダー:
  - X-Payment-Required: true
  - X-Payment-Amount: 支払い額（ETH）
  - X-Payment-Currency: ETH
  - X-Payment-Network: base-sepolia
  - X-Content-Id: コンテンツID
- ボディ: プレビュー、価格、コンテンツID

#### 購入済み（200）
- ステータスコード: 200
- ボディ: 完全なコンテンツ、コンテンツID

### 主要エンドポイント

| エンドポイント | メソッド | 用途 | 認証 |
|---|---|---|---|
| `/api/content` | GET | コンテンツ一覧取得 | 不要 |
| `/api/content/{id}` | GET | コンテンツ取得（402対応） | セッション |
| `/api/content` | POST | コンテンツ作成 | セッション |
| `/api/payment/process` | POST | 支払い処理開始 | セッション |
| `/api/user/wallet` | GET | AAウォレット情報取得 | セッション |

## ユーザー識別とセッション管理

### セッションベースの識別

```mermaid
flowchart LR
    A[ブラウザアクセス] --> B{セッションCookie}
    B -->|なし| C[新規セッション生成]
    B -->|あり| D[既存セッション読込]
    
    C --> E[ユーザーID生成]
    E --> F[AAウォレット生成]
    F --> G[Firestore保存]
    
    D --> H[Firestore読込]
    H --> I[AAウォレット復元]
    
    G --> J[セッション確立]
    I --> J
```

### データフロー

1. **初回アクセス時**
   - セッションID生成
   - ユーザーID生成
   - AAウォレット生成（バックグラウンド）
   - Firestore保存

2. **コンテンツアクセス時**
   - accessList確認
   - 未購入→402レスポンス
   - 購入済→200レスポンス

## 決済フロー詳細

### UserOperation構築

#### UserOperationパラメータ

| パラメータ | 値/説明 |
|---|---|
| sender | AAウォレットアドレス |
| nonce | ウォレットの現在のnonce |
| initCode | 0x（デプロイ済みの場合） |
| callData | execute関数のエンコードデータ |
| callGasLimit | 100000 |
| verificationGasLimit | 200000 |
| preVerificationGas | 50000 |
| maxFeePerGas | 動的に取得 |
| maxPriorityFeePerGas | 2 Gwei |
| paymasterAndData | Pimlicoから取得 |
| signature | サーバー側で生成 |

## State Machine Diagrams

### 1. Payment State Machine

```mermaid
stateDiagram-v2
    [*] --> Initiated: User clicks purchase
    
    Initiated --> Validating: Create UserOp
    Validating --> Rejected: Validation failed
    Validating --> Pending: Validation passed
    
    Pending --> Executing: Bundler accepts
    Pending --> Failed: Bundler rejects
    
    Executing --> Confirmed: On-chain success
    Executing --> Failed: On-chain revert
    
    Confirmed --> Completed: Access granted
    
    Rejected --> [*]
    Failed --> [*]
    Completed --> [*]
    
    note right of Validating
        - Check user balance
        - Verify signatures
        - Validate gas limits
    end note
    
    note right of Executing
        - Submit to mempool
        - Wait for inclusion
        - Monitor status
    end note
```

### 2. Content Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: Create content
    
    Draft --> PendingReview: Submit
    Draft --> Draft: Edit
    
    PendingReview --> Published: Approve
    PendingReview --> Draft: Reject
    
    Published --> Updated: Edit
    Published --> Archived: Archive
    
    Updated --> Published: Save
    Updated --> PendingReview: Major change
    
    Archived --> Published: Restore
    Archived --> Deleted: Permanent delete
    
    Deleted --> [*]
    
    note right of Published
        Content is available
        for purchase
    end note
    
    note right of Archived
        Hidden from public
        but data retained
    end note
```

## 実装タスク一覧

### 1. 環境セットアップ
- [ ] Pimlicoアカウント作成・APIキー取得
- [ ] Firebase プロジェクト作成
- [ ] Vercel プロジェクト作成
- [ ] 環境変数設定

### 2. Backend実装
- [ ] Next.js APIルート作成
  - [ ] `/api/content` - 一覧・作成
  - [ ] `/api/content/[id]` - 402対応
  - [ ] `/api/payment/process` - 決済処理
  - [ ] `/api/user/wallet` - ウォレット情報
- [ ] Firestore接続設定
- [ ] セッション管理実装

### 3. AA Integration
- [ ] permissionless.js セットアップ
- [ ] AAウォレット生成ロジック
- [ ] UserOperation作成・署名
- [ ] Pimlico Bundler接続

### 4. Frontend実装
- [ ] コンテンツ一覧画面
- [ ] 402エラーハンドリング
- [ ] 支払いUI（自動実行）
- [ ] 購入済みコンテンツ表示

### 5. 動作確認
- [ ] Base Sepoliaでのテスト
- [ ] ガスレス決済の確認
- [ ] セッション永続性の確認

### 実装の優先順位

```mermaid
graph TD
    A[1. 環境セットアップ] --> B[2. セッション管理]
    B --> C[3. AAウォレット生成]
    C --> D[4. 402 APIエンドポイント]
    D --> E[5. 決済フロー実装]
    E --> F[6. UI実装]
```

