// Email templates in the user's language (from the Accept-Language header).
import type { FastifyRequest } from 'fastify';

export type Lang = 'uk' | 'en';

export const requestLang = (request: FastifyRequest): Lang =>
  /^uk\b/i.test(request.headers['accept-language'] ?? '') ? 'uk' : 'en';

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function layout(lang: Lang, body: string) {
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#f5f7fa;font-family:Arial,sans-serif;color:#1f2a3d">
<div style="max-width:520px;margin:0 auto;padding:32px 16px">
<div style="font-weight:bold;letter-spacing:6px;margin-bottom:24px">KIDTY</div>
<div style="background:#ffffff;border-radius:16px;padding:24px;line-height:1.5">${body}</div>
</div></body></html>`;
}

const RESET = {
  uk: {
    subject: 'Відновлення пароля Kidty',
    hello: (name: string) => `Привіт, ${name}!`,
    text: 'Ми отримали запит на зміну пароля для вашого акаунта Kidty. Натисніть кнопку нижче, щоб задати новий пароль. Посилання діє 1 годину.',
    button: 'Змінити пароль',
    ignore: 'Якщо ви не надсилали запит, просто проігноруйте цей лист — пароль не зміниться.',
  },
  en: {
    subject: 'Reset your Kidty password',
    hello: (name: string) => `Hi ${name},`,
    text: 'We received a request to reset the password for your Kidty account. Click the button below to choose a new password. The link is valid for 1 hour.',
    button: 'Reset password',
    ignore: "If you didn't ask for this, just ignore this email and your password won't change.",
  },
};

export function resetPasswordEmail(lang: Lang, name: string, link: string) {
  const t = RESET[lang];
  return {
    subject: t.subject,
    text: `${t.hello(name)}\n\n${t.text}\n\n${link}\n\n${t.ignore}`,
    html: layout(lang, `<p>${escape(t.hello(name))}</p><p>${t.text}</p>
<p style="margin:24px 0"><a href="${escape(link)}" style="background:#3a6db3;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;display:inline-block">${t.button}</a></p>
<p style="color:#76829a;font-size:13px">${t.ignore}</p>`),
  };
}

export function supportRequestEmail(name: string, email: string, message: string) {
  return {
    subject: `Kidty support: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: layout('en', `<p><b>${escape(name)}</b> &lt;${escape(email)}&gt;</p><p style="white-space:pre-wrap">${escape(message)}</p>`),
  };
}
