# 🎨 Frontend Design Policy - 402 Payment System

## 概要 (Overview)

この文書は、402 Payment System（分散型マイクロブログプラットフォーム）のフロントエンド開発における統一されたデザイン方針を定義します。

## 🎯 デザイン理念 (Design Philosophy)

### Core Principles
1. **支払いファースト** - 402ステータスコードをUI/UXの中心に据える
2. **分散型の透明性** - ブロックチェーン要素を分かりやすく表現
3. **マイクロコンテンツ** - 短い投稿に最適化されたレイアウト
4. **信頼できる決済** - セキュリティと使いやすさの両立

## 🛠️ 技術スタック

### 基盤技術
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

### 推奨ライブラリ
```json
{
  "UI Components": ["@headlessui/react", "lucide-react"],
  "Animations": ["framer-motion"],
  "Forms": ["react-hook-form", "@hookform/resolvers"],
  "State Management": ["zustand"],
  "Web3": ["wagmi", "viem"]
}
```

## 🎨 カラーパレット (Color Palette)

### Primary Colors
```css
/* 402 Payment Theme */
:root {
  /* Payment Primary */
  --payment-primary: #6366f1;    /* indigo-500 */
  --payment-primary-light: #818cf8; /* indigo-400 */
  --payment-primary-dark: #4f46e5;  /* indigo-600 */
  
  /* Success/Transaction */
  --success: #10b981;            /* emerald-500 */
  --success-light: #34d399;      /* emerald-400 */
  
  /* Warning/Pending */
  --warning: #f59e0b;            /* amber-500 */
  --warning-light: #fbbf24;      /* amber-400 */
  
  /* Error/Failed */
  --error: #ef4444;              /* red-500 */
  --error-light: #f87171;        /* red-400 */
  
  /* Neutral */
  --neutral-900: #111827;        /* gray-900 */
  --neutral-800: #1f2937;        /* gray-800 */
  --neutral-700: #374151;        /* gray-700 */
  --neutral-300: #d1d5db;        /* gray-300 */
  --neutral-100: #f3f4f6;        /* gray-100 */
  --neutral-50: #f9fafb;         /* gray-50 */
}
```

### Usage Guidelines
- **Primary**: メインCTA、ナビゲーション、ブランド要素
- **Success**: 決済完了、トランザクション成功
- **Warning**: 402レスポンス、支払い待機状態
- **Error**: エラー状態、失敗通知
- **Neutral**: テキスト、背景、ボーダー

## 📐 レイアウト規則 (Layout Rules)

### グリッドシステム
```typescript
// Container最大幅
const CONTAINER_SIZES = {
  sm: '640px',    // モバイル
  md: '768px',    // タブレット
  lg: '1024px',   // デスクトップ
  xl: '1280px',   // ワイドスクリーン
  '2xl': '1536px' // Ultra-wide
} as const;

// Spacing Scale (8pxベース)
const SPACING = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
} as const;
```

### マイクロブログレイアウト
```tsx
// 投稿カードの基本構造
<article className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
  <header className="flex items-center justify-between">
    <UserAvatar />
    <PaymentBadge price={content.price} />
  </header>
  
  <div className="space-y-2">
    <h3 className="font-semibold text-gray-900">{content.title}</h3>
    <p className="text-gray-600">{content.preview}</p>
  </div>
  
  <footer className="flex items-center justify-between pt-4 border-t">
    <Timestamp />
    <PaymentButton />
  </footer>
</article>
```

## 🧩 コンポーネント設計 (Component Design)

### 基本原則
1. **Composition Over Inheritance** - 小さなコンポーネントの組み合わせ
2. **Props Interface** - TypeScriptの型安全性を活用
3. **Accessibility First** - ARIA属性とキーボードナビゲーション
4. **Responsive Design** - モバイルファーストアプローチ

### コンポーネント階層
```
components/
├── ui/                 # 基本UIコンポーネント
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── Badge.tsx
├── payment/           # 支払い関連コンポーネント
│   ├── PaymentButton.tsx
│   ├── PaymentModal.tsx
│   ├── PriceDisplay.tsx
│   └── TransactionStatus.tsx
├── content/           # コンテンツ関連コンポーネント
│   ├── ContentCard.tsx
│   ├── ContentList.tsx
│   ├── CreateContent.tsx
│   └── ContentPreview.tsx
└── wallet/            # ウォレット関連コンポーネント
    ├── WalletConnect.tsx
    ├── BalanceDisplay.tsx
    └── AccountInfo.tsx
```

### コンポーネント例
```tsx
// PaymentButton.tsx
interface PaymentButtonProps {
  price: number;
  contentId: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPayment?: (contentId: string) => void;
}

export function PaymentButton({ 
  price, 
  contentId, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPayment 
}: PaymentButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: 'bg-payment-primary hover:bg-payment-primary-dark text-white',
    secondary: 'bg-white hover:bg-gray-50 text-payment-primary border border-payment-primary'
  };

  return (
    <button
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
      `}
      disabled={disabled}
      onClick={() => onPayment?.(contentId)}
    >
      <CoinIcon className="w-4 h-4" />
      {price} ETH
    </button>
  );
}
```

## 🎭 UI/UXパターン

### 402 Payment Flow
```tsx
// 402エラー時のUIフロー
const Payment402Flow = () => {
  const [step, setStep] = useState<'preview' | 'payment' | 'success'>('preview');
  
  return (
    <Modal>
      {step === 'preview' && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
            <LockIcon className="w-8 h-8 text-warning" />
          </div>
          <h3 className="text-lg font-semibold">コンテンツをアンロック</h3>
          <p className="text-gray-600">このコンテンツを読むには支払いが必要です</p>
          <PriceDisplay price={content.price} />
          <PaymentButton onClick={() => setStep('payment')} />
        </div>
      )}
      
      {step === 'payment' && (
        <PaymentProcessing onSuccess={() => setStep('success')} />
      )}
      
      {step === 'success' && (
        <PaymentSuccess contentId={content.id} />
      )}
    </Modal>
  );
};
```

### マイクロペイメント状態表示
```tsx
// 支払い状態の視覚的フィードバック
const PaymentStatusBadge = ({ status, amount }: { 
  status: 'free' | 'paid' | 'pending' | 'failed';
  amount: number;
}) => {
  const statusConfig = {
    free: { bg: 'bg-gray-100', text: 'text-gray-600', icon: '🆓' },
    paid: { bg: 'bg-success/10', text: 'text-success', icon: '✅' },
    pending: { bg: 'bg-warning/10', text: 'text-warning', icon: '⏳' },
    failed: { bg: 'bg-error/10', text: 'text-error', icon: '❌' }
  };

  const config = statusConfig[status];
  
  return (
    <span className={`
      inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${config.bg} ${config.text}
    `}>
      <span>{config.icon}</span>
      {amount > 0 ? `${amount} ETH` : 'Free'}
    </span>
  );
};
```

## 📱 レスポンシブデザイン

### ブレークポイント戦略
```typescript
const BREAKPOINTS = {
  sm: '640px',   // モバイル横向き
  md: '768px',   // タブレット縦向き
  lg: '1024px',  // デスクトップ
  xl: '1280px',  // ワイドスクリーン
  '2xl': '1536px' // Ultra-wide
} as const;

// モバイルファーストのTailwindクラス例
const responsiveClasses = [
  'grid grid-cols-1',      // モバイル: 1列
  'md:grid-cols-2',        // タブレット: 2列
  'lg:grid-cols-3',        // デスクトップ: 3列
  'xl:grid-cols-4'         // ワイド: 4列
].join(' ');
```

### モバイル最適化
- **タッチターゲット**: 最小44px × 44px
- **読みやすさ**: 16px以上のフォントサイズ
- **余白**: タッチしやすい間隔の確保
- **ナビゲーション**: ボトムナビゲーション推奨

## ⚡ パフォーマンス最適化

### 画像最適化
```tsx
// Next.js Image コンポーネントの使用
import Image from 'next/image';

<Image
  src={user.avatar}
  alt={`${user.name}のアバター`}
  width={40}
  height={40}
  className="rounded-full"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

### 遅延読み込み
```tsx
// React.lazy + Suspense
const PaymentModal = lazy(() => import('../payment/PaymentModal'));

<Suspense fallback={<PaymentSkeleton />}>
  <PaymentModal />
</Suspense>
```

## 🔒 セキュリティ考慮事項

### 表示制御
```tsx
// センシティブな情報の表示制御
const AddressDisplay = ({ address }: { address: string }) => {
  const [showFull, setShowFull] = useState(false);
  
  return (
    <button
      onClick={() => setShowFull(!showFull)}
      className="font-mono text-sm"
    >
      {showFull ? address : `${address.slice(0, 6)}...${address.slice(-4)}`}
    </button>
  );
};
```

### ユーザー入力のサニタイズ
```tsx
import DOMPurify from 'isomorphic-dompurify';

const SafeContent = ({ content }: { content: string }) => {
  const sanitizedContent = DOMPurify.sanitize(content);
  
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className="prose prose-sm max-w-none"
    />
  );
};
```

## 🧪 テスト戦略

### コンポーネントテスト
```tsx
// PaymentButton.test.tsx
import { render, fireEvent, screen } from '@testing-library/react';
import { PaymentButton } from '../PaymentButton';

describe('PaymentButton', () => {
  it('価格を正しく表示する', () => {
    render(<PaymentButton price={0.001} contentId="test" />);
    expect(screen.getByText('0.001 ETH')).toBeInTheDocument();
  });

  it('クリック時にonPaymentコールバックを呼ぶ', () => {
    const onPayment = jest.fn();
    render(<PaymentButton price={0.001} contentId="test" onPayment={onPayment} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onPayment).toHaveBeenCalledWith('test');
  });
});
```

## 📚 実装ガイドライン

### ファイル命名規則
```
components/
├── Button.tsx           # PascalCase for components
├── Button.test.tsx      # .test suffix for tests
├── Button.stories.tsx   # .stories suffix for Storybook
└── index.ts            # barrel exports
```

### インポート順序
```tsx
// 1. React
import React from 'react';

// 2. 外部ライブラリ
import clsx from 'clsx';
import { motion } from 'framer-motion';

// 3. 内部utilities
import { cn } from '@/lib/utils';

// 4. 内部components
import { Button } from '@/components/ui/Button';

// 5. 型定義
import type { ComponentProps } from './types';
```

### Tailwind設定拡張
```typescript
// tailwind.config.ts
const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        payment: {
          primary: '#6366f1',
          'primary-light': '#818cf8',
          'primary-dark': '#4f46e5',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'payment-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'transaction-success': 'bounce 1s ease-in-out',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

## 🔄 更新とメンテナンス

### バージョン管理
- このドキュメントは定期的に見直し、プロジェクトの成長に合わせて更新
- 新しいコンポーネントパターンが確立されたら追加
- 廃止予定の機能は明確にマーク

### 貢献ガイドライン
1. 新しいコンポーネント作成時は、このポリシーに従う
2. デザインシステムの変更は、チーム全体で議論
3. アクセシビリティを常に考慮
4. パフォーマンスへの影響を検証

---

**最終更新**: 2025年5月26日  
**対象バージョン**: Next.js 14, React 18, Tailwind CSS 3.4