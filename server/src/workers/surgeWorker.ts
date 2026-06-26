/**
 * Surge Worker — runs every 30 minutes.
 * Adjusts corridor surge multipliers based on parcel/traveler demand ratio.
 */
import cron from 'node-cron'
import { db, parcels, trips, corridorRules, auditLogs } from '@carrymate/db'
import { eq, and, count, sql } from 'drizzle-orm'

const SURGE_THRESHOLD_MODERATE = 2 // 2:1 ratio → 1.15x
const SURGE_THRESHOLD_HIGH = 4     // 4:1 ratio → 1.25x
const SURGE_MODERATE = '1.15'
const SURGE_HIGH = '1.25'
const SURGE_NORMAL = '1.00'

async function runSurgeJob() {
  try {
    // Get all active corridors
    const corridors = await db
      .select()
      .from(corridorRules)
      .where(eq(corridorRules.isActive, true))

    for (const corridor of corridors) {
      const { originCode, destCode, corridorKey } = corridor

      // Count unmatched parcels on this corridor
      const [parcelCount] = await db
        .select({ count: count() })
        .from(parcels)
        .where(
          and(
            eq(parcels.originCode, originCode),
            eq(parcels.destCode, destCode),
            eq(parcels.status, 'pending')
          )
        )

      // Count available traveler slots (open trips with remaining capacity)
      const [tripCount] = await db
        .select({ count: count() })
        .from(trips)
        .where(
          and(
            eq(trips.originCode, originCode),
            eq(trips.destCode, destCode),
            eq(trips.status, 'open')
          )
        )

      const parcelDemand = parcelCount?.count ?? 0
      const travelerSlots = tripCount?.count ?? 0

      let newMultiplier = SURGE_NORMAL
      if (travelerSlots === 0 && parcelDemand > 0) {
        newMultiplier = SURGE_HIGH
      } else if (travelerSlots > 0) {
        const ratio = parcelDemand / travelerSlots
        if (ratio >= SURGE_THRESHOLD_HIGH) {
          newMultiplier = SURGE_HIGH
        } else if (ratio >= SURGE_THRESHOLD_MODERATE) {
          newMultiplier = SURGE_MODERATE
        }
      }

      const currentMultiplier = corridor.surgeMultiplier?.toString() ?? SURGE_NORMAL
      if (newMultiplier !== currentMultiplier) {
        await db
          .update(corridorRules)
          .set({ surgeMultiplier: newMultiplier, updatedAt: new Date() })
          .where(eq(corridorRules.corridorKey, corridorKey))

        // Write audit log entry
        await db.insert(auditLogs).values({
          adminId: sql`(SELECT id FROM users WHERE role = 'admin' LIMIT 1)` as unknown as string,
          adminName: 'SurgeWorker',
          action: 'surge_update',
          targetType: 'corridor',
          metadata: {
            corridorKey,
            previousMultiplier: currentMultiplier,
            newMultiplier,
            parcelDemand,
            travelerSlots,
          },
        })

        console.log(
          `[SurgeWorker] ${corridorKey}: ${currentMultiplier}x → ${newMultiplier}x (${parcelDemand} parcels / ${travelerSlots} slots)`
        )
      }
    }
  } catch (err) {
    console.error('[SurgeWorker] Error:', err)
  }
}

export function startSurgeWorker() {
  console.log('[SurgeWorker] Starting — runs every 30 minutes')
  cron.schedule('*/30 * * * *', runSurgeJob)
}
