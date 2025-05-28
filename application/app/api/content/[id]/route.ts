import { NextRequest, NextResponse } from 'next/server';
import { getSession, createUserSession } from '@/lib/session';
import { db, hasContentAccess, collections } from '@/lib/firebase-admin';
import { parseEther } from 'viem';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get or create session
    const session = await createUserSession();
    const userId = session.userId!;
    const contentId = params.id;

    // Get content from Firestore
    const contentDoc = await db.collection(collections.contents).doc(contentId).get();
    
    if (!contentDoc.exists) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    const content = contentDoc.data()!;

    // Check if user has access
    const hasAccess = await hasContentAccess(contentId, userId);

    if (hasAccess) {
      // Return full content
      return NextResponse.json({
        content: content.content,
        contentId: contentId,
      });
    }

    // Return 402 Payment Required
    const headers = new Headers();
    headers.set('X-Payment-Required', 'true');
    headers.set('X-Payment-Amount', '0.001'); // ETH
    headers.set('X-Payment-Currency', 'ETH');
    headers.set('X-Payment-Network', 'base-sepolia');
    headers.set('X-Content-Id', contentId);

    return NextResponse.json(
      {
        preview: content.preview,
        price: parseEther('0.001').toString(), // Convert to Wei
        contentId: contentId,
      },
      { 
        status: 402,
        headers 
      }
    );
  } catch (error) {
    console.error('Error in content API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}