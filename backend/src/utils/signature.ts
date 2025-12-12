import { ed25519 } from '@noble/curves/ed25519.js';

/**
 * Verify a Cardano wallet signature using CIP-8 and CIP-30 standards
 *
 * This implements proper Ed25519 signature verification for Cardano wallet authentication.
 * The wallet signs the nonce using their private key, and we verify it using the public key.
 *
 * @param walletAddress - The wallet address that signed the message
 * @param nonce - The original nonce message that was signed
 * @param signature - The signature to verify (hex string from CIP-30 signData)
 * @param key - The public key used for signing (hex string from CIP-30 signData)
 * @returns true if signature is cryptographically valid
 */
export async function verifyCardanoSignature(
  walletAddress: string,
  nonce: string,
  signature: string,
  key: string
): Promise<boolean> {
  try {
    // Validate inputs
    if (!signature || typeof signature !== 'string') {
      console.warn('[Security] Invalid signature format');
      return false;
    }

    if (!key || typeof key !== 'string') {
      console.warn('[Security] Invalid public key format');
      return false;
    }

    if (!walletAddress.startsWith('addr1')) {
      console.warn('[Security] Invalid wallet address format');
      return false;
    }

    // Validate hex format
    const hexRegex = /^[0-9a-fA-F]+$/;
    if (!hexRegex.test(signature) || !hexRegex.test(key)) {
      console.warn('[Security] Signature or key is not valid hex');
      return false;
    }

    // Convert hex strings to Uint8Array
    const signatureBytes = hexToBytes(signature);
    const publicKeyBytes = hexToBytes(key);

    // The message that was signed is the nonce converted to bytes
    const encoder = new TextEncoder();
    const messageBytes = encoder.encode(nonce);

    // Verify Ed25519 signature using @noble/curves
    // CIP-30 wallets sign the message bytes directly using Ed25519
    const isValid = ed25519.verify(signatureBytes, messageBytes, publicKeyBytes);

    if (isValid) {
      console.log(
        '[Security] ✓ Signature verified for wallet:',
        walletAddress.substring(0, 15) + '...'
      );
    } else {
      console.warn(
        '[Security] ✗ Invalid signature for wallet:',
        walletAddress.substring(0, 15) + '...'
      );
    }

    return isValid;
  } catch (error) {
    console.error('[Security] Signature verification error:', error);
    return false;
  }
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}
