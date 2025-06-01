'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Content {
  id: string;
  title: string;
  preview: string;
  price: string;
  creatorId: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function ContentList() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) throw new Error('Failed to fetch contents');
      
      const data = await response.json();
      setContents(data.contents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInWei: string) => {
    // Convert from Wei to ETH and then to USD (assuming 1 ETH = $2000)
    const ethPrice = parseFloat(priceInWei) / 1e18;
    const usdPrice = ethPrice * 2000;
    return `$${usdPrice.toFixed(3)}`;
  };

  const formatDate = (timestamp: { _seconds: number }) => {
    return new Date(timestamp._seconds * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchContents}
          className="mt-4 px-4 py-2 bg-payment-primary text-white rounded-lg hover:bg-payment-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No content available</h3>
        <p className="text-gray-600">Check back later for premium content!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <Link
          key={content.id}
          href={`/content/${content.id}`}
          className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-payment-primary/20 transition-all duration-200"
        >
          <div className="p-6">
            {/* Price badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-payment-primary/10 text-payment-primary">
                {formatPrice(content.price)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(content.createdAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-payment-primary transition-colors mb-2">
              {content.title}
            </h3>

            {/* Preview */}
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {content.preview}
            </p>

            {/* Action */}
            <div className="flex items-center text-payment-primary text-sm font-medium">
              <span>Read more</span>
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* 402 Status indicator */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-lg">
            <div className="flex items-center text-xs text-gray-600">
              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              402 Payment Required
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}