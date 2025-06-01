import PaymentInterface from '@/components/PaymentInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">402 Payment System</h1>
              <p className="text-gray-600 mt-1">Decentralized Microblog Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-payment-primary/10 text-payment-primary rounded-full text-sm font-medium">
                Beta
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-8">
        <PaymentInterface />
      </div>
    </main>
  )
}