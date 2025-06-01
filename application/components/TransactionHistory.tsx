'use client';

import { useState, useEffect } from 'react';
import { formatEther } from 'viem';

interface Transaction {
  id: string;
  contentId: string;
  contentTitle: string;
  amount: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  transactionHash?: string;
}

interface TransactionHistoryProps {
  userId?: string;
}

export default function TransactionHistory({ userId }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactionHistory();
  }, [userId]);

  const fetchTransactionHistory = async () => {
    try {
      // In a real implementation, this would fetch from the API
      // For now, we'll use mock data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          contentId: 'content1',
          contentTitle: 'Premium Article',
          amount: '1000000000000000',
          status: 'success',
          timestamp: new Date(Date.now() - 3600000),
          transactionHash: '0x123...abc',
        },
        {
          id: '2',
          contentId: 'content2',
          contentTitle: 'Test Content',
          amount: '2000000000000000',
          status: 'failed',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: '3',
          contentId: 'content3',
          contentTitle: 'Another Article',
          amount: '1500000000000000',
          status: 'pending',
          timestamp: new Date(Date.now() - 10800000),
        },
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to fetch transaction history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
            Success
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
            Pending
          </span>
        );
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minutes ago`;
    } else if (hours < 24) {
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days} days ago`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-payment-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No transactions yet</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {tx.contentTitle}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(tx.timestamp)}
                  {tx.transactionHash && (
                    <span className="ml-2 text-xs">
                      • TX: {tx.transactionHash}
                    </span>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm font-medium text-gray-900">
                  {formatEther(BigInt(tx.amount))} ETH
                </span>
                {getStatusBadge(tx.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}