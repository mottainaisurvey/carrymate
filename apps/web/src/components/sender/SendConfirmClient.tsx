'use client'



import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

export default function SendConfirmClient() {
  const searchParams = useSearchParams()
  const bookingId = searchParams?.get('bookingId') ?? ''

  const { data: booking, isLoading } = trpc.bookings.getById.useQuery(
    { id: bookingId },
    { enabled: !!bookingId }
  )

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="h-64 rounded-3xl animate-pulse" style={{ background: 'var(--warm)' }} />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="font-serif text-3xl font-black mb-3" style={{ color: 'var(--ink)' }}>
        Booking confirmed!
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
        Your parcel has been matched with a traveler. Share the OTP code below with your recipient — they'll need it to confirm delivery.
      </p>

      {/* OTP display */}
      {booking?.deliveryOtp && (
        <div
          className="rounded-3xl p-8 mb-8"
          style={{ background: 'var(--ink)', color: 'white' }}
        >
          <div className="text-xs font-black uppercase tracking-widest mb-3 opacity-60">
            Delivery OTP code
          </div>
          <div className="font-mono text-5xl font-black tracking-[0.3em] mb-3" style={{ color: 'var(--gold)' }}>
            {booking.deliveryOtp}
          </div>
          <div className="text-xs opacity-60">
            Share this code with your recipient
          </div>
        </div>
      )}

      <div
        className="rounded-2xl p-5 mb-8 text-sm text-left"
        style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
      >
        <strong>What happens next?</strong>
        <ol className="mt-2 space-y-1 list-decimal list-inside opacity-90">
          <li>The traveler collects your parcel before their flight</li>
          <li>Your parcel travels to the destination</li>
          <li>Your recipient shares the OTP to confirm delivery</li>
          <li>Payment is released to the traveler</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/parcels/${booking?.parcelId ?? ''}`}
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90"
          style={{ background: 'var(--teal)', color: 'white' }}
        >
          Track parcel
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-[var(--warm)]"
          style={{ border: '1px solid var(--border)', color: 'var(--ink)' }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
