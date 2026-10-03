import { execSync } from 'node:child_process';

// Applies migrations to the test database (created on first run).
export default function setup() {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        'postgresql://kidty:kidty@localhost:5434/kidty_test?schema=public',
    },
  });
}
