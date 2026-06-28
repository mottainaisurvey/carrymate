'use client'

import Link from 'next/link'

const CORRIDORS = [
  { from: 'London', to: 'Lagos', flag: '🇬🇧→🇳🇬' },
  { from: 'London', to: 'Accra', flag: '🇬🇧→🇬🇭' },
  { from: 'Paris', to: 'Abidjan', flag: '🇫🇷→🇨🇮' },
  { from: 'Amsterdam', to: 'Lagos', flag: '🇳🇱→🇳🇬' },
]

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: 'var(--cream)' }}
    >
      {/* Decorative blob */}
      <div
        className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'var(--teal-pale)' }}
      />
      <div
        className="absolute bottom-20 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'rgba(200,150,62,0.3)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
        {/* Left copy */}
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Community-powered delivery
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-black leading-tight mb-6" style={{ color: 'var(--ink)' }}>
            Send anything<br />home for{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#c8963e' }}>half</em><br />
            the price.
          </h1>

          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            Connect with verified travelers flying to your destination. Safe, affordable, and built for the diaspora community.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-base transition-all hover:opacity-90"
              style={{ background: 'var(--teal)', color: 'white' }}
            >
              Send a parcel
              <span>→</span>
            </Link>
            <Link
              href="/signup?role=traveler"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-base border transition-all hover:bg-[var(--warm)]"
              style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
            >
              Earn as a traveler
            </Link>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span style={{ color: 'var(--teal)' }}>✓</span> Verified travelers
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: 'var(--teal)' }}>✓</span> Escrow payments
            </span>
            <span className="flex items-center gap-1.5">
              <span style={{ color: 'var(--teal)' }}>✓</span> OTP handover
            </span>
          </div>
        </div>

        {/* Right card */}
        <div className="relative">
          <div
            className="rounded-3xl p-8 shadow-xl"
            style={{ background: 'white', border: '1px solid var(--border)' }}
          >
            <div className="text-sm font-bold mb-4" style={{ color: 'var(--text-muted)' }}>
              Active corridors
            </div>
            <div className="space-y-3">
              {CORRIDORS.map((c) => (
                <div
                  key={c.from + c.to}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'var(--warm)' }}
                >
                  <span className="font-medium text-sm">
                    {c.flag} {c.from} → {c.to}
                  </span>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
                  >
                    Active
                  </span>
                </div>
              ))}
            </div>
            <div
              className="mt-6 pt-5 border-t flex items-center justify-between text-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Avg. delivery time</span>
              <span className="font-bold">3–7 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
