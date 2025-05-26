'use client';

import { useState, useEffect } from 'react';
import type { Content } from '@/lib/types';

interface ContentListProps {
  userAddress?: string;
  accountInfo?: any;
  refreshTrigger?: number;
}

export default function ContentList({ userAddress, accountInfo, refreshTrigger }: ContentListProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content/list');
      const data = await response.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [refreshTrigger]);

  const viewContent = async (contentId: string) => {
    try {
      const response = await fetch(`/api/resource/${contentId}`, {
        headers: {
          'x-user-id': userAddress || '',
        },
      });

      if (response.status === 402) {
        const paymentData = await response.json();
        if (window.confirm(`このコンテンツは${paymentData.price} ETHが必要です。購入しますか？`)) {
          await purchaseContent(contentId, paymentData.price);
        }
      } else if (response.ok) {
        const data = await response.json();
        alert(`コンテンツ: ${data.content}`);
      }
    } catch (error) {
      console.error('Failed to view content:', error);
    }
  };

  const purchaseContent = async (contentId: string, price: number) => {
    if (!userAddress || !accountInfo) {
      alert('ウォレットを接続してください');
      return;
    }

    setPurchasing(contentId);
    try {
      const response = await fetch('/api/payment/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: contentId,
          amount: price,
          from: userAddress,
        }),
      });

      if (response.ok) {
        alert('購入が完了しました！');
        // 購入後、コンテンツを再度取得
        viewContent(contentId);
      } else {
        alert('購入に失敗しました');
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('購入エラーが発生しました');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">コンテンツ一覧</h2>
      {contents.length === 0 ? (
        <p className="text-gray-500">まだコンテンツがありません</p>
      ) : (
        contents.map((content) => (
          <div key={content.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{content.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${
                content.tier === 0 ? 'bg-green-100 text-green-800' :
                content.tier === 1 ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {content.tier === 0 ? '無料' :
                 content.tier === 1 ? 'プレミアム' : 'エクスクルーシブ'}
              </span>
            </div>
            <p className="text-gray-600 mb-3">{content.preview}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {content.price > 0 ? `${content.price} ETH` : '無料'}
              </span>
              <button
                onClick={() => viewContent(content.id)}
                disabled={purchasing === content.id}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {purchasing === content.id ? '処理中...' : '閲覧'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}