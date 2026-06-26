import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc.js'
import { db, payments, bookings, users, parcels } from '@carrymate/db'
import {
  createEscrowPaymentIntent,
  capturePaymentIntent,
  transferToTraveler,
  refundPaymentIntent,
} from '../services/stripe.js'
import { initializePaystackTransaction } from '../services/paystack.js'
import { notifyUser } from '../services/notify.js'

/** Detect whether a corridor uses Paystack (NGN/GHS) or Stripe (GBP/EUR) */
function isPaystackCorridor(destCode: string): boolean {
  const paystackDests = ['LOS', 'ABV', 'ACC', 'KAN', 'PHC']
  return paystackDests.includes(destCode.toUpperCase())
}

export const paymentsRouter = router({
  /** Create an escrow hold — routes to Stripe or Paystack based on corridor */
  createEscrowHold: protectedProcedure
    .input(z.object({
      bookingId: z.string().uuid(),
      returnUrl: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1)
      if (!booking) throw new TRPCError({ code: 'NOT_FOUND' })
      if (booking.senderId !== ctx.user.id) throw new TRPCError({ code: 'FORBIDDEN' })

      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1)
      if (!payment) throw new TRPCError({ code: 'NOT_FOUND', message: 'Payment record not found' })
      if (payment.status !== 'pending') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Payment already processed' })

      const [parcel] = await db.select().from(parcels).where(eq(parcels.id, booking.parcelId)).limit(1)
      if (!parcel) throw new TRPCError({ code: 'NOT_FOUND', message: 'Parcel not found' })

      const [sender] = await db.select({ email: users.email }).from(users).where(eq(users.id, ctx.user.id)).limit(1)
      const totalPence = Math.round(parseFloat(payment.amount) * 100)

      if (isPaystackCorridor(parcel.destCode)) {
        const callbackUrl = input.returnUrl ?? `${process.env.WEB_URL ?? 'https://app.carrymate.io'}/send/confirm`
        const result = await initializePaystackTransaction({
          amountKobo: totalPence,
          email: sender?.email ?? `user-${ctx.user.id}@carrymate.io`,
          currency: 'NGN',
          parcelId: parcel.id,
          bookingId: booking.id,
          senderId: booking.senderId,
          travelerId: booking.travelerId,
          callbackUrl,
        })
        await db.update(payments).set({
          paystackAccessCode: result.data.access_code,
          paystackReference: result.data.reference,
          updatedAt: new Date(),
        }).where(eq(payments.bookingId, input.bookingId))
        return { provider: 'paystack' as const, authorizationUrl: result.data.authorization_url, reference: result.data.reference }
      } else {
        const pi = await createEscrowPaymentIntent({
          amountPence: totalPence,
          currency: payment.currency ?? 'gbp',
          parcelId: parcel.id,
          bookingId: booking.id,
          senderId: booking.senderId,
          travelerId: booking.travelerId,
        })
        await db.update(payments).set({
          stripePaymentIntentId: pi.id,
          status: 'held',
          heldAt: new Date(),
          updatedAt: new Date(),
        }).where(eq(payments.bookingId, input.bookingId))
        await db.update(bookings).set({ status: 'confirmed', updatedAt: new Date() }).where(eq(bookings.id, input.bookingId))
        return { provider: 'stripe' as const, clientSecret: pi.client_secret, paymentIntentId: pi.id }
      }
    }),

  /** Release escrow to traveler after delivery confirmed */
  releaseEscrow: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1)
      if (!booking) throw new TRPCError({ code: 'NOT_FOUND' })
      if (booking.senderId !== ctx.user.id && ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' })
      if (booking.status !== 'delivered') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Can only release escrow after delivery' })

      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1)
      if (!payment) throw new TRPCError({ code: 'NOT_FOUND' })

      if (payment.stripePaymentIntentId) {
        await capturePaymentIntent(payment.stripePaymentIntentId)
        const [traveler] = await db.select({ stripeAccountId: users.stripeAccountId }).from(users).where(eq(users.id, booking.travelerId)).limit(1)
        if (traveler?.stripeAccountId) {
          const serviceFee = Math.round(parseFloat(payment.amount) * 0.1 * 100)
          const travelerPayout = Math.round(parseFloat(payment.amount) * 100) - serviceFee
          const transfer = await transferToTraveler({
            amountPence: travelerPayout,
            currency: payment.currency ?? 'gbp',
            destination: traveler.stripeAccountId,
            parcelId: booking.parcelId,
          })
          await db.update(payments).set({ stripeTransferId: transfer.id, status: 'released', releasedAt: new Date(), updatedAt: new Date() }).where(eq(payments.bookingId, input.bookingId))
        } else {
          await db.update(payments).set({ status: 'released', releasedAt: new Date(), updatedAt: new Date() }).where(eq(payments.bookingId, input.bookingId))
        }
      } else {
        await db.update(payments).set({ status: 'released', releasedAt: new Date(), updatedAt: new Date() }).where(eq(payments.bookingId, input.bookingId))
      }

      await notifyUser(booking.travelerId, { type: 'delivery_confirmed', title: 'Payment released 💰', body: 'Your earnings have been released. Check your balance.', bookingId: booking.id })
      return { success: true, status: 'released' }
    }),

  /** Refund escrow to sender (admin only) */
  refundEscrow: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can issue refunds' })
      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1)
      if (!payment) throw new TRPCError({ code: 'NOT_FOUND' })
      if (payment.stripePaymentIntentId) await refundPaymentIntent(payment.stripePaymentIntentId)
      await db.update(payments).set({ status: 'refunded', updatedAt: new Date() }).where(eq(payments.bookingId, input.bookingId))
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1)
      if (booking) await notifyUser(booking.senderId, { type: 'booking_created', title: 'Refund issued', body: 'Your payment has been refunded. It may take 3–5 business days to appear.', bookingId: booking.id })
      return { success: true, status: 'refunded' }
    }),

  /** Get payment status for a booking */
  getStatus: protectedProcedure
    .input(z.object({ bookingId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [booking] = await db.select().from(bookings).where(eq(bookings.id, input.bookingId)).limit(1)
      if (!booking) throw new TRPCError({ code: 'NOT_FOUND' })
      if (booking.senderId !== ctx.user.id && booking.travelerId !== ctx.user.id && ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' })
      const [payment] = await db.select().from(payments).where(eq(payments.bookingId, input.bookingId)).limit(1)
      return payment ?? null
    }),
})
