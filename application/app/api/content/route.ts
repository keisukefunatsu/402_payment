import { NextRequest, NextResponse } from 'next/server';
import { getSession, createUserSession } from '@/lib/session';
import { db, collections } from '@/lib/firebase-admin';
import { parseEther } from 'viem';

// GET /api/content - List all contents
export async function GET(request: NextRequest) {
  try {
    if (!db.collection) {
      return NextResponse.json({ contents: [] });
    }
    
    const contentsSnapshot = await db.collection(collections.contents).get();
    
    const contents = contentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Don't include full content in list
      content: undefined,
    }));

    return NextResponse.json({ contents });
  } catch (error) {
    console.error('Error listing contents:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/content - Create new content
export async function POST(request: NextRequest) {
  try {
    const session = await createUserSession();
    const userId = session.userId!;
    
    const body = await request.json();
    const { title, preview, content, price } = body;

    if (!title || !preview || !content || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!db.collection) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      );
    }

    // Create content document
    const contentRef = await db.collection(collections.contents).add({
      creatorId: userId,
      title,
      preview,
      content,
      price: parseEther(price.toString()).toString(), // Store as Wei
      createdAt: new Date(),
    });

    return NextResponse.json({ 
      id: contentRef.id,
      message: 'Content created successfully' 
    });
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}