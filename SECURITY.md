# Wallet Authentication Security Implementation

## Overview

Eight Block implements a secure, challenge-response authentication system using Cardano wallet signatures. This prevents impersonation attacks and ensures only genuine wallet owners can authenticate.

## Security Features Implemented

### 1. **Signature Verification** ✅

- **Challenge-Response Flow**: Users must sign a unique nonce to prove wallet ownership
- **CIP-8 Compliance**: Uses Cardano Improvement Proposal 8 for standardized signature verification
- **One-Time Nonces**: Each nonce expires after 5 minutes and can only be used once

### 2. **JWT Token Security** ✅

- **Strong Secrets**: Production requires 64-byte random JWT secret (fails fast if missing)
- **Token Claims**: Includes `issuer` and `audience` for additional validation
- **7-Day Expiration**: Tokens expire automatically, requiring re-authentication
- **Wallet Address Binding**: Token includes wallet address to prevent token reuse

### 3. **Rate Limiting** ✅

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 attempts per 15 minutes (prevents brute force)
- **Nonce Requests**: 10 requests per 5 minutes (prevents nonce flooding)
- **Smart Counting**: Successful auth attempts don't count toward limit

### 4. **Security Headers** ✅

- **Helmet.js**: Comprehensive HTTP security headers
- **HSTS**: Forces HTTPS in production with 1-year max-age
- **CSP**: Content Security Policy prevents XSS attacks
- **CORS**: Restricted to allowed origins only
- **Payload Limits**: 10MB max to prevent memory exhaustion

### 5. **Input Validation** ✅

- **Zod Schemas**: Type-safe validation for all inputs
- **Address Format**: Validates Cardano address format (must start with `addr1`)
- **Required Fields**: Strict validation of nonce, signature, and key
- **Error Messages**: Clear, non-revealing error messages

## Authentication Flow

```
┌─────────┐                 ┌─────────┐                 ┌─────────┐
│         │                 │         │                 │         │
│ Wallet  │                 │Frontend │                 │ Backend │
│         │                 │         │                 │         │
└────┬────┘                 └────┬────┘                 └────┬────┘
     │                           │                           │
     │  1. Connect Wallet        │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │  2. Get Change Address    │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │  3. Request Nonce         │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │  4. Return Nonce+Message  │
     │                           │◄──────────────────────────┤
     │                           │                           │
     │  5. Sign Message          │                           │
     │◄──────────────────────────┤                           │
     │                           │                           │
     │  6. Return Signature+Key  │                           │
     ├──────────────────────────►│                           │
     │                           │                           │
     │                           │  7. Verify Signature      │
     │                           ├──────────────────────────►│
     │                           │                           │
     │                           │     ┌───────────────┐     │
     │                           │     │ Verify Nonce  │     │
     │                           │     │ Verify Sig    │     │
     │                           │     │ Create User   │     │
     │                           │     │ Generate JWT  │     │
     │                           │     └───────────────┘     │
     │                           │                           │
     │                           │  8. Return JWT Token      │
     │                           │◄──────────────────────────┤
     │                           │                           │
     │                           │  9. Store Token           │
     │                           ├───────────┐               │
     │                           │           │               │
     │                           │◄──────────┘               │
     │                           │                           │
```

## API Endpoints

### Request Nonce

```http
POST /api/auth/wallet/nonce
Content-Type: application/json

{
  "walletAddress": "addr1..."
}
```

**Response:**

```json
{
  "nonce": "abc123...",
  "message": "Sign this message to authenticate with Eight Block.\n\nNonce: abc123...\nTimestamp: 2025-12-12T..."
}
```

### Authenticate

```http
POST /api/auth/wallet
Content-Type: application/json

{
  "walletAddress": "addr1...",
  "nonce": "abc123...",
  "signature": "84582a...",
  "key": "a4010103..."
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "walletAddress": "addr1...",
    "name": "User addr1...",
    "role": "WRITER"
  }
}
```

## Environment Variables (Required for Production)

```bash
# Generate strong JWT secret
openssl rand -base64 64

# Set in .env
JWT_SECRET=<generated-secret>
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

## Security Checklist

- [x] Signature verification prevents wallet impersonation
- [x] Nonce expiration (5 minutes) prevents replay attacks
- [x] One-time use nonces prevent reuse attacks
- [x] Rate limiting prevents brute force attempts
- [x] JWT tokens expire after 7 days
- [x] Production requires strong JWT secret (fails fast if missing)
- [x] CORS restricted to allowed origins
- [x] Security headers (HSTS, CSP, etc.)
- [x] Input validation with Zod
- [x] Payload size limits (10MB max)
- [x] Address format validation

## Testing Security

### Test Valid Authentication

```bash
# 1. Request nonce
curl -X POST http://localhost:5000/api/auth/wallet/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"addr1..."}'

# 2. Sign the message with your wallet (via UI)

# 3. Submit signature
curl -X POST http://localhost:5000/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress":"addr1...",
    "nonce":"...",
    "signature":"...",
    "key":"..."
  }'
```

### Test Rate Limiting

```bash
# Try 6 auth attempts within 15 minutes - should get rate limited
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/wallet \
    -H "Content-Type: application/json" \
    -d '{"walletAddress":"addr1...","nonce":"fake","signature":"fake","key":"fake"}'
done
```

### Test Nonce Expiration

```bash
# Request nonce, wait 6 minutes, then try to use it - should fail
curl -X POST http://localhost:5000/api/auth/wallet/nonce \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"addr1..."}'

sleep 360

# This should fail with "Invalid or expired nonce"
curl -X POST http://localhost:5000/api/auth/wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"addr1...","nonce":"<old-nonce>","signature":"...","key":"..."}'
```

## Migration from Old Authentication

The old authentication endpoint (`POST /api/auth/wallet`) that only required a wallet address **has been replaced**. All clients must update to use the new two-step flow:

1. Request nonce: `POST /api/auth/wallet/nonce`
2. Submit signature: `POST /api/auth/wallet`

## Future Improvements

- [ ] Move nonce storage from memory to Redis for multi-server deployments
- [ ] Add session management with refresh tokens
- [ ] Implement account lockout after failed attempts
- [ ] Add audit logging for authentication events
- [ ] Support multiple wallet providers (Ethereum, Solana, etc.)
- [ ] Add 2FA option for high-security accounts
- [ ] Implement device fingerprinting
