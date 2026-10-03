import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';
import { email, name } from '../lib/schemas.js';
import { env } from '../env.js';
import { sendMail } from '../lib/mailer.js';
import { supportRequestEmail } from '../lib/emails.js';

export const supportRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/send-request-to-email',
    {
      config: { rateLimit: { max: 5, timeWindow: '1 minute' } },
      schema: {
        body: z.object({
          name,
          email,
          message: z
            .string()
            .trim()
            .min(1, 'messageRequired')
            .max(5000, 'messageTooLong'),
        }),
      },
    },
    async (request, reply) => {
      // Saved first, so a mail outage never loses a request.
      await prisma.supportRequest.create({ data: request.body });
      const { name, email, message } = request.body;
      try {
        await sendMail({
          to: env.SUPPORT_EMAIL,
          replyTo: email,
          ...supportRequestEmail(name, email, message),
        });
      } catch (error) {
        request.log.error(error, 'Could not forward the support request');
      }
      return reply
        .status(201)
        .send({ message: 'Sent' });
    }
  );
};
