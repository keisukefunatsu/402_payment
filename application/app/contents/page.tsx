import Link from 'next/link';
import ContentList from '@/components/ContentList';

export default function ContentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-payment-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">₄</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">402 Payment</h1>
                <p className="text-xs text-gray-600">Gasless Micropayments</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-payment-primary transition-colors"
              >
                Home
              </Link>
              <div className="px-3 py-1 bg-payment-primary/10 text-payment-primary rounded-full text-xs font-medium">
                Beta
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Premium Content</h1>
            <p className="mt-2 text-lg text-gray-600">
              Explore our collection of premium articles and content
            </p>
          </div>

          {/* Filters (future enhancement) */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-payment-primary text-white rounded-lg text-sm font-medium">
                All Content
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Latest
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                Popular
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing all content
            </div>
          </div>

          {/* Content Grid */}
          <ContentList />

          {/* Footer */}
          <div className="mt-16 text-center py-8 border-t border-gray-200">
            <p className="text-gray-600">
              More content coming soon. Create your own premium content to monetize your work!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}