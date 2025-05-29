import { NextRequest, NextResponse } from 'next/server';
import { createUserSession } from '@/lib/session';
import { getUser, grantContentAccess, db, collections } from '@/lib/firebase-admin';
import { createAAClient } from '@/lib/aa-wallet';

// This is a mock creator address - in production, get from content creator
const CREATOR_ADDRESS = '0x742D35cC6634C0532925a3b844Bc9e7595f2Bd7e' as const;

export async function POST(request: NextRequest) {
  try {
    const session = await createUserSession();
    const userId = session.userId!;
    
    const { contentId } = await request.json();

    if (!contentId) {
      return NextResponse.json(
        { error: 'Content ID required' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await getUser(userId);
    if (!user || !user.privateKey) {
      return NextResponse.json(
        { error: 'Wallet not initialized' },
        { status: 400 }
      );
    }

    // Get content data
    const contentDoc = await db.collection(collections.contents).doc(contentId).get();
    if (!contentDoc.exists) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const content = contentDoc.data()!;
    const priceInWei = BigInt(content.price);

    // Create AA client
    const smartAccountClient = await createAAClient(user.privateKey);

    // Send payment transaction
    const hash = await smartAccountClient.sendTransaction({
      to: CREATOR_ADDRESS,
      value: priceInWei,
      data: '0x',
    });

    // Record payment in Firestore
    await db.collection(collections.payments).add({
      contentId,
      payerId: userId,
      amount: content.price,
      txHash: hash,
      status: 'completed',
      createdAt: new Date(),
    });

    // Grant access to content
    await grantContentAccess(contentId, userId);

    return NextResponse.json({
      success: true,
      txHash: hash,
      message: 'Payment successful',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Payment failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}