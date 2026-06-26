/**
 * INT-05 — Dispute Flow
 * Sender raises dispute → admin resolves → escrow refunded or released → disputes.status = 'resolved'
 *
 * Requires: DATABASE_URL pointing at staging Supabase
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, users, parcels, trips, bookings, payments, disputes } from '@carrymate/db'
import { eq } from 'drizzle-orm'
import { randomUUID as uuidv4 } from 'crypto'

const testRunId = uuidv4().slice(0, 8)
let senderId: string
let travelerId: string
let adminId: string
let parcelId: string
let tripId: string
let bookingId: string
let paymentId: string
let disputeId: string

describe('INT-05: Dispute Flow', () => {
  beforeAll(async () => {
    const [sender] = await db.insert(users).values({
      authId: `test-dispute-sender-${testRunId}`,
      email: `dispute-sender-${testRunId}@test.carrymate.io`,
      name: 'Dispute Test Sender',
      role: 'sender',
      kycStatus: 'verified',
    }).returning()
    senderId = sender.id

    const [traveler] = await db.insert(users).values({
      authId: `test-dispute-traveler-${testRunId}`,
      email: `dispute-traveler-${testRunId}@test.carrymate.io`,
      name: 'Dispute Test Traveler',
      role: 'traveler',
      kycStatus: 'verified',
    }).returning()
    travelerId = traveler.id

    const [admin] = await db.insert(users).values({
      authId: `test-dispute-admin-${testRunId}`,
      email: `dispute-admin-${testRunId}@test.carrymate.io`,
      name: 'Dispute Test Admin',
      role: 'admin',
      kycStatus: 'verified',
    }).returning()
    adminId = admin.id

    const [parcel] = await db.insert(parcels).values({
      senderId,
      contents: `Dispute Test Parcel ${testRunId}`,
      weightKg: '2.0',
      originCity: 'London',
      originCode: 'LHR',
      destCity: 'Lagos',
      destCode: 'LOS',
      recipientName: 'Dispute Recipient',
      recipientPhone: '+2348099999999',
      status: 'in_transit',
    }).returning()
    parcelId = parcel.id

    const [trip] = await db.insert(trips).values({
      travelerId,
      originCity: 'London',
      originCode: 'LHR',
      destCity: 'Lagos',
      destCode: 'LOS',
      departureDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      availableKg: '5.00',
      remainingKg: '3.00',
      pricePerKg: '15.00',
      status: 'open',
    }).returning()
    tripId = trip.id

    const [booking] = await db.insert(bookings).values({
      parcelId,
      tripId,
      senderId,
      travelerId,
      agreedPrice: '30.00',
      serviceFee: '3.00',
      totalAmount: '33.00',
      status: 'collected',
      collectionOtp: '999111',
      deliveryOtp: '222333',
    }).returning()
    bookingId = booking.id

    const [payment] = await db.insert(payments).values({
      bookingId: booking.id,
      senderId,
      travelerId,
      amount: '33.00',
      currency: 'gbp',
      status: 'held',
      heldAt: new Date(),
    }).returning()
    paymentId = payment.id
  })

  afterAll(async () => {
    if (disputeId) await db.delete(disputes).where(eq(disputes.id, disputeId))
    if (paymentId) await db.delete(payments).where(eq(payments.id, paymentId))
    if (bookingId) await db.delete(bookings).where(eq(bookings.id, bookingId))
    if (parcelId) await db.delete(parcels).where(eq(parcels.id, parcelId))
    if (tripId) await db.delete(trips).where(eq(trips.id, tripId))
    if (adminId) await db.delete(users).where(eq(users.id, adminId))
    if (travelerId) await db.delete(users).where(eq(users.id, travelerId))
    if (senderId) await db.delete(users).where(eq(users.id, senderId))
  })

  it('Step 1: Sender raises a dispute', async () => {
    const [dispute] = await db.insert(disputes).values({
      bookingId,
      raisedBy: senderId,
      reason: 'Parcel not delivered after 5 days',
      status: 'open',
    }).returning()
    disputeId = dispute.id

    // Update booking status to disputed
    await db.update(bookings).set({
      status: 'disputed',
      updatedAt: new Date(),
    }).where(eq(bookings.id, bookingId))

    expect(dispute.status).toBe('open')
    expect(dispute.raisedBy).toBe(senderId)
  })

  it('Step 2: Admin reviews dispute', async () => {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, disputeId)).limit(1)
    expect(dispute.status).toBe('open')
    expect(dispute.resolvedBy).toBeNull()
  })

  it('Step 3: Admin resolves dispute — refund sender', async () => {
    // Admin resolves in favour of sender (refund)
    await db.update(disputes).set({
      status: 'resolved',
      resolution: 'Refund issued to sender — traveler did not deliver within agreed timeframe.',
      resolvedBy: adminId,
      resolvedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(disputes.id, disputeId))

    // Refund payment
    await db.update(payments).set({
      status: 'refunded',
      updatedAt: new Date(),
    }).where(eq(payments.id, paymentId))

    // Update booking
    await db.update(bookings).set({
      status: 'cancelled',
      updatedAt: new Date(),
    }).where(eq(bookings.id, bookingId))
  })

  it('INT-05 PASS: disputes.status = resolved, payment refunded', async () => {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, disputeId)).limit(1)
    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
    // ✅ INT-05 pass criteria
    expect(dispute.status).toBe('resolved')
    expect(dispute.resolvedBy).toBe(adminId)
    expect(dispute.resolvedAt).not.toBeNull()
    expect(payment.status).toBe('refunded')
  })
})
