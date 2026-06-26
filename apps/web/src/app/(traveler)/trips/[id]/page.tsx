'use client'

export const dynamic = 'force-dynamic'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import type { RouterOutputs } from '@/lib/trpc'

type Booking = RouterOutputs['bookings']['list'][number]

const BOOKING_STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(200,150,62,0.12)', color: 'var(--gold)', label: 'Awaiting payment' },
  confirmed: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Confirmed' },
  collected: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Collected' },
  in_transit: { bg: 'rgba(29,122,95,0.12)', color: 'var(--teal)', label: 'In transit' },
  delivered: { bg: 'rgba(26,18,8,0.08)', color: 'var(--text-muted)', label: 'Delivered' },
  cancelled: { bg: 'rgba(192,74,42,0.08)', color: 'var(--rust)', label: 'Cancelled' },
}

export default function TripDetailPage() {
  const params = useParams(); const id = (params?.id as string) ?? ''
  const { data: trip, isLoading } = trpc.trips.getById.useQuery({ id })
  const { data: bookings } = trpc.bookings.list.useQuery({ limit: 50, offset: 0 })

  // Filter bookings for this trip
  const tripBookings = bookings?.filter((b: Booking) => b.tripId === id) ?? []

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'var(--warm)' }} />
        <div className="h-48 rounded-3xl animate-pulse" style={{ background: 'var(--warm)' }} />
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="font-serif text-xl font-black mb-2" style={{ color: 'var(--ink)' }}>
          Trip not found
        </h2>
        <Link href="/dashboard" className="text-sm font-bold" style={{ color: 'var(--teal)' }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const usedKg = parseFloat(trip.availableKg) - parseFloat(trip.remainingKg)
  const capacityPct = Math.round((usedKg / parseFloat(trip.availableKg)) * 100)

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to dashboard
      </Link>

      {/* Trip card */}
      <div
        className="rounded-3xl p-7 mb-5"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
              {trip.originCity} → {trip.destCity}
            </h1>
            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {trip.originCode} → {trip.destCode} ·{' '}
              {new Date(trip.departureDate).toLocaleDateString('en-GB', {
                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
            style={{
              background: trip.status === 'open' ? 'var(--teal-pale)' : 'rgba(26,18,8,0.08)',
              color: trip.status === 'open' ? 'var(--teal)' : 'var(--text-muted)',
            }}
          >
            {trip.status}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>{usedKg.toFixed(1)}kg used</span>
            <span>{trip.remainingKg}kg remaining</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--warm)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${capacityPct}%`, background: 'var(--teal)' }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Price/kg', value: `£${trip.pricePerKg}` },
            { label: 'Available', value: `${trip.availableKg}kg` },
            { label: 'Bookings', value: tripBookings.length.toString() },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--warm)' }}
            >
              <div className="font-bold text-lg" style={{ color: 'var(--ink)' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {trip.notes && (
          <div
            className="mt-4 p-4 rounded-2xl text-sm"
            style={{ background: 'var(--warm)', color: 'var(--text-muted)' }}
          >
            📝 {trip.notes}
          </div>
        )}
      </div>

      {/* Bookings on this trip */}
      <div
        className="rounded-3xl p-7"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h2 className="font-serif text-lg font-black mb-5" style={{ color: 'var(--ink)' }}>
          Parcel bookings
        </h2>
        {!tripBookings.length ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📦</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No parcels booked on this trip yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tripBookings.map((booking: Booking) => {
              const style = BOOKING_STATUS_STYLES[booking.status] ?? BOOKING_STATUS_STYLES.pending
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-2xl"
                  style={{ background: 'var(--warm)' }}
                >
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                      Booking #{booking.id.slice(0, 8)}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Agreed: £{booking.agreedPrice} · Total: £{booking.totalAmount}
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
