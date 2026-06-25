import { z } from "zod";
import { eq, desc, count, and, gte, lte, or, sql, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "../trpc.js";
import {
  db, users, parcels, trips, bookings, payments, disputes, waitlist,
  corridorRules, customsRules, auditLogs,
} from "@carrymate/db";

// ─── Audit Log Helper ─────────────────────────────────────────────────────────
async function writeAudit(
  adminId: string,
  adminName: string | null | undefined,
  action: string,
  targetType?: string,
  targetId?: string,
  metadata?: Record<string, unknown>
) {
  await db.insert(auditLogs).values({
    adminId,
    adminName,
    action,
    targetType,
    targetId,
    metadata,
  });
}

export const adminRouter = router({
  /** Platform analytics overview */
  analytics: adminProcedure.query(async () => {
    const [userCount] = await db.select({ value: count() }).from(users);
    const [parcelCount] = await db.select({ value: count() }).from(parcels);
    const [tripCount] = await db.select({ value: count() }).from(trips);
    const [bookingCount] = await db.select({ value: count() }).from(bookings);
    const [disputeCount] = await db.select({ value: count() }).from(disputes);
    const [waitlistCount] = await db.select({ value: count() }).from(waitlist);
    return {
      users: Number(userCount.value),
      parcels: Number(parcelCount.value),
      trips: Number(tripCount.value),
      bookings: Number(bookingCount.value),
      disputes: Number(disputeCount.value),
      waitlist: Number(waitlistCount.value),
    };
  }),

  /** List all users */
  users: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(users).orderBy(desc(users.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** Ban or unban a user */
  banUser: adminProcedure
    .input(z.object({ userId: z.string().uuid(), banned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await db.update(users).set({
        isBanned: input.banned,
        suspendedAt: input.banned ? new Date() : null,
        updatedAt: new Date(),
      }).where(eq(users.id, input.userId));
      await writeAudit(ctx.user.id, ctx.user.email, input.banned ? "ban_user" : "unban_user", "user", input.userId);
      return { success: true };
    }),

  /** List all parcels */
  parcels: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(parcels).orderBy(desc(parcels.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** List all trips */
  trips: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(trips).orderBy(desc(trips.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** List all bookings */
  bookings: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** List all disputes */
  disputes: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(disputes).orderBy(desc(disputes.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** Resolve a dispute */
  resolveDispute: adminProcedure
    .input(z.object({
      disputeId: z.string().uuid(),
      resolution: z.string().min(1),
      outcome: z.enum(["refund", "release", "split"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(disputes).set({
        status: "resolved",
        resolution: input.resolution,
        resolvedBy: ctx.user.id,
        resolvedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(disputes.id, input.disputeId));
      await writeAudit(ctx.user.id, ctx.user.email, "resolve_dispute", "dispute", input.disputeId, { resolution: input.resolution });
      return { success: true };
    }),

  /** List waitlist entries */
  waitlist: adminProcedure
    .input(z.object({ limit: z.number().default(200) }))
    .query(async ({ input }) => {
      return db.select().from(waitlist).orderBy(asc(waitlist.createdAt)).limit(input.limit);
    }),

  /** List all corridor rules */
  corridors: adminProcedure.query(async () => {
    return db.select().from(corridorRules).orderBy(asc(corridorRules.corridorKey));
  }),

  /** Update a corridor rule */
  updateCorridor: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      isActive: z.boolean().optional(),
      surgeMultiplier: z.number().min(0.5).max(5).optional(),
      basePricePerKg: z.number().min(0).optional(),
      maxWeightKg: z.number().min(1).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input;
      await db.update(corridorRules).set({
        ...updates,
        surgeMultiplier: updates.surgeMultiplier?.toFixed(2),
        basePricePerKg: updates.basePricePerKg?.toFixed(2),
        maxWeightKg: updates.maxWeightKg?.toFixed(2),
        updatedAt: new Date(),
        updatedBy: ctx.user.id,
      }).where(eq(corridorRules.id, id));
      await writeAudit(ctx.user.id, ctx.user.email, "update_corridor", "corridor", id, updates as Record<string, unknown>);
      return { success: true };
    }),

  /** Get audit logs */
  auditLogs: adminProcedure
    .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(input.limit).offset(input.offset);
    }),

  /** Update user role (admin can promote/demote) */
  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.string().uuid(),
      role: z.enum(["user", "sender", "traveler", "admin"]),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.update(users).set({ role: input.role, updatedAt: new Date() }).where(eq(users.id, input.userId));
      await writeAudit(ctx.user.id, ctx.user.email, "update_user_role", "user", input.userId, { role: input.role });
      return { success: true };
    }),
});
