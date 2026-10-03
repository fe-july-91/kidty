import fp from 'fastify-plugin';
import fastifyCookie from '@fastify/cookie';
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

function sessionCookieOptions() {
  return {
    path: '/',
    httpOnly: true,
    sameSite: env.COOKIE_SAMESITE,
    secure: env.COOKIE_SECURE ?? env.NODE_ENV === 'production',
    maxAge: env.SESSION_DAYS * 24 * 60 * 60,
  } as const;
}

declare module 'fastify' {
  interface FastifyReply {
    startSession: (userId: number) => FastifyReply;
    endSession: () => FastifyReply;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userId: number;
  }
}

export const SESSION_COOKIE = 'kidty_session';

const unauthorized = () =>
  new HttpError(401, 'unauthorized', 'Not logged in');

export default fp(async (app) => {
  await app.register(fastifyCookie);
  // The session token lives in an httpOnly cookie, so page scripts can't
  // read it. (A Bearer header still works for API clients and tests.)
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: `${env.SESSION_DAYS}d` },
    cookie: { cookieName: SESSION_COOKIE, signed: false },
  });

  app.decorateRequest('userId', 0);

  app.decorateReply('startSession', function (userId: number) {
    const token = app.jwt.sign({ sub: userId });
    return this.setCookie(SESSION_COOKIE, token, sessionCookieOptions());
  });
  app.decorateReply('endSession', function () {
    return this.clearCookie(SESSION_COOKIE, sessionCookieOptions());
  });

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
