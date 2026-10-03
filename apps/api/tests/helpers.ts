import { afterAll, beforeAll, beforeEach } from 'vitest';
import { buildApp, type App } from '../src/app.js';
import { prisma } from '../src/db.js';

export function setupApp(options: { rateLimit?: boolean } = {}) {
  const ctx = {} as { app: App };

  beforeAll(async () => {
    ctx.app = await buildApp({ rateLimit: options.rateLimit ?? false });
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE users, support_requests RESTART IDENTITY CASCADE'
    );
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  return ctx;
}

let counter = 0;

/** Registers a user and returns auth headers for it. */
export async function signUp(app: App, overrides: { email?: string } = {}) {
  const email = overrides.email ?? `user${++counter}@example.com`;
  const password = 'correct-horse-battery';

  const registration = await app.inject({
    method: 'POST',
    url: '/api/auth/registration',
    payload: { name: 'Марія', email, password, repeatPassword: password },
  });
  if (registration.statusCode !== 201) {
    throw new Error(`Registration failed: ${registration.body}`);
  }

  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email, password },
  });

  return {
    email,
    password,
    headers: { authorization: `Bearer ${login.json().token}` },
  };
}

export const childPayload = {
  name: 'Злата',
  surname: 'Тестова',
  birth: '9-8-2020',
  genderName: 'Дівчинка',
  image: 2,
};
