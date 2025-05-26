import { adminDb, COLLECTIONS } from '../firebase-admin';
import type { User, Content, Payment } from '../types';

// ユーザー作成
export async function createUser(address: string, aaWalletAddress?: string): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    address,
    aaWalletAddress,
    balance: 1000,
  };
  
  await adminDb.collection(COLLECTIONS.USERS).doc(user.id).set(user);
  return user;
}

// ユーザー取得
export async function getUserByAddress(address: string): Promise<User | null> {
  const snapshot = await adminDb
    .collection(COLLECTIONS.USERS)
    .where('address', '==', address)
    .limit(1)
    .get();
  
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as User;
}

// コンテンツ取得
export async function getContent(id: string): Promise<Content | null> {
  const doc = await adminDb.collection(COLLECTIONS.CONTENTS).doc(id).get();
  if (!doc.exists) return null;
  return doc.data() as Content;
}

// 支払い記録
export async function recordPayment(
  userId: string,
  contentId: string,
  amount: number,
  txHash: string
): Promise<void> {
  const payment: Payment = {
    id: crypto.randomUUID(),
    userId,
    contentId,
    amount,
    txHash,
    timestamp: Date.now(),
  };
  
  await adminDb.collection(COLLECTIONS.PAYMENTS).doc(payment.id).set(payment);
  
  // コンテンツアクセス権限を付与
  await adminDb.collection(COLLECTIONS.CONTENT_ACCESS).doc(`${userId}_${contentId}`).set({
    userId,
    contentId,
    grantedAt: Date.now(),
  });
}

// アクセス権限確認
export async function hasContentAccess(userId: string, contentId: string): Promise<boolean> {
  const doc = await adminDb
    .collection(COLLECTIONS.CONTENT_ACCESS)
    .doc(`${userId}_${contentId}`)
    .get();
  
  return doc.exists;
}