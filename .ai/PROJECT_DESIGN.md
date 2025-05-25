# X402 Payment App - Complete Design Documentation

## Project Overview
HTTP 402 Payment Required status implementation with Account Abstraction (ERC-4337) mock.

## System Architecture

### Technical Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **State Management**: In-memory (mock implementation)
- **Crypto Libraries**: ethers.js v6

### Project Structure
```
/402_payment/
├── app/
│   ├── api/
│   │   ├── account/create/route.ts  # Account creation API
│   │   ├── resource/[id]/route.ts   # 402 response API
│   │   └── payment/execute/route.ts # Payment execution API
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                     # Main page
├── components/
│   ├── AccountManager.tsx           # Account management UI
│   └── ResourceList.tsx             # Resource list and payment UI
├── lib/
│   ├── types.ts                     # TypeScript type definitions
│   └── mockAccountAbstraction.ts    # AA implementation
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Core Features

### 1. Account Creation
- Create AA wallet with initial balance of 1000 units
- Generate wallet address and manage nonce

### 2. 402 Payment Flow
```
1. User creates account
   → POST /api/account/create
   → AA wallet generation (initial balance: 1000)

2. Access protected resource
   → GET /api/resource/{id}
   → Returns 402 status with paymentRequest

3. Execute payment
   → POST /api/payment/execute
   → UserOperation validation
   → Balance deduction
   → Return resource content
```

### 3. Account Abstraction Implementation
- Simplified UserOperation structure
- Gas-less transaction simulation
- Mock signature validation

## Data Models

### Account
```typescript
{
  id: string              // Account identifier
  address: string         // Wallet address
  balance: number         // Balance
  nonce: number          // Transaction counter
  owner: string          // Owner name
}
```

### PaymentRequest
```typescript
{
  id: string              // Payment request ID
  resourceId: string      // Resource ID
  amount: number          // Required amount
  recipient: string       // Recipient address
  timestamp: number       // Timestamp
  status: string          // pending | completed | failed
}
```

### UserOperation (Simplified)
```typescript
{
  sender: string          // Sender address
  nonce: bigint          // Nonce
  callData: string       // Execution data
  signature: string      // Signature (unused in mock)
}
```

## API Specifications

### POST /api/account/create
**Request:**
```json
{ "owner": "string" }
```
**Response:**
```json
{
  "success": true,
  "account": { /* Account object */ }
}
```

### GET /api/resource/{id}
**Response (402):**
```json
{
  "error": "Payment Required",
  "paymentRequest": {
    "id": "string",
    "amount": number,
    "recipient": "string",
    "message": "string"
  }
}
```

### POST /api/payment/execute
**Request:**
```json
{
  "paymentId": "string",
  "accountId": "string",
  "userOperation": { /* UserOperation fields */ }
}
```
**Response:**
```json
{
  "success": true,
  "receipt": { /* PaymentReceipt */ },
  "resource": { /* ProtectedResource */ }
}
```

## UI Design

### Component Structure
- **AccountManager**: Account creation and display
  - Input: Owner name
  - Display: Account ID, address, balance
  
- **ResourceList**: Resource list and payment flow
  - Resource list display
  - 402 error payment request display
  - Payment execution button
  - Post-access content display

### Screen Flow
1. Account creation screen
2. Resource list display
3. 402 payment request modal
4. Post-payment content display

## Implementation Status

### Completed Work ✅
1. Next.js + TypeScript environment setup
2. Account abstraction interface creation
3. 402 payment API route implementation
4. UI components (AccountManager, ResourceList)
5. Mock account abstraction logic

### Running the Application
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Security Considerations (Mock Implementation)
- No actual cryptographic signatures implemented
- No private key generation
- All data stored in-memory

## Development Roadmap

### Phase 1 (Current) ✅
- [x] Basic 402 flow
- [x] Mock AA implementation
- [x] Simple UI

### Phase 2 (Future)
- [ ] Smart contract integration
- [ ] Paymaster implementation
- [ ] Signature verification
- [ ] Database integration
- [ ] Persistent data storage

### Phase 3
- [ ] Multi-chain support
- [ ] WebAuthn authentication
- [ ] Complex UserOperation handling

## Testing Strategy
- Unit tests: API routes
- Integration tests: Complete payment flow
- E2E tests: User scenarios

## Known Limitations
- Data is not persisted
- Not connected to actual blockchain
- Mock signature verification
- Single user support only

## Future Extensions
- Real smart contract integration
- Paymaster implementation
- More complex UserOperation validation
- Persistent data storage
- WebAuthn and other authentication features
- Multi-user support
- Real blockchain integration
- Advanced gas management