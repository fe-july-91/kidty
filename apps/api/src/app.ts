import Fastify, {
  type FastifyError,
  type FastifyServerOptions,
} from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import {
  hasZodFastifySchemaValidationErrors,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.js';
import { prisma } from './db.js';
import { HttpError, VALIDATION_CODES } from './lib/errors.js';
import { Prisma } from './generated/prisma/client.js';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { accountRoutes } from './routes/account.js';
import { childrenRoutes } from './routes/children.js';
import { supportRoutes } from './routes/support.js';

type AppOptions = FastifyServerOptions & {
  /** Per-route request limits on auth and support endpoints. */
  rateLimit?: boolean;
};

export async function buildApp({
  rateLimit: enableRateLimit = true,
  ...options
}: AppOptions = {}) {
  const app = Fastify({
    ...options,
    routerOptions: { ignoreDuplicateSlashes: true },
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Error body: { code, message, errors? }. The frontend translates `code`
  // (and each `errors[].code`); `message` is an English fallback.
  app.setErrorHandler((error: FastifyError, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
      return reply.status(400).send({
        code: 'validation',
        message: 'Invalid data',
        errors: error.validation.map((issue) => ({
          field: issue.instancePath.slice(1).replaceAll('/', '.'),
          code: issue.message && VALIDATION_CODES.has(issue.message) ? issue.message : 'invalid',
        })),
      });
    }
    if (error instanceof HttpError) {
      return reply
        .status(error.statusCode)
        .send({ code: error.code, message: error.message });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return reply.status(409).send({ code: 'duplicate', message: 'Already exists' });
    }
    if (error.statusCode === 429) {
      return reply
        .status(429)
        .send({ code: 'tooManyRequests', message: 'Too many requests' });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply
        .status(error.statusCode)
        .send({ code: 'badRequest', message: error.message });
    }

    request.log.error(error);
    return reply.status(500).send({ code: 'server', message: 'Server error' });
  });

  app.setNotFoundHandler((_request, reply) =>
    reply.status(404).send({ code: 'notFound', message: 'Not found' })
  );

  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // the session cookie
  });
  if (enableRateLimit) {
    await app.register(rateLimit, { global: false });
  }
  await app.register(authPlugin);

  await app.register(
    async (api) => {
      api.get('/health', async () => {
        await prisma.$queryRaw`SELECT 1`;
        return { status: 'ok' };
      });

      await api.register(authRoutes, { prefix: '/auth' });
      await api.register(accountRoutes, { prefix: '/account' });
      await api.register(childrenRoutes, { prefix: '/children' });
      await api.register(supportRoutes, { prefix: '/support' });
    },
    { prefix: '/api' }
  );

  return app;
}

export type App = Awaited<ReturnType<typeof buildApp>>;
