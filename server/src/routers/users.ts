import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc.js";
import { db, users, waitlist } from "@carrymate/db";

export const usersRouter = router({
  /** Get current user's full profile */
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);
    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    return user;
  }),

  /** Update current user's role (sender / traveler) */
  updateRole: protectedProcedure
    .input(z.object({ role: z.enum(["sender", "traveler"]) }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(users)
        .set({ role: input.role, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));
      return { success: true };
    }),

  /** Get ban/suspend status for the current user */
  getBannedStatus: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await db
      .select({ isBanned: users.isBanned, suspendReason: users.suspendReason })
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);
    return user ?? { isBanned: false, suspendReason: null };
  }),

  /** Join the waitlist (public) */
  joinWaitlist: publicProcedure
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
  getWaitlistStatus: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      const [entry] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, input.email))
        .limit(1);
      return entry ?? null;
    }),
});
