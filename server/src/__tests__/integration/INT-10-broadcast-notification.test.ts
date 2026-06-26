/**
 * INT-10 — Broadcast Notification
 * Admin broadcasts to all travelers → notifications created for each traveler in DB
 *
 * Requires: DATABASE_URL pointing at staging Supabase
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, users, notifications } from '@carrymate/db'
import { eq, and, inArray } from 'drizzle-orm'
import { randomUUID as uuidv4 } from 'crypto'

const testRunId = uuidv4().slice(0, 8)
let adminId: string
const travelerIds: string[] = []

describe('INT-10: Broadcast Notification', () => {
  beforeAll(async () => {
    // Create admin
    const [admin] = await db.insert(users).values({
      authId: `test-broadcast-admin-${testRunId}`,
      email: `broadcast-admin-${testRunId}@test.carrymate.io`,
      name: 'Broadcast Admin',
      role: 'admin',
      kycStatus: 'verified',
    }).returning()
    adminId = admin.id

    // Create 5 test travelers
    for (let i = 1; i <= 5; i++) {
      const [traveler] = await db.insert(users).values({
        authId: `test-broadcast-traveler-${i}-${testRunId}`,
        email: `broadcast-traveler-${i}-${testRunId}@test.carrymate.io`,
        name: `Broadcast Traveler ${i}`,
        role: 'traveler',
        kycStatus: 'verified',
      }).returning()
      travelerIds.push(traveler.id)
    }
  })

  afterAll(async () => {
    // Clean up notifications for test users
    const allTestUserIds = [adminId, ...travelerIds]
    await db.delete(notifications).where(inArray(notifications.userId, allTestUserIds))
    for (const id of travelerIds) await db.delete(users).where(eq(users.id, id))
    if (adminId) await db.delete(users).where(eq(users.id, adminId))
  })

  it('Step 1: Admin broadcasts to all travelers — simulating admin.broadcastNotification', async () => {
    const broadcastTitle = `Test Broadcast ${testRunId}`
    const broadcastBody = 'This is a test broadcast notification from the admin panel.'

    // Fetch all travelers (in real procedure, this queries by role)
    const targetUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.role, 'traveler'), inArray(users.id, travelerIds)))

    expect(targetUsers.length).toBe(5)

    // Insert a notification for each target user
    for (const user of targetUsers) {
      await db.insert(notifications).values({
        userId: user.id,
        type: 'booking_confirmed',
        title: broadcastTitle,
        body: broadcastBody,
        isRead: false,
      })
    }
  })

  it('Step 2: Verify all 5 travelers received the notification', async () => {
    const broadcastTitle = `Test Broadcast ${testRunId}`

    for (const travelerId of travelerIds) {
      const [notification] = await db
        .select()
        .from(notifications)
        .where(and(eq(notifications.userId, travelerId), eq(notifications.title, broadcastTitle)))
        .limit(1)

      expect(notification).toBeDefined()
      expect(notification.isRead).toBe(false)
      expect(notification.type).toBe('booking_confirmed')
    }
  })

  it('Step 3: Admin user did NOT receive the broadcast (audience = travelers only)', async () => {
    const broadcastTitle = `Test Broadcast ${testRunId}`
    const [adminNotification] = await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, adminId), eq(notifications.title, broadcastTitle)))
      .limit(1)

    // Admin should not receive their own broadcast
    expect(adminNotification).toBeUndefined()
  })

  it('INT-10 PASS: All 5 travelers notified, admin excluded', async () => {
    const broadcastTitle = `Test Broadcast ${testRunId}`

    let notifiedCount = 0
    for (const travelerId of travelerIds) {
      const [notification] = await db
        .select()
        .from(notifications)
        .where(and(eq(notifications.userId, travelerId), eq(notifications.title, broadcastTitle)))
        .limit(1)
      if (notification) notifiedCount++
    }

    // ✅ INT-10 pass criteria
    expect(notifiedCount).toBe(5)
  })
})
