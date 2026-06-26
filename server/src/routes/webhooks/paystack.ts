import type { FastifyInstance } from 'fastify'
import crypto from 'crypto'
import { db, payments, bookings } from '@carrymate/db'
import { eq } from 'drizzle-orm'
import { notifyUser } from '../../services/notify.js'

export async function paystackWebhookRoutes(fastify: FastifyInstance) {
  fastify.post('/webhooks/paystack', async (req, reply) => {
    // Verify Paystack HMAC-SHA512 signature
    const signature = req.headers['x-paystack-signature'] as string
    if (!signature) return reply.status(400).send({ error: 'Missing signature' })

    const secret = process.env.PAYSTACK_SECRET_KEY ?? ''
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex')

    if (hash !== signature) {
      fastify.log.warn('[Paystack webhook] Invalid signature')
      return reply.status(400).send({ error: 'Invalid signature' })
    }

    const { event, data } = req.body as {
      event: string
      data: {
        reference: string
        status: string
        metadata?: {
          parcelId?: string
          bookingId?: string
          senderId?: string
          travelerId?: string
        }
      }
    }

    fastify.log.info(`[Paystack webhook] Received event: ${event}`)

    if (event === 'charge.success') {
      const bookingId = data.metadata?.bookingId
      if (bookingId) {
        await db
          .update(payments)
          .set({
            paystackReference: data.reference,
            status: 'held',
            heldAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(payments.bookingId, bookingId))

        await db
          .update(bookings)
          .set({ status: 'confirmed', updatedAt: new Date() })
          .where(eq(bookings.id, bookingId))

        // Notify sender that payment was received
        const senderId = data.metadata?.senderId
        if (senderId) {
          await notifyUser(senderId, {
            type: 'booking_confirmed',
            title: 'Payment received ✓',
            body: 'Your payment is held in escrow. The traveler has been notified.',
            bookingId,
          })
        }
      }
    }

    if (event === 'charge.failed') {
      const bookingId = data.metadata?.bookingId
      if (bookingId) {
        await db
          .update(payments)
          .set({ status: 'failed', updatedAt: new Date() })
          .where(eq(payments.bookingId, bookingId))
      }
    }

    return reply.send({ status: 'ok' })
  })
}
