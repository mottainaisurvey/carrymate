'use client'
import Link from 'next/link'

function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center">
      <div
        className="w-[280px] h-[560px] rounded-[40px] p-4 shadow-[0_40px_80px_rgba(26,18,8,0.25)]"
        style={{ background: 'var(--ink)' }}
      >
        <div
          className="w-full h-full rounded-[28px] overflow-hidden flex flex-col"
          style={{ background: 'var(--cream)' }}
        >
          {/* Phone header */}
          <div className="p-6 pb-4" style={{ background: 'var(--teal)' }}>
            <div
              className="w-20 h-1 rounded-full mx-auto mb-4"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            />
            <div className="flex justify-between items-center mb-3">
              <span className="font-serif text-lg font-bold text-white">CarryMate</span>
              <span className="text-xs text-white/70">Gold carrier</span>
            </div>
            <div className="text-xs text-white/80">This trip · LHR → LOS · Apr 13</div>
            <div className="font-serif text-4xl font-black text-white mt-1">£81 earned</div>
          </div>
          {/* Phone body */}
          <div className="p-4 flex flex-col gap-2.5 flex-1">
            <div className="bg-white rounded-2xl p-3.5 border border-black/5">
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Active delivery
              </div>
              <div
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: 'var(--ink)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--teal)' }} />
                London
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--rust)' }} />
                Lagos
              </div>
              <div className="text-lg font-bold mt-1" style={{ color: 'var(--teal)' }}>
                £38{' '}
                <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                  on delivery
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-black/5">
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Parcel confirmed · OTP verified
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Clothing package · 2kg · Adaeze O.
              </div>
              <div className="flex gap-1.5 mt-2">
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
                >
                  Customs-safe
                </span>
                <span
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--rust-pale)', color: 'var(--rust)' }}
                >
                  In transit
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-black/5">
              <div
                className="text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Delivery OTP — show recipient
              </div>
              <div className="flex gap-2">
                {['4', '8', '2', '7', '1', '9'].map((d, i) => (
                  <div
                    key={i}
                    className="w-9 h-11 rounded-lg flex items-center justify-center text-lg font-black font-serif"
                    style={{ background: 'var(--cream)', border: '1.5px solid var(--border)' }}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="mt-auto rounded-2xl py-3.5 text-center text-sm font-bold text-white"
              style={{ background: 'var(--teal)' }}
            >
              Confirm delivery
            </div>
          </div>
        </div>
      </div>
      {/* Floating badge — top right */}
      <div className="absolute top-14 -right-14 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(26,18,8,0.15)] flex items-center gap-2.5 animate-float1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'var(--teal-pale)' }}
        >
          🤝
        </div>
        <div>
          <div className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>
            Match found
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Kwame · LHR→LOS
          </div>
        </div>
      </div>
      {/* Floating badge — bottom left */}
      <div className="absolute bottom-24 -left-16 bg-white rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(26,18,8,0.15)] flex items-center gap-2.5 animate-float2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: 'var(--rust-pale)' }}
        >
          🔐
        </div>
        <div>
          <div className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>
            Escrow held
          </div>
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            £43 · Releasing soon
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-16"
      style={{ background: 'var(--cream)' }}
    >
      {/* Decorative blobs */}
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
          {/* Eyebrow — Fix 3 */}
          <div
            className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-6"
            style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
          >
            <span className="hero-pulse-dot" />
            Live · LHR→LOS · 3 travelers available
          </div>

          {/* H1 — gold italic 'half' */}
          <h1
            className="font-serif text-5xl md:text-6xl font-black leading-tight mb-6"
            style={{ color: 'var(--ink)' }}
          >
            Send anything
            <br />
            home for{' '}
            <em style={{ fontStyle: 'italic', fontWeight: 300, color: '#c8963e' }}>half</em>
            <br />
            the price.
          </h1>

          <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
            Connect with verified travelers flying to your destination. Safe, affordable, and built
            for the diaspora community.
          </p>

          {/* CTAs — Fix 4: second button copy */}
          <div className="flex flex-col sm:flex-row gap-3 mb-10">
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
              Earn on your flight
            </Link>
          </div>

          {/* Stats row — Fix 2 */}
          <div className="flex flex-wrap gap-8 mb-10">
            <div>
              <div className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
                50%
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                cheaper than couriers
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
                £150
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                avg traveler earnings
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-black" style={{ color: 'var(--ink)' }}>
                48hr
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                London to Lagos
              </div>
            </div>
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

        {/* Right column — Fix 1: phone mockup */}
        <div className="relative hidden md:flex justify-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  )
}
