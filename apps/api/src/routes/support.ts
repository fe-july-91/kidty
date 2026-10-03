import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { prisma } from '../db.js';
import { email, name } from '../lib/schemas.js';

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
      // TODO: forward to the support inbox once email sending is set up.
      await prisma.supportRequest.create({ data: request.body });
      return reply
        .status(201)
        .send({ message: 'Sent' });
    }
  );
};
