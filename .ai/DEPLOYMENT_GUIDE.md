# DEPLOYMENT GUIDE - LOCAL DEVELOPMENT

## Prerequisites

### Development Environment
- Node.js 18+
- Git
- Hardhat (for smart contract development)

### Current Setup
- Mock implementation (no external services required)
- In-memory data storage
- Local development only

## Local Configuration

### Mock Setup
```javascript
// Current implementation uses mock data
// No external blockchain connection required
// All data stored in memory during development
```

## Environment Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd 402_payment
```

### 2. Install Dependencies
```bash
# Install application dependencies
cd application
npm install

# Install smart contract dependencies
cd ../web3
npm install
```

### 3. No Environment Variables Required
Current mock implementation doesn't require any external API keys or environment variables.

## Smart Contract Development

### 1. Compile Contracts
```bash
cd web3
npx hardhat compile
```

### 2. Test Contracts (if tests exist)
```bash
npx hardhat test
```

### 3. Current Contract Status
- Basic contracts implemented in `/web3/contracts/`
- No deployment scripts yet
- Mock implementation for development

## Application Development

### 1. Start Development Server
```bash
cd application
npm run dev
```

### 2. Access Application
- Open http://localhost:3000
- Test 402 payment flow with mock data
- No database setup required (uses in-memory storage)

## Future Deployment

### When ready for production:
1. Replace mock database with real database
2. Add environment variables for external services
3. Deploy smart contracts to testnet/mainnet
4. Configure production deployment (Vercel, etc.)

## Current Development Status

### Working Features:
1. **402 Payment API**: Returns proper 402 status for premium content
2. **Mock Account Abstraction**: Simulated AA wallet functionality
3. **Content Management**: Create and access tiered content
4. **Payment Simulation**: Mock payment execution

### API Endpoints Available:
- `GET /api/resource/[id]` - Content access (returns 402 for premium)
- `POST /api/payment/execute` - Mock payment execution
- `POST /api/account/create` - Create mock AA account
- `GET /api/content/list` - List available content

## Development Guidelines

### 1. Code Structure
- Keep mock implementations clearly labeled
- Prepare for real implementation by using interfaces
- Document all mock behavior

### 2. Testing
- Test 402 flow manually via browser
- Use curl to test API endpoints
- Verify mock payment execution

### 3. Next Development Steps
- Implement real blockchain connectivity
- Add persistent database storage
- Create proper authentication system

## Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
cd application
rm -rf node_modules package-lock.json
npm install
```

#### 2. API Endpoints Not Working
```bash
# Check if server is running
curl http://localhost:3000/api/health

# Test 402 endpoint
curl http://localhost:3000/api/resource/content-1
```

#### 3. Mock Data Issues
- All data resets when server restarts (in-memory storage)
- Check console logs for detailed error messages
- Verify API request format

## Current Limitations

### Development Phase Limitations
- No persistent data storage
- No real blockchain integration
- Mock payment system only
- No user authentication
- In-memory data only

### Future Enhancements Needed
- Real database integration
- Actual smart contract deployment
- User authentication system
- Production deployment setup