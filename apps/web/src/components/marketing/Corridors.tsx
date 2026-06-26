'use client'

const CORRIDORS = [
  { code: 'LHR→LOS', from: 'London Heathrow', to: 'Lagos', fromFlag: '🇬🇧', toFlag: '🇳🇬', travelers: 24, priceKg: 8 },
  { code: 'LHR→ABV', from: 'London Heathrow', to: 'Abuja', fromFlag: '🇬🇧', toFlag: '🇳🇬', travelers: 12, priceKg: 9 },
  { code: 'CDG→LOS', from: 'Paris CDG', to: 'Lagos', fromFlag: '🇫🇷', toFlag: '🇳🇬', travelers: 8, priceKg: 10 },
  { code: 'LHR→ACC', from: 'London Heathrow', to: 'Accra', fromFlag: '🇬🇧', toFlag: '🇬🇭', travelers: 15, priceKg: 8 },
  { code: 'AMS→LOS', from: 'Amsterdam', to: 'Lagos', fromFlag: '🇳🇱', toFlag: '🇳🇬', travelers: 6, priceKg: 11 },
  { code: 'CDG→ABJ', from: 'Paris CDG', to: 'Abidjan', fromFlag: '🇫🇷', toFlag: '🇨🇮', travelers: 9, priceKg: 9 },
]

export function Corridors() {
  return (
    <section className="py-24" style={{ background: 'var(--warm)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
          >
            Live routes
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--ink)' }}>
            Active corridors
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Travelers flying these routes right now. More corridors launching soon.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORRIDORS.map((corridor) => (
            <div
              key={corridor.code}
              className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'white', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">
                  {corridor.fromFlag} → {corridor.toFlag}
                </span>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
                >
                  Active
                </span>
              </div>
              <div className="font-mono text-sm font-bold mb-1" style={{ color: 'var(--teal)' }}>
                {corridor.code}
              </div>
              <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                {corridor.from} → {corridor.to}
              </div>
              <div
                className="flex items-center justify-between pt-4 text-sm"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <span style={{ color: 'var(--text-muted)' }}>
                  {corridor.travelers} travelers
                </span>
                <span className="font-bold" style={{ color: 'var(--ink)' }}>
                  from £{corridor.priceKg}/kg
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
