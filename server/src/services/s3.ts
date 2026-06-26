import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getS3Client() {
  return new S3Client({
    region: process.env.S3_REGION ?? 'eu-west-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    },
  })
}

const BUCKET = process.env.S3_BUCKET ?? 'carrymate-uploads'

/**
 * Generate a pre-signed PUT URL for direct browser/app upload.
 * The client uploads directly to S3; no data passes through the server.
 */
export async function getPresignedUploadUrl({
  key,
  contentType,
  expiresIn = 300,
}: {
  key: string
  contentType: string
  expiresIn?: number
}): Promise<string> {
  const s3 = getS3Client()
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(s3, command, { expiresIn })
}

/**
 * Build the public S3 URL for a given key.
 */
export function getS3Url(key: string): string {
  const region = process.env.S3_REGION ?? 'eu-west-1'
  return `https://${BUCKET}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Delete an object from S3 (used when a parcel is cancelled).
 */
export async function deleteS3Object(key: string): Promise<void> {
  const s3 = getS3Client()
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
