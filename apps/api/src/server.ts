import { buildApp } from './app.js';
import { env } from './env.js';
import { prisma } from './db.js';

const app = await buildApp({
  logger:
    env.NODE_ENV === 'development'
      ? { transport: { target: 'pino-pretty' } }
      : true,
});

const shutdown = async () => {
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

await app.listen({ host: env.HOST, port: env.PORT });
