import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context.js";

// ── tRPC init ─────────────────────────────────────────────────────────────────
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }
  if (ctx.user.isBanned) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Account is suspended" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});
