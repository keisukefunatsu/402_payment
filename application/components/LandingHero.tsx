'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LandingHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-payment-primary/5 to-payment-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          {/* Main headline */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
            <span className="block">Micropayments made</span>
            <span className="block text-payment-primary mt-2">
              Simple & Gasless
            </span>
          </h1>
          
          {/* Description */}
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600">
            Experience the future of content monetization with HTTP 402 Payment Required 
            and Account Abstraction. No wallet connection, no gas fees.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contents"
              className={`px-8 py-4 bg-payment-primary text-white font-semibold rounded-lg 
                hover:bg-payment-primary/90 transition-all duration-200 
                transform hover:scale-105 shadow-lg ${
                  mounted ? 'animate-fade-in' : ''
                }`}
            >
              Browse Premium Content
            </Link>
            <Link
              href="#demo"
              className={`px-8 py-4 bg-white text-payment-primary font-semibold rounded-lg 
                border-2 border-payment-primary/20 hover:border-payment-primary/40 
                transition-all duration-200 transform hover:scale-105 ${
                  mounted ? 'animate-fade-in animation-delay-200' : ''
                }`}
            >
              Try Demo
            </Link>
          </div>

          {/* Features preview */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-payment-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-payment-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">No Wallet Required</h3>
              <p className="mt-2 text-sm text-gray-600">
                Start using immediately without MetaMask or any wallet extension
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-payment-secondary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-payment-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Gasless Payments</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sponsored transactions mean you never pay gas fees
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Micro Pricing</h3>
              <p className="mt-2 text-sm text-gray-600">
                Pay only for the content you consume, starting from $0.001
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-payment-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-payment-secondary/5 rounded-full blur-3xl" />
    </section>
  );
}