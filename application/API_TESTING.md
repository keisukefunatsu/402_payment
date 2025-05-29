# API Testing Guide

This guide explains how to test the 402 Payment API endpoints.

## Quick Start

```bash
# Make sure the development server is running
pnpm dev

# Run the API test script
./test-api.sh
```

## API Endpoints

### 1. Health Check
- **URL**: `GET /api/health`
- **Purpose**: Check if the API is running and configured correctly
- **Response**: System status and configuration info

### 2. User Wallet
- **URL**: `GET /api/user/wallet`
- **Purpose**: Get or create an AA wallet for the current session
- **Response**: User ID and AA wallet address

### 3. Content Management
- **Create**: `POST /api/content`
  ```json
  {
    "title": "Article Title",
    "preview": "Preview text",
    "content": "Full content",
    "price": 0.001
  }
  ```
- **List**: `GET /api/content`

### 4. Payment Process
- **URL**: `POST /api/payment/process`
- **Body**: `{ "contentId": "content-id-here" }`
- **Status**: Currently failing due to Paymaster configuration

## Session Management

The API uses cookie-based sessions. The test script automatically handles cookies to maintain session state across requests.

## Current Issues

1. **Payment Processing**: The payment endpoint is returning an error due to Paymaster not being properly funded or configured on Base Sepolia.

2. **Required Environment Variables**:
   - `PIMLICO_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `SESSION_SECRET`

## Next Steps

1. Configure Pimlico Paymaster with funds on Base Sepolia
2. Implement frontend UI for content display and payment
3. Add 402 Payment Required status handling
4. Deploy to production environment