import nodemailer from 'nodemailer';
import { env } from '../env.js';

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

// Without SMTP nothing is delivered: tests record messages in `outbox`,
// elsewhere they are only logged (e.g. before an email provider is set up).
const transport = env.SMTP_URL
  ? nodemailer.createTransport(env.SMTP_URL)
  : nodemailer.createTransport({ jsonTransport: true });

/** Messages "sent" in tests. */
export const outbox: Mail[] = [];

export async function sendMail(mail: Mail) {
  if (!env.SMTP_URL) {
    if (env.NODE_ENV === 'test') outbox.push(mail);
    else console.warn(`SMTP_URL is not set; not sending "${mail.subject}" to ${mail.to}`);
    return;
  }
  await transport.sendMail({ from: env.MAIL_FROM, ...mail });
}
