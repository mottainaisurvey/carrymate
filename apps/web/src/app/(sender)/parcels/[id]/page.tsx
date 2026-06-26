'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'

const STATUS_TIMELINE = [
  { key: 'pending', label: 'Parcel posted', icon: '📦' },
  { key: 'booked', label: 'Traveler matched', icon: '🤝' },
  { key: 'collected', label: 'Collected by traveler', icon: '🧳' },
  { key: 'in_transit', label: 'In transit', icon: '✈️' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
]

const STATUS_ORDER = ['pending', 'booked', 'collected', 'in_transit', 'delivered']

export default function ParcelTrackingPage() {
  const { id } = useParams<{ id: string }>()
  const { data: parcel, isLoading } = trpc.parcels.getById.useQuery({ id })

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="h-8 w-48 rounded-xl animate-pulse" style={{ background: 'var(--warm)' }} />
        <div className="h-64 rounded-3xl animate-pulse" style={{ background: 'var(--warm)' }} />
      </div>
    )
  }

  if (!parcel) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="font-serif text-xl font-black mb-2" style={{ color: 'var(--ink)' }}>
          Parcel not found
        </h2>
        <Link href="/dashboard" className="text-sm font-bold" style={{ color: 'var(--teal)' }}>
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(parcel.status)

  return (
    <div className="max-w-xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--text-muted)' }}
      >
        ← Back to dashboard
      </Link>

      {/* Header card */}
      <div
        className="rounded-3xl p-7 mb-5"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
              {parcel.contents}
            </h1>
            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              → {parcel.destCity}, {parcel.destCode} · {parcel.weightKg}kg
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full capitalize"
            style={{
              background: parcel.status === 'delivered' ? 'rgba(26,18,8,0.08)' : 'var(--teal-pale)',
              color: parcel.status === 'delivered' ? 'var(--text-muted)' : 'var(--teal)',
            }}
          >
            {parcel.status.replace('_', ' ')}
          </span>
        </div>

        {/* Recipient info */}
        <div
          className="flex items-center justify-between p-4 rounded-2xl text-sm"
          style={{ background: 'var(--warm)' }}
        >
          <div>
            <div className="font-bold" style={{ color: 'var(--ink)' }}>{parcel.recipientName}</div>
            <div style={{ color: 'var(--text-muted)' }}>{parcel.recipientPhone}</div>
          </div>
          {parcel.isCustomsSafe && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
            >
              Customs safe ✓
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div
        className="rounded-3xl p-7"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h2 className="font-serif text-lg font-black mb-5" style={{ color: 'var(--ink)' }}>
          Delivery timeline
        </h2>
        <div className="space-y-0">
          {STATUS_TIMELINE.map((step, i) => {
            const isCompleted = i <= currentStatusIndex
            const isCurrent = i === currentStatusIndex
            return (
              <div key={step.key} className="flex gap-4">
                {/* Icon + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={
                      isCompleted
                        ? { background: 'var(--teal)', color: 'white' }
                        : { background: 'var(--warm)', color: 'var(--text-muted)' }
                    }
                  >
                    {isCompleted ? step.icon : '○'}
                  </div>
                  {i < STATUS_TIMELINE.length - 1 && (
                    <div
                      className="w-0.5 h-8 mt-1"
                      style={{ background: i < currentStatusIndex ? 'var(--teal)' : 'var(--border)' }}
                    />
                  )}
                </div>
                {/* Label */}
                <div className="pb-8 pt-2">
                  <div
                    className="text-sm font-bold"
                    style={{ color: isCurrent ? 'var(--teal)' : isCompleted ? 'var(--ink)' : 'var(--text-muted)' }}
                  >
                    {step.label}
                    {isCurrent && (
                      <span
                        className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
