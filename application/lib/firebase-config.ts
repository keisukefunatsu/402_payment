// Firebase設定の定数
export const FIREBASE_CONFIG = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
  emulatorHost: process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080',
};

// コレクション名
export const COLLECTIONS = {
  USERS: 'users',
  CONTENTS: 'contents',
  PAYMENTS: 'payments',
  CONTENT_ACCESS: 'contentAccess',
} as const;