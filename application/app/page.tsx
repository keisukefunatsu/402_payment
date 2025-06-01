import LandingHero from '@/components/LandingHero';
import ContentList from '@/components/ContentList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-payment-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">₄</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">402 Payment</h1>
                <p className="text-xs text-gray-600">Gasless Micropayments</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="/contents"
                className="text-sm font-medium text-gray-700 hover:text-payment-primary transition-colors"
              >
                Browse
              </a>
              <a 
                href="#demo"
                className="text-sm font-medium text-gray-700 hover:text-payment-primary transition-colors"
              >
                Demo
              </a>
              <div className="px-3 py-1 bg-payment-primary/10 text-payment-primary rounded-full text-xs font-medium">
                Beta
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <LandingHero />

      {/* Demo Section */}
      <section id="demo" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Try It Now</h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience gasless micropayments with our demo content
            </p>
          </div>
          
          <ContentList />

          <div className="mt-12 text-center">
            <a
              href="/contents"
              className="inline-flex items-center text-payment-primary font-medium hover:text-payment-primary/80 transition-colors"
            >
              View all content
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, secure, and seamless micropayments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-payment-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-payment-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Content</h3>
              <p className="text-gray-600">
                Find premium content you want to access. Each piece shows its price upfront.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-payment-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-payment-secondary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Click to Pay</h3>
              <p className="text-gray-600">
                When you hit a 402 paywall, simply click pay. No wallet connection needed.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">
                Payment is processed instantly with no gas fees. Enjoy your content immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}