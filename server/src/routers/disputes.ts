import { z } from "zod";
import { eq, or, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, disputes, bookings } from "@carrymate/db";

export const disputesRouter = router({
  /** Raise a dispute on a booking */
  create: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      reason: z.string().min(10).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [dispute] = await db.insert(disputes).values({
        bookingId: input.bookingId,
        raisedBy: ctx.user.id,
        reason: input.reason,
        status: "open",
      }).returning();

      // Update booking status to disputed
      await db.update(bookings).set({
        status: "disputed",
        updatedAt: new Date(),
      }).where(eq(bookings.id, input.bookingId));

      return dispute;
    }),

  /** List disputes for the current user */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(disputes)
        .where(eq(disputes.raisedBy, ctx.user.id))
        .orderBy(desc(disputes.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /** Upload evidence for a dispute (stores URL reference) */
  uploadEvidence: protectedProcedure
    .input(z.object({
      disputeId: z.string().uuid(),
      evidenceUrl: z.string().url(),
      description: z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [dispute] = await db.select().from(disputes).where(eq(disputes.id, input.disputeId)).limit(1);
      if (!dispute) throw new TRPCError({ code: "NOT_FOUND" });
      if (dispute.raisedBy !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

      // Store evidence URL in the resolution field as JSON array (simple approach)
      // TODO: add a dedicated dispute_evidence table
      const existing = dispute.resolution ? JSON.parse(dispute.resolution) : [];
      const updated = Array.isArray(existing)
        ? [...existing, { url: input.evidenceUrl, description: input.description, uploadedAt: new Date().toISOString() }]
        : [{ url: input.evidenceUrl, description: input.description, uploadedAt: new Date().toISOString() }];

      await db.update(disputes).set({
        resolution: JSON.stringify(updated),
        updatedAt: new Date(),
      }).where(eq(disputes.id, input.disputeId));

      return { success: true };
    }),
});
