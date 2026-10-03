import { defineConfig } from 'prisma/config';

// Prisma 7 no longer loads .env automatically; use Node's built-in loader.
try {
  process.loadEnvFile();
} catch {
  // No .env file (e.g. in production) — rely on real environment variables.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
