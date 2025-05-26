# COMMANDS HISTORY & DEVELOPMENT WORKFLOW

## Initial Setup

### 1. Project Initialization
```bash
# Create project structure
mkdir 402_payment && cd 402_payment
mkdir application web3

# Initialize Next.js application
cd application
pnpm create next-app@latest . --typescript --tailwind --app

# Initialize smart contracts
cd ../web3
forge init --no-git

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

# Core dependencies
pnpm add wagmi viem @rainbow-me/rainbowkit ethers@^6
pnpm add @pimlico/permissionless @pimlico/bundler-client
pnpm add @prisma/client prisma
pnpm add axios ipfs-http-client
pnpm add @tanstack/react-query

# Dev dependencies
pnpm add -D @types/node
```

#### Smart Contract Dependencies
```bash
cd web3
forge install OpenZeppelin/openzeppelin-contracts
forge install eth-infinitism/account-abstraction
forge install foundry-rs/forge-std
```

## Development Commands

### Smart Contract Development

#### Build & Test
```bash
# Build contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testCreateContent -vvvv

# Format code
forge fmt
```

#### Local Deployment
```bash
# Start local node
anvil --chain-id 31337

# Deploy to local
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url http://localhost:8545 \
    --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
    --broadcast
```

#### Base Sepolia Deployment
```bash
# Deploy to Base Sepolia
forge script script/Deploy.s.sol:DeployScript \
    --rpc-url https://sepolia.base.org \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify

# Verify single contract
forge verify-contract \
    --chain-id 84532 \
    --num-of-optimizations 200 \
    CONTRACT_ADDRESS \
    src/ContentRegistry.sol:ContentRegistry
```

### Application Development

#### Development Server
```bash
cd application

# Start development server
pnpm dev

# Start with specific port
pnpm dev -p 3001

# Start with debug mode
NODE_OPTIONS='--inspect' pnpm dev
```

#### Database Management
```bash
# Create migration
pnpm prisma migrate dev --name add_user_table

# Apply migrations
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset

# Open Prisma Studio
pnpm prisma studio

# Generate Prisma Client
pnpm prisma generate
```

#### Build & Production
```bash
# Build application
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm build && pnpm analyze

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## Testing Commands

### Smart Contract Testing
```bash
# Run all tests
forge test

# Run with coverage
forge coverage

# Fork testing
forge test --fork-url https://sepolia.base.org

# Fuzz testing
forge test --fuzz-runs 10000
```

### Application Testing
```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

## Utility Commands

### Blockchain Interactions

#### Check Balances
```bash
# Check ETH balance
cast balance 0xYourAddress --rpc-url https://sepolia.base.org

# Check in wei
cast balance 0xYourAddress --rpc-url https://sepolia.base.org --raw
```

#### Send Transactions
```bash
# Send ETH
cast send 0xRecipientAddress --value 0.1ether --private-key $PRIVATE_KEY

# Call contract function
cast send $CONTRACT_ADDRESS "createContent(string,uint256,uint256)" \
    "QmHash" 1000000000000000 1 \
    --private-key $PRIVATE_KEY
```

#### Read Contract Data
```bash
# Read public variable
cast call $CONTRACT_ADDRESS "contents(uint256)" 1

# Decode response
cast call $CONTRACT_ADDRESS "getContent(uint256)" 1 | cast --abi-decode "getContent(uint256)(address,string,uint256,uint256,bool)"
```

### IPFS Commands
```bash
# Add file to IPFS
ipfs add content.json

# Pin content
ipfs pin add QmYourHash

# Get content
ipfs cat QmYourHash
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/add-subscription-tiers

# Commit with conventional commits
git add .
git commit -m "feat: add subscription tier management"

# Push and create PR
git push -u origin feature/add-subscription-tiers
gh pr create --title "Add subscription tiers" --body "Implements monthly subscription model"
```

## Debugging Commands

### Smart Contract Debugging
```bash
# Debug transaction
cast run $TX_HASH --rpc-url https://sepolia.base.org

# Trace transaction
cast trace $TX_HASH --rpc-url https://sepolia.base.org

# Get transaction receipt
cast receipt $TX_HASH --rpc-url https://sepolia.base.org
```

### Application Debugging
```bash
# Debug Next.js
NODE_OPTIONS='--inspect' pnpm dev

# Debug specific file
node --inspect-brk node_modules/.bin/next dev

# Check bundle size
ANALYZE=true pnpm build
```

## Maintenance Commands

### Dependency Updates
```bash
# Check outdated packages
pnpm outdated

# Update dependencies
pnpm update

# Update to latest
pnpm update --latest

# Security audit
pnpm audit
```

### Performance Monitoring
```bash
# Lighthouse CI
lighthouse http://localhost:3000 --view

# Bundle analysis
pnpm build:analyze

# Memory profiling
node --inspect-brk --expose-gc node_modules/.bin/next build
```

## Production Commands

### Deployment
```bash
# Deploy to Vercel
vercel --prod

# Deploy with environment
vercel --prod --env NODE_ENV=production

# Check deployment
vercel ls
```

### Monitoring
```bash
# Check logs
vercel logs

# Check function logs
vercel logs --function api/content

# Monitor in real-time
vercel logs --follow
```

## Common Workflows

### 1. Adding New Feature
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Update smart contracts if needed
cd web3
# Make changes
forge test
forge build

# 3. Update application
cd ../application
# Make changes
pnpm dev
# Test changes

# 4. Run tests
pnpm test
cd ../web3 && forge test

# 5. Commit and push
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature
```

### 2. Deploying Updates
```bash
# 1. Deploy smart contracts (if changed)
cd web3
forge script script/Deploy.s.sol:DeployScript --broadcast

# 2. Update environment variables
# Update contract addresses in .env

# 3. Deploy application
cd ../application
vercel --prod

# 4. Verify deployment
# Check application
# Test transactions
```

### 3. Debugging Production Issue
```bash
# 1. Check logs
vercel logs --follow

# 2. Check blockchain state
cast call $CONTRACT_ADDRESS "getState()"

# 3. Check database
pnpm prisma studio

# 4. Test locally with production data
vercel env pull .env.local
pnpm dev
```

## Aliases & Shortcuts

Add to your shell profile (`.zshrc` or `.bashrc`):

```bash
# Project shortcuts
alias 402dev="cd ~/Projects/402_payment && code ."
alias 402app="cd ~/Projects/402_payment/application"
alias 402web3="cd ~/Projects/402_payment/web3"

# Common commands
alias pdev="pnpm dev"
alias pbuild="pnpm build"
alias ftest="forge test"
alias fbuild="forge build"

# Deployment
alias deploy-local="forge script script/Deploy.s.sol:DeployScript --rpc-url http://localhost:8545 --broadcast"
alias deploy-sepolia="forge script script/Deploy.s.sol:DeployScript --rpc-url https://sepolia.base.org --broadcast"
```