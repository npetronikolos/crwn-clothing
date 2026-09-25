import { defineConfig } from 'prisma/config';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env file; fall back to the environment and the default below.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js'
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
  }
});
