import jwt from 'jsonwebtoken';

// Fail fast if JWT_SECRET is not set in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('CRITICAL: JWT_SECRET must be set in production environment');
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'insecure-secret-for-development-only';
const EXPIRES_IN = '7d';

export interface TokenPayload {
  userId: string;
  role: string;
  walletAddress?: string;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
    issuer: 'eightblock',
    audience: 'eightblock-api',
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'eightblock',
    audience: 'eightblock-api',
  }) as TokenPayload;
}
