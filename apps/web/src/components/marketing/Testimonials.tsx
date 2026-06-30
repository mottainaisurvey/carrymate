const TESTIMONIALS = [
  {
    name: 'Amara O.',
    location: 'London → Lagos',
    role: 'Sender',
    avatar: 'AO',
    text: "I sent my mum's birthday gift from London to Lagos in 5 days. The traveler was professional and the OTP handover gave me complete peace of mind. Half the price of DHL!",
    rating: 5,
  },
  {
    name: 'Kwame A.',
    location: 'London → Accra',
    role: 'Traveler',
    avatar: 'KA',
    text: "I fly home every 3 months and now I earn £120 each trip just by carrying a couple of parcels. The app makes everything seamless — booking, handover, payment.",
    rating: 5,
  },
  {
    name: 'Fatou D.',
    location: 'Paris → Dakar',
    role: 'Sender',
    avatar: 'FD',
    text: "Sending documents and small packages to my family in Dakar used to be a nightmare. CarryMate changed everything. Fast, reliable, and the team is so responsive.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-24" style={{ background: 'var(--warm)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
          >
            Community voices
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--ink)' }}>
            Loved by the diaspora
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Real stories from senders and travelers in our community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-3xl p-8"
              style={{ background: 'white', border: '1px solid var(--border)' }}
            >
              <div className="flex mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: 'var(--gold)' }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--ink)' }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'var(--teal)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--ink)' }}>
                    {t.name}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
