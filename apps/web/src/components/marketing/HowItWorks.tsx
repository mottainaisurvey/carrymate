const STEPS = [
  {
    number: '01',
    title: 'Post your parcel',
    description: 'Describe your parcel, set the destination, and choose your preferred delivery window. Takes 2 minutes.',
    icon: '📦',
  },
  {
    number: '02',
    title: 'Match with a traveler',
    description: 'Our system matches you with verified travelers flying your route. Review profiles, ratings, and accept a match.',
    icon: '✈️',
  },
  {
    number: '03',
    title: 'Secure handover',
    description: 'Meet at the airport or arrange collection. Confirm handover with a one-time code. Funds release on delivery.',
    icon: '🔐',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24" style={{ background: 'var(--warm)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
          >
            Simple process
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-black mb-4" style={{ color: 'var(--ink)' }}>
            How CarryMate works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Three simple steps to get your parcel delivered safely and affordably.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-full w-full h-px -translate-x-1/2 z-0"
                  style={{ background: 'var(--border)', width: '50%', left: '75%' }}
                />
              )}
              <div
                className="relative z-10 rounded-3xl p-8 h-full"
                style={{ background: 'white', border: '1px solid var(--border)' }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div
                  className="text-xs font-black tracking-widest mb-2"
                  style={{ color: 'var(--teal)' }}
                >
                  STEP {step.number}
                </div>
                <h3 className="font-serif text-xl font-black mb-3" style={{ color: 'var(--ink)' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
