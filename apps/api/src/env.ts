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
  /** How long a login session lasts. */
  SESSION_DAYS: z.coerce.number().int().positive().default(7),
  /** Send the session cookie over HTTPS only (on by default in production). */
  COOKIE_SECURE: z.stringbool().optional(),
  /** 'lax' when the app and API share a site; 'none' (with HTTPS) when they don't. */
  COOKIE_SAMESITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  /** Comma-separated list of allowed frontend origins. */
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  /** SMTP server, e.g. smtp://localhost:1025 (Mailpit) or smtps://user:pass@host:465. */
  SMTP_URL: z.string().optional(),
  MAIL_FROM: z.string().default('Kidty <no-reply@kidty.local>'),
  /** Where messages from the support form are sent. */
  SUPPORT_EMAIL: z.email().default('support@kidty.local'),
  /** Public URL of the frontend, used in password reset links. */
  APP_URL: z.url().default('http://localhost:3000'),
});

export const env = schema.parse(process.env);
