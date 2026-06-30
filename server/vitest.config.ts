import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Default: unit tests only (no DATABASE_URL required)
    include: ['src/__tests__/**/*.test.ts'],
    exclude: ['src/__tests__/integration/**/*.test.ts'],
    environment: 'node',
    globals: false,
  },
})
