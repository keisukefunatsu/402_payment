const axios = require('axios');

const PIMLICO_API_KEY = 'pim_CtQtca5ce55fKWnFtVeHJQ';
const POLICY_ID = 'sp_parched_lethal_legion';

async function debugPimlicoPolicy() {
  try {
    console.log('=== Pimlico Policy Debug ===\n');
    
    // 1. Check API key
    console.log('1. Checking API key validity...');
    const gasResponse = await axios.post(
      `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`,
      {
        jsonrpc: '2.0',
        method: 'pimlico_getUserOperationGasPrice',
        params: [],
        id: 1
      }
    );
    console.log('✅ API key is valid\n');
    
    // 2. Get account balance
    console.log('2. Checking account balance...');
    // Note: This endpoint might require authentication
    console.log('⚠️  You need to check your balance in the Pimlico dashboard');
    console.log('   Go to: https://dashboard.pimlico.io');
    console.log('   Look for "Balance" or "Credits" section');
    console.log('   If balance is 0, click "Add Balance" to top up\n');
    
    // 3. Policy requirements
    console.log('3. Policy Requirements:');
    console.log('   ✅ Policy ID: ' + POLICY_ID);
    console.log('   ⚠️  Policy must be "active" status');
    console.log('   ⚠️  Must have positive balance in dashboard');
    console.log('   ⚠️  Spending Authorization must be claimed/active');
    console.log('   ⚠️  Chain must be set to "Base Sepolia"');
    
    console.log('\n4. Next Steps:');
    console.log('   1. Go to https://dashboard.pimlico.io');
    console.log('   2. Add balance to your account (click "Add Balance")');
    console.log('   3. Ensure policy is set to "active"');
    console.log('   4. Ensure Spending Authorization is active');
    console.log('   5. Run test again');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugPimlicoPolicy();