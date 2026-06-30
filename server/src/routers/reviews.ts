import { z } from "zod";
import { eq, and, desc, avg, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, reviews, bookings, users } from "@carrymate/db";

export const reviewsRouter = router({
  /** Submit a review after a completed booking */
  create: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      rating: z.number().min(1).max(5),
      comment: z.string().max(1000).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (booking.status !== "delivered") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Can only review after delivery" });
      }

      const isSender = booking.senderId === ctx.user.id;
      const revieweeId = isSender ? booking.travelerId : booking.senderId;
      const direction = isSender ? "sender_to_traveler" : "traveler_to_sender";

      // Check for duplicate review
      const [existing] = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.bookingId, input.bookingId), eq(reviews.reviewerId, ctx.user.id)))
        .limit(1);
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "Already reviewed this booking" });

      const [review] = await db.insert(reviews).values({
        bookingId: input.bookingId,
        reviewerId: ctx.user.id,
        revieweeId,
        direction,
        rating: input.rating,
        comment: input.comment,
      }).returning();

      return review;
    }),

  /** Get all reviews for a traveler */
  getForTraveler: protectedProcedure
    .input(z.object({
      travelerId: z.string().uuid(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      return db
        .select()
        .from(reviews)
        .where(and(
          eq(reviews.revieweeId, input.travelerId),
          eq(reviews.direction, "sender_to_traveler"),
        ))
        .orderBy(desc(reviews.createdAt))
        .limit(input.limit);
    }),
});
