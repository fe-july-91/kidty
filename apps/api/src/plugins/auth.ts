import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../env.js';
import { prisma } from '../db.js';
import { HttpError } from '../lib/errors.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: number };
    user: { sub: number };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userId: number;
  }
}

const unauthorized = () =>
  new HttpError(401, 'Неавторизований. Будь ласка, увійдіть до системи');

export default fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_EXPIRES_IN },
  });

  app.decorateRequest('userId', 0);

  // preHandler for routes that require a signed-in user. Also rejects tokens
  // of accounts that have since been deleted.
  app.decorate('authenticate', async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch {
      throw unauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id: request.user.sub },
      select: { id: true },
    });
    if (!user) throw unauthorized();

    request.userId = user.id;
  });
});
