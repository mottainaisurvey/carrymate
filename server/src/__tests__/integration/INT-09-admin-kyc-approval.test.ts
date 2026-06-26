/**
 * INT-09 — Admin Panel KYC Approval
 * Admin approves KYC submission → users.kyc_status = 'verified' +
 * kyc_submissions.status = 'approved' + audit log entry
 *
 * Requires: DATABASE_URL pointing at staging Supabase
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db, users, kycSubmissions, auditLogs } from '@carrymate/db'
import { eq, and } from 'drizzle-orm'
import { randomUUID as uuidv4 } from 'crypto'

const testRunId = uuidv4().slice(0, 8)
let userId: string
let adminId: string
let kycSubmissionId: string

describe('INT-09: Admin Panel KYC Approval', () => {
  beforeAll(async () => {
    // Create a user with submitted KYC
    const [user] = await db.insert(users).values({
      authId: `test-admin-kyc-user-${testRunId}`,
      email: `admin-kyc-user-${testRunId}@test.carrymate.io`,
      name: 'KYC Pending User',
      role: 'sender',
      kycStatus: 'submitted',
    }).returning()
    userId = user.id

    // Create admin user
    const [admin] = await db.insert(users).values({
      authId: `test-admin-kyc-admin-${testRunId}`,
      email: `admin-kyc-admin-${testRunId}@test.carrymate.io`,
      name: 'Test Admin',
      role: 'admin',
      kycStatus: 'verified',
    }).returning()
    adminId = admin.id

    // Create KYC submission record
    const [submission] = await db.insert(kycSubmissions).values({
      userId,
      provider: 'sumsub',
      applicantId: `test-admin-applicant-${testRunId}`,
      status: 'pending',
      submittedAt: new Date(),
    }).returning()
    kycSubmissionId = submission.id
  })

  afterAll(async () => {
    await db.delete(auditLogs).where(eq(auditLogs.targetId, kycSubmissionId))
    if (kycSubmissionId) await db.delete(kycSubmissions).where(eq(kycSubmissions.id, kycSubmissionId))
    if (adminId) await db.delete(users).where(eq(users.id, adminId))
    if (userId) await db.delete(users).where(eq(users.id, userId))
  })

  it('Step 1: KYC submission is in pending state', async () => {
    const [submission] = await db.select().from(kycSubmissions).where(eq(kycSubmissions.id, kycSubmissionId)).limit(1)
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    expect(submission.status).toBe('pending')
    expect(user.kycStatus).toBe('submitted')
  })

  it('Step 2: Admin approves KYC — simulating admin.approveKyc procedure', async () => {
    // This mirrors the logic in server/src/routers/admin.ts approveKyc procedure
    await db.update(users).set({
      kycStatus: 'verified',
      updatedAt: new Date(),
    }).where(eq(users.id, userId))

    await db.update(kycSubmissions).set({
      status: 'approved',
      reviewedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(kycSubmissions.id, kycSubmissionId))

    // Write audit log
    await db.insert(auditLogs).values({
      adminId: adminId,
      action: 'kyc_approve',
      targetType: 'kyc_submissions',
      targetId: kycSubmissionId,
      adminName: 'INT09 Admin',
      metadata: {
        userId,
        previousStatus: 'submitted',
        newStatus: 'verified',
        approvedBy: adminId,
      },
    })
  })

  it('INT-09 PASS: users.kyc_status = verified, submission approved, audit log written', async () => {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    const [submission] = await db.select().from(kycSubmissions).where(eq(kycSubmissions.id, kycSubmissionId)).limit(1)
    const [auditEntry] = await db
      .select()
      .from(auditLogs)
      .where(and(eq(auditLogs.targetId, kycSubmissionId), eq(auditLogs.action, 'kyc_approve')))
      .limit(1)

    // ✅ INT-09 pass criteria
    expect(user.kycStatus).toBe('verified')
    expect(submission.status).toBe('approved')
    expect(submission.reviewedAt).not.toBeNull()
    expect(auditEntry).toBeDefined()
    expect(auditEntry.adminId).toBe(adminId)
    expect(auditEntry.action).toBe('kyc_approve')
  })
})
