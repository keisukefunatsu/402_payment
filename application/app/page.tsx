export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">402 Payment System</h1>
              <p className="text-gray-600 mt-1">分散型マイクロブログプラットフォーム</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-payment-primary/10 text-payment-primary rounded-full text-sm font-medium">
                ベータ版
              </div>
              <button className="px-4 py-2 bg-payment-primary text-white rounded-lg hover:bg-payment-primary-dark transition-colors">
                ウォレット接続
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample Content Cards */}
          <article className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-fade-in">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-payment-primary to-payment-primary-dark rounded-full"></div>
                <span className="font-medium text-gray-900">作者名</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                <span>✅</span>
                0.001 ETH
              </span>
            </header>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">サンプル投稿タイトル</h3>
              <p className="text-gray-600 text-sm">これはサンプルのプレビューテキストです。実際の投稿内容の一部が表示されます...</p>
            </div>
            
            <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">2時間前</span>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-payment-primary hover:bg-payment-primary-dark text-white rounded-lg transition-colors">
                <span>🔓</span>
                読む
              </button>
            </footer>
          </article>

          <article className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-fade-in">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-warning to-warning-light rounded-full"></div>
                <span className="font-medium text-gray-900">別の作者</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                <span>🔒</span>
                0.002 ETH
              </span>
            </header>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">有料コンテンツ</h3>
              <p className="text-gray-600 text-sm">このコンテンツは有料です。支払いが必要です...</p>
            </div>
            
            <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">5時間前</span>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-warning hover:bg-warning/90 text-white rounded-lg transition-colors">
                <span>💰</span>
                支払う
              </button>
            </footer>
          </article>

          <article className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 animate-fade-in">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
                <span className="font-medium text-gray-900">フリー投稿</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                <span>🆓</span>
                Free
              </span>
            </header>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">無料で読める記事</h3>
              <p className="text-gray-600 text-sm">この投稿は無料で読むことができます。誰でもアクセス可能です...</p>
            </div>
            
            <footer className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">1日前</span>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                <span>📖</span>
                読む
              </button>
            </footer>
          </article>
        </div>

        {/* Design System Preview */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">デザインシステムプレビュー</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">カラーパレット</h3>
              <div className="flex gap-2 mb-4">
                <div className="w-8 h-8 bg-payment-primary rounded" title="Primary"></div>
                <div className="w-8 h-8 bg-success rounded" title="Success"></div>
                <div className="w-8 h-8 bg-warning rounded" title="Warning"></div>
                <div className="w-8 h-8 bg-error rounded" title="Error"></div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">アニメーション</h3>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-payment-primary rounded animate-payment-pulse"></div>
                <div className="w-8 h-8 bg-success rounded animate-transaction-success"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}