import { createHash, randomBytes } from 'node:crypto';

/** Returns a random URL-safe token and the hash to store in the database. */
export function createResetToken() {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

export const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');
