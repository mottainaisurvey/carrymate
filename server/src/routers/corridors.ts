import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc.js";
import { db, corridorRules, customsRules } from "@carrymate/db";

export const corridorsRouter = router({
  /** List all active corridors (public — no auth required) */
  list: publicProcedure
    .input(z.object({
      activeOnly: z.boolean().default(true),
    }).optional())
    .query(async ({ input }) => {
      const activeOnly = input?.activeOnly ?? true;
      if (activeOnly) {
        return db
          .select()
          .from(corridorRules)
          .where(eq(corridorRules.isActive, true));
      }
      return db.select().from(corridorRules);
    }),

  /** Get a single corridor by ID (public) */
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [corridor] = await db
        .select()
        .from(corridorRules)
        .where(eq(corridorRules.id, input.id))
        .limit(1);
      if (!corridor) throw new TRPCError({ code: "NOT_FOUND", message: "Corridor not found" });
      return corridor;
    }),

  /** Get customs rules for a corridor key (public) */
  getCustomsRules: publicProcedure
    .input(z.object({ corridorKey: z.string().min(1) }))
    .query(async ({ input }) => {
      const [rule] = await db
        .select()
        .from(customsRules)
        .where(eq(customsRules.corridorKey, input.corridorKey.toUpperCase()))
        .limit(1);
      return rule ?? null;
    }),
});
