// Test specific authorization ID
const { createPublicClient, http, parseEther } = require('viem');
const { baseSepolia } = require('viem/chains');
const { createPimlicoClient } = require('permissionless/clients/pimlico');
const { privateKeyToAccount } = require('viem/accounts');
const { toSafeSmartAccount } = require('permissionless/accounts');

const PIMLICO_API_KEY = 'pim_CtQtca5ce55fKWnFtVeHJQ';
const POLICY_ID = 'sp_parched_lethal_legion';
const AUTHORIZATION_ID = 'spw_TTtfGKdmaV5sWwp1';

async function testAuthorization() {
  try {
    console.log('=== Testing Pimlico Authorization ===\n');
    console.log('Policy ID:', POLICY_ID);
    console.log('Authorization ID:', AUTHORIZATION_ID);
    console.log('API Key:', PIMLICO_API_KEY ? 'Set' : 'Missing');
    
    // Create test account
    const owner = privateKeyToAccount('0x' + '1'.repeat(64));
    console.log('\nTest owner address:', owner.address);
    
    // Create clients
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http('https://base-sepolia-rpc.publicnode.com'),
    });
    
    const pimlicoUrl = `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;
    const pimlicoClient = createPimlicoClient({
      transport: http(pimlicoUrl),
      entryPoint: {
        address: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        version: '0.7',
      },
    });
    
    // Create Safe account
    const safeAccount = await toSafeSmartAccount({
      client: publicClient,
      owners: [owner],
      version: '1.4.1',
      entryPoint: {
        address: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        version: '0.7',
      },
    });
    
    console.log('Safe account address:', safeAccount.address);
    
    // Test user operation with different context formats
    const testOp = {
      sender: safeAccount.address,
      nonce: BigInt(0),
      callData: '0x',
      callGasLimit: BigInt(100000),
      verificationGasLimit: BigInt(100000),
      preVerificationGas: BigInt(100000),
      maxFeePerGas: BigInt(1000000000),
      maxPriorityFeePerGas: BigInt(1000000),
      paymasterAndData: '0x',
      signature: '0x',
    };
    
    console.log('\n=== Testing Different Context Formats ===\n');
    
    // Test 1: With sponsorshipPolicyId only
    console.log('1. Testing with sponsorshipPolicyId only...');
    try {
      const result1 = await pimlicoClient.sponsorUserOperation({
        userOperation: testOp,
        sponsorshipPolicyId: POLICY_ID,
      });
      console.log('✅ Success with policy ID only');
    } catch (e) {
      console.log('❌ Failed:', e.message);
    }
    
    // Test 2: With authorization ID
    console.log('\n2. Testing with authorizationId...');
    try {
      const result2 = await pimlicoClient.sponsorUserOperation({
        userOperation: testOp,
        sponsorshipPolicyId: POLICY_ID,
        authorizationId: AUTHORIZATION_ID,
      });
      console.log('✅ Success with authorization ID');
    } catch (e) {
      console.log('❌ Failed:', e.message);
    }
    
    // Test 3: Different context structure
    console.log('\n3. Testing with context object...');
    try {
      const result3 = await pimlicoClient.sponsorUserOperation({
        userOperation: testOp,
        context: {
          sponsorshipPolicyId: POLICY_ID,
          authorizationId: AUTHORIZATION_ID,
        },
      });
      console.log('✅ Success with context object');
    } catch (e) {
      console.log('❌ Failed:', e.message);
    }
    
    console.log('\n=== Recommendations ===');
    console.log('1. Check if the authorization ID is correct');
    console.log('2. Verify the authorization is active and not expired');
    console.log('3. Ensure the authorization is for Base Sepolia chain');
    console.log('4. Check if you need to be whitelisted for this authorization');
    
  } catch (error) {
    console.error('\n❌ General error:', error);
  }
}

testAuthorization();