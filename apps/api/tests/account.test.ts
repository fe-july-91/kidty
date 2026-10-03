import { describe, expect, it } from 'vitest';
import { prisma } from '../src/db.js';
import { childPayload, setupApp, signUp } from './helpers.js';

describe('account', () => {
  const ctx = setupApp();

  it('updates personal data and rejects a taken email', async () => {
    const { headers } = await signUp(ctx.app);
    const other = await signUp(ctx.app);

    const updated = await ctx.app.inject({
      method: 'PUT',
      url: '/api/account/reset-data',
      headers,
      payload: { name: 'Нове імʼя', email: 'new@example.com' },
    });
    expect(updated.json()).toMatchObject({ name: 'Нове імʼя', email: 'new@example.com' });

    const taken = await ctx.app.inject({
      method: 'PUT',
      url: '/api/account/reset-data',
      headers,
      payload: { name: 'Нове імʼя', email: other.email },
    });
    expect(taken.statusCode).toBe(409);
  });

  it('changes the password only with the current one', async () => {
    const { headers, email, password } = await signUp(ctx.app);

    const wrong = await ctx.app.inject({
      method: 'PUT',
      url: '/api/account/reset-password',
      headers,
      payload: { currentPassword: 'not-my-password', password: 'changed-password', repeatPassword: 'changed-password' },
    });
    expect(wrong.statusCode).toBe(400);
    expect(wrong.json().code).toBe('currentPasswordWrong');

    const res = await ctx.app.inject({
      method: 'PUT',
      url: '/api/account/reset-password',
      headers,
      payload: { currentPassword: password, password: 'changed-password', repeatPassword: 'changed-password' },
    });
    expect(res.statusCode).toBe(200);

    const login = await ctx.app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email, password: 'changed-password' },
    });
    expect(login.statusCode).toBe(200);
  });

  it('deletes the account with all data and invalidates its token', async () => {
    const { headers } = await signUp(ctx.app);
    await ctx.app.inject({
      method: 'POST',
      url: '/api/children',
      headers,
      payload: childPayload,
    });

    const res = await ctx.app.inject({
      method: 'DELETE',
      url: '/api/account/delete',
      headers,
    });
    expect(res.statusCode).toBe(204);
    expect(await prisma.child.count()).toBe(0);

    const after = await ctx.app.inject({ url: '/api/account/me', headers });
    expect(after.statusCode).toBe(401);
  });

  it('accepts support requests', async () => {
    const res = await ctx.app.inject({
      method: 'POST',
      // The frontend sends this path with a leading slash.
      url: '/api//support/send-request-to-email',
      payload: { name: 'Марія', email: 'm@example.com', message: 'Привіт!' },
    });
    expect(res.statusCode).toBe(201);
    expect(await prisma.supportRequest.count()).toBe(1);
  });
});
