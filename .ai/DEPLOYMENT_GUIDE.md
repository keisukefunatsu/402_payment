# DEPLOYMENT GUIDE - BASE SEPOLIA

## Prerequisites

### Development Environment
- Node.js 18+ and pnpm
- Git
- Foundry (for smart contract deployment)
- Docker (optional, for local services)

### Accounts & Services
- Base Sepolia ETH (get from faucet)
- Pimlico API key (for bundler/paymaster)
- Alchemy/Infura API key (for RPC)
- IPFS service (Pinata/Infura)
- PostgreSQL database

## Base Sepolia Configuration

### Network Details
```javascript
export const baseSepoliaConfig = {
    chainId: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
        },
        public: {
            http: ['https://sepolia.base.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BaseScan',
            url: 'https://sepolia.basescan.org',
        },
    },
    testnet: true,
};
```

### Faucets
- Base Sepolia Faucet: https://docs.base.org/tools/network-faucets
- Alchemy Faucet: https://sepoliafaucet.com/
- Coinbase Wallet Faucet: In-app faucet for Base Sepolia

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/402-payment-microblog
cd 402-payment-microblog
```

### 2. Environment Variables
Create `.env.local` in the application directory:

```env
# Base Sepolia RPC
NEXT_PUBLIC_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
NEXT_PUBLIC_CHAIN_ID=84532

# Smart Contract Addresses (after deployment)
NEXT_PUBLIC_ACCOUNT_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_CONTENT_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_PROCESSOR_ADDRESS=0x...
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x...

# Pimlico (Bundler & Paymaster)
PIMLICO_API_KEY=your_pimlico_api_key
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/base-sepolia/rpc

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/microblog

# IPFS
IPFS_API_URL=https://ipfs.infura.io:5001
IPFS_API_KEY=your_ipfs_key
IPFS_API_SECRET=your_ipfs_secret
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# API Keys
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLATFORM_FEE_PERCENTAGE=5
```

## Smart Contract Deployment

### 1. Install Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Deploy Contracts
```bash
cd web3
forge install OpenZeppelin/openzeppelin-contracts
forge install eth-infinitism/account-abstraction

# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url $BASE_SEPOLIA_RPC \
    --private-key $DEPLOYER_PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $BASESCAN_API_KEY
```

### 3. Deployment Script
```solidity
// script/Deploy.s.sol
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/AccountFactory.sol";
import "../src/ContentRegistry.sol";
import "../src/PaymentProcessor.sol";
import "../src/Paymaster.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address entryPoint = 0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789;
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy AccountFactory
        AccountFactory factory = new AccountFactory(entryPoint);
        console.log("AccountFactory:", address(factory));
        
        // Deploy ContentRegistry
        ContentRegistry registry = new ContentRegistry();
        console.log("ContentRegistry:", address(registry));
        
        // Deploy PaymentProcessor
        PaymentProcessor processor = new PaymentProcessor(
            address(registry),
            500 // 5% platform fee
        );
        console.log("PaymentProcessor:", address(processor));
        
        // Deploy Paymaster
        Paymaster paymaster = new Paymaster(
            entryPoint,
            address(processor)
        );
        console.log("Paymaster:", address(paymaster));
        
        // Fund Paymaster
        payable(address(paymaster)).transfer(0.1 ether);
        
        vm.stopBroadcast();
    }
}
```

## Application Deployment

### 1. Install Dependencies
```bash
cd application
pnpm install
```

### 2. Database Setup
```bash
# Create database
createdb microblog_402

# Run migrations
pnpm prisma migrate deploy

# Seed initial data (optional)
pnpm prisma db seed
```

### 3. Build Application
```bash
pnpm build
```

### 4. Local Testing
```bash
# Development mode
pnpm dev

# Production mode
pnpm start
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
pnpm i -g vercel
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Configure Environment Variables
Set all environment variables in Vercel dashboard:
- Settings → Environment Variables
- Add all variables from `.env.local`

### 4. Configure Domains
- Add custom domain in Vercel dashboard
- Update NEXT_PUBLIC_APP_URL

## Post-Deployment Setup

### 1. Verify Smart Contracts
```bash
forge verify-contract \
    --chain-id 84532 \
    --num-of-optimizations 200 \
    --compiler-version v0.8.19 \
    CONTRACT_ADDRESS \
    src/ContractName.sol:ContractName \
    --etherscan-api-key $BASESCAN_API_KEY
```

### 2. Initialize Contracts
```javascript
// Initialize paymaster with funds
const paymaster = new ethers.Contract(PAYMASTER_ADDRESS, PaymasterABI, signer);
await signer.sendTransaction({
    to: PAYMASTER_ADDRESS,
    value: ethers.parseEther("1.0")
});

// Set platform wallet
const processor = new ethers.Contract(PROCESSOR_ADDRESS, ProcessorABI, signer);
await processor.setPlatformWallet(PLATFORM_WALLET_ADDRESS);
```

### 3. Configure IPFS Pinning
```javascript
// Setup automatic pinning
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(PINATA_API_KEY, PINATA_SECRET_KEY);

// Test connection
const result = await pinata.testAuthentication();
console.log(result);
```

## Monitoring & Maintenance

### 1. Setup Monitoring
- **Uptime**: UptimeRobot or Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Plausible
- **Smart Contract Events**: The Graph or Alchemy Webhooks

### 2. Regular Maintenance
- Monitor paymaster balance
- Check gas price fluctuations
- Update dependencies monthly
- Review security advisories

### 3. Backup Procedures
- Database: Daily automated backups
- IPFS: Pin important content to multiple services
- Smart Contracts: Keep deployment artifacts

## Troubleshooting

### Common Issues

#### 1. Paymaster Out of Funds
```bash
# Check balance
cast balance $PAYMASTER_ADDRESS --rpc-url $BASE_SEPOLIA_RPC

# Top up
cast send $PAYMASTER_ADDRESS --value 1ether --private-key $PRIVATE_KEY
```

#### 2. RPC Rate Limits
- Use multiple RPC providers
- Implement request caching
- Add retry logic with backoff

#### 3. IPFS Gateway Timeout
- Use multiple gateway URLs
- Implement local IPFS node
- Cache frequently accessed content

## Security Checklist

### Pre-Launch
- [ ] Smart contract audit completed
- [ ] Penetration testing performed
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Content Security Policy set

### Post-Launch
- [ ] Monitor for suspicious activity
- [ ] Regular security updates
- [ ] Incident response plan ready
- [ ] Bug bounty program active

## Scaling Considerations

### When to Scale
- >1000 daily active users
- >10,000 daily transactions
- Response time >2 seconds
- Database CPU >80%

### Scaling Options
1. **Horizontal Scaling**: Multiple API instances
2. **Database Scaling**: Read replicas
3. **Caching Layer**: Redis cluster
4. **CDN**: CloudFlare or Fastly
5. **IPFS Cluster**: Multiple pinning nodes

## Cost Estimation (Monthly)

### Infrastructure
- Vercel Pro: $20
- Database (Supabase): $25
- IPFS (Pinata): $20
- RPC (Alchemy Growth): $49

### Blockchain Costs
- Paymaster funding: ~0.5 ETH
- Contract deployment: ~0.1 ETH
- Monitoring services: $50

**Total: ~$200/month + ETH costs**