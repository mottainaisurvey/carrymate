import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Trust & Safety — CarryMate',
  description: 'How CarryMate protects every delivery: biometric identity verification, escrow payments, photo proof, dual OTP confirmation, and per-corridor customs intelligence.',
}

const PILLARS = [
  { icon: '🪪', title: 'Verified identity', sub: 'Every traveler passes biometric ID verification before carrying anything' },
  { icon: '🔐', title: 'Escrow payments', sub: 'Money is held safely until both sides confirm delivery' },
  { icon: '📷', title: 'Photo proof', sub: 'Every parcel photographed at pickup — timestamped and tamper-evident' },
  { icon: '📋', title: 'Customs intelligence', sub: 'Per-corridor rules built into every delivery — not buried in a help article' },
]

const LAYERS = [
  {
    num: '1',
    tag: 'Layer 1',
    title: 'Every traveler is verified before they carry anything',
    body: 'Before a Traveler can accept a single parcel, they must pass our biometric identity verification. This includes government-issued ID scan with machine-readable zone (MRZ) verification, a liveness detection test to prevent spoofing, and real-time screening against international PEP and sanctions lists.',
    checks: [
      'Passport or national ID scan with MRZ validation',
      'Anti-spoofing liveness detection — no static photos accepted',
      'PEP and international sanctions screening on every user',
      'Flight itinerary verified for every trip posted',
    ],
    visual: (
      <div>
        <VisualCard label="Traveler verification" content="British-Nigerian passport · MRZ validated" status="✓ Identity verified · liveness passed" statusType="green" />
        <VisualCard label="Sanctions screening" content="PEP and sanctions check · World-Check database" status="✓ No matches found" statusType="green" />
        <VisualCard label="Carrier tier · Kofi Asante" content="Platinum · 94 deliveries · ★★★★★ 5.0" status="Trusted carrier" statusType="teal" />
      </div>
    ),
  },
  {
    num: '2',
    tag: 'Layer 2',
    title: 'AI screens every parcel before matching begins',
    body: 'When a Sender posts a parcel, our NLP classifier checks the description against our prohibited items database and per-corridor customs rules. Hard-blocked items cannot proceed at all. Restricted items are flagged with specific guidance. Safe items proceed immediately to matching.',
    checks: [
      'Classifier trained on customs rules across all 12 corridors',
      'Hard blocks cannot be overridden by users',
      'Amber warnings with corridor-specific declaration guidance',
      'High-risk listings reviewed by trust team before matching',
    ],
    reverse: true,
    visual: (
      <div>
        <VisualCard label="Item: Clothing + shoes · 2kg · £45" status="✓ Customs-safe · LHR → LOS corridor" statusType="green" />
        <VisualCard label="Item flagged · Tramadol capsules · 200 units" status="✗ Hard blocked · prohibited item" statusType="red" />
        <VisualCard label="Item: Laptop · MacBook Pro · £1,800" status="⚠ Declare required on arrival at LOS" statusType="amber" />
      </div>
    ),
  },
  {
    num: '3',
    tag: 'Layer 3',
    title: "Money doesn't move until delivery is confirmed",
    body: 'When a Sender pays, funds go into escrow held by our licensed payment processor — not by CarryMate. Neither party can access them. The Traveler is not paid until the recipient confirms delivery with a one-time code. This eliminates the risk on both sides.',
    checks: [
      'Funds held by Stripe (GBP/EUR) or Paystack (NGN/GHS)',
      'Released only on dual OTP confirmation from both ends',
      '72-hour automatic escalation if delivery is unconfirmed',
    ],
    visual: (
      <div>
        <VisualCard label="£22.18 · Sender paid at checkout" status="Held in escrow · Stripe regulated account" statusType="amber" />
        <VisualCard label="Release conditions" content="Pickup OTP confirmed ✓ AND delivery OTP confirmed — both required before release" />
        <VisualCard label="Timeout protection" content="If unconfirmed after 72 hours — auto escalation to disputes team" status="Automated safety net" statusType="teal" />
      </div>
    ),
  },
  {
    num: '4',
    tag: 'Layer 4',
    title: 'Dual OTP confirmation at both ends',
    body: 'Two separate one-time passwords protect every delivery. The pickup OTP confirms the right Sender handed over to the right Traveler. The delivery OTP confirms the right recipient received it at destination. Both are unique per delivery, expire after use, and create a tamper-evident chain of custody.',
    checks: [
      'Pickup OTP confirms correct Sender and Traveler at collection',
      'Delivery OTP confirms correct recipient at destination',
      'Both logged with timestamps in our audit record',
      'Mismatch triggers automatic support escalation',
    ],
    reverse: true,
    visual: (
      <div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '12px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Pickup OTP · Sender shows at collection</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {['4','8','2','9'].map(d => <OtpDigit key={d} digit={d} active />)}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: '#e8f5e2', color: '#2a6b0f', marginTop: '10px' }}>✓ Confirmed · 09:42 · timestamped</div>
        </div>
        <div style={{ background: 'white', borderRadius: '16px', padding: '18px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Delivery OTP · Recipient enters on arrival</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {['7','3','1','6'].map(d => <OtpDigit key={d} digit={d} />)}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: '#fef3cd', color: '#7a4f00', marginTop: '10px' }}>Awaiting recipient entry</div>
        </div>
      </div>
    ),
  },
  {
    num: '5',
    tag: 'Layer 5',
    title: 'Photo and declaration at every pickup',
    body: 'Before a Traveler can confirm pickup, they must photograph the parcel using the CarryMate app. The photo cannot be uploaded from the gallery — it must be taken in-app, live. Both Sender and Traveler digitally sign a declaration confirming the contents match the listing. This protects the Traveler from customs liability if a misdescription is discovered later.',
    checks: [
      'In-app camera capture — gallery upload not accepted',
      'Timestamped and stored on AWS S3 in Africa (af-south-1)',
      'Digital declaration signed by both parties',
      'Shared with customs authorities in incidents',
    ],
    visual: (
      <div>
        <VisualCard label="Parcel photo · in-app capture at pickup">
          <div style={{ background: 'var(--warm)', borderRadius: '8px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '8px 0', fontSize: '32px' }}>📦</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: '#e8f5e2', color: '#2a6b0f' }}>✓ Timestamped · 09:41 · stored S3 af-south-1</div>
        </VisualCard>
        <VisualCard label="Digital declaration · signed by both" content={'"Contents: clothing and shoes, personal use, value £45. I have inspected the parcel and it matches the description."'} status="✓ Signed · both parties · timestamped" statusType="green" />
      </div>
    ),
  },
  {
    num: '6',
    tag: 'Layer 6',
    title: 'Reputation scores that compound and cannot be reset',
    body: 'After every delivery, both Sender and Traveler rate each other. These ratings are cumulative, public, and permanent. Our matching algorithm surfaces higher-rated carriers first. Senders with a pattern of misdescriptions have their listings reviewed before matching proceeds. The community polices itself — we build the infrastructure.',
    checks: [
      'Post-delivery rating from both parties',
      'Cumulative reputation — cannot be reset or hidden',
      'Matching algorithm weights by rating and delivery count',
      'Repeated dispute patterns trigger account review',
    ],
    reverse: true,
    visual: (
      <div>
        <VisualCard label="Carrier reputation · Kofi Asante" content="★★★★★ 5.0 · 94 deliveries · 0 disputes" status="Platinum carrier · surfaces first in matching" statusType="teal" />
        <VisualCard label="Sender history" content="14 deliveries · 1 dispute resolved in traveler favour" status="Listings reviewed before matching" statusType="amber" />
      </div>
    ),
  },
]

const CORRIDORS = [
  {
    flag: '🇬🇧 → 🇳🇬', route: 'London → Lagos', threshold: 'Duty-free: NGN 50,000 (~£30) personal gifts',
    rules: [
      { safe: true, text: 'Clothing and shoes — permitted' },
      { safe: true, text: 'Baby formula — up to 6 tins' },
      { safe: false, text: 'Electronics — 1 unit max, declare on arrival' },
      { safe: false, text: 'Jewellery — must declare in writing' },
    ],
  },
  {
    flag: '🇬🇧 → 🇬🇭', route: 'London → Accra', threshold: 'Duty-free: GHS 200 (~£13) personal effects',
    rules: [
      { safe: true, text: 'Clothing and personal items — permitted' },
      { safe: true, text: 'Cosmetics for personal use — permitted' },
      { safe: false, text: 'Electronics — CEPS declaration required' },
      { safe: false, text: 'Items above GHS 200 — declare on arrival' },
    ],
  },
  {
    flag: '🇺🇸 → 🇳🇬', route: 'New York → Lagos', threshold: 'NGN 50,000 limit on Nigeria end',
    rules: [
      { safe: true, text: 'Personal goods under $2,500 — no US export licence needed' },
      { safe: true, text: 'Clothing and gifts — permitted' },
      { safe: false, text: 'Goods over $2,500 — EEI filing required at US exit' },
      { safe: false, text: 'Nigeria arrival — all imports inspected' },
    ],
  },
  {
    flag: '🇬🇧 → 🇰🇪', route: 'London → Nairobi', threshold: 'Duty-free: KES 50,000 (~£385) personal effects',
    rules: [
      { safe: true, text: 'Clothing and personal items — permitted' },
      { safe: true, text: 'Relatively generous threshold vs other corridors' },
      { safe: false, text: '25% duty + 16% VAT applies above threshold' },
      { safe: false, text: 'Electronics bundles — commercial presumption risk' },
    ],
  },
  {
    flag: '🇫🇷 → 🇨🇮', route: 'Paris → Abidjan', threshold: 'CFA franc personal allowance applies',
    rules: [
      { safe: true, text: 'Personal effects within threshold — permitted' },
      { safe: true, text: 'French language declaration forms in app' },
      { safe: false, text: 'Quantities above personal use — declare' },
      { safe: false, text: 'Fresh food — phytosanitary requirements apply' },
    ],
  },
  {
    flag: '🇬🇧 → 🇯🇲', route: 'London → Kingston', threshold: 'Duty-free: JMD 50,000 (~£250)',
    rules: [
      { safe: true, text: 'Clothing, shoes, personal goods — permitted' },
      { safe: true, text: 'Ackee (canned and sealed) — permitted' },
      { safe: false, text: 'Fresh produce — agricultural inspection required' },
      { safe: false, text: 'Electronics — declare if new or high value' },
    ],
  },
]

const TIMELINE = [
  { num: '1', color: 'var(--teal)', time: 'Within 2 hours', title: 'Acknowledgement and escrow freeze', body: 'We acknowledge your dispute and freeze the escrow. Neither party can access the funds while the investigation is open. You receive a confirmation by push notification and email.' },
  { num: '2', color: 'var(--teal)', time: 'Within 8 hours', title: 'Evidence collection', body: 'We review parcel photos, OTP records, booking history, and communication. We contact both the Sender and Traveler for their account of events and any supporting evidence.' },
  { num: '3', color: 'var(--gold)', time: 'Within 24 hours', title: 'Assessment', body: 'Our trust team assesses liability. If a Sender misdescribed a parcel, they bear responsibility — not the Traveler. If a Traveler failed to deliver without good cause, they bear responsibility. We document our reasoning.' },
  { num: '4', color: 'var(--ink)', time: 'Within 48 hours', title: 'Decision and resolution', body: 'We issue a decision: full release to Traveler, full refund to Sender, or a partial split. Funds are moved within 24 hours of the decision. Both parties notified by push notification and email.' },
]

const CONTACTS = [
  { icon: '⚠', title: 'Report a safety concern', desc: 'If you believe a parcel contains a prohibited item, or something about a delivery feels wrong, contact us immediately. We investigate every report.', link: 'mailto:safety@carrymate.io', linkText: 'safety@carrymate.io →' },
  { icon: '⚖', title: 'Open a dispute', desc: 'For delivery problems, damaged parcels, or payment issues, open a dispute directly in the CarryMate app. Go to your parcel and tap "Report a problem."', link: '/faq#disputes', linkText: 'How disputes work →' },
  { icon: '🛃', title: 'Customs incident support', desc: 'If you are stopped at customs while carrying CarryMate parcels, contact us immediately. We will provide your booking documentation to the customs officer.', link: 'mailto:support@carrymate.io', linkText: 'support@carrymate.io →' },
  { icon: '🔒', title: 'Report fraud or abuse', desc: 'If you suspect your account has been compromised, or believe another user is acting fraudulently, contact our security team immediately.', link: 'mailto:security@carrymate.io', linkText: 'security@carrymate.io →' },
]

function VisualCard({ label, content, status, statusType, children }: { label: string; content?: string; status?: string; statusType?: 'green' | 'amber' | 'teal' | 'red'; children?: React.ReactNode }) {
  const statusColors: Record<string, { bg: string; color: string }> = {
    green: { bg: '#e8f5e2', color: '#2a6b0f' },
    amber: { bg: '#fef3cd', color: '#7a4f00' },
    teal: { bg: 'var(--teal-pale)', color: 'var(--teal)' },
    red: { bg: '#fceee8', color: '#7a2a16' },
  }
  const sc = statusType ? statusColors[statusType] : null
  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '18px', marginBottom: '12px', border: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>{label}</div>
      {content && <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500, lineHeight: 1.5 }}>{content}</div>}
      {children}
      {status && sc && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: sc.bg, color: sc.color, marginTop: '6px' }}>
          {status}
        </div>
      )}
    </div>
  )
}

function OtpDigit({ digit, active }: { digit: string; active?: boolean }) {
  return (
    <div style={{
      width: '36px', height: '44px', borderRadius: '10px',
      border: `1.5px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
      background: active ? 'var(--teal-pale)' : 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '20px', fontWeight: 700, color: active ? 'var(--teal)' : 'var(--ink)',
    }}>
      {digit}
    </div>
  )
}

export default function TrustPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
        {/* Hero */}
        <section style={{ background: 'var(--ink)', padding: '88px 5vw 72px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 120%,rgba(29,122,95,0.25),transparent)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.7)', marginBottom: '20px' }}>
            How we protect you
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', marginBottom: '20px', lineHeight: 1.0 }}>
            Safety is the product,<br />not a feature
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(245,240,232,0.65)', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.7 }}>
            Every layer of CarryMate is built around one question: how do we make sure both the sender and the traveler are fully protected in every delivery?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2px', maxWidth: '900px', margin: '0 auto' }}>
            {PILLARS.map(({ icon, title, sub }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.05)', padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.4 }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust layers */}
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '80px 5vw' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>The trust stack</div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px' }}>
            Six layers of protection<br />on every delivery
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '560px', lineHeight: 1.7, marginBottom: '60px' }}>
            Each of these layers serves a specific purpose. Together they make CarryMate the most trustworthy way to send a parcel through the diaspora community.
          </p>

          {LAYERS.map(({ num, tag, title, body, checks, reverse, visual }) => (
            <div
              key={num}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
                gap: '48px',
                alignItems: 'center',
                marginBottom: '72px',
                paddingBottom: '72px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ order: reverse ? 2 : 1 }}>
                <div style={{ background: 'var(--warm)', borderRadius: '24px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(29,122,95,0.08)' }} />
                  <div className="font-serif" style={{ fontSize: '80px', fontWeight: 900, color: 'var(--teal)', opacity: 0.12, position: 'absolute', top: '12px', right: '20px', lineHeight: 1 }}>{num}</div>
                  {visual}
                </div>
              </div>
              <div style={{ order: reverse ? 1 : 2 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--teal)', background: 'var(--teal-pale)', padding: '3px 10px', borderRadius: '99px', display: 'inline-block', marginBottom: '16px' }}>{tag}</span>
                <h3 className="font-serif" style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '14px', lineHeight: 1.15, marginTop: '10px' }}>{title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '14px' }}>{body}</p>
                <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
                  {checks.map(c => (
                    <li key={c} style={{ fontSize: '14px', color: 'var(--ink)', display: 'flex', gap: '10px', alignItems: 'flex-start', lineHeight: 1.55 }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, marginTop: '1px', color: 'var(--teal)', fontWeight: 700 }}>✓</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Customs intelligence */}
        <section style={{ background: 'var(--ink)', padding: '80px 5vw' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '16px' }}>Customs intelligence</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '12px' }}>
              Built for your corridor,<br />not every corridor
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.55)', marginBottom: '48px', maxWidth: '560px', lineHeight: 1.7 }}>
              Generic customs advice is not enough at an international border. Our guide is built specifically for each route we operate — verified quarterly with local legal counsel in each market.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
              {CORRIDORS.map(({ flag, route, threshold, rules }) => (
                <div key={route} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '22px' }}>
                  <div className="font-serif" style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{flag} {route}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(245,240,232,0.45)', marginBottom: '14px' }}>{threshold}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {rules.map(({ safe, text }) => (
                      <div key={text} style={{ fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'rgba(245,240,232,0.65)', lineHeight: 1.5 }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0, marginTop: '5px', background: safe ? 'var(--teal-light)' : 'var(--gold)', display: 'inline-block' }} />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dispute process */}
        <section style={{ padding: '80px 5vw', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>When things go wrong</div>
          <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px' }}>
            A dispute process you<br />can actually trust
          </h2>
          <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '540px', lineHeight: 1.7, marginBottom: '48px' }}>
            We aim to resolve every dispute within 48 hours. Here is exactly what happens when you open one.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', maxWidth: '680px' }}>
            <div style={{ position: 'absolute', left: '19px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
            {TIMELINE.map(({ num, color, time, title, body }) => (
              <div key={num} style={{ display: 'flex', gap: '20px', paddingBottom: '32px', position: 'relative' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0, position: 'relative', zIndex: 1, border: '2px solid var(--cream)', fontWeight: 700, background: color, color: 'white' }}>
                  {num}
                </div>
                <div style={{ paddingTop: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--teal)', letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: '5px' }}>{time}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '5px' }}>{title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact trust team */}
        <section style={{ background: 'var(--warm)', padding: '80px 5vw' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>Contact the trust team</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px' }}>We are here when you need us</h2>
            <p style={{ fontSize: '17px', color: 'var(--text-muted)', maxWidth: '520px', lineHeight: 1.7 }}>Safety issues get priority response. Our team is available 7 days a week and responds within 4 hours.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '24px', marginTop: '48px' }}>
              {CONTACTS.map(({ icon, title, desc, link, linkText }) => (
                <div key={title} style={{ background: 'white', borderRadius: '20px', padding: '28px', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{icon}</span> {title}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '16px' }}>{desc}</p>
                  {link.startsWith('mailto:') ? (
                    <a href={link} style={{ fontSize: '14px', color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>{linkText}</a>
                  ) : (
                    <Link href={link} style={{ fontSize: '14px', color: 'var(--teal)', fontWeight: 600, textDecoration: 'none' }}>{linkText}</Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
