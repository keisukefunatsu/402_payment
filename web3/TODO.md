# Web3 TODO List

## 完了したタスク ✅

### 基本セットアップ
- [x] Hardhatプロジェクトの初期化
- [x] 必要な依存関係のインストール
- [x] hardhat.config.tsの設定
- [x] プロジェクト構造の作成

### スマートコントラクト実装
- [x] PaymentManager.sol - 基本的な支払い管理
- [x] AccountAbstraction.sol - ERC-4337準拠のアカウント実装
- [x] AccountFactory.sol - アカウント作成ファクトリー
- [x] Paymaster.sol - ガススポンサー機能
- [x] PaymentToken.sol - 402ペイメントレシート
- [x] ContentRegistry.sol - IPFS統合
- [x] PaymentManagerV2.sol - サブスクリプション機能追加
- [x] IntegratedPaymentSystem.sol - AAウォレットとの統合

### テストとデプロイ
- [x] 基本的なテストファイルの作成
- [x] テストの実行（8テスト全てパス）
- [x] ローカルデプロイの実行

## 未完了タスク 📝

### スマートコントラクト改善
- [ ] EntryPointコントラクトの実装（現在はインターフェースのみ）
- [ ] SocialRecovery.sol - ガーディアンシステムの実装
- [ ] 緊急停止機能（Circuit Breaker）の追加
- [ ] アップグレード可能なプロキシパターンの実装

### テスト拡充
- [ ] PaymentManagerV2のテスト作成
- [ ] Paymasterのテスト作成
- [ ] PaymentTokenのテスト作成
- [ ] ContentRegistryのテスト作成
- [ ] IntegratedPaymentSystemのテスト作成
- [ ] 統合テストの作成

### デプロイとインフラ
- [ ] Base Sepoliaへのデプロイスクリプト更新
- [ ] デプロイ済みコントラクトのVerify
- [ ] Subgraphの作成（The Graph）
- [ ] IPFSゲートウェイの設定

### フロントエンド統合
- [ ] Web3ライブラリの統合（wagmi/viem）
- [ ] AAウォレットSDKの統合（Pimlico/Biconomy）
- [ ] コントラクトABIの生成と型定義
- [ ] 402ステータスコードのハンドリング実装

### セキュリティ
- [ ] スマートコントラクトの内部監査
- [ ] ガス最適化
- [ ] リエントランシー攻撃の追加対策
- [ ] アクセス制御の強化

### ドキュメント
- [ ] スマートコントラクトのNatSpecコメント追加
- [ ] デプロイメントガイドの作成
- [ ] API仕様書の作成
- [ ] 統合テストシナリオの文書化

## 次のステップ 🚀

1. **テストカバレッジの向上**
   - 新しく作成したコントラクトのユニットテスト
   - エッジケースのテスト

2. **Base Sepoliaへのデプロイ準備**
   - 環境変数の設定（.env）
   - デプロイスクリプトの更新
   - ガス見積もりの確認

3. **フロントエンドとの統合**
   - TypeChainで生成された型の活用
   - AAウォレットの作成フロー
   - 402ペイメントフローの実装

## メモ 📌

- コントラクトアドレスは`deployments.json`に保存
- 警告は機能に影響なし（未使用変数など）
- EntryPointアドレスは本番環境では実際のERC-4337 EntryPointを使用