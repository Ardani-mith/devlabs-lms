#!/bin/bash

echo "🔄 Testing Rate Limit Handling"
echo "=============================="
echo ""

echo "📋 This script will make multiple rapid requests to test rate limiting"
echo ""

BASE_URL="http://localhost:4300"
ENDPOINT="/courses"

echo "🚀 Making rapid requests to trigger rate limiting..."
echo ""

for i in {1..15}; do
  echo "Request $i:"
  response=$(curl -s -w "HTTPSTATUS:%{http_code}" "$BASE_URL$ENDPOINT")
  http_code=$(echo $response | sed -e 's/.*HTTPSTATUS://')
  body=$(echo $response | sed -e 's/HTTPSTATUS:.*//g')
  
  if [ "$http_code" -eq 200 ]; then
    echo "  ✅ Success (200)"
  elif [ "$http_code" -eq 429 ]; then
    echo "  ⚠️  Rate Limited (429)"
    # Check for Retry-After header
    retry_after=$(curl -s -I "$BASE_URL$ENDPOINT" | grep -i "retry-after" | cut -d' ' -f2 | tr -d '\r')
    if [ ! -z "$retry_after" ]; then
      echo "     Retry-After: $retry_after seconds"
    fi
  else
    echo "  ❌ Error ($http_code)"
  fi
  
  # Small delay between requests
  sleep 0.1
done

echo ""
echo "🎯 Expected Behavior:"
echo "   • First ~10 requests: Success (200)"
echo "   • Remaining requests: Rate Limited (429)"
echo "   • Frontend should automatically retry with backoff"
echo ""

echo "💡 Now test in browser:"
echo "   1. Open: http://localhost:4301/courses"
echo "   2. If you see rate limit error, click 'Coba Lagi'"
echo "   3. Should automatically retry with delays"
echo "   4. Eventually should succeed and load courses"
