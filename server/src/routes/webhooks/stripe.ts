import type { FastifyInstance } from 'fastify'
import { constructStripeEvent } from '../../services/stripe.js'
import { db, payments, bookings } from '@carrymate/db'
import { eq } from 'drizzle-orm'
import { notifyUser } from '../../services/notify.js'

export async function stripeWebhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/webhooks/stripe',
    {
      config: { rawBody: true },
    },
    async (req, reply) => {
      const sig = req.headers['stripe-signature'] as string
      if (!sig) return reply.status(400).send({ error: 'Missing stripe-signature header' })

      let event: ReturnType<typeof constructStripeEvent>
      try {
        // @ts-expect-error rawBody is added by fastify-raw-body plugin
        event = constructStripeEvent(req.rawBody as Buffer, sig)
      } catch (err) {
        fastify.log.error({ err }, '[Stripe webhook] Signature verification failed')
        return reply.status(400).send({ error: 'Invalid signature' })
      }

      fastify.log.info(`[Stripe webhook] Received event: ${event.type}`)

      switch (event.type) {
        case 'payment_intent.payment_failed': {
          const pi = event.data.object as { id: string; metadata: { bookingId?: string } }
          const bookingId = pi.metadata?.bookingId
          if (bookingId) {
            await db
              .update(payments)
              .set({ status: 'failed', updatedAt: new Date() })
              .where(eq(payments.bookingId, bookingId))
            // Notify sender
            const [booking] = await db
              .select()
              .from(bookings)
              .where(eq(bookings.id, bookingId))
              .limit(1)
            if (booking) {
              await notifyUser(booking.senderId, {
                type: 'booking_created',
                title: 'Payment failed',
                body: 'Your payment could not be processed. Please try again.',
                bookingId,
              })
            }
          }
          break
        }

        case 'payment_intent.succeeded': {
          const pi = event.data.object as { id: string; metadata: { bookingId?: string } }
          const bookingId = pi.metadata?.bookingId
          if (bookingId) {
            await db
              .update(payments)
              .set({ status: 'held', heldAt: new Date(), updatedAt: new Date() })
              .where(eq(payments.bookingId, bookingId))
          }
          break
        }

        case 'transfer.created': {
          const transfer = event.data.object as { id: string; transfer_group?: string }
          const parcelId = transfer.transfer_group
          if (parcelId) {
            // Mark payment as released when transfer is confirmed
            await db
              .update(payments)
              .set({ stripeTransferId: transfer.id, status: 'released', releasedAt: new Date(), updatedAt: new Date() })
              .where(eq(payments.stripeTransferId, transfer.id))
          }
          break
        }

        default:
          fastify.log.debug(`[Stripe webhook] Unhandled event type: ${event.type}`)
      }

      return reply.send({ received: true })
    }
  )
}
