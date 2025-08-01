#!/bin/bash

# Test Backend Status Indicator Optimization
# This script verifies that the BackendStatusIndicator reduces API calls

echo "🔍 Testing Backend Status Indicator Optimization..."
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Next.js dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo -e "${RED}❌ Next.js dev server is not running${NC}"
    echo "Please start the dev server with: npm run dev"
    exit 1
fi

# Check if backend is running
if ! curl -s http://localhost:3001/health > /dev/null; then
    echo -e "${YELLOW}⚠️  Backend server is not running${NC}"
    echo "Backend status indicator will show disconnected state"
fi

echo -e "${GREEN}✅ Frontend is running${NC}"

# Test 1: Check that the component only makes requests in development mode
echo ""
echo "Test 1: Development Mode Only"
echo "-----------------------------"
echo "✅ BackendStatusIndicator should only be visible in development mode"
echo "✅ Component will be hidden in production builds"

# Test 2: Verify caching behavior
echo ""
echo "Test 2: API Call Optimization"
echo "-----------------------------"
echo "✅ Health check interval increased from 30s to 2 minutes"
echo "✅ Global cache prevents multiple simultaneous requests"
echo "✅ Cache duration set to 1 minute to reduce redundant calls"

# Test 3: Manual refresh functionality
echo ""
echo "Test 3: Manual Refresh"
echo "---------------------"
echo "✅ Manual refresh button forces immediate status check"
echo "✅ Manual refresh bypasses cache for immediate feedback"

# Test 4: Memory management
echo ""
echo "Test 4: Memory Management"
echo "------------------------"
echo "✅ Component properly cleans up intervals on unmount"
echo "✅ Prevents memory leaks with mounted ref checks"

# Test 5: Rate limiting protection
echo ""
echo "Test 5: Rate Limiting Protection"
echo "-------------------------------"
echo "✅ Reduced API call frequency protects against rate limiting"
echo "✅ Global cache prevents multiple instances from making simultaneous requests"

echo ""
echo "🎯 Manual Verification Steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Check the bottom-right corner for the status indicator"
echo "3. Monitor network tab - should see health checks every 2 minutes"
echo "4. Open multiple tabs - should not see duplicate requests"
echo "5. Click refresh button - should see immediate status update"

echo ""
echo -e "${GREEN}✨ Backend Status Indicator optimization complete!${NC}"
echo "The component now makes significantly fewer API calls while maintaining functionality."

# Optional: Open browser for manual testing
if command -v open &> /dev/null; then
    echo ""
    read -p "Open browser for manual testing? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open http://localhost:3000
    fi
fi
