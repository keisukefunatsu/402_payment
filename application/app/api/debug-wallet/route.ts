import { NextRequest, NextResponse } from 'next/server';
import { createUserSession } from '@/lib/session';
import { getUser, createUser } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Step 1: Create session
    const session = await createUserSession();
    const userId = session.userId!;
    
    // Step 2: Check if user exists
    let user = await getUser(userId);
    
    if (user) {
      return NextResponse.json({
        step: 'User exists',
        userId,
        user
      });
    }
    
    // Step 3: Try to generate AA wallet (simplified for debugging)
    const mockWalletAddress = `0x${userId.substring(0, 40).padEnd(40, '0')}`;
    
    // Step 4: Create user in Firestore
    await createUser(userId, {
      aaWalletAddress: mockWalletAddress,
      privateKey: 'mock-private-key-for-testing',
    });
    
    return NextResponse.json({
      step: 'User created',
      userId,
      aaWalletAddress: mockWalletAddress,
      message: 'Mock wallet created for debugging'
    });
    
  } catch (error) {
    console.error('Debug wallet error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}