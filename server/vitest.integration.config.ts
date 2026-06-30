import { defineConfig } from 'vitest/config'

/**
 * Integration test config — requires DATABASE_URL environment variable
 * pointing at the staging Supabase project (dsfwdyryshbqqseoinzv).
 *
 * Run with:
 *   DATABASE_URL="postgresql://postgres:[password]@db.dsfwdyryshbqqseoinzv.supabase.co:5432/postgres?sslmode=require" \
 *   pnpm vitest run --config vitest.integration.config.ts
 *
 * Optional env vars for live third-party sandbox tests:
 *   STRIPE_SECRET_KEY=sk_test_...
 *   PAYSTACK_SECRET_KEY=sk_test_...
 *   SUMSUB_SECRET_KEY=...
 *   STAGING_SERVER_URL=https://carrymate-server-staging.railway.app
 */
export default defineConfig({
  test: {
    include: ['src/__tests__/integration/**/*.test.ts'],
    environment: 'node',
    globals: false,
    // Integration tests can take longer (DB round-trips, external APIs)
    testTimeout: 30000,
    hookTimeout: 30000,
    // Run sequentially to avoid test data collisions
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
