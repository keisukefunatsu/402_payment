// モックデータベース（開発用）
interface MockUser {
  id: string;
  address: string;
  aaWalletAddress?: string;
  balance: number;
}

interface MockContent {
  id: string;
  title: string;
  preview: string;
  content: string;
  fullContent?: string;
  price: number;
  tier: number;
  creatorAddress?: string;
  createdAt?: number;
}

interface MockPayment {
  id: string;
  userId: string;
  contentId: string;
  amount: number;
  txHash: string;
  timestamp: number;
}

// インメモリストレージ
const users = new Map<string, MockUser>();
const contents = new Map<string, MockContent>();
const payments = new Map<string, MockPayment>();
const contentAccess = new Map<string, Set<string>>(); // userId -> contentIds

// ユーザー操作
export const mockDb = {
  users: {
    create: async (address: string, aaWalletAddress?: string): Promise<MockUser> => {
      const user: MockUser = {
        id: crypto.randomUUID(),
        address,
        aaWalletAddress,
        balance: 1000,
      };
      users.set(user.id, user);
      return user;
    },
    
    getByAddress: async (address: string): Promise<MockUser | null> => {
      const user = Array.from(users.values()).find(u => u.address === address);
      return user || null;
    },
  },
  
  contents: {
    create: async (content: Omit<MockContent, 'id'>): Promise<MockContent> => {
      const newContent: MockContent = {
        ...content,
        id: crypto.randomUUID(),
        createdAt: content.createdAt || Date.now(),
      };
      contents.set(newContent.id, newContent);
      return newContent;
    },
    
    get: async (id: string): Promise<MockContent | null> => {
      return contents.get(id) || null;
    },
    
    list: async (): Promise<MockContent[]> => {
      return Array.from(contents.values()).sort((a, b) => 
        (b.createdAt || 0) - (a.createdAt || 0)
      );
    },
  },
  
  payments: {
    record: async (
      userId: string,
      contentId: string,
      amount: number,
      txHash: string
    ): Promise<void> => {
      const payment: MockPayment = {
        id: crypto.randomUUID(),
        userId,
        contentId,
        amount,
        txHash,
        timestamp: Date.now(),
      };
      payments.set(payment.id, payment);
      
      // アクセス権限を付与
      if (!contentAccess.has(userId)) {
        contentAccess.set(userId, new Set());
      }
      contentAccess.get(userId)!.add(contentId);
    },
    
    hasAccess: async (userId: string, contentId: string): Promise<boolean> => {
      return contentAccess.get(userId)?.has(contentId) || false;
    },
  },
};

// 初期データ
const initData = async () => {
  // サンプルコンテンツ
  await mockDb.contents.create({
    title: 'Web3入門ガイド',
    preview: 'Web3の基本概念について学びましょう...',
    content: 'Web3は分散型インターネットの新しい形です。',
    fullContent: 'Web3は分散型インターネットの新しい形です。このガイドでは詳しく解説します。',
    price: 0,
    tier: 0,
    creatorAddress: '0x1234567890123456789012345678901234567890',
  });
  
  await mockDb.contents.create({
    title: 'DeFiプロトコルの仕組み',
    preview: 'DeFiがどのように動作するか理解しよう...',
    content: 'DeFi（分散型金融）の基本',
    fullContent: 'DeFi（分散型金融）は、従来の金融サービスをブロックチェーン上で再現したものです。',
    price: 0.001,
    tier: 1,
    creatorAddress: '0x2345678901234567890123456789012345678901',
  });
};

// 初期化
initData();