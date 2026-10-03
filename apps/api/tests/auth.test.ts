import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { hashToken } from '../src/lib/tokens.js';
import { setupApp, signUp } from './helpers.js';

describe('auth', () => {
  const ctx = setupApp();

  it('registers and logs in, storing only a password hash', async () => {
    const { email, password, headers } = await signUp(ctx.app, {
      email: '  Mixed@Example.com ',
    });

    expect(email.trim().toLowerCase()).toBe('mixed@example.com');
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: 'mixed@example.com' },
    });
    expect(user.passwordHash).not.toContain(password);
    expect(headers.cookie).toMatch(/^kidty_session=.+/);
  });

  it('rejects a duplicate email', async () => {
    const { email } = await signUp(ctx.app);
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/registration',
      payload: {
        name: 'Інша',
        email,
        password: 'another-password',
        repeatPassword: 'another-password',
      },
    });
    expect(res.statusCode).toBe(409);
    expect(res.json().code).toBe('emailTaken');
  });

  it('validates registration input with error codes per field', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/registration',
      payload: {
        name: '',
        email: 'not-an-email',
        password: 'short',
        repeatPassword: 'different',
      },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().code).toBe('validation');
    expect(res.json().errors).toEqual(
      expect.arrayContaining([
        { field: 'name', code: 'nameRequired' },
        { field: 'email', code: 'invalidEmail' },
        { field: 'password', code: 'passwordTooShort' },
        { field: 'repeatPassword', code: 'passwordsMismatch' },
      ])
    );
  });

  it('rejects wrong credentials', async () => {
    const { email } = await signUp(ctx.app);
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password: 'wrong-password' },
    });
    expect(res.statusCode).toBe(401);
    expect(res.json().code).toBe('invalidCredentials');
  });

  it('keeps the session in an httpOnly cookie, not in the response body', async () => {
    const { email, password } = await signUp(ctx.app);
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password },
    });
    const cookie = res.cookies.find((c) => c.name === 'kidty_session');
    expect(cookie).toMatchObject({ httpOnly: true, sameSite: 'Lax', path: '/' });
    expect(res.json()).toEqual({ user: expect.objectContaining({ email }) });
    expect(JSON.stringify(res.json())).not.toContain(cookie!.value);
  });

  it('clears the session cookie on logout', async () => {
    const { headers } = await signUp(ctx.app);
    const res = await ctx.app.inject({ method: 'POST', url: '/api/auth/logout', headers });
    expect(res.statusCode).toBe(204);
    const cookie = res.cookies.find((c) => c.name === 'kidty_session');
    expect(cookie?.value).toBe('');
  });

  it('requires a valid token on protected routes', async () => {
    const missing = await ctx.app.inject({ url: '/api/children' });
    const invalid = await ctx.app.inject({
      url: '/api/children',
      headers: { authorization: 'Bearer nonsense' },
    });
    expect(missing.statusCode).toBe(401);
    expect(invalid.statusCode).toBe(401);
  });

  it('resets the password with a one-time token', async () => {
    const { email } = await signUp(ctx.app);

    const forgot = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/forgot-password',
      payload: { email },
    });
    expect(forgot.statusCode).toBe(200);

    // The raw token only goes out by email; plant a known one instead.
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken('known-token'),
        expiresAt: new Date(Date.now() + 60_000),
      },
    });

    const reset = () =>
      ctx.app.inject({
        method: 'POST',
        url: '/api/auth/reset-password',
        payload: {
          token: 'known-token',
          password: 'brand-new-password',
          repeatPassword: 'brand-new-password',
        },
      });

    expect((await reset()).statusCode).toBe(200);
    expect((await reset()).statusCode).toBe(400);

    const login = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password: 'brand-new-password' },
    });
    expect(login.statusCode).toBe(200);
  });

  it('answers forgot-password the same way for unknown emails', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/forgot-password',
      payload: { email: 'nobody@example.com' },
    });
    expect(res.statusCode).toBe(200);
    expect(await prisma.passwordResetToken.count()).toBe(0);
  });
});

describe('rate limiting', () => {
  const ctx = setupApp({ rateLimit: true });

  it('limits repeated login attempts', async () => {
    const attempt = () =>
      ctx.app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: { email: 'x@example.com', password: 'whatever' },
      });

    for (let i = 0; i < 10; i++) await attempt();
    const res = await attempt();
    expect(res.statusCode).toBe(429);
  });
});
