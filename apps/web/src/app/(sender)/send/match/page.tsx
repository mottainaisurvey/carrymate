'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

export default function MatchTravelerPage() {
  const searchParams = useSearchParams()
  const parcelId = searchParams.get('parcelId') ?? ''
  const router = useRouter()

  const { data: trips, isLoading } = trpc.trips.list.useQuery(
    { limit: 20, offset: 0 },
    { enabled: !!parcelId }
  )

  const createBooking = trpc.bookings.create.useMutation({
    onSuccess: (data) => {
      router.push(`/sender/send/pay?bookingId=${data.booking.id}`)
    },
  })

  const isBooking = createBooking.isPending

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Parcel details', 'Match traveler', 'Payment', 'Confirm'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={
                i === 1
                  ? { background: 'var(--teal)', color: 'white' }
                  : i < 1
                  ? { background: 'var(--teal-pale)', color: 'var(--teal)' }
                  : { background: 'var(--warm)', color: 'var(--text-muted)' }
              }
            >
              {i < 1 ? '✓' : i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === 1 ? 'var(--teal)' : 'var(--text-muted)' }}
            >
              {step}
            </span>
            {i < 3 && <span className="text-xs opacity-30">›</span>}
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
          Available travelers
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Choose a verified traveler flying your route.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'var(--warm)' }} />
          ))}
        </div>
      ) : !trips?.length ? (
        <div
          className="rounded-3xl p-12 text-center"
          style={{ background: 'var(--warm)', border: '1px solid var(--border)' }}
        >
          <div className="text-4xl mb-3">✈️</div>
          <h2 className="font-serif text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>
            No travelers available yet
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            We'll notify you as soon as a traveler matches your route.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="rounded-2xl p-5"
              style={{ background: 'white', border: '1px solid var(--border)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                    {trip.originCity} → {trip.destCity}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {trip.originCode} → {trip.destCode}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: 'var(--teal)' }}>
                    £{trip.pricePerKg}/kg
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {trip.remainingKg}kg available
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Departs {new Date(trip.departureDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </div>
                <button
                  onClick={() => createBooking.mutate({ tripId: trip.id, parcelId })}
                  disabled={isBooking}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'var(--teal)', color: 'white' }}
                >
                  {isBooking ? 'Booking…' : 'Book this traveler'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
