import nodemailer from 'nodemailer';
import { env } from '../env.js';

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

// Tests and setups without SMTP get a transport that only records messages.
const transport = env.SMTP_URL
  ? nodemailer.createTransport(env.SMTP_URL)
  : nodemailer.createTransport({ jsonTransport: true });

/** Messages "sent" without SMTP, for tests and local debugging. */
export const outbox: Mail[] = [];

export async function sendMail(mail: Mail) {
  if (!env.SMTP_URL) outbox.push(mail);
  await transport.sendMail({ from: env.MAIL_FROM, ...mail });
}
