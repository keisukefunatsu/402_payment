import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/mockDatabase';

export async function GET(request: NextRequest) {
  try {
    // Get contents from mock database
    const contents = await mockDb.contents.list();
    
    // Return only preview information for listing
    const contentList = contents.map(content => ({
      id: content.id,
      title: content.title,
      preview: content.preview,
      price: content.price,
      tier: content.tier,
      creatorAddress: content.creatorAddress,
      createdAt: content.createdAt,
    }));
    
    return NextResponse.json({
      contents: contentList,
      total: contentList.length,
    });
  } catch (error) {
    console.error('Content listing failed:', error);
    return NextResponse.json(
      { error: 'Failed to list contents' },
      { status: 500 }
    );
  }
}