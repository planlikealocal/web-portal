#!/bin/bash

# Test script for Specialists API endpoint
# This script tests the /api/mobile/v1/specialists endpoint

# Configuration - Update these values
API_BASE_URL="${API_BASE_URL:-http://localhost:8000}"
TOKEN="${TOKEN:-your_token_here}"
SPECIALIST_IDS="${SPECIALIST_IDS:-1,2,3}"

echo "=========================================="
echo "Testing Specialists API Endpoint"
echo "=========================================="
echo ""
echo "API Base URL: $API_BASE_URL"
echo "Endpoint: /api/mobile/v1/specialists?ids=$SPECIALIST_IDS"
echo ""

# Test without authentication (public endpoint if available)
echo "Test 1: Without authentication"
echo "----------------------------"
curl -X GET \
  "$API_BASE_URL/api/mobile/v1/specialists?ids=$SPECIALIST_IDS" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' || echo "Response (raw):"
echo ""

# Test with authentication
if [ "$TOKEN" != "your_token_here" ]; then
  echo "Test 2: With authentication"
  echo "----------------------------"
  curl -X GET \
    "$API_BASE_URL/api/mobile/v1/specialists?ids=$SPECIALIST_IDS" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -w "\n\nHTTP Status: %{http_code}\n" \
    -s | jq '.' || echo "Response (raw):"
  echo ""
fi

echo "=========================================="
echo "Check profile_pic field in response"
echo "=========================================="
echo ""
echo "Look for 'profile_pic' field in the response above."
echo "It should be a full URL like:"
echo "  - https://images.unsplash.com/... (for seeded data)"
echo "  - http://localhost:8000/storage/specialists/... (for uploaded images)"
echo ""
