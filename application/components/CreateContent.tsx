'use client';

import { useState } from 'react';

interface CreateContentProps {
  userAddress: string;
  onContentCreated: () => void;
}

export default function CreateContent({ userAddress, onContentCreated }: CreateContentProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tier, setTier] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch('/api/content/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          preview: content.substring(0, 100) + '...',
          content,
          price: tier > 0 ? price : 0,
          tier,
          creatorAddress: userAddress,
        }),
      });

      if (response.ok) {
        setTitle('');
        setContent('');
        setTier(0);
        setPrice(0);
        onContentCreated();
      } else {
        console.error('Failed to create content');
      }
    } catch (error) {
      console.error('Error creating content:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">投稿を作成</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />
        <textarea
          placeholder="内容を入力..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded mb-4 h-32"
          required
        />
        <div className="flex gap-4 mb-4">
          <select
            value={tier}
            onChange={(e) => setTier(Number(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={0}>無料</option>
            <option value={1}>プレミアム</option>
            <option value={2}>エクスクルーシブ</option>
          </select>
          {tier > 0 && (
            <input
              type="number"
              placeholder="価格 (ETH)"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              step="0.001"
              min="0.001"
              className="p-2 border rounded"
              required
            />
          )}
        </div>
        <button
          type="submit"
          disabled={isCreating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? '投稿中...' : '投稿する'}
        </button>
      </form>
    </div>
  );
}