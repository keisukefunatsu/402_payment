import { NextRequest, NextResponse } from 'next/server';
import { FIREBASE_CONFIG } from '@/lib/firebase-config';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    config: FIREBASE_CONFIG,
    timestamp: new Date().toISOString(),
  });
}