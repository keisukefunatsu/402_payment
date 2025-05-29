import { NextRequest, NextResponse } from 'next/server';
import { db, collections } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Test Firestore connection
    const testDoc = await db.collection('test').doc('connection').set({
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    
    // Try to read it back
    const readBack = await db.collection('test').doc('connection').get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      data: readBack.exists ? readBack.data() : null,
      collections: collections
    });
  } catch (error) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}