# COMMANDS HISTORY & DEVELOPMENT WORKFLOW

## Initial Setup

### 1. Project Initialization
```bash
# Create project structure
mkdir 402_payment && cd 402_payment
mkdir application web3

# Initialize Next.js application
cd application
npm create next-app@latest . --typescript --tailwind --app

# Initialize web3 with Hardhat (current setup)
cd ../web3
npm init -y
npm install --save-dev hardhat
npx hardhat init

# Initialize git repository
cd ..
git init
git add .
git commit -m "Initial project setup"
```

### 2. Install Dependencies

#### Application Dependencies
```bash
cd application

# Current dependencies
npm install wagmi viem
npm install axios
npm install --save-dev @types/node
```

#### Smart Contract Dependencies
```bash
cd web3
npm install @openzeppelin/contracts
npm install hardhat @nomiclabs/hardhat-ethers ethers
```

## Development Commands

### Smart Contract Development

#### Build & Test
```bash
# Build contracts
npx hardhat compile

# Run tests
npx hardhat test

# Clean build artifacts
npx hardhat clean
```

#### Local Deployment
```bash
# Start local node
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost
```

### Application Development

#### Development Server
```bash
cd application

# Start development server
npm run dev

# Start with specific port
npm run dev -- -p 3001
```

#### Build & Production
```bash
# Build application
npm run build

# Start production server
npm start

# Type checking
npm run build

# Linting
npm run lint
```

## Testing Commands

### Smart Contract Testing
```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/PaymentManager.test.js
```

### Application Testing
```bash
# Currently using development testing
npm run dev
# Manual testing via browser at http://localhost:3000
```

## Utility Commands

### Current Implementation Status
```bash
# Check application status
cd application && npm run dev

# View mock data implementation
cat application/lib/mockDatabase.ts

# Check 402 payment implementation
curl -X GET http://localhost:3000/api/resource/content-1
```

### Git Workflow
```bash
# Standard workflow
git add .
git commit -m "Update implementation"
git push
```

## Debugging Commands

### Application Debugging
```bash
# Debug Next.js
NODE_OPTIONS='--inspect' npm run dev

# Check logs
tail -f .next/server.log
```

## Maintenance Commands

### Dependency Updates
```bash
# Check outdated packages
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
```

## Common Workflows

### 1. Adding New Feature
```bash
# 1. Update application
cd application
# Make changes to components/api
npm run dev
# Test changes via browser

# 2. Update smart contracts if needed
cd ../web3
# Edit contracts in contracts/ directory
npx hardhat compile
npx hardhat test

# 3. Commit changes
git add .
git commit -m "feat: add new feature"
```

### 2. Testing 402 Payment Flow
```bash
# 1. Start development server
cd application
npm run dev

# 2. Test API endpoints
curl -X GET http://localhost:3000/api/resource/content-1
# Should return 402 for premium content

# 3. Test payment execution
curl -X POST http://localhost:3000/api/payment/execute \
  -H "Content-Type: application/json" \
  -d '{"resourceId":"content-1","amount":"0.001"}'
```

## Aliases & Shortcuts

Add to your shell profile (`.zshrc` or `.bashrc`):

```bash
# Project shortcuts
alias 402dev="cd ~/Projects/personal/402_payment && code ."
alias 402app="cd ~/Projects/personal/402_payment/application"
alias 402web3="cd ~/Projects/personal/402_payment/web3"

# Common commands
alias ndev="npm run dev"
alias nbuild="npm run build"
alias htest="npx hardhat test"
alias hcompile="npx hardhat compile"
```