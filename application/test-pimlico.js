const { createPublicClient, http } = require('viem');
const { baseSepolia } = require('viem/chains');
const { createPimlicoClient } = require('permissionless/clients/pimlico');

const PIMLICO_API_KEY = 'pim_CtQtca5ce55fKWnFtVeHJQ';
const pimlicoUrl = `https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`;

async function testPimlico() {
  try {
    console.log('Creating Pimlico client...');
    const pimlicoClient = createPimlicoClient({
      transport: http(pimlicoUrl),
      entryPoint: {
        address: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
        version: '0.7',
      },
    });

    console.log('Getting gas price...');
    const gasPrice = await pimlicoClient.getUserOperationGasPrice();
    console.log('Gas price:', gasPrice);

    console.log('Pimlico client is working correctly!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testPimlico();