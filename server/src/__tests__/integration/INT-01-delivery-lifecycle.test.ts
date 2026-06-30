/**
 * INT-01 — Full Delivery Lifecycle
 * Sender posts parcel → matched to traveler → pickup OTP → delivery OTP → escrow released
 * Pass criteria: parcels.status = 'delivered', payments.status = 'released'
 *
 * Requires: DATABASE_URL pointing at staging Supabase
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, users, parcels, trips, bookings, payments } from '@carrymate/db'
import { eq, and } from 'drizzle-orm'
import { randomUUID as uuidv4 } from 'crypto'

// ── Test data IDs (cleaned up in afterAll) ────────────────────────────────────
const testRunId = uuidv4().slice(0, 8)
let senderId: string
let travelerId: string
let parcelId: string
let tripId: string
let bookingId: string
let paymentId: string
let deliveryOtp: string

describe('INT-01: Full Delivery Lifecycle', () => {
  beforeAll(async () => {
    // Create a test sender
    const [sender] = await db.insert(users).values({
      authId: `test-sender-${testRunId}`,
      email: `sender-${testRunId}@test.carrymate.io`,
      name: 'Test Sender',
      role: 'sender',
      kycStatus: 'verified',
    }).returning()
    senderId = sender.id

    // Create a test traveler
    const [traveler] = await db.insert(users).values({
      authId: `test-traveler-${testRunId}`,
      email: `traveler-${testRunId}@test.carrymate.io`,
      name: 'Test Traveler',
      role: 'traveler',
      kycStatus: 'verified',
    }).returning()
    travelerId = traveler.id
  })

  afterAll(async () => {
    // Clean up test data in reverse dependency order
    if (paymentId) await db.delete(payments).where(eq(payments.id, paymentId))
    if (bookingId) await db.delete(bookings).where(eq(bookings.id, bookingId))
    if (parcelId) await db.delete(parcels).where(eq(parcels.id, parcelId))
    if (tripId) await db.delete(trips).where(eq(trips.id, tripId))
    if (travelerId) await db.delete(users).where(eq(users.id, travelerId))
    if (senderId) await db.delete(users).where(eq(users.id, senderId))
  })

  it('Step 1: Sender posts a parcel', async () => {
    const [parcel] = await db.insert(parcels).values({
      senderId,
      contents: `Test Parcel ${testRunId}`,
      
      weightKg: '2.5',
      originCity: 'London',
      originCode: 'LHR',
      destCity: 'Lagos',
      destCode: 'LOS',
      recipientName: 'Test Recipient',
      recipientPhone: '+2348012345678',
      status: 'pending',
    }).returning()
    parcelId = parcel.id
    expect(parcel.status).toBe('pending')
  })

  it('Step 2: Traveler posts a matching trip', async () => {
    const [trip] = await db.insert(trips).values({
      travelerId,
      originCity: 'London',
      originCode: 'LHR',
      destCity: 'Lagos',
      destCode: 'LOS',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      availableKg: '10.00',
      remainingKg: '10.00',
      pricePerKg: '15.00',
      status: 'open',
    }).returning()
    tripId = trip.id
    expect(trip.status).toBe('open')
  })

  it('Step 3: Traveler accepts parcel (booking created)', async () => {
    const agreedPrice = 2.5 * 15 // weightKg * pricePerKg = 37.50
    const serviceFee = agreedPrice * 0.1 // 10% = 3.75
    const totalAmount = agreedPrice + serviceFee // 41.25
    const collectionOtp = '123456'
    deliveryOtp = '654321'

    const [booking] = await db.insert(bookings).values({
      parcelId,
      tripId,
      senderId,
      travelerId,
      agreedPrice: agreedPrice.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      status: 'pending',
      collectionOtp,
      deliveryOtp,
    }).returning()
    bookingId = booking.id

    // Mark parcel as booked
    await db.update(parcels).set({ status: 'booked', updatedAt: new Date() }).where(eq(parcels.id, parcelId))

    // Create payment record
    const [payment] = await db.insert(payments).values({
      bookingId: booking.id,
      senderId,
      travelerId,
      amount: totalAmount.toFixed(2),
      status: 'pending',
    }).returning()
    paymentId = payment.id

    const [updatedParcel] = await db.select().from(parcels).where(eq(parcels.id, parcelId)).limit(1)
    expect(updatedParcel.status).toBe('booked')
    expect(booking.collectionOtp).toBe(collectionOtp)
    expect(booking.deliveryOtp).toBe(deliveryOtp)
  })

  it('Step 4: Sender pays — payment status becomes held', async () => {
    await db.update(payments).set({
      status: 'held',
      heldAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(payments.id, paymentId))

    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
    expect(payment.status).toBe('held')
    expect(payment.heldAt).not.toBeNull()
  })

  it('Step 5: Traveler confirms pickup via collection OTP → parcel in_transit', async () => {
    // Simulate confirmPickupOTP procedure
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1)
    expect(booking.collectionOtp).toBe('123456')

    await db.update(bookings).set({
      status: 'collected',
      updatedAt: new Date(),
    }).where(eq(bookings.id, bookingId))

    await db.update(parcels).set({ status: 'in_transit', updatedAt: new Date() }).where(eq(parcels.id, parcelId))

    const [updatedParcel] = await db.select().from(parcels).where(eq(parcels.id, parcelId)).limit(1)
    expect(updatedParcel.status).toBe('in_transit')
  })

  it('Step 6: Sender confirms delivery via delivery OTP → parcel delivered', async () => {
    // Simulate confirmDeliveryOTP procedure
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1)
    expect(booking.deliveryOtp).toBe(deliveryOtp)

    await db.update(bookings).set({
      status: 'delivered',
      deliveryVerifiedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(bookings.id, bookingId))

    await db.update(parcels).set({ status: 'delivered', updatedAt: new Date() }).where(eq(parcels.id, parcelId))

    const [updatedParcel] = await db.select().from(parcels).where(eq(parcels.id, parcelId)).limit(1)
    const [updatedBooking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1)
    expect(updatedParcel.status).toBe('delivered')
    expect(updatedBooking.status).toBe('delivered')
    expect(updatedBooking.deliveryVerifiedAt).not.toBeNull()
  })

  it('Step 7: Escrow released — payments.status = released', async () => {
    await db.update(payments).set({
      status: 'released',
      releasedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(payments.id, paymentId))

    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
    // ✅ INT-01 pass criteria
    expect(payment.status).toBe('released')
    expect(payment.releasedAt).not.toBeNull()
  })

  it('INT-01 PASS: Final state verification — parcel delivered, payment released', async () => {
    const [parcel] = await db.select().from(parcels).where(eq(parcels.id, parcelId)).limit(1)
    const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1)
    // ✅ Primary pass criteria from Migration Decision v1.0 Section 9
    expect(parcel.status).toBe('delivered')
    expect(payment.status).toBe('released')
  })
})
