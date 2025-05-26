'use client';

import { useState, useEffect } from 'react';

interface AccountManagerProps {
  onAccountCreated: (accountInfo: any, address: string) => void;
}

export default function AccountManager({ onAccountCreated }: AccountManagerProps) {
  const [address, setAddress] = useState('');
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // シミュレートされたウォレット接続
  const connectWallet = () => {
    const mockAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setAddress(mockAddress);
  };

  const createAccount = async () => {
    if (!address) {
      alert('まずウォレットを接続してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: address }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccountInfo(data);
        onAccountCreated(data, address);
      } else {
        console.error('Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      createAccount();
    }
  }, [address]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">アカウント管理</h2>
      
      {!address ? (
        <button
          onClick={connectWallet}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          ウォレットを接続
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">接続されたアドレス:</p>
            <p className="font-mono text-sm">{address}</p>
          </div>
          
          {accountInfo && (
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">AAウォレット:</p>
                <p className="font-mono text-sm">{accountInfo.account}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">残高:</p>
                <p className="text-lg font-semibold">{accountInfo.balance} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ステータス:</p>
                <p className={`text-sm ${accountInfo.isDeployed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {accountInfo.isDeployed ? 'デプロイ済み' : '未デプロイ'}
                </p>
              </div>
            </div>
          )}
          
          {loading && <p className="text-gray-500">アカウント作成中...</p>}
        </div>
      )}
    </div>
  );
}