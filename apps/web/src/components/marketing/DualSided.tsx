import Link from 'next/link'

const SENDER_BENEFITS = [
  { icon: '💸', text: 'Up to 50% cheaper than couriers' },
  { icon: '🛡️', text: 'Escrow payment — pay only on delivery' },
  { icon: '📍', text: 'Real-time tracking updates' },
  { icon: '🤝', text: 'Community-vetted travelers' },
]

const TRAVELER_BENEFITS = [
  { icon: '💰', text: 'Earn £30–150 per trip' },
  { icon: '✈️', text: 'Carry items you were already flying with' },
  { icon: '⭐', text: 'Build reputation and unlock higher tiers' },
  { icon: '🔒', text: 'Secure OTP handover system' },
]

export function DualSided() {
  return (
    <section className="py-24" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--ink)' }}>
            Built for both sides
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Whether you're sending or carrying, CarryMate works for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sender card */}
          <div
            className="rounded-3xl p-10"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            <div className="text-4xl mb-4">📦</div>
            <div className="text-xs font-black tracking-widest mb-2 opacity-70">FOR SENDERS</div>
            <h3 className="font-serif text-3xl font-black mb-3">Send parcels home</h3>
            <p className="opacity-80 mb-8 leading-relaxed">
              Ship gifts, documents, and goods to family back home at a fraction of courier prices.
            </p>
            <ul className="space-y-3 mb-8">
              {SENDER_BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3 text-sm">
                  <span>{b.icon}</span>
                  <span className="opacity-90">{b.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'white', color: 'var(--teal)' }}
            >
              Send a parcel →
            </Link>
          </div>

          {/* Traveler card */}
          <div
            className="rounded-3xl p-10"
            style={{ background: 'var(--ink)', color: 'white' }}
          >
            <div className="text-4xl mb-4">✈️</div>
            <div className="text-xs font-black tracking-widest mb-2 opacity-70">FOR TRAVELERS</div>
            <h3 className="font-serif text-3xl font-black mb-3">Earn on your trips</h3>
            <p className="opacity-80 mb-8 leading-relaxed">
              Already flying home? Carry a parcel and earn extra cash — with zero hassle.
            </p>
            <ul className="space-y-3 mb-8">
              {TRAVELER_BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3 text-sm">
                  <span>{b.icon}</span>
                  <span className="opacity-90">{b.text}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup?role=traveler"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90"
              style={{ background: 'var(--gold)', color: 'white' }}
            >
              Start earning →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
