import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase-admin';
import type { Content } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { title, preview, content, price, tier, creatorAddress } = await request.json();
    
    if (!title || !preview || !content || !creatorAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newContent: Content = {
      id: crypto.randomUUID(),
      title,
      preview,
      content,
      fullContent: content,
      price: price || 0,
      tier: tier || 0,
      creatorAddress,
      createdAt: Date.now(),
    };
    
    // Save to Firestore
    try {
      await adminDb.collection(COLLECTIONS.CONTENTS).doc(newContent.id).set(newContent);
    } catch (dbError) {
      console.error('Failed to save to Firestore:', dbError);
      // In development, continue even if Firestore fails
    }
    
    return NextResponse.json({
      success: true,
      contentId: newContent.id,
      content: newContent,
    });
  } catch (error) {
    console.error('Content creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}