const axios = require('axios');

const PIMLICO_API_KEY = 'pim_CtQtca5ce55fKWnFtVeHJQ';
const SPONSORSHIP_POLICY_ID = 'sp_zealous_mcclintock';

async function testSponsorshipPolicy() {
  try {
    // Test 1: Check API key validity
    console.log('1. Testing API key...');
    const gasResponse = await axios.post(
      `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`,
      {
        jsonrpc: '2.0',
        method: 'pimlico_getUserOperationGasPrice',
        params: [],
        id: 1
      }
    );
    console.log('✅ API key is valid');
    console.log('Gas prices:', gasResponse.data.result);

    // Test 2: Check sponsorship policy
    console.log('\n2. Testing sponsorship policy...');
    console.log('Policy ID:', SPONSORSHIP_POLICY_ID);
    
    // Note: Actual sponsorship policy validation happens during UserOperation submission
    console.log('⚠️  Sponsorship policy validation occurs during transaction execution');
    console.log('   Make sure the policy is:');
    console.log('   - Active in the dashboard');
    console.log('   - Has sufficient balance');
    console.log('   - Configured for Base Sepolia network');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSponsorshipPolicy();