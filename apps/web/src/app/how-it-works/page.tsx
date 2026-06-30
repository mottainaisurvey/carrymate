'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

const SENDER_STEPS = [
  {
    num: '1',
    title: 'Describe your parcel — we check customs instantly',
    body1: 'Tell us what you are sending, where it is going, and when you need it there. Our AI checks your item description against the customs rules for your specific corridor before you proceed.',
    body2: 'Items that are clearly prohibited are blocked. Items that require a customs declaration show an amber warning with guidance. Safe items proceed straight to matching. No guesswork, no nasty surprises at the border.',
    tip: '💡 Be specific and honest in your description. "Clothing" is fine. "A package" is not. Inaccurate descriptions are your legal liability at customs.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="Route" badge={{ text: 'Corridor detected', type: 'teal' }} content="London → Lagos · needed by 15 April" />
        <StepCard label="What you are sending" badge={{ text: '✓ Customs-safe', type: 'safe' }} content="Clothing + shoes · 2kg · declared value £45" />
        <StepCard label="AI customs check · LHR → LOS" smallContent="Clothing: permitted · Value below duty-free threshold · No declaration required" />
      </div>
    ),
  },
  {
    num: '2',
    title: 'Choose a verified traveler flying your route',
    body1: 'CarryMate surfaces travelers who are already flying your route in your timeframe. You see their departure date, available luggage space, carrier rating, and price. Every traveler on CarryMate has passed passport verification and a sanctions check.',
    body2: 'Browse and select the one that works for you. Higher-rated carriers appear first. Platinum carriers (100+ deliveries) are a safe choice for valuable or time-sensitive items.',
    tip: '💡 The Platinum tier badge means 100+ completed deliveries with no unresolved disputes. It is the community\'s highest trust signal.',
    flip: true,
    visual: (
      <div>
        <StepCard label="3 travelers matched · LHR→LOS · Apr 12–14">
          <TravelerRow initials="KA" color="teal" name="Kofi A." sub="Apr 13 · 5kg space · ★★★★★ 5.0" price="£19" />
          <TravelerRow initials="AO" color="gold" name="Adaeze O." sub="Apr 12 · 3kg space · ★★★★★ 4.9" price="£22" />
          <TravelerRow initials="BN" color="rust" name="Bisi N." sub="Apr 14 · 2kg space · ★★★★☆ 4.7" price="£25" />
        </StepCard>
      </div>
    ),
  },
  {
    num: '3',
    title: 'Pay into escrow — funds held until delivery',
    body1: 'When you confirm your traveler, you pay the full amount into escrow. Escrow means your money is held by our regulated payment processor — not by CarryMate, and not by the Traveler. Nobody can touch it until the delivery is confirmed.',
    body2: 'You also receive a 4-digit pickup OTP. This is the code you will show the Traveler when you meet to hand over the parcel. Without this code, the Traveler cannot confirm collection.',
    tip: '💡 The pickup OTP confirms that the right person collected your parcel at the right time. Keep it safe until you meet the Traveler.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="Payment breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px' }}>
            {[['Traveler fee', '£19.00'], ['Platform fee', '£2.28']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Insurance (optional)</span>
              <span style={{ fontWeight: 600, color: 'var(--teal)' }}>+ £0.90</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '18px', color: 'var(--teal)' }}>£22.18</span>
            </div>
          </div>
        </StepCard>
        <StepCard label="Your pickup code · show to traveler">
          <OtpRow digits={['4','8','2','9']} active />
        </StepCard>
      </div>
    ),
  },
  {
    num: '4',
    title: 'Meet your traveler and hand over the parcel',
    body1: 'Arrange a meetup with your Traveler — typically somewhere convenient to both of you, or at the departure airport. Show them your pickup OTP. They enter it into the CarryMate app and photograph your parcel.',
    body2: 'From that moment, you can track the delivery in real time from your app. The status updates at every stage: collected, in transit, and finally delivered.',
    tip: '💡 Most meetups happen at a café, a train station, or the airport. The Traveler photographs the parcel at this point — so make sure it is well packaged.',
    flip: true,
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="You meet the traveler" content="Agreed location · Kofi A. · Apr 13 · 10:00">
          <div style={{ background: 'var(--warm)', borderRadius: '8px', padding: '10px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.55, marginTop: '8px' }}>
            Traveler inspects parcel, photographs it, enters your OTP. You both sign the digital declaration. Parcel is on its way.
          </div>
        </StepCard>
        <StepCard label="In transit · live status" badge={{ text: 'On the way', type: 'teal' }}>
          <ProgressBar pct={60} from="London" to="Lagos" />
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Flight BA0075 · Departed LHR 22:15</div>
        </StepCard>
      </div>
    ),
  },
  {
    num: '5',
    title: 'Recipient confirms delivery — escrow is released',
    body1: 'When the Traveler delivers the parcel, your recipient enters a delivery OTP to confirm they received it. This OTP is separate from your pickup code and is sent directly to the recipient\'s phone.',
    body2: 'The moment they confirm, the escrow is automatically released to the Traveler. You receive a delivery notification, and you can rate your Traveler. That is it — done.',
    tip: '💡 Your recipient does not need a CarryMate account. They just need their phone to receive the delivery OTP by SMS.',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--teal-pale)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'var(--teal)', fontWeight: 700 }}>✓</div>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '20px', fontWeight: 700, color: 'var(--teal)', marginBottom: '4px' }}>Delivered!</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lagos · Apr 13 · 18:42 · OTP confirmed</div>
          </div>
        </StepCard>
        <StepCard label="Funds released to traveler" content="£19.00 paid to Kofi A. · Barclays ••4821">
          <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: '#e8f5e2', color: '#2a6b0f' }}>✓ Escrow released</span>
        </StepCard>
        <StepCard label="You saved">
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', fontWeight: 900, color: 'var(--teal)' }}>£62.82</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>vs DHL Express price of £85</div>
        </StepCard>
      </div>
    ),
  },
]

const TRAVELER_STEPS = [
  {
    num: '1',
    title: 'Post your trip and set your earning goal',
    body1: 'Tell CarryMate where you are flying, when, and how much luggage space you have available. Set an earning goal — for example, £150 to offset your ticket, or £200 to cover your allowance.',
    body2: 'The app will then show you which parcels available on your route would get you closest to your goal, based on your available space and the per-parcel fee for your corridor.',
    tip: '💡 You earn more with higher carrier tiers. Complete 10 deliveries to reach Silver tier and unlock a 5% commission bonus on every delivery after that.',
    color: 'teal',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="Your trip" content="London Heathrow → Lagos · Apr 13 · BA0075" />
        <StepCard label="Luggage space available">
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '28px', fontWeight: 900, color: 'var(--teal)', marginBottom: '6px' }}>8 kg</div>
          <ProgressBar pct={100} />
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>23kg allowance · 15kg personal · 8kg available</div>
        </StepCard>
        <StepCard label="Earning goal for this trip">
          <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '28px', fontWeight: 900, color: 'var(--ink)' }}>£150</div>
          <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-pale)', color: 'var(--teal)' }}>3–4 parcels needed</span>
        </StepCard>
      </div>
    ),
  },
  {
    num: '2',
    title: 'Browse matched parcels and accept the ones you want',
    body1: 'CarryMate shows you parcels available on your route. Each listing shows the item type, weight, customs status, and your earning per delivery. You choose which ones to accept — there is no obligation to take any particular parcel.',
    body2: 'Every parcel has already been screened by our AI against customs rules for your corridor. Items that require declaration are flagged with an amber warning so you know what to expect at the border.',
    tip: '💡 You are always within your rights to decline any parcel at any point before pickup — including if it looks different from the description when you meet the Sender. Declining never affects your carrier rating.',
    flip: true,
    color: 'teal',
    visual: (
      <div>
        <StepCard label="5 parcels matched · LHR→LOS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            <div style={{ background: 'var(--teal-pale)', borderRadius: '10px', padding: '10px 12px', border: '1px solid rgba(29,122,95,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>👗 Clothing</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2kg · Adaeze O.</div>
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, color: 'var(--teal)' }}>£19</div>
              </div>
              <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: '#e8f5e2', color: '#2a6b0f' }}>✓ Customs-safe</span>
            </div>
            <div style={{ background: 'white', borderRadius: '10px', padding: '10px 12px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>💻 Laptop</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>2.5kg · Emeka T.</div>
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, color: 'var(--teal)' }}>£38</div>
              </div>
              <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: '#fef3cd', color: '#7a4f00' }}>⚠ Declare on arrival</span>
            </div>
          </div>
        </StepCard>
      </div>
    ),
  },
  {
    num: '3',
    title: 'Collect parcels — inspect, photograph, confirm OTP',
    body1: 'Meet each Sender before your departure. Inspect every parcel — make sure it matches the description and that nothing feels wrong. If anything is off, do not collect it. Contact CarryMate support immediately.',
    body2: 'If everything looks right: ask the Sender to show you their pickup OTP, enter it in the app, and photograph the parcel using the in-app camera. That photograph creates a timestamped record that protects you if any customs issue arises later.',
    tip: '💡 The photo is your legal protection. If a Sender misdescribed a parcel and you have a photo showing you collected what you were told, the liability is theirs — not yours.',
    color: 'teal',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="Meet the sender · confirm pickup OTP" content="Adaeze O. · Clothing · 2kg">
          <OtpRow digits={['4','8','2','9']} active />
          <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: '#e8f5e2', color: '#2a6b0f' }}>✓ OTP confirmed · 09:42</span>
        </StepCard>
        <StepCard label="Parcel photo taken · in-app camera">
          <div style={{ background: 'var(--warm)', borderRadius: '8px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '6px 0' }}>📦</div>
          <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-pale)', color: 'var(--teal)' }}>Timestamped · stored securely</span>
        </StepCard>
      </div>
    ),
  },
  {
    num: '4',
    title: 'Fly — with the customs guide in your pocket',
    body1: 'On the day of your flight, your CarryMate app shows a customs guide specifically for your corridor — which items require declaration, which are permitted without declaration, and what to say if you are stopped.',
    body2: 'At the border, you are carrying goods on behalf of individuals for personal use — our documentation supports this position. If you are stopped, contact CarryMate support immediately. We will provide your booking records and parcel photos to the customs officer.',
    tip: '💡 The customs guide updates quarterly with input from local legal counsel. Always check it on the day of your flight — rules change.',
    flip: true,
    color: 'teal',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard label="Customs guide · LHR → LOS">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px', fontSize: '12px' }}>
            {[
              { safe: true, text: 'Clothing: permitted — no declaration' },
              { safe: false, text: 'Laptop: 1 unit — declare on Red channel at LOS' },
              { safe: true, text: 'Baby formula: up to 6 tins — permitted' },
              { safe: true, text: 'Cash: declare amounts over $5,000' },
            ].map(({ safe, text }) => (
              <div key={text} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: safe ? 'var(--teal-light)' : 'var(--gold)', flexShrink: 0, marginTop: '4px', display: 'inline-block' }} />
                <span style={{ color: 'var(--ink)' }}>{text}</span>
              </div>
            ))}
          </div>
        </StepCard>
        <StepCard label="Flight in progress · BA0075">
          <ProgressBar pct={75} from="London" to="Lagos" />
        </StepCard>
      </div>
    ),
  },
  {
    num: '5',
    title: 'Deliver, collect OTPs, and get paid',
    body1: 'Meet each recipient in Lagos and have them enter the delivery OTP into the CarryMate app. The moment they confirm, the escrow for that parcel is released to your account. Do all three deliveries and the full amount is released.',
    body2: 'Payouts process to your registered bank account within 3–5 business days. UK banks via Stripe. Nigerian banks via Paystack. Ghanaian and East African accounts via Flutterwave, with mobile money supported.',
    tip: '💡 Your carrier rating updates after every delivery. Every five-star rating moves you closer to the next tier and higher commission bonuses.',
    color: 'teal',
    visual: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <StepCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '36px', fontWeight: 900, color: 'var(--teal)', marginBottom: '4px' }}>£81</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>earned this trip · 3 deliveries</div>
            <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: 'var(--teal-pale)', color: 'var(--teal)' }}>Payout processing · Barclays ••4821</span>
          </div>
        </StepCard>
        <StepCard>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '12px' }}>
            {[['Clothing · Adaeze O.', '£19 ✓'], ['Laptop · Emeka T.', '£38 ✓'], ['Formula · Ngozi K.', '£24 ✓']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{v}</span>
              </div>
            ))}
          </div>
        </StepCard>
      </div>
    ),
  },
]

const QUESTIONS = [
  { q: 'Is it legal to send parcels through CarryMate?', a: 'Yes. Individuals have always been permitted to carry personal goods for others while travelling. CarryMate provides the technology to make this safer and structured. The legality of any specific parcel depends on its contents and the customs rules of the destination country.' },
  { q: 'What if no traveler is available for my route?', a: 'Your listing stays active and we keep searching. If no match is found within 48 hours, you receive a £5 account credit. You can also set a flexible date range so your parcel is visible to more travelers.' },
  { q: 'As a traveler, can I decline a parcel after accepting?', a: 'Yes — at any point before pickup confirmation. You can also decline at pickup if the parcel does not match its description. Declining does not affect your carrier rating. Your safety and legal protection always come first.' },
  { q: 'What if something goes wrong with the delivery?', a: 'Open a dispute in the app. We acknowledge within 2 hours, freeze the escrow, and aim to resolve within 48 hours. The escrow protects your money until the situation is resolved — nothing moves until we issue a decision.' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepCard({ label, badge, content, smallContent, children }: {
  label?: string
  badge?: { text: string; type: 'safe' | 'warn' | 'teal' | 'amber' }
  content?: string
  smallContent?: string
  children?: React.ReactNode
}) {
  const badgeColors: Record<string, { bg: string; color: string }> = {
    safe: { bg: '#e8f5e2', color: '#2a6b0f' },
    warn: { bg: '#fef3cd', color: '#7a4f00' },
    teal: { bg: 'var(--teal-pale)', color: 'var(--teal)' },
    amber: { bg: 'rgba(192,74,42,0.12)', color: '#c04a2a' },
  }
  return (
    <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
      {(label || badge) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          {label && <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>}
          {badge && (
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: badgeColors[badge.type].bg, color: badgeColors[badge.type].color }}>
              {badge.text}
            </span>
          )}
        </div>
      )}
      {content && <div style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500, lineHeight: 1.5 }}>{content}</div>}
      {smallContent && <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{smallContent}</div>}
      {children}
    </div>
  )
}

function TravelerRow({ initials, color, name, sub, price }: { initials: string; color: 'teal' | 'gold' | 'rust'; name: string; sub: string; price: string }) {
  const colors = {
    teal: { bg: 'var(--teal-pale)', color: 'var(--teal)' },
    gold: { bg: 'rgba(200,150,62,0.12)', color: 'var(--gold)' },
    rust: { bg: 'rgba(192,74,42,0.12)', color: '#c04a2a' },
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0, background: colors[color].bg, color: colors[color].color }}>
        {initials}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{name}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>
      </div>
      <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '16px', fontWeight: 700, color: 'var(--teal)' }}>{price}</div>
    </div>
  )
}

function OtpRow({ digits, active }: { digits: string[]; active?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
      {digits.map((d, i) => (
        <div key={i} style={{
          width: '32px', height: '38px', borderRadius: '8px',
          border: `1.5px solid ${active ? 'var(--teal)' : 'var(--border)'}`,
          background: active ? 'var(--teal-pale)' : 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', fontWeight: 700,
          color: active ? 'var(--teal)' : 'var(--ink)',
        }}>
          {d}
        </div>
      ))}
    </div>
  )
}

function ProgressBar({ pct, from, to }: { pct: number; from?: string; to?: string }) {
  return (
    <>
      <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '6px 0' }}>
        <div style={{ height: '4px', borderRadius: '2px', background: 'var(--teal)', width: `${pct}%` }} />
      </div>
      {(from || to) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>{from}</span><span>{to}</span>
        </div>
      )}
    </>
  )
}

export default function HowItWorksPage() {
  const [tab, setTab] = useState<'sender' | 'traveler'>('sender')
  const steps = tab === 'sender' ? SENDER_STEPS : TRAVELER_STEPS

  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '80px 5vw 64px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            How it works
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px', lineHeight: 1.0 }}>
            Simple for senders.<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 300 }}>Profitable</em> for travelers.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.7 }}>
            CarryMate connects in five steps. Whether you are sending a parcel or carrying one, the whole process happens in the app.
          </p>
          {/* Toggle */}
          <div style={{ display: 'flex', gap: '4px', background: 'var(--warm)', padding: '4px', borderRadius: '100px', width: 'fit-content', margin: '0 auto' }}>
            <button
              onClick={() => setTab('sender')}
              style={{ padding: '11px 28px', borderRadius: '100px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s', background: tab === 'sender' ? 'var(--ink)' : 'transparent', color: tab === 'sender' ? 'white' : 'var(--text-muted)' }}
            >
              I want to send a parcel
            </button>
            <button
              onClick={() => setTab('traveler')}
              style={{ padding: '11px 28px', borderRadius: '100px', border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s', background: tab === 'traveler' ? 'var(--teal)' : 'transparent', color: tab === 'traveler' ? 'white' : 'var(--text-muted)' }}
            >
              I want to earn on my flight
            </button>
          </div>
        </div>

        {/* Steps */}
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '72px 5vw' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px', textAlign: 'center' }}>
            {tab === 'sender' ? 'For senders' : 'For travelers'}
          </div>
          <div className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', textAlign: 'center', marginBottom: '60px' }}>
            {tab === 'sender' ? 'Send a parcel in five steps' : 'Earn on your flight in five steps'}
          </div>

          {steps.map(({ num, title, body1, body2, tip, flip, color, visual }) => (
            <div
              key={num}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
                gap: '56px',
                alignItems: 'center',
                marginBottom: '80px',
                paddingBottom: '80px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ order: flip ? 2 : 1 }}>
                <div style={{ background: 'var(--warm)', borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden', minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="font-serif" style={{ position: 'absolute', top: '12px', right: '16px', fontSize: '96px', fontWeight: 900, color: 'var(--teal)', opacity: 0.08, lineHeight: 1 }}>{num}</div>
                  {visual}
                </div>
              </div>
              <div style={{ order: flip ? 1 : 2 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '50%', fontSize: '13px', fontWeight: 700, color: 'white', marginBottom: '14px',
                  background: color === 'teal' ? 'var(--teal)' : 'var(--ink)',
                }}>
                  {num}
                </div>
                <h3 className="font-serif" style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.15 }}>{title}</h3>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '12px' }}>{body1}</p>
                <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.75 }}>{body2}</p>
                <div style={{ background: 'var(--teal-pale)', borderRadius: '10px', padding: '12px 14px', fontSize: '13px', color: '#0a3d2b', fontWeight: 500, marginTop: '14px', lineHeight: 1.55 }}>
                  {tip}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Questions */}
        <section style={{ background: 'var(--ink)', padding: '72px 5vw' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '48px', alignItems: 'start' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '14px' }}>Still wondering</div>
              <div className="font-serif" style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '16px' }}>Common questions</div>
              <p style={{ fontSize: '16px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.7, marginBottom: '28px' }}>The full FAQ covers every scenario. Start here for the most common ones.</p>
              <Link href="/faq" style={{ background: 'var(--teal)', color: 'white', padding: '13px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                Read the full FAQ →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {QUESTIONS.map(({ q, a }) => (
                <div key={q} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '16px 18px', border: '1px solid transparent' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', marginBottom: '5px' }}>{q}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.6 }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '72px 5vw', textAlign: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '14px' }}>
            Ready to get started?
          </h2>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '440px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Sign up takes 3 minutes. No commitment until you confirm a match.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: 'var(--ink)', color: 'var(--cream)', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Send a parcel →
            </Link>
            <Link href="/signup" style={{ background: 'transparent', color: 'var(--ink)', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid var(--border)', display: 'inline-block' }}>
              Earn on my flight
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
