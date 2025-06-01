'use client';

import { useState, useEffect } from 'react';
import { formatEther, parseEther } from 'viem';
import TransactionHistory from './TransactionHistory';

interface Content {
  id: string;
  title: string;
  preview: string;
  price: string;
  creatorId: string;
  createdAt: any;
}

interface UserWallet {
  userId: string;
  aaWalletAddress: string;
}

export default function PaymentInterface() {
  const [contents, setContents] = useState<Content[]>([]);
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);

  // Initialize wallet and fetch contents
  useEffect(() => {
    initializeInterface();
  }, []);

  const initializeInterface = async () => {
    try {
      // Get or create user wallet
      const walletRes = await fetch('/api/user/wallet');
      const walletData = await walletRes.json();
      setUserWallet(walletData);

      // Fetch available contents
      const contentsRes = await fetch('/api/content');
      const contentsData = await contentsRes.json();
      setContents(contentsData.contents || []);
    } catch (error) {
      console.error('Failed to initialize:', error);
      setPaymentError('Failed to initialize payment interface');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (contentId: string) => {
    setPaymentLoading(true);
    setPaymentError(null);
    setPaymentSuccess(null);
    setSelectedContent(contentId);

    try {
      const response = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      setPaymentSuccess(`Payment successful! Transaction: ${data.transactionHash}`);
      
      // Refresh contents to update paid status
      await initializeInterface();
    } catch (error: any) {
      console.error('Payment failed:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-payment-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Wallet Info */}
      {userWallet && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Your Wallet</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">User ID: {userWallet.userId}</p>
            <p className="text-sm text-gray-600 break-all">
              Wallet Address: {userWallet.aaWalletAddress}
            </p>
          </div>
        </div>
      )}

      {/* Payment Status Messages */}
      {paymentError && (
        <div className="bg-error/10 border border-error rounded-lg p-4">
          <p className="text-error font-medium">{paymentError}</p>
        </div>
      )}
      
      {paymentSuccess && (
        <div className="bg-success/10 border border-success rounded-lg p-4">
          <p className="text-success font-medium">{paymentSuccess}</p>
        </div>
      )}

      {/* Content List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available Content</h2>
        
        {contents.length === 0 ? (
          <p className="text-gray-500">No content available yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 space-y-4 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{content.title}</h3>
                  <p className="text-gray-600 text-sm">{content.preview}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm font-medium text-payment-primary">
                    {formatEther(BigInt(content.price))} ETH
                  </span>
                  
                  <button
                    onClick={() => handlePayment(content.id)}
                    disabled={paymentLoading && selectedContent === content.id}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${paymentLoading && selectedContent === content.id
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-payment-primary text-white hover:bg-payment-primary-dark'
                      }
                    `}
                  >
                    {paymentLoading && selectedContent === content.id ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                        Processing...
                      </span>
                    ) : (
                      'Purchase'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <TransactionHistory userId={userWallet?.userId} />
    </div>
  );
}