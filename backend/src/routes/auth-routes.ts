import { Router } from 'express';
import { z } from 'zod';
import { walletAuth, requestNonce } from '@/controllers/auth-controller';
import { validateBody } from '@/middleware/validate';
import { authLimiter, nonceLimiter } from '@/middleware/rate-limit';

const router = Router();

const requestNonceSchema = z.object({
  walletAddress: z.string().min(10).startsWith('addr1', 'Must be a valid Cardano address'),
});

const walletAuthSchema = z.object({
  walletAddress: z.string().min(10).startsWith('addr1', 'Must be a valid Cardano address'),
  nonce: z.string().min(1),
  signature: z.string().min(1),
  key: z.string().min(1),
});

// Step 1: Request authentication nonce (rate limited)
router.post('/wallet/nonce', nonceLimiter, validateBody(requestNonceSchema), requestNonce);

// Step 2: Authenticate with signature (strict rate limiting)
router.post('/wallet', authLimiter, validateBody(walletAuthSchema), walletAuth);

export default router;
