import { z } from "zod";
import { eq } from "drizzle-orm";
import { router, publicProcedure, protectedProcedure } from "../router.js";
import { users } from "@carrymate/db/schema";

export const authRouter = router({
  // Returns the current authenticated user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);
    return user ?? null;
  }),

  // Called after Supabase auth sign-up to create the users row
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
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.authId, input.authId))
        .limit(1);

      if (existing) return existing;

      const [created] = await ctx.db
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
});
