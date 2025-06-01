'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Content {
  id: string;
  title: string;
  preview: string;
  fullContent?: string;
  price: string;
  creatorId: string;
  hasAccess?: boolean;
}

export default function ContentPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${contentId}`);
      
      if (response.status === 402) {
        // Payment required - this is expected
        const data = await response.json();
        setContent(data);
      } else if (response.ok) {
        const data = await response.json();
        setContent(data);
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Payment successful - refetch content to get full access
        await fetchContent();
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  const formatPrice = (priceInWei: string) => {
    const ethPrice = parseFloat(priceInWei) / 1e18;
    const usdPrice = ethPrice * 2000;
    return `$${usdPrice.toFixed(3)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/"
            className="text-payment-primary hover:text-payment-primary/80"
          >
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to content
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>By {content.creatorId}</span>
              <span>•</span>
              <span>{formatPrice(content.price)}</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            {content.hasAccess ? (
              <>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {content.fullContent || content.preview}
                  </p>
                </div>
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">You have access to this content</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Preview */}
                <div className="prose prose-lg max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed">{content.preview}</p>
                </div>

                {/* Paywall */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="bg-gradient-to-b from-transparent to-gray-50 -mt-20 pt-20 pb-8 text-center">
                    <div className="inline-block bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">402 Payment Required</h3>
                      <p className="text-gray-600 mb-6">
                        This is premium content. Make a one-time payment to unlock full access.
                      </p>

                      <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-900">{formatPrice(content.price)}</span>
                        <span className="text-gray-600 ml-2">one-time payment</span>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={paying}
                        className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                          paying
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-payment-primary text-white hover:bg-payment-primary/90 hover:scale-105'
                        }`}
                      >
                        {paying ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Pay Now'
                        )}
                      </button>

                      {error && (
                        <p className="mt-4 text-sm text-red-600">{error}</p>
                      )}

                      <p className="mt-6 text-xs text-gray-500">
                        No wallet required • Gasless transaction • Instant access
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}