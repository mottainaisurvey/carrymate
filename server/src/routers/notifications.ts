import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, notifications } from "@carrymate/db";

export const notificationsRouter = router({
  /**
   * List notifications for the current user.
   * Input is fully optional so mobile can call with no arguments.
   */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      unreadOnly: z.boolean().default(false),
    }).optional())
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;
      const unreadOnly = input?.unreadOnly ?? false;
      const conditions = [eq(notifications.userId, ctx.user.id)];
      if (unreadOnly) conditions.push(eq(notifications.isRead, false));
      const rows = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(limit)
        .offset(offset);
      // Return mobile-friendly shape
      return rows.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        read: n.isRead,
        createdAt: n.createdAt,
        bookingId: n.bookingId,
      }));
    }),

  /** Mark one or all notifications as read */
  markAsRead: protectedProcedure
    .input(z.object({
      id: z.string().uuid().optional(), // if omitted, mark all as read
    }))
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        const [notif] = await db
          .select()
          .from(notifications)
          .where(eq(notifications.id, input.id))
          .limit(1);
        if (!notif) throw new TRPCError({ code: "NOT_FOUND" });
        if (notif.userId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, input.id));
      } else {
        await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, ctx.user.id));
      }
      return { success: true };
    }),

  /** Mark ALL notifications as read — mobile alias */
  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, ctx.user.id));
    return { success: true };
  }),

  /** Get unread count */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const unread = await db
      .select({ id: notifications.id })
      .from(notifications)
      .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.isRead, false)));
    return { count: unread.length };
  }),
});
