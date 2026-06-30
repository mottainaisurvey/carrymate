import type { FastifyInstance } from 'fastify'
import crypto from 'crypto'
import { db, kycSubmissions, users } from '@carrymate/db'
import { eq } from 'drizzle-orm'
import { notifyUser } from '../../services/notify.js'

export async function sumsubWebhookRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/webhooks/sumsub',
    { config: { rawBody: true } },
    async (req, reply) => {
      // Verify Sumsub HMAC-SHA256 signature
      const digest = req.headers['x-payload-digest'] as string
      if (!digest) return reply.status(403).send({ error: 'Missing digest header' })

      const secret = process.env.SUMSUB_SECRET_KEY ?? ''
      // @ts-expect-error rawBody added by fastify-raw-body
      const rawBody = req.rawBody as Buffer
      const computed = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex')

      if (computed !== digest) {
        fastify.log.warn('[Sumsub webhook] Invalid signature')
        return reply.status(403).send({ error: 'Invalid signature' })
      }

      const body = req.body as {
        type: string
        applicantId: string
        reviewResult?: {
          reviewAnswer: 'GREEN' | 'RED'
          rejectLabels?: string[]
          reviewRejectType?: string
        }
      }

      fastify.log.info(`[Sumsub webhook] Event type: ${body.type}, applicantId: ${body.applicantId}`)

      if (body.type === 'applicantReviewed' && body.reviewResult) {
        const isApproved = body.reviewResult.reviewAnswer === 'GREEN'
        const kycStatus = isApproved ? 'verified' : 'rejected'

        // Update kyc_submissions record
        await db
          .update(kycSubmissions)
          .set({
            status: kycStatus,
            reviewedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(kycSubmissions.applicantId, body.applicantId))

        // Fetch the submission to get userId
        const [submission] = await db
          .select()
          .from(kycSubmissions)
          .where(eq(kycSubmissions.applicantId, body.applicantId))
          .limit(1)

        if (submission) {
          // Update user kycStatus
          await db
            .update(users)
            .set({ kycStatus, updatedAt: new Date() })
            .where(eq(users.id, submission.userId))

          // Push notification to user
          await notifyUser(submission.userId, {
            type: 'booking_created', // closest available type for system notifications
            title: isApproved ? 'Identity verified ✓' : 'Verification unsuccessful',
            body: isApproved
              ? 'You can now post trips and carry parcels.'
              : 'Please resubmit your documents in the app.',
          })
        }
      }

      if (body.type === 'applicantPending') {
        await db
          .update(kycSubmissions)
          .set({ status: 'pending', updatedAt: new Date() })
          .where(eq(kycSubmissions.applicantId, body.applicantId))
      }

      return reply.send({ ok: true })
    }
  )
}
