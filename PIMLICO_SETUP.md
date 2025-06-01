# Pimlico Paymaster Setup Guide

## Overview
This guide explains how to set up Pimlico's paymaster for sponsoring gas fees in the 402 Payment application.

## Current Issue
The application is experiencing a "pm_getPaymasterStubData method not found" error because:
1. The method `pm_getPaymasterStubData` is specific to Biconomy's paymaster
2. Pimlico uses different methods: `pm_sponsorUserOperation` and `pm_getPaymasterData`
3. The sponsorship configuration needs to be properly set up

## Setup Steps

### 1. Create a Sponsorship Policy (Recommended)
1. Go to [Pimlico Dashboard](https://dashboard.pimlico.io)
2. Navigate to "Sponsorship Policies"
3. Create a new policy with:
   - Name: "402 Payment Base Sepolia"
   - Chain: Base Sepolia
   - Set limits as needed (e.g., max sponsorship per user, per operation)
4. Copy the policy ID (format: `sp_xxxxx`)

### 2. Environment Variables
Add the following to your `.env.local`:
```bash
# Required
PIMLICO_API_KEY=your_api_key_here

# Optional - only if using sponsorship policies
PIMLICO_SPONSORSHIP_POLICY_ID=sp_your_policy_id_here
```

### 3. Without Sponsorship Policy
If you don't want to use a sponsorship policy, Pimlico will use their default verifying paymaster. This means:
- Gas will be sponsored based on your API key's quota
- No custom limits or rules
- Simpler setup but less control

## Implementation Details

### Current Code Structure
The application now properly configures:
1. **Pimlico Client**: Handles both bundler and paymaster operations
2. **Gas Estimation**: Uses `getUserOperationGasPrice().fast` for proper fee estimation
3. **Paymaster Context**: Conditionally adds sponsorship policy if configured

### Key Changes Made
1. Fixed the client initialization to use the correct Pimlico client
2. Added proper gas estimation configuration
3. Added support for optional sponsorship policies
4. Updated transaction sending to include paymaster context

## Testing the Setup

### 1. Check API Key
```bash
curl https://api.pimlico.io/v2/base-sepolia/rpc?apikey=YOUR_API_KEY \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"pimlico_getUserOperationGasPrice","params":[],"id":1}'
```

### 2. Test with Application
```bash
# Start the application
pnpm dev

# Run the test script
./test-api.sh
```

### 3. Debug Information
Enable debug mode by setting:
```bash
DEBUG=permissionless:*
```

## Common Issues

### 1. Method Not Found Error
- **Cause**: Using Biconomy-specific methods with Pimlico
- **Solution**: Ensure you're using Pimlico's methods

### 2. Sponsorship Rejected
- **Cause**: No sponsorship policy or exceeded limits
- **Solution**: Create a policy or increase limits

### 3. Invalid Entry Point
- **Cause**: Wrong entry point address for the chain
- **Solution**: Use `0x0000000071727De22E5E9d8BAf0edAc6f37da032` for v0.7

## Resources
- [Pimlico Documentation](https://docs.pimlico.io)
- [Permissionless.js Docs](https://docs.pimlico.io/permissionless)
- [Sponsorship Policies Guide](https://docs.pimlico.io/infra/platform/sponsorship-policies)