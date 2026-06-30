import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Corridors — CarryMate',
  description: 'Two live diaspora delivery routes — London to Lagos and London to Accra — each fully profiled with customs intelligence, traveler earnings, and delivery times.'
}

type DotType = 'safe' | 'warn' | 'block'

interface CorridorData {
  flag: string
  route: string
  airports: string
  badge: string
  isLaunch?: boolean
  stats: { label: string; val: string; sub: string }[]
  about: string[]
  customsTitle: string
  threshold: string
  rules: { type: DotType; text: string }[]
  footerNote: string
}

const CORRIDORS: CorridorData[] = [
  {
    flag: '🇬🇧 → 🇳🇬',
    route: 'London → Lagos',
    airports: 'London Heathrow (LHR) → Murtala Muhammed International (LOS)',
    badge: 'Launch route',
    isLaunch: true,
    stats: [
      { label: 'Avg delivery', val: '£22', sub: 'vs £85+ courier' },
      { label: 'Delivery time', val: '48hr', sub: 'door to door' },
      { label: 'Traveler earnings', val: '£150', sub: 'avg per round trip' },
      { label: 'Flights daily', val: '4+', sub: 'BA, Virgin, Air Peace' },
    ],
    about: [
      'The largest diaspora corridor in Europe. Over 500,000 Nigerians live in the UK, concentrated in Peckham, Brixton, Hackney, and Croydon. Four airlines operate direct daily flights, creating consistent traveler supply year-round.',
      'November and December are the peak season — the annual Detty December homecoming draws tens of thousands of travelers to Lagos, creating 3–4× normal traveler supply and a surge in parcel demand. Optimal time to send.',
      'Common parcels on this route: clothing and fashion, baby products, cosmetics, electronics, documents, dried and packaged food (egusi, crayfish, stockfish), and gifts.',
    ],
    customsTitle: 'Customs guide · Nigeria',
    threshold: 'Duty-free: NGN 50,000 (~£30) personal gifts',
    rules: [
      { type: 'safe', text: 'Clothing and shoes — permitted, no declaration' },
      { type: 'safe', text: 'Baby formula — up to 6 tins permitted' },
      { type: 'safe', text: 'Cosmetics and personal care — permitted for personal use' },
      { type: 'safe', text: 'Dried and packaged food — permitted (egusi, crayfish, beans)' },
      { type: 'warn', text: 'Electronics — 1 unit only, declare on Red channel' },
      { type: 'warn', text: 'Jewellery — must declare in writing on arrival' },
      { type: 'warn', text: 'Items above NGN 50,000 — declare and pay import duty' },
      { type: 'block', text: 'Codeine products — prohibited by Nigerian law' },
      { type: 'block', text: 'Cash over $5,000 — must declare or risk seizure' },
    ],
    footerNote: 'Customs rules verified June 2026 · Updated quarterly with local legal counsel · Always check before your trip',
  },
  {
    flag: '🇬🇧 → 🇬🇭',
    route: 'London → Accra',
    airports: 'London Heathrow (LHR) → Kotoka International (ACC)',
    badge: 'Launch route',
    isLaunch: true,
    stats: [
      { label: 'Avg delivery', val: '£20', sub: 'vs £75+ courier' },
      { label: 'Delivery time', val: '36hr', sub: 'door to door' },
      { label: 'Traveler earnings', val: '£130', sub: 'avg per round trip' },
      { label: 'Flights daily', val: '3+', sub: 'BA, KLM, Ghana Airways' },
    ],
    about: [
      "The UK's Ghanaian diaspora numbers around 141,000, concentrated in Birmingham and South London. Three airlines operate daily direct services, with transit options via Amsterdam (KLM) offering additional frequency.",
      "Ghana's customs rules are more structured than Nigeria's, with a clear CEPS declaration process. Our in-app customs guide generates the CEPS form automatically for parcels that exceed the duty-free threshold, reducing friction at the border.",
      'Common parcels: clothing and textiles, cosmetics, Ghanaian food products (dried fish, shito, palm oil in sealed containers), electronics, and business documents.',
    ],
    customsTitle: 'Customs guide · Ghana',
    threshold: 'Duty-free: GHS 200 (~£13) personal effects',
    rules: [
      { type: 'safe', text: 'Clothing and personal items — permitted' },
      { type: 'safe', text: 'Cosmetics for personal use — permitted' },
      { type: 'safe', text: 'Sealed food products — generally permitted' },
      { type: 'warn', text: 'Electronics — declare to CEPS on arrival' },
      { type: 'warn', text: 'Goods above GHS 200 — CEPS declaration form required' },
      { type: 'warn', text: 'Jewellery — declare if new or high value' },
      { type: 'block', text: 'Fresh produce — agricultural inspection, high seizure risk' },
      { type: 'block', text: 'Commercial quantities of any goods — not permitted via this route' },
    ],
    footerNote: 'Customs rules verified June 2026 · CEPS form generated automatically in app for flagged parcels',
  },
]

const DOT_COLORS: Record<DotType, string> = {
  safe: 'var(--teal-light)',
  warn: 'var(--gold)',
  block: '#c04a2a',
}

export default function CorridorsPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '72px 5vw 56px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            Active routes
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px' }}>
            Every corridor,<br />fully profiled
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Two live routes at launch — London to Lagos and London to Accra. Each one built with local knowledge, customs intelligence, and community data.
          </p>
        </div>

        {/* Corridor cards */}
        <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '56px 5vw 96px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {CORRIDORS.map(({ flag, route, airports, badge, isLaunch, stats, about, customsTitle, threshold, rules, footerNote }) => (
            <div key={route} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ background: isLaunch ? 'var(--teal)' : 'var(--ink)', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{flag}</div>
                  <div className="font-serif" style={{ fontSize: '24px', fontWeight: 900, color: 'white', marginBottom: '4px', letterSpacing: '-0.5px' }}>{route}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>{airports}</div>
                </div>
                <span style={{
                  background: isLaunch ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                  border: isLaunch ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '99px', padding: '5px 14px', fontSize: '12px', fontWeight: 700,
                  color: isLaunch ? 'var(--ink)' : 'white', whiteSpace: 'nowrap',
                }}>
                  {badge}
                </span>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', borderBottom: '1px solid var(--border)' }}>
                {stats.map(({ label, val, sub }, i) => (
                  <div key={label} style={{ padding: '20px 24px', borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</div>
                    <div className="font-serif" style={{ fontSize: '26px', fontWeight: 900, color: 'var(--teal)' }}>{val}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>
                  </div>
                ))}
              </div>

              {/* Body */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
                {/* About */}
                <div style={{ padding: '24px 28px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    About this corridor
                  </div>
                  {about.map((p, i) => (
                    <p key={i} style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '14px' }}>{p}</p>
                  ))}
                </div>

                {/* Customs */}
                <div style={{ padding: '24px 28px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
                    {customsTitle}
                  </div>
                  <div style={{ background: 'var(--teal-pale)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: 'var(--teal)', fontWeight: 600, marginBottom: '12px', display: 'inline-block' }}>
                    {threshold}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {rules.map(({ type, text }) => (
                      <div key={text} style={{ fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'flex-start', lineHeight: 1.5 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px', background: DOT_COLORS[type], display: 'inline-block' }} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ background: 'var(--warm)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{footerNote}</div>
                <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '9px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Send on this route →
                </Link>
              </div>
            </div>
          ))}

          {/* Coming soon */}
          <div style={{ background: 'var(--warm)', border: '1.5px dashed var(--border)', borderRadius: '24px', padding: '40px 36px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>Coming in 2026</div>
            <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>More corridors launching later this year</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '560px' }}>
              We are expanding to New York → Lagos, London → Nairobi, Paris → Abidjan, and London → Kingston later this year. Join the waitlist to be notified first.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px', marginBottom: '24px' }}>
              {[
                { flag: '🇺🇸', label: 'New York → Lagos', code: 'JFK → LOS' },
                { flag: '🇬🇧', label: 'London → Nairobi', code: 'LHR → NBO' },
                { flag: '🇫🇷', label: 'Paris → Abidjan', code: 'CDG → ABJ' },
                { flag: '🇬🇧', label: 'London → Kingston', code: 'LHR → KIN' },
              ].map(({ flag, label, code }) => (
                <div key={code} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>{flag} {label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'monospace' }}>{code}</div>
                  </div>
                  <Link href="/signup" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--teal)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Join waitlist →</Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--teal)', padding: '64px 5vw', textAlign: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3.5vw,42px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '12px' }}>
            Flying one of these routes?
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Post your trip in three minutes and start earning on luggage space you were already bringing.
          </p>
          <Link href="/signup" style={{ background: 'white', color: 'var(--teal)', padding: '13px 26px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Get started →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
