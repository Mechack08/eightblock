import { Router } from 'express';
import { z } from 'zod';
import { walletAuth, requestNonce } from '@/controllers/auth-controller';
import { validateBody } from '@/middleware/validate';
import { authLimiter, nonceLimiter } from '@/middleware/rate-limit';

const router = Router();

const requestNonceSchema = z.object({
  walletAddress: z
    .string()
    .min(10)
    .refine((addr) => addr.startsWith('addr1'), {
      message: 'Must be a valid Cardano address starting with addr1',
    }),
});

const walletAuthSchema = z.object({
  walletAddress: z
    .string()
    .min(10)
    .refine((addr) => addr.startsWith('addr1'), {
      message: 'Must be a valid Cardano address starting with addr1',
    }),
  nonce: z.string().min(1, 'Nonce is required'),
  signature: z.string().min(1, 'Signature is required'),
  key: z.string().min(1, 'Public key is required'),
});

// Step 1: Request authentication nonce (rate limited)
router.post('/wallet/nonce', nonceLimiter, validateBody(requestNonceSchema), requestNonce);

// Step 2: Authenticate with signature (strict rate limiting)
router.post('/wallet', authLimiter, validateBody(walletAuthSchema), walletAuth);

export default router;
