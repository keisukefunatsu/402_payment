import { createPublicClient, http, createWalletClient, Hex } from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import { 
  createSmartAccountClient
} from 'permissionless';
import { toSafeSmartAccount } from 'permissionless/accounts';
import { createPimlicoClient } from 'permissionless/clients/pimlico';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';

// Constants
const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY!;
const ENTRYPOINT_ADDRESS = ENTRYPOINT_ADDRESS_V07;

// Create clients
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org'),
});

const pimlicoClient = createPimlicoClient({
  transport: http(`https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
  entryPoint: {
    address: ENTRYPOINT_ADDRESS,
    version: '0.7',
  },
});

// Generate AA wallet for a user
export async function generateAAWallet(userId: string) {
  // Generate a deterministic private key for the user
  // In production, use a secure key derivation method
  const privateKey = generatePrivateKey();
  const signer = privateKeyToAccount(privateKey);
  
  // Create wallet client
  const walletClient = createWalletClient({
    account: signer,
    chain: baseSepolia,
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  });
  
  // Create Safe smart account
  const safeAccount = await toSafeSmartAccount({
    client: publicClient,
    owners: [signer],
    version: '1.4.1',
    entryPoint: {
      address: ENTRYPOINT_ADDRESS,
      version: '0.7',
    },
  });
  
  return {
    address: safeAccount.address,
    privateKey, // Store securely in production
  };
}

// Create smart account client for transactions
export async function createAAClient(privateKey: `0x${string}`) {
  const signer = privateKeyToAccount(privateKey);
  
  const safeAccount = await toSafeSmartAccount({
    client: publicClient,
    owners: [signer],
    version: '1.4.1',
    entryPoint: {
      address: ENTRYPOINT_ADDRESS,
      version: '0.7',
    },
  });
  
  const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    chain: baseSepolia,
    bundlerTransport: http(`https://api.pimlico.io/v2/base-sepolia/rpc?apikey=${PIMLICO_API_KEY}`),
    paymaster: pimlicoClient,
    userOperation: {
      estimateFeesPerGas: async () => {
        return {
          maxFeePerGas: BigInt(1000000),
          maxPriorityFeePerGas: BigInt(1000000),
        };
      },
    },
  });
  
  return smartAccountClient;
}