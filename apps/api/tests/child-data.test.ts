import { describe, expect, it } from 'vitest';
import { childPayload, setupApp, signUp } from './helpers.js';

describe('child data', () => {
  const ctx = setupApp();

  async function createChild() {
    const { headers } = await signUp(ctx.app);
    const child = (
      await ctx.app.inject({
        method: 'POST',
        url: '/api/children',
        headers,
        payload: childPayload,
      })
    ).json();
    return { headers, base: `/api/children/${child.id}` };
  }

  it('stores one measurement per month and keeps types separate', async () => {
    const { headers, base } = await createChild();

    const post = (path: string, payload: object) =>
      ctx.app.inject({ method: 'POST', url: `${base}/${path}`, headers, payload });

    const first = await post('height', { year: '2025', month: 'Березень', value: 110 });
    expect(first.statusCode).toBe(201);
    expect(first.json()).toMatchObject({ year: '2025', month: 'Березень', value: 110 });

    // Same month again replaces the value instead of duplicating it.
    await post('height', { year: '2025', month: 'Березень', value: 111.5 });
    await post('weight', { year: '2025', month: 'Березень', value: 18.4 });

    const heights = (await ctx.app.inject({ url: `${base}/height`, headers })).json();
    expect(heights).toEqual([
      { id: first.json().id, year: '2025', month: 'Березень', value: 111.5 },
    ]);

    const updated = await ctx.app.inject({
      method: 'PUT',
      url: `${base}/height/${first.json().id}`,
      headers,
      payload: { year: '2025', month: 'Квітень', value: 112 },
    });
    expect(updated.json()).toMatchObject({ month: 'Квітень', value: 112 });

    // A weight id can't be used through the height endpoint.
    const weightId = (await ctx.app.inject({ url: `${base}/weight`, headers })).json()[0].id;
    const wrongType = await ctx.app.inject({
      method: 'DELETE',
      url: `${base}/height/${weightId}`,
      headers,
    });
    expect(wrongType.statusCode).toBe(404);

    const deleted = await ctx.app.inject({
      method: 'DELETE',
      url: `${base}/height/${first.json().id}`,
      headers,
    });
    expect(deleted.statusCode).toBe(204);
  });

  it('validates measurement values', async () => {
    const { headers, base } = await createChild();

    for (const payload of [
      { year: '2025', month: 'March', value: 100 },
      { year: '2025', month: 'Березень', value: -1 },
      { year: '2025', month: 'Березень', value: 999 },
    ]) {
      const res = await ctx.app.inject({
        method: 'POST',
        url: `${base}/height`,
        headers,
        payload,
      });
      expect(res.statusCode, JSON.stringify(payload)).toBe(400);
    }
  });

  it('returns zero eyesight until it is saved, then upserts', async () => {
    const { headers, base } = await createChild();

    const empty = await ctx.app.inject({ url: `${base}/eye`, headers });
    expect(empty.json()).toMatchObject({ leftEye: 0, rightEye: 0 });

    for (const values of [
      { leftEye: -1.5, rightEye: 0.5 },
      { leftEye: -1, rightEye: 0.25 },
    ]) {
      const res = await ctx.app.inject({
        method: 'PUT',
        url: `${base}/eye`,
        headers,
        payload: values,
      });
      expect(res.json()).toMatchObject(values);
    }
  });

  it('manages vaccinations', async () => {
    const { headers, base } = await createChild();

    const created = await ctx.app.inject({
      method: 'POST',
      url: `${base}/vaccination`,
      headers,
      payload: { type: 'Гепатит Б', date: '15-05-2021' },
    });
    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({ type: 'Гепатит Б', date: '15-05-2021' });

    const duplicate = await ctx.app.inject({
      method: 'POST',
      url: `${base}/vaccination`,
      headers,
      payload: { type: 'Гепатит Б', date: '15-05-2021' },
    });
    expect(duplicate.statusCode).toBe(409);

    const unknown = await ctx.app.inject({
      method: 'POST',
      url: `${base}/vaccination`,
      headers,
      payload: { type: 'Щось інше', date: '15-05-2021' },
    });
    expect(unknown.statusCode).toBe(400);

    const updated = await ctx.app.inject({
      method: 'PUT',
      url: `${base}/vaccination/${created.json().id}`,
      headers,
      payload: { type: 'Кашлюк', date: '01-06-2021' },
    });
    expect(updated.json()).toMatchObject({ type: 'Кашлюк', date: '01-06-2021' });

    const deleted = await ctx.app.inject({
      method: 'DELETE',
      url: `${base}/vaccination/${created.json().id}`,
      headers,
    });
    expect(deleted.statusCode).toBe(204);
  });
});
