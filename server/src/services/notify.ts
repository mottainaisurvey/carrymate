/**
 * notifyUser — creates a DB notification record and sends an FCM push.
 * Replaces all TODO stubs in procedures.
 */
import { db, notifications, users } from '@carrymate/db'
import { eq } from 'drizzle-orm'
import { sendPushNotification } from './firebase.js'

export type NotificationType =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_accepted'
  | 'collection_verified'
  | 'delivery_confirmed'
  | 'dispute_raised'
  | 'new_message'
  | 'review_received'

export async function notifyUser(
  userId: string,
  {
    type,
    title,
    body,
    bookingId,
  }: {
    type: NotificationType
    title: string
    body: string
    bookingId?: string
  }
): Promise<void> {
  // 1. Persist notification in DB
  await db.insert(notifications).values({
    userId,
    type,
    title,
    body,
    ...(bookingId ? { bookingId } : {}),
  })

  // 2. Send FCM push if user has a push token
  const [user] = await db
    .select({ pushToken: users.pushToken })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (user?.pushToken) {
    await sendPushNotification(user.pushToken, title, body)
  }
}
