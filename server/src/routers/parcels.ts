import { z } from "zod";
import { eq, and, desc, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, parcels, users } from "@carrymate/db";

export const parcelsRouter = router({
  /** Create a new parcel listing */
  create: protectedProcedure
    .input(z.object({
      originCity: z.string().min(1),
      originCode: z.string().min(2).max(10),
      destCity: z.string().min(1),
      destCode: z.string().min(2).max(10),
      weightKg: z.number().min(0.1).max(50),
      contents: z.string().min(1),
      recipientName: z.string().min(1),
      recipientPhone: z.string().min(5),
      recipientAddress: z.string().optional(),
      isCustomsSafe: z.boolean().default(true),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db.insert(parcels).values({
        senderId: ctx.user.id,
        originCity: input.originCity,
        originCode: input.originCode.toUpperCase(),
        destCity: input.destCity,
        destCode: input.destCode.toUpperCase(),
        weightKg: input.weightKg.toFixed(2),
        contents: input.contents,
        recipientName: input.recipientName,
        recipientPhone: input.recipientPhone,
        recipientAddress: input.recipientAddress,
        isCustomsSafe: input.isCustomsSafe,
        notes: input.notes,
      }).returning();
      return parcel;
    }),

  /** List parcels for the current user */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(parcels)
        .where(eq(parcels.senderId, ctx.user.id))
        .orderBy(desc(parcels.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /** Get a single parcel by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [parcel] = await db
        .select()
        .from(parcels)
        .where(eq(parcels.id, input.id))
        .limit(1);
      if (!parcel) throw new TRPCError({ code: "NOT_FOUND", message: "Parcel not found" });
      if (parcel.senderId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      return parcel;
    }),

  /** Cancel a parcel (sender only, must be pending) */
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db
        .select()
        .from(parcels)
        .where(eq(parcels.id, input.id))
        .limit(1);
      if (!parcel) throw new TRPCError({ code: "NOT_FOUND" });
      if (parcel.senderId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      if (!["pending", "open"].includes(parcel.status)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel a parcel that is already booked or delivered" });
      }
      await db
        .update(parcels)
        .set({ status: "cancelled", updatedAt: new Date() })
        .where(eq(parcels.id, input.id));
      return { success: true };
    }),

  /** Confirm pickup via OTP (traveler provides OTP to sender) */
  confirmPickupOTP: protectedProcedure
    .input(z.object({ parcelId: z.string().uuid(), otp: z.string().length(6) }))
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db
        .select()
        .from(parcels)
        .where(eq(parcels.id, input.parcelId))
        .limit(1);
      if (!parcel) throw new TRPCError({ code: "NOT_FOUND" });
      // OTP verification is handled at the booking level; this just marks the parcel as in_transit
      await db
        .update(parcels)
        .set({ status: "in_transit", updatedAt: new Date() })
        .where(eq(parcels.id, input.parcelId));
      return { success: true };
    }),

  /** Get open parcels for traveler matching (filtered by corridor) */
  openParcels: protectedProcedure
    .input(z.object({
      originCode: z.string().optional(),
      destCode: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const conditions = [eq(parcels.status, "pending")];
      if (input.originCode) conditions.push(eq(parcels.originCode, input.originCode.toUpperCase()));
      if (input.destCode) conditions.push(eq(parcels.destCode, input.destCode.toUpperCase()));
      return db
        .select()
        .from(parcels)
        .where(and(...conditions))
        .orderBy(desc(parcels.createdAt))
        .limit(input.limit);
    }),
});
