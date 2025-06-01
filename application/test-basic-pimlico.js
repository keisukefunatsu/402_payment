const axios = require('axios');

const PIMLICO_API_KEY = 'pim_CtQtca5ce55fKWnFtVeHJQ';

async function testBasicPimlico() {
  console.log('=== Testing Basic Pimlico API ===\n');
  
  const chains = [
    { name: 'Base Sepolia', url: 'https://api.pimlico.io/v2/base-sepolia/rpc' },
    { name: 'Polygon', url: 'https://api.pimlico.io/v2/137/rpc' },
    { name: 'Sepolia', url: 'https://api.pimlico.io/v2/sepolia/rpc' },
  ];
  
  for (const chain of chains) {
    console.log(`\nTesting ${chain.name}:`);
    console.log(`URL: ${chain.url}?apikey=${PIMLICO_API_KEY}`);
    
    try {
      // Test 1: Gas Price
      const gasResponse = await axios.post(
        `${chain.url}?apikey=${PIMLICO_API_KEY}`,
        {
          jsonrpc: '2.0',
          method: 'pimlico_getUserOperationGasPrice',
          params: [],
          id: 1
        }
      );
      console.log('✅ Gas price:', JSON.stringify(gasResponse.data.result, null, 2));
      
      // Test 2: Get supported EntryPoints
      const entryPointsResponse = await axios.post(
        `${chain.url}?apikey=${PIMLICO_API_KEY}`,
        {
          jsonrpc: '2.0',
          method: 'eth_supportedEntryPoints',
          params: [],
          id: 2
        }
      );
      console.log('✅ Supported EntryPoints:', entryPointsResponse.data.result);
      
    } catch (error) {
      console.log('❌ Error:', error.response?.data || error.message);
    }
  }
  
  console.log('\n=== Sponsorship Policy Info ===');
  console.log('Policy ID: sp_parched_lethal_legion');
  console.log('Authorization ID: spw_TTtfGKdmaV5sWwp1');
  console.log('Grant Amount Remaining: $1');
  
  console.log('\n=== Possible Issues ===');
  console.log('1. Wrong chain configuration (should be Base Sepolia)');
  console.log('2. Authorization not properly linked to your API key');
  console.log('3. Authorization expired or inactive');
  console.log('4. Need to whitelist your wallet address');
}

testBasicPimlico();