'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import type { RouterOutputs } from '@/lib/trpc'

type Trip = RouterOutputs['trips']['list'][number]
type Booking = RouterOutputs['bookings']['list'][number]

const TRIP_STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  open: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Open' },
  full: { bg: 'rgba(200,150,62,0.12)', color: 'var(--gold)', label: 'Full' },
  completed: { bg: 'rgba(26,18,8,0.08)', color: 'var(--text-muted)', label: 'Completed' },
  cancelled: { bg: 'rgba(192,74,42,0.08)', color: 'var(--rust)', label: 'Cancelled' },
}

const BOOKING_STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(200,150,62,0.12)', color: 'var(--gold)', label: 'Awaiting payment' },
  confirmed: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Confirmed' },
  collected: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Collected' },
  in_transit: { bg: 'rgba(29,122,95,0.12)', color: 'var(--teal)', label: 'In transit' },
  delivered: { bg: 'rgba(26,18,8,0.08)', color: 'var(--text-muted)', label: 'Delivered' },
  cancelled: { bg: 'rgba(192,74,42,0.08)', color: 'var(--rust)', label: 'Cancelled' },
}

export function TravelerDashboard() {
  const { data: trips, isLoading: tripsLoading } = trpc.trips.list.useQuery({ limit: 20, offset: 0 })
  const { data: bookings, isLoading: bookingsLoading } = trpc.bookings.list.useQuery({ limit: 20, offset: 0 })

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black" style={{ color: 'var(--ink)' }}>
            My trips
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Manage your upcoming flights and parcel bookings
          </p>
        </div>
        <Link
          href="/trips/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
          style={{ background: 'var(--teal)', color: 'white' }}
        >
          <span>+</span> Post a trip
        </Link>
      </div>

      <section>
        <h2 className="font-serif text-xl font-black mb-4" style={{ color: 'var(--ink)' }}>
          Upcoming flights
        </h2>
        {tripsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--warm)' }} />
            ))}
          </div>
        ) : !trips?.length ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: 'var(--warm)', border: '1px solid var(--border)' }}
          >
            <div className="text-4xl mb-3">✈️</div>
            <h3 className="font-serif text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>
              No trips posted yet
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Post your next flight and start earning by carrying parcels.
            </p>
            <Link
              href="/trips/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--teal)', color: 'white' }}
            >
              Post a trip →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip: Trip) => {
              const style = TRIP_STATUS_STYLES[trip.status] ?? TRIP_STATUS_STYLES.open
              return (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.id}`}
                  className="flex items-center justify-between p-5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: 'white', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: 'var(--warm)' }}
                    >
                      ✈️
                    </div>
                    <div>
                      <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                        {trip.originCity} → {trip.destCity}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {new Date(trip.departureDate).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })} · {trip.remainingKg}kg remaining · £{trip.pricePerKg}/kg
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {style.label}
                    </span>
                    <span className="text-sm opacity-40">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-black mb-4" style={{ color: 'var(--ink)' }}>
          Parcel bookings
        </h2>
        {bookingsLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'var(--warm)' }} />
            ))}
          </div>
        ) : !bookings?.length ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'var(--warm)', border: '1px solid var(--border)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No bookings yet. Once senders book your trips, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking: Booking) => {
              const style = BOOKING_STATUS_STYLES[booking.status] ?? BOOKING_STATUS_STYLES.pending
              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-5 rounded-2xl"
                  style={{ background: 'white', border: '1px solid var(--border)' }}
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
      </section>
    </div>
  )
}
