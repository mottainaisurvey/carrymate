import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc.js";
import { db, trips, users } from "@carrymate/db";

export const tripsRouter = router({
  /** Create a new trip listing */
  create: protectedProcedure
    .input(z.object({
      originCity: z.string().min(1),
      originCode: z.string().min(2).max(10),
      destCity: z.string().min(1),
      destCode: z.string().min(2).max(10),
      departureDate: z.string(), // ISO date string
      availableKg: z.number().min(0.5).max(50),
      pricePerKg: z.number().min(1).max(100),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [trip] = await db.insert(trips).values({
        travelerId: ctx.user.id,
        originCity: input.originCity,
        originCode: input.originCode.toUpperCase(),
        destCity: input.destCity,
        destCode: input.destCode.toUpperCase(),
        departureDate: new Date(input.departureDate),
        availableKg: input.availableKg.toFixed(2),
        remainingKg: input.availableKg.toFixed(2),
        pricePerKg: input.pricePerKg.toFixed(2),
        notes: input.notes,
      }).returning();
      return trip;
    }),

  /** List trips for the current traveler */
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      return db
        .select()
        .from(trips)
        .where(eq(trips.travelerId, ctx.user.id))
        .orderBy(desc(trips.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  /** Get a single trip by ID */
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const [trip] = await db
        .select({
          id: trips.id,
          travelerId: trips.travelerId,
          originCity: trips.originCity,
          originCode: trips.originCode,
          destCity: trips.destCity,
          destCode: trips.destCode,
          departureDate: trips.departureDate,
          availableKg: trips.availableKg,
          remainingKg: trips.remainingKg,
          pricePerKg: trips.pricePerKg,
          notes: trips.notes,
          status: trips.status,
          createdAt: trips.createdAt,
          updatedAt: trips.updatedAt,
          travelerName: users.name,
          travelerTier: users.carrierTier,
          travelerRating: users.averageRating,
          travelerDeliveries: users.completedDeliveries,
        })
        .from(trips)
        .leftJoin(users, eq(trips.travelerId, users.id))
        .where(eq(trips.id, input.id))
        .limit(1);
      if (!trip) throw new TRPCError({ code: "NOT_FOUND", message: "Trip not found" });
      return trip;
    }),

  /** Update available space on a trip */
  updateSpace: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      availableKg: z.number().min(0).max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const [trip] = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.id))
        .limit(1);
      if (!trip) throw new TRPCError({ code: "NOT_FOUND" });
      if (trip.travelerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      await db
        .update(trips)
        .set({ availableKg: input.availableKg.toFixed(2), updatedAt: new Date() })
        .where(eq(trips.id, input.id));
      return { success: true };
    }),

  /** Mark a trip as complete */
  complete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [trip] = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.id))
        .limit(1);
      if (!trip) throw new TRPCError({ code: "NOT_FOUND" });
      if (trip.travelerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      await db
        .update(trips)
        .set({ status: "completed", updatedAt: new Date() })
        .where(eq(trips.id, input.id));
      return { success: true };
    }),

  /** Get open trips for sender matching (filtered by corridor) */
  openTrips: protectedProcedure
    .input(z.object({
      originCode: z.string().optional(),
      destCode: z.string().optional(),
      limit: z.number().min(1).max(100).default(50),
    }))
    .query(async ({ input }) => {
      const conditions = [eq(trips.status, "open")];
      if (input.originCode) conditions.push(eq(trips.originCode, input.originCode.toUpperCase()));
      if (input.destCode) conditions.push(eq(trips.destCode, input.destCode.toUpperCase()));
      return db
        .select({
          id: trips.id,
          travelerId: trips.travelerId,
          originCity: trips.originCity,
          originCode: trips.originCode,
          destCity: trips.destCity,
          destCode: trips.destCode,
          departureDate: trips.departureDate,
          availableKg: trips.availableKg,
          remainingKg: trips.remainingKg,
          pricePerKg: trips.pricePerKg,
          status: trips.status,
          createdAt: trips.createdAt,
          travelerName: users.name,
          travelerTier: users.carrierTier,
          travelerRating: users.averageRating,
          travelerDeliveries: users.completedDeliveries,
        })
        .from(trips)
        .leftJoin(users, eq(trips.travelerId, users.id))
        .where(and(...conditions))
        .orderBy(desc(trips.createdAt))
        .limit(input.limit);
    }),
});
