import nodemailer from 'nodemailer';
import { env } from '../env.js';

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

/** Messages "sent" in tests. */
export const outbox: Mail[] = [];

const smtp = env.SMTP_URL ? nodemailer.createTransport(env.SMTP_URL) : null;

/** Sends through Resend's HTTP API. Exported for tests. */
export async function sendWithResend(mail: Mail, apiKey = env.RESEND_API_KEY, from = env.MAIL_FROM) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}

/**
 * Sends an email via Resend (production), SMTP (local Mailpit) or, in
 * tests, the in-memory outbox. Without any of them it only logs.
 */
export async function sendMail(mail: Mail) {
  if (env.NODE_ENV === 'test') {
    outbox.push(mail);
  } else if (env.RESEND_API_KEY) {
    await sendWithResend(mail);
  } else if (smtp) {
    await smtp.sendMail({ from: env.MAIL_FROM, ...mail });
  } else {
    console.warn(`No email transport configured; not sending "${mail.subject}" to ${mail.to}`);
  }
}
