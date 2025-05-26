import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Firebase Admin SDK初期化
// App Hosting環境では自動的に認証される（環境変数不要）
// 参考: https://firebase.google.com/docs/app-hosting/firebase-sdks
const app = getApps().length === 0 ? initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
}) : getApps()[0];

export const adminDb = getFirestore(app);

// コレクション名
export const COLLECTIONS = {
  USERS: 'users',
  CONTENTS: 'contents',
  PAYMENTS: 'payments',
  CONTENT_ACCESS: 'contentAccess',
} as const;