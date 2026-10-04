import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendWithResend } from '../src/lib/mailer.js';

const mail = {
  to: 'parent@example.com',
  subject: 'Hello',
  text: 'Plain text',
  html: '<p>HTML</p>',
  replyTo: 'someone@example.com',
};

describe('Resend transport', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('posts the message to the Resend API', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"id":"1"}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await sendWithResend(mail, 're_test_key', 'Kidty <no-reply@kidty.com.ua>');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer re_test_key');
    expect(JSON.parse(init.body)).toEqual({
      from: 'Kidty <no-reply@kidty.com.ua>',
      to: ['parent@example.com'],
      subject: 'Hello',
      text: 'Plain text',
      html: '<p>HTML</p>',
      reply_to: 'someone@example.com',
    });
  });

  it('throws with the API response when sending fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"message":"Invalid API key"}', { status: 401 })));
    await expect(sendWithResend(mail, 'bad', 'x@example.com')).rejects.toThrow('Resend 401');
  });
});
