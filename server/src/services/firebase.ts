/**
 * Firebase Cloud Messaging (FCM) service — firebase-admin v14 API.
 * Uses named imports from firebase-admin/app and firebase-admin/messaging.
 */
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

let _app: App | null = null

function getFirebaseApp(): App | null {
  if (_app) return _app
  if (getApps().length > 0) {
    _app = getApps()[0]!
    return _app
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!serviceAccountJson) {
    console.warn('[FCM] FIREBASE_SERVICE_ACCOUNT_JSON not set — push notifications disabled')
    return null
  }

  try {
    _app = initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) })
  } catch (err) {
    console.error('[FCM] Failed to initialize Firebase app:', err)
    return null
  }

  return _app
}

/**
 * Send a push notification to a single device token via FCM.
 * Silently skips if Firebase is not configured or token is missing.
 */
export async function sendPushNotification(
  pushToken: string | null | undefined,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<boolean> {
  if (!pushToken) return false
  const app = getFirebaseApp()
  if (!app) return false

  try {
    await getMessaging(app).send({
      token: pushToken,
      notification: { title, body },
      ...(data ? { data } : {}),
      apns: { payload: { aps: { sound: 'default' } } },
      android: { notification: { sound: 'default' } },
    })
    return true
  } catch (err) {
    console.error('[FCM] Failed to send push notification:', err)
    return false
  }
}

/**
 * Send push notifications to multiple tokens in a single batch.
 * Returns count of successful sends.
 */
export async function sendMulticastPush(
  tokens: string[],
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<number> {
  if (tokens.length === 0) return 0
  const app = getFirebaseApp()
  if (!app) return 0

  try {
    const response = await getMessaging(app).sendEachForMulticast({
      tokens,
      notification: { title, body },
      ...(data ? { data } : {}),
      apns: { payload: { aps: { sound: 'default' } } },
      android: { notification: { sound: 'default' } },
    })
    return response.successCount
  } catch (err) {
    console.error('[FCM] Multicast send failed:', err)
    return 0
  }
}
