'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

const ROUTES = [
  { flag: '🇬🇧', route: 'London → Lagos', weight: '2kg', price: '£18–£28', dhl: '£75–£120', save: 'Save ~£65' },
  { flag: '🇬🇧', route: 'London → Accra', weight: '2kg', price: '£16–£24', dhl: '£70–£110', save: 'Save ~£60' },
  { flag: '🇺🇸', route: 'New York → Lagos', weight: '2kg', price: '$24–$38', dhl: '$90–$140', save: 'Save ~$80' },
  { flag: '🇬🇧', route: 'London → Nairobi', weight: '2kg', price: '£20–£30', dhl: '£80–£120', save: 'Save ~£65' },
  { flag: '🇫🇷', route: 'Paris → Abidjan', weight: '2kg', price: '€22–€34', dhl: '€80–€120', save: 'Save ~€65' },
  { flag: '🇬🇧', route: 'London → Kingston', weight: '2kg', price: '£18–£26', dhl: '£70–£105', save: 'Save ~£55' },
]

const TIERS = [
  { name: 'Bronze', deliveries: '0–9 deliveries', bonus: '75%', label: 'of delivery fee', platinum: false },
  { name: 'Silver', deliveries: '10–49 deliveries', bonus: '+5%', label: 'commission bonus', platinum: false },
  { name: 'Gold', deliveries: '50–99 deliveries', bonus: '+10%', label: 'commission bonus', platinum: false },
  { name: 'Platinum', deliveries: '100+ deliveries', bonus: '+15%', label: 'commission bonus', platinum: true },
]

const SENDER_FAQS = [
  { q: 'Is the price I see at checkout the final price?', a: 'Yes. The price displayed when you select a Traveler is the total amount charged to your card. Optional insurance is shown separately and only added if you choose it. There are no fees added after checkout.' },
  { q: 'What payment methods are accepted?', a: 'UK and European senders: Visa, Mastercard, debit cards, Apple Pay, Google Pay via Stripe. Nigerian and Ghanaian senders: card, bank transfer, and USSD via Paystack.' },
  { q: 'Can I get a refund if the delivery does not happen?', a: 'Yes. If you cancel before the Traveler confirms pickup, you receive a full refund. If the Traveler cancels, you receive a full refund including the platform fee. If a dispute is resolved in your favour, you receive a full or partial refund as determined by our trust team.' },
  { q: 'What does the platform fee cover?', a: 'Identity verification for every Traveler. Escrow payment infrastructure. The customs intelligence guide. Real-time matching technology. Support and dispute resolution. Insurance infrastructure. It is one fee, not a list of add-ons.' },
]

const TRAVELER_FAQS = [
  { q: 'Is there a fee to sign up as a Traveler?', a: 'No. Signing up and posting trips is free. CarryMate earns only when a delivery completes successfully. There are no subscription fees, listing fees, or upfront costs.' },
  { q: 'Do I pay tax on my CarryMate earnings?', a: 'You are an independent contractor, not an employee. You are responsible for declaring your earnings to your relevant tax authority. In the UK, earnings above the £1,000 trading allowance per tax year must be declared to HMRC. CarryMate does not withhold tax. We recommend speaking to an accountant if you earn regularly through the platform.' },
  { q: 'Can I set my own price?', a: "Prices per corridor are set by CarryMate's algorithm based on corridor demand, parcel weight, and market rates. Travelers do not set individual prices — this ensures Senders can compare fairly and Travelers on the same corridor are on equal footing. Surge pricing (up to +25%) activates when demand on a corridor significantly exceeds traveler supply, automatically increasing your earnings." },
  { q: 'What happens if I cannot complete a delivery after collecting the parcel?', a: 'Contact CarryMate support immediately. Your carrier rating will not be affected by cancellations caused by circumstances outside your control (flight cancellations, medical emergencies, family situations) provided you notify us promptly. The escrow is held until the situation is resolved.' },
]

export default function PricingPage() {
  const [tab, setTab] = useState<'sender' | 'traveler'>('sender')

  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '80px 5vw 64px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            Transparent pricing
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px' }}>
            No surprises.<br />No hidden fees.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Every fee is shown at checkout before you commit. What you see is what you pay.
          </p>
          {/* Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--warm)', padding: '4px', borderRadius: '100px', width: 'fit-content', margin: '36px auto 0' }}>
            {(['sender', 'traveler'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '10px 28px', borderRadius: '100px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s',
                  background: tab === t ? 'var(--ink)' : 'transparent',
                  color: tab === t ? 'white' : 'var(--text-muted)',
                }}
              >
                {t === 'sender' ? 'I want to send' : 'I want to earn'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 5vw 96px' }}>
          {/* SENDER PANEL */}
          {tab === 'sender' && (
            <div>
              {/* Comparison */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px', marginBottom: '48px' }}>
                {/* Courier */}
                <div style={{ borderRadius: '20px', padding: '32px', border: '2px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Traditional courier</div>
                  <div className="font-serif" style={{ fontSize: '56px', fontWeight: 900, color: 'var(--ink)', lineHeight: 1, marginBottom: '4px' }}>£85</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>typical DHL Express price</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>London → Lagos · 2kg parcel</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: 0, listStyle: 'none' }}>
                    {[['✓', 'Tracking included'], ['✗', '4–7 business days'], ['✗', 'No cultural familiarity'], ['✗', 'No customs guidance'], ['✗', 'Unknown handler']].map(([icon, text]) => (
                      <li key={text} style={{ fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'var(--ink)' }}>
                        <span style={{ color: icon === '✓' ? 'var(--teal)' : '#c04a2a', fontWeight: 700, flexShrink: 0 }}>{icon}</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* CarryMate */}
                <div style={{ borderRadius: '20px', padding: '32px', border: '2px solid var(--teal)', background: 'var(--teal-pale)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '8px' }}>CarryMate</div>
                  <div className="font-serif" style={{ fontSize: '56px', fontWeight: 900, color: 'var(--teal)', lineHeight: 1, marginBottom: '4px' }}>£22</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>average delivery price</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>London → Lagos · 2kg parcel</div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: 0, listStyle: 'none' }}>
                    {['Real-time status updates', '24–48 hours delivery', 'Verified community member', 'Built-in customs guide', 'Escrow payment protection'].map(text => (
                      <li key={text} style={{ fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start', color: 'var(--ink)' }}>
                        <span style={{ color: 'var(--teal)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Breakdown */}
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
                <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>What makes up your delivery fee</h3>
                {[
                  { label: 'Traveler fee', note: '75% of the total delivery charge — goes directly to the carrier', val: '£16.50', muted: false },
                  { label: 'Platform fee (12%)', note: 'Covers matching, escrow, KYC, support, customs guide, and insurance infrastructure', val: '£2.28', muted: true },
                  { label: 'Insurance (optional)', note: 'Covers loss or damage up to the declared value (max £200). Added at checkout.', val: '£0.90', muted: true },
                  { label: 'Total', note: '', val: '£22.18', muted: false, total: true },
                ].map(({ label, note, val, muted, total }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: total ? '16px 0 0' : '12px 0', borderBottom: total ? 'none' : '1px solid var(--border)', fontSize: total ? '16px' : '14px', fontWeight: total ? 700 : 400 }}>
                    <span>
                      {label}
                      {note && <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 400 }}>{note}</div>}
                    </span>
                    <span className={muted ? '' : 'font-serif'} style={{ fontSize: muted ? '14px' : '18px', fontWeight: 700, color: muted ? 'var(--text-muted)' : 'var(--teal)' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Routes table */}
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Typical prices by corridor</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginBottom: '32px' }}>
                  <thead>
                    <tr>
                      {['Route', 'Typical weight', 'CarryMate', 'DHL equivalent', 'You save'].map(h => (
                        <th key={h} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '12px 14px', textAlign: 'left', borderBottom: '2px solid var(--border)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROUTES.map(({ flag, route, weight, price, dhl, save }, i) => (
                      <tr key={route}>
                        <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{flag} {route}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{weight}</td>
                        <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? 'var(--warm)' : undefined }}>
                          <span className="font-serif" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--teal)' }}>{price}</span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? 'var(--warm)' : undefined }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{dhl}</span>
                        </td>
                        <td style={{ padding: '14px', borderBottom: '1px solid var(--border)', background: i % 2 === 1 ? 'var(--warm)' : undefined }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, background: '#e8f5e2', color: '#2a6b0f', padding: '3px 8px', borderRadius: '99px' }}>{save}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* FAQ */}
              <MiniFaq title="Sender pricing questions" items={SENDER_FAQS} />
            </div>
          )}

          {/* TRAVELER PANEL */}
          {tab === 'traveler' && (
            <div>
              {/* Earn hero */}
              <div style={{ background: 'var(--ink)', borderRadius: '24px', padding: '48px', textAlign: 'center', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 100%,rgba(29,122,95,0.3),transparent)', pointerEvents: 'none' }} />
                <h2 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: '12px', position: 'relative' }}>
                  Turn your next flight into income
                </h2>
                <div className="font-serif" style={{ fontSize: '72px', fontWeight: 900, color: '#2ea882', lineHeight: 1, margin: '16px 0 8px', position: 'relative' }}>£150</div>
                <p style={{ fontSize: '16px', color: 'rgba(245,240,232,0.65)', position: 'relative' }}>average earnings per round trip · London → Lagos</p>
              </div>

              {/* Tiers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '16px', marginBottom: '32px' }}>
                {TIERS.map(({ name, deliveries, bonus, label, platinum }) => (
                  <div key={name} style={{ background: platinum ? 'var(--teal-pale)' : 'white', border: `1px solid ${platinum ? 'var(--teal)' : 'var(--border)'}`, borderRadius: '16px', padding: '22px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: platinum ? 'var(--teal)' : 'var(--text-muted)', marginBottom: '8px' }}>{name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{deliveries}</div>
                    <div className="font-serif" style={{ fontSize: '32px', fontWeight: 900, color: platinum ? 'var(--teal)' : 'var(--ink)', marginBottom: '4px' }}>{bonus}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Earnings calc */}
              <div style={{ background: 'var(--warm)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
                <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Example trip earnings · LHR → LOS</h3>
                {[
                  { label: 'Parcel 1: Clothing · £22 delivery fee', val: '£16.50' },
                  { label: 'Parcel 2: Laptop · £32 delivery fee', val: '£24.00' },
                  { label: 'Parcel 3: Baby formula · £24 delivery fee', val: '£18.00' },
                  { label: 'Total earnings (3 parcels · 5.5kg used)', val: '£63.00', bold: true },
                ].map(({ label, val, bold }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '10px 0', borderBottom: bold ? 'none' : '1px solid var(--border)', fontWeight: bold ? 700 : 400, fontSize: bold ? '16px' : '14px' }}>
                    <span>{label}</span>
                    <span className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--teal)' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Highlight box */}
              <div style={{ background: 'var(--teal-pale)', border: '1px solid rgba(29,122,95,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '24px', fontSize: '14px', color: '#0a3d2b', lineHeight: 1.7 }}>
                <strong>How your payout is calculated:</strong> CarryMate takes 12% of the delivery fee as the platform fee. You receive 75% of the delivery fee set for your corridor. For example, on a £22 delivery: £16.50 to you, £2.64 platform fee, £2.86 covers payment processing and operations. Higher carrier tiers earn a commission bonus on top of the base 75%.
              </div>

              {/* Payout schedule */}
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
                <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>Payout schedule</h3>
                {[
                  { label: 'When is payment released?', note: 'Immediately when the recipient enters the delivery OTP', val: 'On OTP confirm' },
                  { label: 'UK bank accounts (Stripe)', note: 'Faster Payments to any UK bank — no fee', val: '3–5 working days' },
                  { label: 'Nigerian bank accounts (Paystack)', note: 'NGN equivalent at prevailing rate — no conversion fee charged by CarryMate', val: '3–5 working days' },
                  { label: 'Mobile money · Ghana, Kenya, East Africa', note: 'MTN Mobile Money, M-Pesa via Flutterwave', val: '1–3 working days' },
                ].map(({ label, note, val }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)', fontSize: '14px' }}>
                    <span>
                      {label}
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{note}</div>
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '16px' }}>{val}</span>
                  </div>
                ))}
              </div>

              <MiniFaq title="Traveler earning questions" items={TRAVELER_FAQS} />
            </div>
          )}
        </div>

        {/* CTA */}
        <div style={{ background: 'var(--teal)', padding: '64px 5vw', textAlign: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '12px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px' }}>Sign up in 3 minutes. No commitment, no subscription.</p>
          <Link href="/signup" style={{ background: 'white', color: 'var(--teal)', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            Create your account →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}

function MiniFaq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <div style={{ marginTop: '48px' }}>
      <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>{title}</h3>
      {items.map(({ q, a }) => (
        <div key={q} style={{ borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>{q}</div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{a}</div>
        </div>
      ))}
    </div>
  )
}
