import { z } from "zod";
import { eq, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, payments, bookings } from "@carrymate/db";

export const paymentsRouter = router({
  /** Create an escrow hold for a booking (sender initiates payment) */
  createEscrowHold: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });

      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1);
      if (!payment) throw new TRPCError({ code: "NOT_FOUND", message: "Payment record not found" });

      // TODO: integrate Stripe PaymentIntent here
      // For now, mark as held (escrow placeholder)
      await db.update(payments).set({
        status: "held",
        heldAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(payments.bookingId, input.bookingId));

      await db.update(bookings).set({
        status: "confirmed",
        updatedAt: new Date(),
      }).where(eq(bookings.id, input.bookingId));

      return { success: true, status: "held" };
    }),

  /** Release escrow to traveler after delivery confirmed */
  releaseEscrow: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (booking.status !== "delivered") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Can only release escrow after delivery" });
      }

      // TODO: trigger Stripe transfer to traveler's connected account
      await db.update(payments).set({
        status: "released",
        releasedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(payments.bookingId, input.bookingId));

      return { success: true, status: "released" };
    }),

  /** Refund escrow to sender (dispute resolution or cancellation) */
  refundEscrow: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only admins can issue refunds" });
      }

      // TODO: trigger Stripe refund
      await db.update(payments).set({
        status: "refunded",
        updatedAt: new Date(),
      }).where(eq(payments.bookingId, input.bookingId));

      return { success: true, status: "refunded" };
    }),

  /** Get payment status for a booking */
  getStatus: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1);
      return payment ?? null;
    }),
});
