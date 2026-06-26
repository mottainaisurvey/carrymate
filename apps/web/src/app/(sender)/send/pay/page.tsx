'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId') ?? ''
  const router = useRouter()

  const { data: booking, isLoading } = trpc.bookings.getById.useQuery(
    { id: bookingId },
    { enabled: !!bookingId }
  )

  const createEscrow = trpc.payments.createEscrowHold.useMutation({
    onSuccess: () => {
      router.push(`/sender/send/confirm?bookingId=${bookingId}`)
    },
  })

  const isPaying = createEscrow.isPending

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="h-64 rounded-3xl animate-pulse" style={{ background: 'var(--warm)' }} />
      </div>
    )
  }

  const totalAmount = booking ? parseFloat(booking.totalAmount) : 0
  const agreedPrice = booking ? parseFloat(booking.agreedPrice) : 0
  const serviceFee = booking ? parseFloat(booking.serviceFee) : 0

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Parcel details', 'Match traveler', 'Payment', 'Confirm'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={
                i === 2
                  ? { background: 'var(--teal)', color: 'white' }
                  : i < 2
                  ? { background: 'var(--teal-pale)', color: 'var(--teal)' }
                  : { background: 'var(--warm)', color: 'var(--text-muted)' }
              }
            >
              {i < 2 ? '✓' : i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === 2 ? 'var(--teal)' : 'var(--text-muted)' }}
            >
              {step}
            </span>
            {i < 3 && <span className="text-xs opacity-30">›</span>}
          </div>
        ))}
      </div>

      <div
        className="rounded-3xl p-8"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: 'var(--ink)' }}>
          Secure payment
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Funds are held in escrow and released only after confirmed delivery.
        </p>

        {/* Order summary */}
        <div
          className="rounded-2xl p-5 mb-6 space-y-3"
          style={{ background: 'var(--warm)' }}
        >
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Delivery fee</span>
            <span className="font-bold" style={{ color: 'var(--ink)' }}>
              £{agreedPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Service fee (10%)</span>
            <span className="font-bold" style={{ color: 'var(--ink)' }}>
              £{serviceFee.toFixed(2)}
            </span>
          </div>
          <div
            className="flex justify-between text-sm font-bold pt-3"
            style={{ borderTop: '1px solid var(--border)', color: 'var(--ink)' }}
          >
            <span>Total</span>
            <span style={{ color: 'var(--teal)' }}>£{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Escrow notice */}
        <div
          className="rounded-2xl p-4 mb-6 text-sm"
          style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
        >
          🔐 Your payment is held securely in escrow. It's only released to the traveler when your recipient confirms delivery with the OTP code.
        </div>

        {createEscrow.error && (
          <div
            className="text-sm px-4 py-3 rounded-xl mb-4"
            style={{ background: 'rgba(192,74,42,0.08)', color: 'var(--rust)' }}
          >
            {createEscrow.error.message}
          </div>
        )}

        <button
          onClick={() => createEscrow.mutate({ bookingId })}
          disabled={isPaying || !booking}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
          style={{ background: 'var(--teal)', color: 'white' }}
        >
          {isPaying ? 'Processing…' : 'Pay & confirm booking →'}
        </button>
      </div>
    </div>
  )
}
