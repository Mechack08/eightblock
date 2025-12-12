import type { Request, Response } from 'express';
import { prisma } from '@/prisma/client';
import { signToken } from '@/utils/jwt';
import { generateNonce, verifyAndConsumeNonce } from '@/utils/nonce';
import { verifyCardanoSignature } from '@/utils/signature';

// Step 1: Request a nonce for wallet authentication
export async function requestNonce(req: Request, res: Response) {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  // Validate wallet address format (Cardano addresses start with addr1)
  if (!walletAddress.startsWith('addr1')) {
    return res.status(400).json({ error: 'Invalid Cardano wallet address format' });
  }

  try {
    const nonce = generateNonce(walletAddress);

    // Return just the nonce - wallet will sign it directly
    return res.json({
      nonce,
      message: `Authenticate with Eight Block\nNonce: ${nonce}`, // Human readable message
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return res.status(500).json({ error: 'Failed to generate authentication challenge' });
  }
}

// Step 2: Verify signature and authenticate
export async function walletAuth(req: Request, res: Response) {
  const { walletAddress, nonce, signature, key } = req.body;

  if (!walletAddress || !nonce || !signature || !key) {
    return res.status(400).json({
      error: 'Wallet address, nonce, signature, and key are required',
    });
  }

  // Validate wallet address format
  if (!walletAddress.startsWith('addr1')) {
    return res.status(400).json({ error: 'Invalid Cardano wallet address format' });
  }

  try {
    // Verify the nonce is valid and not expired
    const isNonceValid = verifyAndConsumeNonce(walletAddress, nonce);
    if (!isNonceValid) {
      return res.status(401).json({
        error: 'Invalid or expired nonce. Please request a new authentication challenge.',
      });
    }

    // Verify the signature (validates cryptographic proof of wallet ownership)
    const isSignatureValid = await verifyCardanoSignature(walletAddress, nonce, signature, key);
    if (!isSignatureValid) {
      return res.status(401).json({
        error: 'Invalid signature. Wallet ownership verification failed.',
      });
    }

    // Find or create user with this wallet address
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      select: { id: true, walletAddress: true, name: true, role: true },
    });

    if (!user) {
      // Create new user with wallet address
      user = await prisma.user.create({
        data: {
          walletAddress,
          name: `User ${walletAddress.substring(0, 8)}...`,
          role: 'WRITER',
        },
        select: { id: true, walletAddress: true, name: true, role: true },
      });
    }

    // Generate JWT token with enhanced security
    const token = signToken({
      userId: user.id,
      role: user.role,
      walletAddress: user.walletAddress,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Wallet auth error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
