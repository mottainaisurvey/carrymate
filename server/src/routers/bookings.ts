import { z } from "zod";
import { eq, and, desc, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, bookings, parcels, trips, payments, users } from "@carrymate/db";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const bookingsRouter = router({
  /** Traveler accepts a parcel — creates a booking */
  create: protectedProcedure
    .input(z.object({
      parcelId: z.string().uuid(),
      tripId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db.select().from(parcels).where(eq(parcels.id, input.parcelId)).limit(1);
      if (!parcel) throw new TRPCError({ code: "NOT_FOUND", message: "Parcel not found" });
      if (parcel.status !== "pending") throw new TRPCError({ code: "BAD_REQUEST", message: "Parcel is not available" });

      const [trip] = await db.select().from(trips).where(eq(trips.id, input.tripId)).limit(1);
      if (!trip) throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      if (trip.travelerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "You can only accept parcels on your own trips" });
      if (trip.status !== "open") throw new TRPCError({ code: "BAD_REQUEST", message: "Trip is full or closed" });

      const weightKg = parseFloat(parcel.weightKg);
      const remaining = parseFloat(trip.remainingKg);
      if (weightKg > remaining) throw new TRPCError({ code: "BAD_REQUEST", message: "Insufficient capacity on this trip" });

      const pricePerKg = parseFloat(trip.pricePerKg);
      const agreedPrice = weightKg * pricePerKg;
      const serviceFee = agreedPrice * 0.1;
      const totalAmount = agreedPrice + serviceFee;

      const collectionOtp = generateOTP();
      const deliveryOtp = generateOTP();

      const [booking] = await db.insert(bookings).values({
        parcelId: input.parcelId,
        tripId: input.tripId,
        senderId: parcel.senderId,
        travelerId: ctx.user.id,
        agreedPrice: agreedPrice.toFixed(2),
        serviceFee: serviceFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        status: "pending",
        collectionOtp,
        deliveryOtp,
      }).returning();

      // Mark parcel as booked
      await db.update(parcels).set({ status: "booked", updatedAt: new Date() }).where(eq(parcels.id, input.parcelId));

      // Decrease trip capacity
      const newRemaining = Math.max(0, remaining - weightKg);
      await db.update(trips).set({
        remainingKg: newRemaining.toFixed(2),
        status: newRemaining <= 0 ? "full" : "open",
        updatedAt: new Date(),
      }).where(eq(trips.id, input.tripId));

      // Create payment record
      await db.insert(payments).values({
        bookingId: booking.id,
        senderId: parcel.senderId,
        travelerId: ctx.user.id,
        amount: totalAmount.toFixed(2),
        status: "pending",
      });

      return { success: true, booking };
    }),

  /** List bookings for the current user (as sender or traveler) */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(bookings)
        .where(or(eq(bookings.senderId, ctx.user.id), eq(bookings.travelerId, ctx.user.id)))
        .orderBy(desc(bookings.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /** Get a single booking by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, input.id))
        .limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return booking;
    }),

  /** Confirm delivery via OTP */
  confirmDeliveryOTP: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid(), otp: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (booking.deliveryOtp !== input.otp) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid OTP" });
      }
      await db.update(bookings).set({
        status: "delivered",
        deliveryVerifiedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(bookings.id, input.bookingId));

      // Mark parcel as delivered
      await db.update(parcels).set({ status: "delivered", updatedAt: new Date() }).where(eq(parcels.id, booking.parcelId));

      return { success: true };
    }),

  /** Rate a completed booking (sender rates traveler) */
  rate: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      rating: z.number().min(1).max(5),
      review: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      if (booking.status !== "delivered") throw new TRPCError({ code: "BAD_REQUEST", message: "Can only rate delivered bookings" });

      await db.update(bookings).set({
        travelerRating: input.rating,
        travelerReview: input.review,
        updatedAt: new Date(),
      }).where(eq(bookings.id, input.bookingId));

      // Update traveler stats
      const [traveler] = await db.select().from(users).where(eq(users.id, booking.travelerId)).limit(1);
      if (traveler) {
        const totalRatings = (traveler.totalRatings ?? 0) + 1;
        const completedDeliveries = (traveler.completedDeliveries ?? 0) + 1;
        const prevAvg = parseFloat(traveler.averageRating ?? "0");
        const newAvg = ((prevAvg * (totalRatings - 1)) + input.rating) / totalRatings;
        await db.update(users).set({
          completedDeliveries,
          totalRatings,
          averageRating: newAvg.toFixed(2),
          updatedAt: new Date(),
        }).where(eq(users.id, booking.travelerId));
      }

      return { success: true };
    }),
});
