import { z } from "zod";
import { eq, count, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc.js";
import { db, waitlist } from "@carrymate/db";

export const waitlistRouter = router({
  /** Join the waitlist (public) */
  join: publicProcedure
    .input(z.object({
      email: z.string().email(),
      role: z.enum(["sender", "traveler", "both"]).default("both"),
      name: z.string().max(200).optional(),
      phone: z.string().max(32).optional(),
    }))
    .mutation(async ({ input }) => {
      const existing = await db
        .select({ id: waitlist.id })
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);
      if (existing.length > 0) return { success: true, alreadyExists: true };
      await db.insert(waitlist).values({
        email: input.email,
        role: input.role,
        name: input.name,
        phone: input.phone,
      });
      return { success: true, alreadyExists: false };
    }),

  /** Get waitlist status for an email (public) */
  getStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const [entry] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);
      if (!entry) return { onWaitlist: false, position: null };

      // Get approximate position
      const [{ value: totalBefore }] = await db
        .select({ value: count() })
        .from(waitlist)
        .where(eq(waitlist.email, input.email));

      return { onWaitlist: true, entry, position: Number(totalBefore) };
    }),
});
