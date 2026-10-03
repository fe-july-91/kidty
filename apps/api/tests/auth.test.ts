import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { outbox } from '../src/lib/mailer.js';
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

  it('emails a one-time reset link in the user\'s language', async () => {
    const { email } = await signUp(ctx.app);

    const forgot = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/forgot-password',
      headers: { 'accept-language': 'uk' },
      payload: { email },
    });
    expect(forgot.statusCode).toBe(200);

    expect(outbox).toHaveLength(1);
    expect(outbox[0]).toMatchObject({ to: email, subject: 'Відновлення пароля Kidty' });
    const token = /reset-password\?token=([\w-]+)/.exec(outbox[0].text)?.[1];
    expect(token).toBeTruthy();

    const reset = () =>
      ctx.app.inject({
        method: 'POST',
        url: '/api/auth/reset-password',
        payload: { token, password: 'brand-new-password', repeatPassword: 'brand-new-password' },
      });

    expect((await reset()).statusCode).toBe(200);
    const reused = await reset();
    expect(reused.statusCode).toBe(400);
    expect(reused.json().code).toBe('resetLinkInvalid');

    const login = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password: 'brand-new-password' },
    });
    expect(login.statusCode).toBe(200);
  });

  it('writes the reset email in English by default', async () => {
    const { email } = await signUp(ctx.app);
    await ctx.app.inject({ method: 'POST', url: '/api/auth/forgot-password', payload: { email } });
    expect(outbox[0].subject).toBe('Reset your Kidty password');
  });

  it('answers forgot-password the same way for unknown emails', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/forgot-password',
      payload: { email: 'nobody@example.com' },
    });
    expect(res.statusCode).toBe(200);
    expect(await prisma.passwordResetToken.count()).toBe(0);
    expect(outbox).toHaveLength(0);
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
