// Re-export tRPC primitives from trpc.ts so existing imports from "./router.js" still work
export { router, publicProcedure, protectedProcedure, adminProcedure } from "./trpc.js";
import { router } from "./trpc.js";

// ── Sub-routers ───────────────────────────────────────────────────────────────
import { authRouter } from "./routers/auth.js";
import { healthRouter } from "./routers/health.js";

export const appRouter = router({
  auth: authRouter,
  health: healthRouter,
});

export type AppRouter = typeof appRouter;
