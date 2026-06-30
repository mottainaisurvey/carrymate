import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Lagos Customs Guide 2026 — What You Can and Cannot Bring In — CarryMate',
  description: 'Complete 2026 guide to Nigerian customs rules at MMA Lagos — duty-free limits, prohibited items, declaration process, and what actually happens at the Red channel.',
}

type StatusType = 'safe' | 'warn' | 'block'

const STATUS_ITEMS: { category: string; items: { status: StatusType; text: string }[] }[] = [
  {
    category: 'Clothing and fashion',
    items: [
      { status: 'safe', text: 'New or used clothing for personal use — generally permitted without declaration' },
      { status: 'safe', text: 'Shoes — one or two pairs for personal gift use, generally permitted' },
      { status: 'warn', text: 'Large quantities (10+ items) — risk of commercial classification, declare' },
      { status: 'warn', text: 'High-value fashion items (bags, luxury brand goods) — declare on Red channel' },
    ],
  },
  {
    category: 'Electronics',
    items: [
      { status: 'safe', text: 'One mobile phone for personal use — permitted' },
      { status: 'warn', text: 'One laptop — permitted, but use Red channel and declare' },
      { status: 'block', text: 'Two or more phones or laptops — classified as commercial import, full duty applies' },
      { status: 'warn', text: 'Smart watches, tablets — declare, personal use likely permitted' },
      { status: 'block', text: 'Printers, photocopiers, commercial equipment — commercial import, duty and permits required' },
    ],
  },
  {
    category: 'Food products',
    items: [
      { status: 'safe', text: 'Dried goods (egusi, crayfish, beans, stockfish dried) — permitted' },
      { status: 'safe', text: 'Sealed packaged goods (rice, flour in factory packaging) — generally permitted' },
      { status: 'warn', text: 'Packaged meat (sealed, vacuum-packed) — usually permitted, inspect likely' },
      { status: 'block', text: 'Fresh fruit and vegetables — NAFDAC permit required, very high seizure risk' },
      { status: 'block', text: 'Fresh or frozen meat and fish — very high seizure risk without NAFDAC permit' },
    ],
  },
  {
    category: 'Healthcare and pharmaceuticals',
    items: [
      { status: 'safe', text: 'Over-the-counter medicines (paracetamol, ibuprofen, vitamins) — permitted for personal use' },
      { status: 'warn', text: 'Prescription medicines — permitted with valid prescription and doctor\'s letter' },
      { status: 'block', text: 'Codeine-containing products — banned in Nigeria since 2018, zero tolerance' },
      { status: 'block', text: 'Tramadol — controlled substance in Nigeria, permit required' },
      { status: 'block', text: 'Psychotropic substances — strictly prohibited' },
    ],
  },
  {
    category: 'Cosmetics and personal care',
    items: [
      { status: 'safe', text: 'Personal use quantities — shampoo, body lotion, perfume, skincare — permitted' },
      { status: 'warn', text: 'Large quantities suggesting resale — classify as commercial, duty may apply' },
      { status: 'warn', text: 'Skin-lightening products — NAFDAC regulates these; carry evidence of personal use' },
    ],
  },
  {
    category: 'Baby products',
    items: [
      { status: 'safe', text: 'Baby formula — up to 6 tins generally permitted without declaration' },
      { status: 'safe', text: 'Baby clothing, toys, and accessories — permitted' },
      { status: 'warn', text: 'More than 6 tins of formula — risk of commercial classification, declare' },
    ],
  },
]

const STATUS_STYLES: Record<StatusType, { bg: string; color: string; dot: string }> = {
  safe: { bg: '#e8f5e2', color: '#1a4a0f', dot: '#2a6b0f' },
  warn: { bg: '#fef3cd', color: '#5a3a00', dot: '#c8963e' },
  block: { bg: '#fceee8', color: '#7a2a16', dot: '#c04a2a' },
}

const QUICK_REF = [
  { status: 'safe' as StatusType, text: 'Clothing: permitted' },
  { status: 'safe' as StatusType, text: 'Baby formula: up to 6 tins' },
  { status: 'warn' as StatusType, text: 'Laptop: 1 unit, declare' },
  { status: 'block' as StatusType, text: 'Codeine: banned, zero tolerance' },
  { status: 'block' as StatusType, text: 'Fresh food: very high seizure risk' },
]

export default function LagosCustomsGuidePage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--ink)', padding: '72px 5vw 56px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: 'var(--gold)', color: 'var(--ink)', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700 }}>Customs</span>
            Nigeria · MMA Lagos
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: '16px', lineHeight: 1.1, maxWidth: '720px' }}>
            Lagos customs guide 2026: what you can and cannot bring into Nigeria
          </h1>
          <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.45)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span>CarryMate Editorial</span>
            <span>June 2026</span>
            <span>10 min read</span>
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '56px', maxWidth: '960px', margin: '0 auto', padding: '56px 5vw 96px', alignItems: 'start' }}>
          {/* Article */}
          <article style={{ minWidth: 0 }}>
            <P>Nigerian customs rules are frequently misunderstood, inconsistently applied, and rarely explained clearly to diaspora travelers. This guide aims to fix that. It covers what you can bring into Nigeria in 2026, what the actual duty-free limits are, how the Red and Green channels work at MMA Lagos, and what happens if you are stopped.</P>
            <P>This is particularly relevant for CarryMate carriers — but it is equally useful for anyone traveling to Nigeria with goods for family or friends.</P>

            <Warning>This guide is for informational purposes only. Customs rules change frequently and are subject to officer discretion at the point of entry. Always verify current rules with the Nigerian Customs Service (customs.gov.ng) before traveling. This is not legal advice.</Warning>

            <H2>The duty-free threshold: what it means in practice</H2>
            <P>Nigeria's personal gift allowance is NGN 50,000 — approximately £30 at the exchange rates prevailing in June 2026. This is one of the lowest duty-free thresholds of any major destination country in Africa. It means, technically, that almost any goods brought in on behalf of another person could attract import duty.</P>
            <P>In practice, the threshold is applied with significant officer discretion. Customs officers at MMA Lagos distinguish between:</P>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { bold: 'Personal effects', rest: ' — goods for the traveler\'s own use, which are generally waved through regardless of value' },
                { bold: 'Personal gifts', rest: ' — goods clearly intended as gifts for family, which face the NGN 50,000 threshold' },
                { bold: 'Commercial goods', rest: ' — multiple units, large quantities, or goods clearly not for personal use, which face full import duty' },
              ].map(({ bold, rest }) => (
                <li key={bold} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}><strong>{bold}</strong>{rest}</li>
              ))}
            </ul>
            <P>The distinction between personal gifts and commercial goods is the key one for CarryMate carriers. Carrying one pair of shoes for a family member is a personal gift. Carrying ten pairs of shoes is commercial. The application of this distinction is where officer discretion matters most.</P>

            <H2>Item-by-item guide</H2>
            {STATUS_ITEMS.map(({ category, items }) => (
              <div key={category}>
                <H3>{category}</H3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '20px 0' }}>
                  {items.map(({ status, text }) => {
                    const s = STATUS_STYLES[status]
                    return (
                      <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', lineHeight: 1.6, background: s.bg, color: s.color }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot, flexShrink: 0, marginTop: '5px' }} />
                        <span>{text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            <H2>The Red and Green channels at MMA Lagos</H2>
            <P>Murtala Muhammed International Airport operates the standard two-channel customs system:</P>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { bold: 'Green channel:', rest: ' Nothing to declare. Use this if your goods are all within personal effects limits and do not require declaration. There is random inspection — officers may stop you regardless of which channel you use.' },
                { bold: 'Red channel:', rest: ' Goods to declare. Use this if you are carrying goods above the NGN 50,000 threshold, electronics that require declaration, or anything you are uncertain about. It is always better to declare and be assessed than to be stopped with undeclared goods.' },
              ].map(({ bold, rest }) => (
                <li key={bold} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}><strong>{bold}</strong>{rest}</li>
              ))}
            </ul>
            <P>For CarryMate carriers: our customs guide in the app tells you exactly which channel to use before your trip. We have built the Red/Green channel decision into the item classification — if any parcel you are carrying requires the Red channel, the app flags this before you depart.</P>

            <H2>What actually happens if you are stopped</H2>
            <P>If you are stopped at customs while carrying goods — whether in the Red channel by choice or in the Green channel randomly — here is what typically happens:</P>
            <ol style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'The officer will ask you to open your bags and declare the goods you are carrying',
                'You explain what the items are, who they are for, and that they are personal gifts',
                'The officer may assess the value of the goods and calculate any applicable duty',
                'You pay any duty assessed (cash, or by bank transfer in some cases) and receive a receipt',
                'Your goods are released and you proceed through',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ol>
            <P>In the vast majority of cases, the process is straightforward for travelers carrying genuine personal goods. The risk increases significantly for high-value goods, electronics, pharmaceutical products, and anything in commercial quantities.</P>
            <Callout>If you are a CarryMate carrier and you are stopped at customs, contact CarryMate support immediately via WhatsApp. We will send your parcel booking records, parcel photographs, and the sender's signed declaration to support your position with the customs officer. The sender — not you — bears legal responsibility for any misdescription of parcel contents.</Callout>

            <H2>Practical tips for carriers on the LHR → LOS route</H2>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Read the full customs guide in the CarryMate app before your departure, not on the plane',
                'Use the Red channel if you are carrying any declared item — it is safer and shows good faith',
                'Keep all CarryMate booking records and parcel photos accessible on your phone',
                'Do not carry goods for people you do not know via the platform — stick to verified CarryMate-matched senders',
                'If in doubt about any parcel contents, do not collect it — contact CarryMate support first',
                'Spread multiple parcels across your bags naturally rather than consolidating them in one location',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ul>

            {/* Article footer CTA */}
            <div style={{ background: 'var(--warm)', borderRadius: '16px', padding: '28px', marginTop: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--ink)' }}>Carry parcels safely on your next Lagos flight</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.65 }}>
                CarryMate's per-corridor customs guide is updated quarterly with local legal counsel. Every item you carry is pre-screened against Nigerian customs rules before you even agree to carry it.
              </p>
              <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '11px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                Start earning as a carrier →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Earn on your Lagos flight</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>Post your LHR → LOS trip and earn an average of £150 per round trip.</p>
              <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '10px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Get started →
              </Link>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Related guides</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/blog/send-london-lagos', label: 'Sending parcels from London to Lagos' },
                  { href: '/blog/earn-on-flight', label: 'How to earn on your diaspora flight' },
                  { href: '/corridors', label: 'LHR → LOS corridor profile' },
                  { href: '/trust', label: 'How CarryMate protects you at customs' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Quick reference</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                {QUICK_REF.map(({ status, text }) => (
                  <div key={text} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_STYLES[status].dot, flexShrink: 0, marginTop: '4px' }} />
                    <span style={{ color: 'var(--ink)' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '20px', lineHeight: 1.8 }}>{children}</p>
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)', margin: '40px 0 16px', letterSpacing: '-0.3px' }}>{children}</h2>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', margin: '28px 0 10px' }}>{children}</h3>
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--teal-pale)', borderLeft: '3px solid var(--teal)', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '24px 0', fontSize: '15px', color: '#0a3d2b', lineHeight: 1.7 }}>
      {children}
    </div>
  )
}
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fceee8', borderLeft: '3px solid #c04a2a', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '24px 0', fontSize: '15px', color: '#7a2a16', lineHeight: 1.7 }}>
      {children}
    </div>
  )
}
