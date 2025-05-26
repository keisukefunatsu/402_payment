import { NextRequest, NextResponse } from 'next/server';
import { createAccount } from '@/lib/mockAccountAbstraction';
import { mockDb } from '@/lib/mockDatabase';

export async function POST(request: NextRequest) {
  try {
    const { owner } = await request.json();
    
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner address is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await mockDb.users.getByAddress(owner);
    if (existingUser) {
      return NextResponse.json({
        account: existingUser.aaWalletAddress || owner,
        balance: existingUser.balance,
        isDeployed: !!existingUser.aaWalletAddress,
      });
    }
    
    // Create AA account
    const accountInfo = await createAccount(owner);
    
    // Save to mock database
    const user = await mockDb.users.create(owner, accountInfo.account);
    
    return NextResponse.json({
      account: accountInfo.account,
      balance: user.balance,
      isDeployed: accountInfo.isDeployed,
    });
  } catch (error) {
    console.error('Account creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}