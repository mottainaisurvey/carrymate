import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc.js";
import { db, users } from "@carrymate/db";

export const authRouter = router({
  /** Get current authenticated user */
  me: publicProcedure.query(({ ctx }) => ctx.user ?? null),

  /** Logout — client should clear the Supabase session */
  logout: protectedProcedure.mutation(() => {
    return { success: true };
  }),

  /** Called after Supabase auth sign-up to upsert the users row */
  register: publicProcedure
    .input(
      z.object({
        authId: z.string().uuid(),
        name: z.string().min(1).max(200),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        role: z.enum(["sender", "traveler"]).default("sender"),
      })
    )
    .mutation(async ({ input }) => {
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.authId, input.authId))
        .limit(1);

      if (existing) return existing;

      const [created] = await db
        .insert(users)
        .values({
          authId: input.authId,
          name: input.name,
          email: input.email,
          phone: input.phone,
          role: input.role,
        })
        .returning({ id: users.id });

      return created;
    }),

  /** Update the current user's profile */
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(200).optional(),
      phone: z.string().max(32).optional(),
      avatar: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.name && !input.phone && !input.avatar) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No fields to update" });
      }
      await db.update(users).set({
        ...(input.name && { name: input.name }),
        ...(input.phone && { phone: input.phone }),
        ...(input.avatar && { avatar: input.avatar }),
        updatedAt: new Date(),
      }).where(eq(users.id, ctx.user.id));
      const [updated] = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
      return updated;
    }),
});
