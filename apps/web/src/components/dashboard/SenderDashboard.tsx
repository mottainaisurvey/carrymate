'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: 'rgba(200,150,62,0.12)', color: 'var(--gold)', label: 'Pending' },
  matched: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Matched' },
  booked: { bg: 'var(--teal-pale)', color: 'var(--teal)', label: 'Booked' },
  in_transit: { bg: 'rgba(29,122,95,0.12)', color: 'var(--teal)', label: 'In Transit' },
  delivered: { bg: 'rgba(26,18,8,0.08)', color: 'var(--text-muted)', label: 'Delivered' },
  cancelled: { bg: 'rgba(192,74,42,0.08)', color: 'var(--rust)', label: 'Cancelled' },
}

export function SenderDashboard() {
  const { data: parcels, isLoading } = trpc.parcels.list.useQuery({ limit: 20, offset: 0 })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-black" style={{ color: 'var(--ink)' }}>
            My parcels
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Track and manage your shipments
          </p>
        </div>
        <Link
          href="/send"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all hover:opacity-90"
          style={{ background: 'var(--teal)', color: 'white' }}
        >
          <span>+</span> Send parcel
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--warm)' }} />
          ))}
        </div>
      ) : !parcels?.length ? (
        <div
          className="rounded-3xl p-16 text-center"
          style={{ background: 'var(--warm)', border: '1px solid var(--border)' }}
        >
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-serif text-xl font-black mb-2" style={{ color: 'var(--ink)' }}>
            No parcels yet
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Send your first parcel and connect with a traveler flying your route.
          </p>
          <Link
            href="/send"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            Send a parcel →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {parcels.map((parcel) => {
            const style = STATUS_STYLES[parcel.status] ?? STATUS_STYLES.pending
            return (
              <Link
                key={parcel.id}
                href={`/parcels/${parcel.id}`}
                className="flex items-center justify-between p-5 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ background: 'white', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'var(--warm)' }}
                  >
                    📦
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: 'var(--ink)' }}>
                      {parcel.contents}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {parcel.destCity}, {parcel.destCode} · {parcel.weightKg}kg
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
    </div>
  )
}
