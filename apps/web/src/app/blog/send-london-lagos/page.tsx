import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'How to Send a Parcel from London to Lagos Safely — CarryMate',
  description: 'A practical guide to sending parcels from London to Lagos — options, prices, customs rules, and what to watch out for.',
}

const COMPARISON = [
  { option: 'DHL Express', cost: '£75–£120', transit: '3–5 days', reliability: 'High', customs: 'Basic', highlight: false },
  { option: 'Royal Mail / EMS', cost: '£40–£65', transit: '7–14 days', reliability: 'Medium', customs: 'None', highlight: false },
  { option: 'Informal (friend travelling)', cost: 'Free or gift', transit: '1–3 days', reliability: 'Variable', customs: 'None', highlight: false },
  { option: 'CarryMate', cost: '£18–£28', transit: '24–48 hours', reliability: 'High', customs: 'Built-in', highlight: true },
]

const GLANCE = [
  { label: 'Avg delivery', val: '£22', teal: true },
  { label: 'Transit time', val: '24–48hr', teal: false },
  { label: 'Flights/day', val: '4+', teal: false },
  { label: 'Traveler earnings', val: '£150/trip', teal: true },
]

export default function SendLondonLagosPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--ink)', padding: '72px 5vw 56px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: 'var(--teal)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700 }}>Guide</span>
            London → Lagos
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: '16px', lineHeight: 1.1, maxWidth: '720px' }}>
            How to send a parcel from London to Lagos safely in 2026
          </h1>
          <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.45)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <span>CarryMate Editorial</span>
            <span>June 2026</span>
            <span>8 min read</span>
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '56px', maxWidth: '960px', margin: '0 auto', padding: '56px 5vw 96px', alignItems: 'start' }}>
          {/* Article */}
          <article style={{ minWidth: 0 }}>
            <P>If you have ever tried to send a parcel from London to Lagos, you already know the problem. The quotes are high. The timelines are long. And half the time the parcel arrives damaged, delayed, or not at all.</P>
            <P>This guide covers everything you need to know about sending parcels from London to Lagos in 2026 — the main options, what they actually cost, what you can and cannot send, and how to make sure your parcel arrives safely.</P>

            <H2>Your main options for sending from London to Lagos</H2>
            <P>There are four realistic options for getting a parcel from London to Lagos. Here is how they compare:</P>

            {/* Comparison table */}
            <div style={{ overflowX: 'auto', margin: '20px 0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    {['Option', 'Typical cost (2kg)', 'Transit time', 'Reliability', 'Customs support'].map(h => (
                      <th key={h} style={{ background: 'var(--ink)', color: 'white', padding: '11px 14px', textAlign: 'left', fontSize: '12px', letterSpacing: '.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(({ option, cost, transit, reliability, customs, highlight }, i) => (
                    <tr key={option}>
                      {[option, cost, transit, reliability, customs].map((cell, j) => (
                        <td key={j} style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.5, background: highlight ? 'var(--teal-pale)' : i % 2 === 1 ? 'var(--warm)' : 'white', fontWeight: highlight ? 600 : 400, color: highlight ? 'var(--teal)' : 'var(--ink)' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <P>The informal option — sending via a friend or relative who happens to be flying — is by far the most common method used by Nigerian diaspora communities. It is cheap, fast, and culturally trusted. The problem is that it has no protection when something goes wrong. CarryMate is built specifically to solve this problem: the speed and trust of the informal method, with the legal and financial protection of a proper platform.</P>

            <H2>What you can send from London to Lagos</H2>
            <P>Nigerian customs allows a wide range of personal goods brought in by travelers, within the duty-free personal gift threshold of NGN 50,000 (approximately £30 at current exchange rates). Here is what is generally permitted:</P>

            <H3>Commonly allowed items</H3>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Clothing, shoes, and accessories — including new and unused items',
                'Baby products — formula (up to 6 tins), clothing, nappies, toys',
                'Cosmetics and personal care products — for personal use quantities',
                'Dried and sealed food products — egusi, crayfish, beans, groundnut, stockfish (dried)',
                'Toiletries — shampoo, body lotion, deodorant',
                'Books and printed materials',
                'Personal documents — academic certificates, legal papers',
                'Mobile phones — one unit for personal use',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ul>

            <H3>Items that require declaration at Nigerian customs</H3>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Laptops and computers — one unit, must declare on the Red channel at MMA',
                'Jewellery — especially if new or high value',
                'Any goods above the NGN 50,000 duty-free threshold',
                'Cash or monetary instruments above $5,000',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ul>

            <H3>Items you cannot send</H3>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Codeine-based products — banned in Nigeria since 2018',
                'Tramadol and other controlled substances without proper documentation',
                'Fresh food — very high seizure risk at customs',
                'Commercial quantities of anything — even clothing',
                'Firearms, weapons, or replicas',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ul>

            <Warning>A note on electronics: sending two or more phones, laptops, or tablets in the same parcel will almost certainly result in them being treated as commercial imports at Nigerian customs. Duties of 20–35% plus VAT can be applied. Stick to one unit per parcel.</Warning>

            <H2>How Nigerian customs actually works at MMA Lagos</H2>
            <P>Murtala Muhammed International Airport has two customs channels — Green (nothing to declare) and Red (goods to declare). Travelers carrying goods for others should use the Red channel and declare honestly. The customs officer will assess the items and either wave them through or assess duty.</P>
            <P>The duty-free personal gift threshold of NGN 50,000 is relatively low by international standards — it works out to roughly £30 at current rates. However, in practice, customs officers have discretion in how they apply it to genuine personal goods being brought in by travelers. The risk is highest for items that look new, items in bulk, and anything that could be construed as commercial.</P>
            <P>Our carriers are briefed with a specific customs guide for the LHR → LOS corridor before every trip. They know which items require declaration and which channel to use. This is one of the core ways CarryMate protects both senders and travelers.</P>

            <H2>How to package your parcel for the journey</H2>
            <P>Your parcel will be carried in a Traveler's personal luggage — treated as their own belongings throughout the journey. This means it needs to be packaged well, but it does not need to be a courier-grade shipping box. Here is what works:</P>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Use a sealed plastic bag inside an outer bag or box for clothing and soft goods',
                'Wrap electronics in bubble wrap and place in a padded envelope or small box',
                'Seal food products in airtight bags inside a zip-lock outer bag',
                'Do not overfill — the Traveler needs to fit this in their suitcase alongside their own belongings',
                'Label the parcel clearly with the recipient\'s name and phone number',
              ].map(item => <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>)}
            </ul>
            <Callout><strong>Tip:</strong> The Traveler will photograph your parcel at pickup using the CarryMate app. A well-packaged parcel creates a clear photographic record of its condition — which matters if any customs or damage question arises later.</Callout>

            <H2>What does it cost to send from London to Lagos?</H2>
            <P>On CarryMate, the average price for a 2kg parcel from London to Lagos is £22 — compared to £75–£120 for the equivalent DHL Express shipment. The price varies by traveler (who sets their own corridor rate within a system-determined range), parcel weight, and demand on the route. You see the exact price at checkout before you commit.</P>
            <P>Optional insurance is available at checkout for 1–3% of the declared value of your parcel, covering loss or damage up to £200.</P>

            <H2>How long does it take?</H2>
            <P>Most deliveries complete within 24–48 hours of the Traveler departing London. Direct flights from LHR to LOS take approximately 6.5 hours. The remaining time is collection at the Lagos end, which most Travelers complete within 24 hours of landing.</P>
            <P>For urgent items, filter travelers by departure date when you post your parcel. Travelers departing within 24 hours can deliver within 36 hours in most cases.</P>

            <Callout><strong>The bottom line:</strong> For the Nigerian diaspora in the UK, CarryMate is the most cost-effective, fastest, and most culturally appropriate way to send parcels home. It is the informal "friend on a flight" model — made safe, structured, and protected by escrow payments and biometric identity verification.</Callout>

            {/* Article footer CTA */}
            <div style={{ background: 'var(--warm)', borderRadius: '16px', padding: '28px', marginTop: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'var(--ink)' }}>Ready to send your first parcel?</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.65 }}>
                Post a parcel listing in under 3 minutes. Our AI checks customs compliance instantly. Travelers on the LHR → LOS route are available most days of the week.
              </p>
              <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '11px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                Send a parcel to Lagos →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Send a parcel today</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>LHR → LOS travelers available most days. Average price £22 for a 2kg parcel.</p>
              <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '10px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Get started →
              </Link>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Related guides</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/blog/lagos-customs-guide', label: 'Lagos customs guide 2026' },
                  { href: '/blog/earn-on-flight', label: 'Earn on your flight to Nigeria' },
                  { href: '/corridors', label: 'All CarryMate corridors' },
                  { href: '/trust', label: 'How CarryMate protects you' },
                  { href: '/faq', label: 'Frequently asked questions' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>LHR → LOS at a glance</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                {GLANCE.map(({ label, val, teal }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color: teal ? 'var(--teal)' : 'var(--ink)' }}>{val}</span>
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
