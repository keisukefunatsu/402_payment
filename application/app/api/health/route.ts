import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const hasFirebaseConfig = !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
  
  const hasPimlicoConfig = !!process.env.PIMLICO_API_KEY;
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      firebase: hasFirebaseConfig ? 'configured' : 'missing',
      pimlico: hasPimlicoConfig ? 'configured' : 'missing',
      sessionSecret: process.env.SESSION_SECRET ? 'configured' : 'missing',
    },
    debug: {
      projectId: process.env.FIREBASE_PROJECT_ID?.substring(0, 10) + '...' || 'not set',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 20) + '...' || 'not set',
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    }
  });
}