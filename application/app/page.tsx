'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import CreateContent from '@/components/CreateContent';
import ContentList from '@/components/ContentList';

// Dynamic import to avoid SSR issues
const AccountManager = dynamic(() => import('@/components/AccountManager'), { ssr: false });

export default function Home() {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAccountCreated = (info: any, address: string) => {
    setAccountInfo(info);
    setUserAddress(address);
  };

  const handleContentCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8">402 Payment Microblog</h1>
        
        <div className="mb-8">
          <AccountManager onAccountCreated={handleAccountCreated} />
        </div>

        {userAddress && (
          <div className="mb-8">
            <CreateContent 
              userAddress={userAddress} 
              onContentCreated={handleContentCreated} 
            />
          </div>
        )}

        <ContentList 
          userAddress={userAddress}
          accountInfo={accountInfo}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </main>
  );
}