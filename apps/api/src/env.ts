import { z } from 'zod';

// Tests provide their own environment (see vitest.config.ts).
if (process.env.NODE_ENV !== 'test') {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file (e.g. in production) — rely on real environment variables.
  }
}

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().default(8088),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  /** Comma-separated list of allowed frontend origins. */
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  /** Public URL of the frontend, used in password reset links. */
  APP_URL: z.url().default('http://localhost:3000'),
});

export const env = schema.parse(process.env);
