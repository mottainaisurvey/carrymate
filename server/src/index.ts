import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import type { AnyTRPCRouter } from '@trpc/server'
import { appRouter } from './router.js'
import { createContext } from './context.js'

// Webhook route handlers
import { stripeWebhookRoutes } from './routes/webhooks/stripe.js'
import { paystackWebhookRoutes } from './routes/webhooks/paystack.js'
import { sumsubWebhookRoutes } from './routes/webhooks/sumsub.js'

// Background workers
import { startMatchingWorker } from './workers/matchingWorker.js'
import { startSurgeWorker } from './workers/surgeWorker.js'
import { startNotificationWorker } from './workers/notificationWorker.js'
import { startEscrowWorker } from './workers/escrowWorker.js'

const server = Fastify({
  logger: process.env.NODE_ENV !== 'test',
  trustProxy: true,
})

// ── Raw body support (required for Stripe + Sumsub signature verification) ────
await server.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  function (_req, body, done) {
    try {
      ;(_req as unknown as { rawBody: Buffer }).rawBody = body as Buffer
      const json = JSON.parse((body as Buffer).toString())
      done(null, json)
    } catch (err) {
      done(err as Error, undefined)
    }
  }
)

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOrigin = process.env.CORS_ORIGIN
await server.register(cors, {
  origin: corsOrigin
    ? corsOrigin.split(',').map((o) => o.trim())
    : [
        process.env.WEB_URL ?? 'http://localhost:3000',
        process.env.ADMIN_URL ?? 'http://localhost:3002',
        /\.carrymate\.io$/,
      ],
  credentials: true,
})

// ── Cookies ───────────────────────────────────────────────────────────────────
await server.register(cookie, {
  secret: process.env.COOKIE_SECRET ?? 'dev-cookie-secret-change-in-production',
})

// ── Health check ──────────────────────────────────────────────────────────────
server.get('/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV ?? 'development',
  version: '1.0.0',
}))

// ── Webhook routes (registered before tRPC) ───────────────────────────────────
await server.register(stripeWebhookRoutes)
await server.register(paystackWebhookRoutes)
await server.register(sumsubWebhookRoutes)

// ── tRPC ──────────────────────────────────────────────────────────────────────
const trpcOptions: Parameters<typeof fastifyTRPCPlugin<AnyTRPCRouter>>[1] = {
  prefix: '/api/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError(opts: { path?: string; error: { code: string; message: string } }) {
      if (opts.error.code === 'INTERNAL_SERVER_ERROR') {
        console.error(`tRPC error on ${opts.path ?? 'unknown'}:`, opts.error)
      }
    },
  },
}
await server.register(fastifyTRPCPlugin, trpcOptions)

// ── Start ─────────────────────────────────────────────────────────────────────
const port = parseInt(process.env.PORT ?? '4000', 10)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await server.listen({ port, host })
  console.log(`🚀 CarryMate API running at http://${host}:${port}`)
  console.log(`   tRPC endpoint:     http://${host}:${port}/api/trpc`)
  console.log(`   Health check:      http://${host}:${port}/health`)
  console.log(`   Stripe webhook:    http://${host}:${port}/webhooks/stripe`)
  console.log(`   Paystack webhook:  http://${host}:${port}/webhooks/paystack`)
  console.log(`   Sumsub webhook:    http://${host}:${port}/webhooks/sumsub`)

  // Start background workers (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    startMatchingWorker()
    startSurgeWorker()
    startNotificationWorker()
    startEscrowWorker()
    console.log('   Workers:           matching ✓  surge ✓  notification ✓  escrow ✓')
  }
} catch (err) {
  server.log.error(err)
  process.exit(1)
}

export { server }
