import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

const server = Fastify({
  logger: process.env.NODE_ENV !== "test",
  trustProxy: true,
});

// ── CORS ──────────────────────────────────────────────────────────────────────
await server.register(cors, {
  origin: [
    process.env.WEB_URL ?? "http://localhost:3000",
    process.env.ADMIN_URL ?? "http://localhost:3001",
    /\.carrymate\.io$/,
  ],
  credentials: true,
});

// ── Cookies ───────────────────────────────────────────────────────────────────
await server.register(cookie, {
  secret: process.env.COOKIE_SECRET ?? "dev-cookie-secret-change-in-production",
});

// ── Health check ──────────────────────────────────────────────────────────────
server.get("/health", async () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV ?? "development",
}));

// ── tRPC ──────────────────────────────────────────────────────────────────────
await server.register(fastifyTRPCPlugin, {
  prefix: "/api/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      if (error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`tRPC error on ${path}:`, error);
      }
    },
  },
});

// ── Start ─────────────────────────────────────────────────────────────────────
const port = parseInt(process.env.PORT ?? "4000", 10);
const host = process.env.HOST ?? "0.0.0.0";

try {
  await server.listen({ port, host });
  console.log(`🚀 CarryMate API running at http://${host}:${port}`);
  console.log(`   tRPC endpoint: http://${host}:${port}/api/trpc`);
  console.log(`   Health check:  http://${host}:${port}/health`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}

export { server };
