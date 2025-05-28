import { NextRequest, NextResponse } from 'next/server';
import { createUserSession } from '@/lib/session';
import { getUser, createUser } from '@/lib/firebase-admin';
import { generateAAWallet } from '@/lib/aa-wallet';

export async function GET(request: NextRequest) {
  try {
    const session = await createUserSession();
    const userId = session.userId!;

    // Check if user exists in Firestore
    let user = await getUser(userId);

    if (!user) {
      // Generate AA wallet for new user
      const { address, privateKey } = await generateAAWallet(userId);
      
      // Store user data in Firestore
      await createUser(userId, {
        aaWalletAddress: address,
        // In production, store privateKey encrypted or use key management service
        privateKey,
      });

      user = {
        aaWalletAddress: address,
      };
    }

    return NextResponse.json({
      userId,
      aaWalletAddress: user.aaWalletAddress,
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}