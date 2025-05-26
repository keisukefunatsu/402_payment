import { NextRequest, NextResponse } from 'next/server';
import { getContent, hasContentAccess } from '@/lib/api/db';
import { mockResources } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resourceId = params.id;
  const userId = request.headers.get('x-user-id');
  
  try {
    // Try to get content from Firestore
    let content;
    let hasAccess = false;
    
    try {
      content = await getContent(resourceId);
      if (content && userId) {
        hasAccess = await hasContentAccess(userId, resourceId);
      }
    } catch (dbError) {
      console.log('Firestore failed, using mock data:', dbError);
      // Fall back to mock data
      content = mockResources.find(r => r.id === resourceId);
      hasAccess = content?.tier === 0; // Free content
    }
    
    if (!content) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    // Check if content requires payment
    if (content.tier > 0 && !hasAccess) {
      return new NextResponse(
        JSON.stringify({
          preview: content.preview,
          message: 'Payment required for full content',
          resourceId: content.id,
          price: content.price,
        }),
        {
          status: 402,
          headers: {
            'Content-Type': 'application/json',
            'X-Payment-Address': '0x' + '0'.repeat(40), // Mock payment address
            'X-Payment-Amount': content.price.toString(),
            'X-Payment-Currency': 'ETH',
            'X-Payment-Network': 'base-sepolia',
            'X-Resource-Id': content.id,
          },
        }
      );
    }
    
    // Return full content
    return NextResponse.json({
      id: content.id,
      title: content.title,
      content: content.fullContent || content.content,
      tier: content.tier,
    });
  } catch (error) {
    console.error('Resource fetch failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}