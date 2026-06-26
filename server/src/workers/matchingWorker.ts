/**
 * Matching Worker — runs every 5 minutes.
 * Finds unmatched parcels and notifies the top 3 eligible traveler matches.
 */
import cron from 'node-cron'
import { db, parcels, trips, users } from '@carrymate/db'
import { eq, and, gte, lte, sql } from 'drizzle-orm'
import { sendMulticastPush } from '../services/firebase.js'
import { notifyUser } from '../services/notify.js'

async function runMatchingJob() {
  try {
    // Find pending (unmatched) parcels
    const pendingParcels = await db
      .select()
      .from(parcels)
      .where(eq(parcels.status, 'pending'))
      .limit(50)

    if (pendingParcels.length === 0) return

    for (const parcel of pendingParcels) {
      // Find open trips on the same corridor within the next 48 hours
      const cutoff = new Date(Date.now() + 48 * 60 * 60 * 1000)
      const matchingTrips = await db
        .select({
          id: trips.id,
          travelerId: trips.travelerId,
          remainingKg: trips.remainingKg,
          pricePerKg: trips.pricePerKg,
          departureDate: trips.departureDate,
        })
        .from(trips)
        .where(
          and(
            eq(trips.originCode, parcel.originCode),
            eq(trips.destCode, parcel.destCode),
            eq(trips.status, 'open'),
            lte(trips.departureDate, cutoff),
            gte(trips.remainingKg, parcel.weightKg)
          )
        )
        .limit(10)

      if (matchingTrips.length === 0) continue

      // Score trips: prefer higher rating, customs-safe parcels, closer departure
      const travelerIds = matchingTrips.map((t) => t.travelerId)
      const travelerProfiles = await db
        .select({ id: users.id, averageRating: users.averageRating, pushToken: users.pushToken })
        .from(users)
        .where(sql`${users.id} = ANY(${travelerIds})`)
        .limit(10)

      const profileMap = new Map(travelerProfiles.map((u) => [u.id, u]))

      const scored = matchingTrips
        .map((trip) => {
          const profile = profileMap.get(trip.travelerId)
          const rating = parseFloat(profile?.averageRating ?? '0')
          const hoursUntilDeparture = (new Date(trip.departureDate).getTime() - Date.now()) / 3600000
          // Score: rating (0–5) + customs bonus (1) + urgency bonus (closer = higher)
          const score = rating + (parcel.isCustomsSafe ? 1 : 0) + Math.max(0, (48 - hoursUntilDeparture) / 48)
          return { trip, profile, score }
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)

      // Notify top 3 traveler matches
      const tokens = scored
        .map((s) => s.profile?.pushToken)
        .filter((t): t is string => Boolean(t))

      if (tokens.length > 0) {
        await sendMulticastPush(
          tokens,
          'New parcel match 📦',
          `A parcel needs carrying from ${parcel.originCity} to ${parcel.destCity} (${parcel.weightKg} kg). Tap to view.`,
          { parcelId: parcel.id, screen: 'browse' }
        )
      }

      // Also create DB notifications for in-app notification centre
      for (const { trip } of scored) {
        await notifyUser(trip.travelerId, {
          type: 'booking_created',
          title: 'New parcel match 📦',
          body: `A parcel needs carrying from ${parcel.originCity} to ${parcel.destCity} (${parcel.weightKg} kg).`,
        })
      }
    }
  } catch (err) {
    console.error('[MatchingWorker] Error:', err)
  }
}

export function startMatchingWorker() {
  console.log('[MatchingWorker] Starting — runs every 5 minutes')
  cron.schedule('*/5 * * * *', runMatchingJob)
}
