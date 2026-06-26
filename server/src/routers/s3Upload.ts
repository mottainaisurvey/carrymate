/**
 * S3 upload procedures — pre-signed URL generation for parcel photos.
 * Merged into parcels router or used standalone.
 */
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '../trpc.js'
import { db, parcels } from '@carrymate/db'
import { getPresignedUploadUrl, getS3Url } from '../services/s3.js'

export const s3UploadRouter = router({
  /**
   * Generate a pre-signed S3 PUT URL for a parcel pickup photo.
   * The mobile app uploads directly to S3, then calls confirmPhotoUpload.
   */
  getParcelUploadUrl: protectedProcedure
    .input(
      z.object({
        parcelId: z.string().uuid(),
        mimeType: z.string().regex(/^image\/(jpeg|png|webp|heic)$/, 'Only image uploads are allowed'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db
        .select()
        .from(parcels)
        .where(eq(parcels.id, input.parcelId))
        .limit(1)

      if (!parcel) throw new TRPCError({ code: 'NOT_FOUND' })
      if (parcel.senderId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const ext = input.mimeType.split('/')[1]
      const key = `parcels/${input.parcelId}/pickup-photo-${Date.now()}.${ext}`

      const uploadUrl = await getPresignedUploadUrl({
        key,
        contentType: input.mimeType,
        expiresIn: 300, // 5 minutes
      })

      return { uploadUrl, key, expiresIn: 300 }
    }),

  /**
   * Confirm a successful S3 upload by storing the photo URL in the parcel record.
   */
  confirmParcelPhotoUpload: protectedProcedure
    .input(
      z.object({
        parcelId: z.string().uuid(),
        s3Key: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [parcel] = await db
        .select()
        .from(parcels)
        .where(eq(parcels.id, input.parcelId))
        .limit(1)

      if (!parcel) throw new TRPCError({ code: 'NOT_FOUND' })
      if (parcel.senderId !== ctx.user.id && ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }

      const photoUrl = getS3Url(input.s3Key)

      await db
        .update(parcels)
        .set({ pickupPhotoUrl: photoUrl, updatedAt: new Date() })
        .where(eq(parcels.id, input.parcelId))

      return { success: true, photoUrl }
    }),
})
