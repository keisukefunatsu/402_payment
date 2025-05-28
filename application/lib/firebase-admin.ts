import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let db: Firestore;

// Initialize Firebase Admin only if environment variables are present
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  db = getFirestore();
} else {
  // Mock Firestore for build time
  console.warn('Firebase environment variables not found. Using mock Firestore.');
  db = {} as Firestore;
}

export { db };

// Firestore collections
export const collections = {
  users: 'users',
  contents: 'contents',
  payments: 'payments'
} as const;

// Helper functions
export async function getUser(userId: string) {
  if (!db.collection) return null;
  const userDoc = await db.collection(collections.users).doc(userId).get();
  return userDoc.exists ? userDoc.data() : null;
}

export async function createUser(userId: string, data: any) {
  if (!db.collection) return;
  await db.collection(collections.users).doc(userId).set({
    ...data,
    createdAt: new Date(),
  });
}

export async function hasContentAccess(contentId: string, userId: string) {
  if (!db.collection) return false;
  const accessDoc = await db
    .collection(collections.contents)
    .doc(contentId)
    .collection('accessList')
    .doc(userId)
    .get();
  
  return accessDoc.exists;
}

export async function grantContentAccess(contentId: string, userId: string) {
  if (!db.collection) return;
  await db
    .collection(collections.contents)
    .doc(contentId)
    .collection('accessList')
    .doc(userId)
    .set({
      grantedAt: new Date(),
    });
}