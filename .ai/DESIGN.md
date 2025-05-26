# TECHNICAL DESIGN SPECIFICATION

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  API Routes      │────▶│ Smart Contracts │
│   (Frontend)    │     │  (402 Handler)   │     │   (Base Sepolia)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                         │
         │                       │                         │
         ▼                       ▼                         ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Wagmi + Viem   │     │   PostgreSQL     │     │  Account Factory│
│  (Web3 Client)  │     │   (Metadata)     │     │  (AA Wallets)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Smart Contract Architecture

### 1. Account Abstraction Components

```solidity
// IAccount.sol - ERC-4337 Account Interface
interface IAccount {
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 missingAccountFunds
    ) external returns (uint256 validationData);
}

// AccountFactory.sol - Deploys AA wallets
contract AccountFactory {
    function createAccount(
        address owner,
        uint256 salt
    ) external returns (address account);
}

// Paymaster.sol - Sponsors gas fees
contract Paymaster is IPaymaster {
    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) external returns (bytes memory context, uint256 validationData);
}
```

### 2. Content Management Contracts

```solidity
// ContentRegistry.sol
contract ContentRegistry {
    struct Content {
        address creator;
        string ipfsHash;
        uint256 price;
        uint256 tier; // 0: free, 1: premium, 2: exclusive
        bool active;
    }
    
    mapping(uint256 => Content) public contents;
    mapping(address => uint256[]) public userContents;
    
    function createContent(
        string memory ipfsHash,
        uint256 price,
        uint256 tier
    ) external returns (uint256 contentId);
    
    function purchaseAccess(uint256 contentId) external payable;
}

// PaymentProcessor.sol
contract PaymentProcessor {
    uint256 public constant PLATFORM_FEE = 500; // 5%
    
    function processPayment(
        address creator,
        uint256 amount
    ) external payable {
        uint256 platformCut = (amount * PLATFORM_FEE) / 10000;
        uint256 creatorCut = amount - platformCut;
        
        payable(creator).transfer(creatorCut);
        // Platform fee handling
    }
}
```

## 402 Payment Flow Implementation

### 1. HTTP 402 Response Structure

```typescript
// API Route: /api/content/[id]
export async function GET(request: Request) {
    const contentId = request.params.id;
    const content = await getContent(contentId);
    
    if (content.tier > 0 && !hasAccess(user, contentId)) {
        return new Response(
            JSON.stringify({
                preview: content.preview,
                message: "Payment required for full content"
            }),
            {
                status: 402,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Payment-Address': PAYMENT_CONTRACT_ADDRESS,
                    'X-Payment-Amount': content.price.toString(),
                    'X-Payment-Currency': 'ETH',
                    'X-Payment-Network': 'base-sepolia',
                    'X-Content-Id': contentId
                }
            }
        );
    }
    
    return Response.json({ content: content.full });
}
```

### 2. Client-Side Payment Handler

```typescript
// hooks/use402Payment.ts
export function use402Payment() {
    const { data: walletClient } = useWalletClient();
    const { address } = useAccount();
    
    const handlePayment = async (response: Response) => {
        if (response.status !== 402) return response;
        
        const paymentAddress = response.headers.get('X-Payment-Address');
        const amount = response.headers.get('X-Payment-Amount');
        const contentId = response.headers.get('X-Content-Id');
        
        // Create UserOperation for AA wallet
        const userOp = await buildUserOperation({
            sender: address,
            callData: encodePaymentCall(contentId, amount),
            paymaster: PAYMASTER_ADDRESS
        });
        
        // Send through bundler
        const txHash = await sendUserOperation(userOp);
        await waitForTransaction(txHash);
        
        // Retry original request
        return fetch(response.url);
    };
    
    return { handlePayment };
}
```

## Account Abstraction Integration

### 1. Wallet Creation Flow

```typescript
// services/aaWallet.ts
export class AAWalletService {
    private bundlerClient: BundlerClient;
    private paymasterClient: PaymasterClient;
    
    async createWallet(owner: Address): Promise<Address> {
        const initCode = concat([
            ACCOUNT_FACTORY_ADDRESS,
            encodeFunctionData({
                abi: AccountFactoryABI,
                functionName: 'createAccount',
                args: [owner, generateSalt()]
            })
        ]);
        
        const walletAddress = await this.bundlerClient.getSenderAddress(initCode);
        return walletAddress;
    }
    
    async sendTransaction(
        to: Address,
        value: bigint,
        data: Hex
    ): Promise<Hash> {
        const userOp = await this.buildUserOperation({
            sender: this.walletAddress,
            callData: encodeFunctionData({
                abi: AccountABI,
                functionName: 'execute',
                args: [to, value, data]
            })
        });
        
        // Get paymaster signature
        const paymasterData = await this.paymasterClient.sponsorUserOperation(userOp);
        userOp.paymasterAndData = paymasterData;
        
        return this.bundlerClient.sendUserOperation(userOp);
    }
}
```

### 2. Paymaster Configuration

```typescript
// config/paymaster.ts
export const paymasterConfig = {
    // Pimlico Paymaster
    url: 'https://api.pimlico.io/v2/base-sepolia/rpc',
    
    // Sponsorship rules
    rules: [
        {
            // Sponsor all content purchases under 0.001 ETH
            condition: 'value < 0.001 ETH',
            sponsorshipType: 'full'
        },
        {
            // Partial sponsorship for larger transactions
            condition: 'value >= 0.001 ETH',
            sponsorshipType: 'partial',
            sponsorshipAmount: '50%'
        }
    ]
};
```

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    address VARCHAR(42) UNIQUE NOT NULL,
    aa_wallet_address VARCHAR(42),
    username VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contents table
CREATE TABLE contents (
    id UUID PRIMARY KEY,
    creator_id UUID REFERENCES users(id),
    ipfs_hash VARCHAR(66) NOT NULL,
    preview TEXT,
    price DECIMAL(18, 8),
    tier INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    content_id UUID REFERENCES contents(id),
    payer_id UUID REFERENCES users(id),
    amount DECIMAL(18, 8),
    tx_hash VARCHAR(66),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Access control
CREATE TABLE content_access (
    user_id UUID REFERENCES users(id),
    content_id UUID REFERENCES contents(id),
    expires_at TIMESTAMP,
    PRIMARY KEY (user_id, content_id)
);
```

## API Endpoints

### Content Management
- `GET /api/content` - List all content (with previews)
- `GET /api/content/[id]` - Get specific content (402 if premium)
- `POST /api/content` - Create new content
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

### Payment Processing
- `POST /api/payment/initiate` - Start payment flow
- `POST /api/payment/confirm` - Confirm on-chain payment
- `GET /api/payment/history` - User payment history

### User Management
- `POST /api/auth/connect` - Connect wallet
- `POST /api/auth/create-aa-wallet` - Deploy AA wallet
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## Security Considerations

### 1. Smart Contract Security
- Use OpenZeppelin contracts as base
- Implement reentrancy guards
- Rate limiting on payment functions
- Multi-sig admin controls

### 2. API Security
- JWT authentication
- Request signing with wallet
- Rate limiting per wallet
- CORS configuration

### 3. Content Security
- IPFS content validation
- Malware scanning
- NSFW detection
- Community reporting

## Performance Optimizations

### 1. Caching Strategy
- Redis for session management
- CDN for static content
- IPFS gateway caching
- Database query caching

### 2. Scalability
- Horizontal scaling for API
- Database read replicas
- Queue system for heavy operations
- Bundler load balancing

### 3. Gas Optimization
- Batch operations in AA wallet
- Efficient contract storage
- Minimal on-chain data
- Off-chain signatures