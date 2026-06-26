const PILLARS = [
  {
    icon: '🪪',
    title: 'ID Verification',
    description: 'Every traveler is identity-verified before they can accept parcels. We check government-issued ID and cross-reference flight details.',
  },
  {
    icon: '🔐',
    title: 'Escrow Payments',
    description: 'Funds are held securely in escrow. Payment is only released to the traveler after the recipient confirms delivery with a one-time code.',
  },
  {
    icon: '📱',
    title: 'OTP Handover',
    description: 'A unique one-time password is generated for each delivery. The recipient must share it with the traveler to confirm safe handover.',
  },
  {
    icon: '⚖️',
    title: 'Dispute Resolution',
    description: 'Our dedicated support team mediates any disputes. Senders are protected with a full refund guarantee if delivery fails.',
  },
]

export function Trust() {
  return (
    <section className="py-24" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
            >
              Trust & Safety
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-black mb-6" style={{ color: 'var(--ink)' }}>
              Your safety is our{' '}
              <span style={{ color: 'var(--teal)' }}>top priority</span>
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We've built multiple layers of protection into every delivery. From verified identities to secure escrow payments, CarryMate keeps both senders and travelers safe.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl p-6"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)' }}
              >
                <div className="text-3xl mb-3">{pillar.icon}</div>
                <h3 className="font-serif text-lg font-black mb-2" style={{ color: 'var(--ink)' }}>
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
