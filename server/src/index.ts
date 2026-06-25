import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import type { AnyTRPCRouter } from "@trpc/server";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

const server = Fastify({
  logger: process.env.NODE_ENV !== "test",
  trustProxy: true,
});

// ── CORS ──────────────────────────────────────────────────────────────────────
const corsOrigin = process.env.CORS_ORIGIN;
await server.register(cors, {
  origin: corsOrigin
    ? corsOrigin.split(",").map((o) => o.trim())
    : [
        process.env.WEB_URL ?? "http://localhost:3000",
        process.env.ADMIN_URL ?? "http://localhost:3002",
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
  version: "1.0.0",
}));

// ── tRPC ──────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trpcOptions: Parameters<typeof fastifyTRPCPlugin<AnyTRPCRouter>>[1] = {
  prefix: "/api/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError(opts: { path?: string; error: { code: string; message: string } }) {
      if (opts.error.code === "INTERNAL_SERVER_ERROR") {
        console.error(`tRPC error on ${opts.path ?? "unknown"}:`, opts.error);
      }
    },
  },
};
await server.register(fastifyTRPCPlugin, trpcOptions);

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
