/**
 * Escrow Worker — runs every hour.
 * Finds payments held for > 72 hours without delivery confirmation
 * and auto-creates a dispute record, notifying both parties and ops.
 */
import cron from 'node-cron'
import { db, payments, bookings, disputes, users } from '@carrymate/db'
import { eq, and, lte, sql } from 'drizzle-orm'
import { notifyUser } from '../services/notify.js'

const ESCROW_TIMEOUT_HOURS = 72

async function runEscrowJob() {
  try {
    const cutoff = new Date(Date.now() - ESCROW_TIMEOUT_HOURS * 60 * 60 * 1000)

    // Find payments held for > 72 hours with no delivery confirmation
    const stalePayments = await db
      .select({
        paymentId: payments.id,
        bookingId: payments.bookingId,
        senderId: payments.senderId,
        travelerId: payments.travelerId,
        heldAt: payments.heldAt,
      })
      .from(payments)
      .innerJoin(bookings, eq(bookings.id, payments.bookingId))
      .where(
        and(
          eq(payments.status, 'held'),
          lte(payments.heldAt, cutoff),
          // No delivery OTP confirmed
          sql`${bookings.deliveryVerifiedAt} IS NULL`
        )
      )
      .limit(20)

    for (const stalePayment of stalePayments) {
      // Check if a dispute already exists for this booking
      const [existingDispute] = await db
        .select({ id: disputes.id })
        .from(disputes)
        .where(eq(disputes.bookingId, stalePayment.bookingId))
        .limit(1)

      if (existingDispute) continue // Already raised

      // Auto-create dispute
      await db.insert(disputes).values({
        bookingId: stalePayment.bookingId,
        raisedBy: stalePayment.senderId,
        reason: `Automatic dispute: payment held for more than ${ESCROW_TIMEOUT_HOURS} hours without delivery confirmation.`,
        status: 'open',
      })

      // Update booking status
      await db
        .update(bookings)
        .set({ status: 'disputed', updatedAt: new Date() })
        .where(eq(bookings.id, stalePayment.bookingId))

      // Notify sender
      await notifyUser(stalePayment.senderId, {
        type: 'dispute_raised',
        title: 'Delivery overdue — dispute opened',
        body: 'Your parcel delivery is overdue. A dispute has been automatically opened. Our team will investigate.',
        bookingId: stalePayment.bookingId,
      })

      // Notify traveler
      await notifyUser(stalePayment.travelerId, {
        type: 'dispute_raised',
        title: 'Dispute opened on your delivery',
        body: 'A dispute has been opened because delivery was not confirmed within 72 hours. Please contact support.',
        bookingId: stalePayment.bookingId,
      })

      // Notify admin (find first admin user)
      const [admin] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, 'admin'))
        .limit(1)

      if (admin) {
        await notifyUser(admin.id, {
          type: 'dispute_raised',
          title: 'Auto-dispute raised',
          body: `Booking ${stalePayment.bookingId} has been auto-disputed after ${ESCROW_TIMEOUT_HOURS}h without delivery.`,
          bookingId: stalePayment.bookingId,
        })
      }

      console.log(`[EscrowWorker] Auto-dispute raised for booking ${stalePayment.bookingId}`)
    }
  } catch (err) {
    console.error('[EscrowWorker] Error:', err)
  }
}

export function startEscrowWorker() {
  console.log('[EscrowWorker] Starting — runs every hour')
  cron.schedule('0 * * * *', runEscrowJob) // top of every hour
}
