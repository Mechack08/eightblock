#!/bin/bash

# Test script to verify signature verification security
# This demonstrates that fake signatures are now properly rejected

API_URL="http://localhost:5000/api"
WALLET_ADDRESS="addr1qyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqyqszqgpqy9f5g9"

echo "============================================"
echo "Testing Wallet Authentication Security"
echo "============================================"
echo ""

# Test 1: Request a nonce
echo "Test 1: Requesting nonce for wallet..."
NONCE_RESPONSE=$(curl -s -X POST "$API_URL/auth/wallet/nonce" \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"$WALLET_ADDRESS\"}")

echo "Response: $NONCE_RESPONSE"
NONCE=$(echo $NONCE_RESPONSE | jq -r '.nonce')
echo "Nonce received: $NONCE"
echo ""

# Test 2: Try to authenticate with FAKE signature (should FAIL)
echo "Test 2: Attempting authentication with FAKE signature..."
echo "Expected result: ❌ REJECTED (401 Invalid signature)"
echo ""

FAKE_AUTH_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$API_URL/auth/wallet" \
  -H "Content-Type: application/json" \
  -d "{
    \"walletAddress\":\"$WALLET_ADDRESS\",
    \"nonce\":\"$NONCE\",
    \"signature\":\"deadbeefcafebabe1234567890abcdef\",
    \"key\":\"fakepublickey9876543210fedcba\"
  }")

HTTP_STATUS=$(echo "$FAKE_AUTH_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$FAKE_AUTH_RESPONSE" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $HTTP_STATUS"
echo "Response: $RESPONSE_BODY"
echo ""

if [ "$HTTP_STATUS" = "401" ]; then
  echo "✅ SUCCESS: Fake signature properly rejected!"
  echo "🔒 Authentication is SECURE - attackers cannot forge signatures"
else
  echo "❌ CRITICAL VULNERABILITY: Fake signature was accepted!"
  echo "🚨 SECURITY BREACH - anyone can impersonate any wallet!"
fi

echo ""
echo "============================================"
echo "Security Test Complete"
echo "============================================"
echo ""
echo "NOTE: To test successful authentication, you need to:"
echo "1. Connect a real Cardano wallet in the frontend"
echo "2. The wallet will sign the nonce with your private key"
echo "3. Only with a valid signature will authentication succeed"
