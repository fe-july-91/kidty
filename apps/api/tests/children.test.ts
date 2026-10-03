import { describe, expect, it } from 'vitest';
import { childPayload, setupApp, signUp } from './helpers.js';

describe('children', () => {
  const ctx = setupApp();

  it('creates, reads, updates and deletes a child', async () => {
    const { headers, email } = await signUp(ctx.app);

    const created = await ctx.app.inject({
      method: 'POST',
      url: '/api/children',
      headers,
      payload: childPayload,
    });
    expect(created.statusCode).toBe(201);
    const child = created.json();
    expect(child).toMatchObject({
      name: 'Злата',
      surname: 'Тестова',
      birth: '09-08-2020',
      genderName: 'Дівчинка',
      image: '2',
      parent: 'Марія',
      userEmail: email,
    });

    const updated = await ctx.app.inject({
      method: 'PUT',
      url: `/api/children/${child.id}`,
      headers,
      payload: { ...childPayload, name: 'Златка', genderName: 'Хлопчик', image: '5' },
    });
    expect(updated.json()).toMatchObject({
      name: 'Златка',
      genderName: 'Хлопчик',
      image: '5',
    });

    const list = await ctx.app.inject({ url: '/api/children', headers });
    expect(list.json()).toHaveLength(1);

    const deleted = await ctx.app.inject({
      method: 'DELETE',
      url: `/api/children/${child.id}`,
      headers,
    });
    expect(deleted.statusCode).toBe(204);

    const missing = await ctx.app.inject({
      url: `/api/children/${child.id}`,
      headers,
    });
    expect(missing.statusCode).toBe(404);
  });

  it('rejects impossible and future birth dates', async () => {
    const { headers } = await signUp(ctx.app);

    for (const birth of ['31-02-2020', '01-01-2999', 'yesterday']) {
      const res = await ctx.app.inject({
        method: 'POST',
        url: '/api/children',
        headers,
        payload: { ...childPayload, birth },
      });
      expect(res.statusCode, birth).toBe(400);
    }
  });

  it("does not expose another user's children", async () => {
    const owner = await signUp(ctx.app);
    const stranger = await signUp(ctx.app);

    const child = (
      await ctx.app.inject({
        method: 'POST',
        url: '/api/children',
        headers: owner.headers,
        payload: childPayload,
      })
    ).json();

    const requests = [
      { method: 'GET' as const, url: `/api/children/${child.id}` },
      { method: 'PUT' as const, url: `/api/children/${child.id}`, payload: childPayload },
      { method: 'DELETE' as const, url: `/api/children/${child.id}` },
      { method: 'GET' as const, url: `/api/children/${child.id}/height` },
      { method: 'GET' as const, url: `/api/children/${child.id}/eye` },
      { method: 'GET' as const, url: `/api/children/${child.id}/vaccination` },
    ];

    for (const request of requests) {
      const res = await ctx.app.inject({ ...request, headers: stranger.headers });
      expect(res.statusCode, `${request.method} ${request.url}`).toBe(404);
    }

    const strangerList = await ctx.app.inject({
      url: '/api/children',
      headers: stranger.headers,
    });
    expect(strangerList.json()).toEqual([]);
  });
});
