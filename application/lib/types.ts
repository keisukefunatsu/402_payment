export interface User {
  id: string;
  address: string;
  aaWalletAddress?: string;
  balance: number;
}

export interface Resource {
  id: string;
  title: string;
  preview: string;
  content: string;
  price: number;
  tier: number; // 0: free, 1: premium, 2: exclusive
}

export interface Content {
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

export interface Payment {
  id: string;
  userId: string;
  contentId: string;
  amount: number;
  txHash: string;
  timestamp: number;
}

export interface UserOperation {
  sender: string;
  target: string;
  value: number;
  data: string;
}