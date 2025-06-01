#!/bin/bash

# Test health API with verbose output
echo "Testing Health API..."
echo "===================="

# Show request details
echo "Request: GET http://localhost:3000/api/health"
echo ""

# Make request with verbose headers
curl -v http://localhost:3000/api/health 2>&1 | grep -E "(^>|^<|HTTP|{)"

echo ""
echo "===================="

# Test with different paths
echo -e "\nTesting variations:"
echo "1. /api/health"
curl -s -o /dev/null -w "   Status: %{http_code}\n" http://localhost:3000/api/health

echo "2. /api/health/"
curl -s -o /dev/null -w "   Status: %{http_code}\n" http://localhost:3000/api/health/

echo "3. /api/user/wallet"
curl -s -o /dev/null -w "   Status: %{http_code}\n" http://localhost:3000/api/user/wallet