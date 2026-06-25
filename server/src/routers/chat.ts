import { z } from "zod";
import { eq, and, desc, isNull } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, chatMessages, bookings } from "@carrymate/db";

export const chatRouter = router({
  /** Get all messages for a booking */
  getMessages: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      limit: z.number().min(1).max(200).default(100),
    }))
    .query(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.bookingId, input.bookingId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(input.limit);
    }),

  /** Send a message in a booking chat */
  sendMessage: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      content: z.string().min(1).max(2000),
    }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [message] = await db.insert(chatMessages).values({
        bookingId: input.bookingId,
        senderId: ctx.user.id,
        content: input.content,
      }).returning();

      return message;
    }),

  /** Mark all messages in a booking as read */
  markRead: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1);
      if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      await db.update(chatMessages).set({ readAt: new Date() }).where(
        and(
          eq(chatMessages.bookingId, input.bookingId),
          isNull(chatMessages.readAt),
        )
      );
      return { success: true };
    }),
});
