import crypto from 'crypto';

// In-memory nonce store (use Redis in production for scalability)
const nonceStore = new Map<string, { nonce: string; expiresAt: number }>();

// Clean up expired nonces every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [walletAddress, data] of nonceStore.entries()) {
      if (data.expiresAt < now) {
        nonceStore.delete(walletAddress);
      }
    }
  },
  5 * 60 * 1000
);

export function generateNonce(walletAddress: string): string {
  const nonce = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  nonceStore.set(walletAddress, { nonce, expiresAt });
  return nonce;
}

export function verifyAndConsumeNonce(walletAddress: string, nonce: string): boolean {
  const stored = nonceStore.get(walletAddress);

  if (!stored) {
    return false;
  }

  if (stored.nonce !== nonce) {
    return false;
  }

  if (stored.expiresAt < Date.now()) {
    nonceStore.delete(walletAddress);
    return false;
  }

  // Consume the nonce (one-time use)
  nonceStore.delete(walletAddress);
  return true;
}
