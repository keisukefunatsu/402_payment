import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 基本的な動作確認
    const testData: any = {
      message: 'API is working',
      timestamp: new Date().toISOString(),
      emulator: process.env.FIRESTORE_EMULATOR_HOST || 'not set',
      environment: process.env.NODE_ENV || 'development',
    };

    // Firebase Admin SDKをダイナミックインポート
    try {
      const { adminDb } = await import('@/lib/firebase-admin');
      testData.firebaseAdmin = 'loaded';

      // Firestoreへの接続テスト（エラーを許容）
      try {
        await adminDb.collection('test').doc('connection').set({
          tested: true,
          timestamp: Date.now(),
        });
        testData.firestoreStatus = 'connected';
      } catch (dbError: any) {
        testData.firestoreStatus = 'not connected';
        testData.firestoreError = dbError.message;
      }
    } catch (importError: any) {
      testData.firebaseAdmin = 'failed to load';
      testData.adminError = importError.message;
    }

    return NextResponse.json(testData);
  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}