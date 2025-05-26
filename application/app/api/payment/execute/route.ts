import { NextRequest, NextResponse } from 'next/server';
import { executeUserOperation } from '@/lib/mockAccountAbstraction';
import { recordPayment, getUserByAddress } from '@/lib/api/db';

export async function POST(request: NextRequest) {
  try {
    const { resourceId, amount, from } = await request.json();
    
    if (!resourceId || !amount || !from) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Execute mock payment
    const result = await executeUserOperation({
      sender: from,
      target: '0x' + '0'.repeat(40), // Mock payment address
      value: amount,
      data: '0x',
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Payment failed' },
        { status: 400 }
      );
    }
    
    // Record payment in Firestore
    try {
      const user = await getUserByAddress(from);
      if (user) {
        await recordPayment(
          user.id,
          resourceId,
          amount,
          result.transactionHash
        );
      }
    } catch (dbError) {
      console.log('Failed to record payment in Firestore:', dbError);
      // Continue even if Firestore fails
    }
    
    return NextResponse.json({
      success: true,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
    });
  } catch (error) {
    console.error('Payment execution failed:', error);
    return NextResponse.json(
      { error: 'Failed to execute payment' },
      { status: 500 }
    );
  }
}