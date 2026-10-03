import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globalSetup: './tests/global-setup.ts',
    // Tests share one database, so run files one after another.
    fileParallelism: false,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        'postgresql://kidty:kidty@localhost:5434/kidty_test?schema=public',
      JWT_SECRET: 'test-secret-that-is-at-least-32-characters-long',
    },
  },
});
