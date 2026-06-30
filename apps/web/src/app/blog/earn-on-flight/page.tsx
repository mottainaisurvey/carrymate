import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'How to Earn £150 on Your Next Flight Home — CarryMate',
  description: 'A practical guide to earning money carrying parcels on diaspora flights. What to expect, how much you can earn, and how the whole process works.',
}

const EARNINGS = [
  { desc: 'Parcel 1: Clothing and shoes · 2kg · Adaeze O.', val: '£19' },
  { desc: 'Parcel 2: Baby formula · 1.5kg · Ngozi K.', val: '£22' },
  { desc: 'Parcel 3: Laptop · 2.5kg · Emeka T. (declare at customs)', val: '£38' },
  { desc: 'Total · 3 parcels · 6kg used · 2kg still available', val: '£79', bold: true },
]

const TIERS = [
  { name: 'Bronze', val: '75%', sub: '0–9 deliveries', highlight: false },
  { name: 'Silver', val: '+5%', sub: '10–49 deliveries', highlight: false },
  { name: 'Gold', val: '+10%', sub: '50–99 deliveries', highlight: false },
  { name: 'Platinum', val: '+15%', sub: '100+ deliveries', highlight: true },
]

const CORRIDOR_EARNINGS = [
  { route: 'LHR → LOS', earn: '£150' },
  { route: 'LHR → ACC', earn: '£130' },
  { route: 'JFK → LOS', earn: '$200' },
  { route: 'LHR → NBO', earn: '£140' },
  { route: 'CDG → ABJ', earn: '€160' },
]

export default function EarnOnFlightPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--teal)', padding: '72px 5vw 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,255,255,0.06), transparent)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700 }}>Carrier guide</span>
              Earn on your flight
            </div>
            <h1 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 900, letterSpacing: '-1.5px', color: 'white', marginBottom: '16px', lineHeight: 1.1, maxWidth: '680px' }}>
              How to earn £150 on your next flight home — and why you should
            </h1>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <span>CarryMate Editorial</span>
              <span>June 2026</span>
              <span>7 min read</span>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '56px', maxWidth: '960px', margin: '0 auto', padding: '56px 5vw 96px', alignItems: 'start' }}>
          {/* Article */}
          <article style={{ minWidth: 0 }}>
            <ArticleP>If you are part of the Nigerian or Ghanaian diaspora in the UK, you have almost certainly carried something home for someone. A parcel for a cousin. A phone for your mum. A suitcase full of things someone needed. Probably for free, as a favour, because that is what the community does.</ArticleP>
            <ArticleP>CarryMate does not ask you to stop doing that. It asks you to get paid for it.</ArticleP>
            <ArticleP>Here is how it works, what you can realistically earn, and what you need to know before your first trip.</ArticleP>

            <ArticleH2>What is CarryMate and how does carrying work?</ArticleH2>
            <ArticleP>CarryMate is a platform that connects people who want to send parcels home with travelers who have available luggage space on flights they are already taking. You post your trip, set an earning goal, browse matched parcels, collect them from senders before your flight, deliver them at the other end, and get paid when the recipient confirms receipt.</ArticleP>
            <ArticleP>That is the whole thing. You were going to Lagos anyway. The suitcase had space anyway. Now that space earns money.</ArticleP>

            <ArticleH2>How much can you realistically earn?</ArticleH2>
            <ArticleP>On the London to Lagos corridor, the average earning per round trip for a CarryMate carrier is £150. That is across all carrier levels — Bronze, Silver, Gold, and Platinum. Here is what a typical LHR → LOS trip looks like with three parcels:</ArticleP>

            {/* Earnings example */}
            <div style={{ background: 'var(--ink)', borderRadius: '16px', padding: '28px', margin: '28px 0', color: 'white' }}>
              <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'white' }}>
                Example trip earnings · LHR → LOS · 8kg available
              </h3>
              {EARNINGS.map(({ desc, val, bold }) => (
                <div key={desc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '9px 0', borderBottom: bold ? 'none' : '1px solid rgba(255,255,255,0.08)', fontWeight: bold ? 700 : 400, paddingTop: bold ? '14px' : '9px' }}>
                  <span>{desc}</span>
                  <span className="font-serif" style={{ fontSize: '16px', fontWeight: 700, color: '#2ea882' }}>{val}</span>
                </div>
              ))}
            </div>

            <ArticleP>That is £79 for a single leg of the journey. If you carry parcels on the return trip too — from Lagos to London — you can earn another £60–100, depending on what is available. Many of our Gold and Platinum carriers earn £150–200 per round trip.</ArticleP>
            <ArticleP>Earnings are higher during peak periods. November and December (Detty December season) see a 3–4× increase in parcel demand on the LHR → LOS route. Carriers who are available during this period can earn significantly more per trip.</ArticleP>

            <ArticleH2>The carrier tier system</ArticleH2>
            <ArticleP>CarryMate has four carrier tiers. Each tier unlocks higher commission rates and additional benefits:</ArticleP>

            {/* Tier strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2px', margin: '20px 0', borderRadius: '12px', overflow: 'hidden' }}>
              {TIERS.map(({ name, val, sub, highlight }) => (
                <div key={name} style={{ background: highlight ? 'var(--teal-pale)' : 'var(--warm)', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>{name}</div>
                  <div className="font-serif" style={{ fontSize: '22px', fontWeight: 900, color: 'var(--teal)' }}>{val}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>
                </div>
              ))}
            </div>

            <ArticleP>As a Bronze carrier, you earn 75% of the delivery fee. That is already the standard rate — the platform fee covers identity verification, escrow infrastructure, customs intelligence, matching, and support. As you progress through Silver, Gold, and Platinum, you earn a percentage bonus on top of that base rate. A Platinum carrier on a £38 laptop delivery earns roughly £44 versus a Bronze carrier's £28.50.</ArticleP>

            <ArticleH2>What does the process actually look like?</ArticleH2>

            <ArticleH3>Before your flight</ArticleH3>
            <ArticleP>Post your trip in the app: enter your departure and arrival cities, your flight date, and how much luggage space you have available (in kilograms). Set an earning goal — for example, £150 — and the app will show you which available parcels on your route would get you closest to that target.</ArticleP>
            <ArticleP>Browse the matched parcels. Every parcel has already been screened against Nigerian customs rules by our AI. Items that are customs-safe show a green badge. Items that require declaration show an amber warning with specific guidance. Accept the parcels you want to carry.</ArticleP>

            <ArticleH3>Collecting parcels</ArticleH3>
            <ArticleP>You arrange to meet each Sender before your flight — at a café, a station, or the airport itself. When you meet them:</ArticleP>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Inspect the parcel. Make sure it matches the description in the app. If anything is off — heavier than listed, wrong type of item, sealed in a way that prevents inspection — do not collect it. Contact CarryMate support.',
                'Ask the Sender to show you their pickup OTP. Enter it in the app.',
                'Photograph the parcel using the in-app camera. This protects you legally.',
                'Both you and the Sender digitally sign a declaration confirming the contents match the listing.',
              ].map(item => (
                <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>

            <ArticleH3>The flight</ArticleH3>
            <ArticleP>The CarryMate app shows you a customs guide specifically for your corridor before departure. For the LHR → LOS route, this tells you which items require declaration at MMA, which channel to use (Red or Green), and what documentation you have available if you are stopped.</ArticleP>
            <ArticleP>You travel as normal. The parcels are in your luggage alongside your own belongings.</ArticleP>

            <ArticleH3>Delivering at the Lagos end</ArticleH3>
            <ArticleP>Contact each recipient when you land. Arrange to meet them — most CarryMate deliveries in Lagos happen at the recipient's home, office, or a nearby meetup point within 24 hours of landing. When you hand over the parcel, the recipient enters a delivery OTP to confirm they received it. That triggers the escrow release.</ArticleP>

            <ArticleH3>Getting paid</ArticleH3>
            <ArticleP>The moment each recipient confirms delivery via OTP, the escrow for that parcel is released. If you are based in the UK, your payout goes to your UK bank account via Stripe within 3–5 business days. Nigerian bank accounts receive payouts via Paystack. The money arrives with no additional deduction — what you saw in the app is what you receive.</ArticleP>

            <ArticleH2>Is it legal? Am I liable for what I carry?</ArticleH2>
            <ArticleP>Individuals have always been permitted to carry personal goods for others while traveling. This is not a grey area. CarryMate formalises what the diaspora community has always done informally.</ArticleP>
            <ArticleP>Your legal protection comes from several layers:</ArticleP>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Every Sender signs a declaration that their parcel contents are accurate. If they lie and you are stopped with undeclared or prohibited goods, the legal and financial liability is theirs, not yours.',
                'The parcel photograph taken at pickup is a timestamped record of what you collected. It shows exactly what you were given.',
                'CarryMate provides your booking documentation and parcel photos to customs officers in any incident.',
                'Our AI screens every parcel description before you see it — hard-blocked items never reach you as a match.',
              ].map(item => (
                <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>

            <Callout>The most important thing you can do to protect yourself: physically inspect every parcel at collection. Do not accept anything sealed in a way that prevents you from seeing what is inside. If a parcel feels wrong, do not carry it. Declining never affects your rating.</Callout>

            <ArticleH2>Who is this right for?</ArticleH2>
            <ArticleP>CarryMate is for people who:</ArticleP>
            <ul style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Travel between the UK and Nigeria, Ghana, Kenya, Jamaica, or Côte d\'Ivoire regularly — at least a few times a year',
                'Consistently travel with available luggage space that is not being used',
                'Are comfortable with the responsibility of carrying goods through customs on behalf of others',
                'Want to earn meaningful income — not just cover a taxi — from travel they are doing anyway',
              ].map(item => (
                <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
            <ArticleP>It is not right for people who travel with full bags every time, who are uncomfortable with the customs process, or who travel infrequently. It works best for the frequent traveler who treats the corridor as a regular route and builds a carrier reputation over multiple trips.</ArticleP>

            <ArticleH2>How to get started</ArticleH2>
            <ol style={{ paddingLeft: '20px', marginBottom: '18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Download the CarryMate app and create an account',
                'Complete identity verification — passport scan and liveness check, takes under 5 minutes',
                'Post your next trip when you have a confirmed flight',
                'Browse matched parcels and accept the ones that work for you',
                'Collect, fly, deliver, get paid',
              ].map(item => (
                <li key={item} style={{ fontSize: '16px', color: 'var(--ink)', lineHeight: 1.7 }}>{item}</li>
              ))}
            </ol>
            <ArticleP>Your first trip will be slower as you learn the process. Most carriers find the second and third trips much smoother. By your fifth trip, it becomes second nature.</ArticleP>

            {/* Article footer CTA */}
            <div style={{ background: 'var(--teal)', borderRadius: '16px', padding: '28px', marginTop: '40px' }}>
              <h3 className="font-serif" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>Start earning on your next flight</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: 1.65 }}>
                Post your trip in under 3 minutes. Travelers on LHR → LOS and LHR → ACC earn an average of £150 per round trip.
              </p>
              <Link href="/signup" style={{ background: 'white', color: 'var(--teal)', padding: '11px 22px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                Post your first trip →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px' }}>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Post your trip today</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '12px' }}>Average earning per LHR → LOS round trip: £150. Sign up and post your first trip in 3 minutes.</p>
              <Link href="/signup" style={{ background: 'var(--teal)', color: 'white', padding: '10px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Get started →
              </Link>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Related guides</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/blog/send-london-lagos', label: 'Sending parcels London to Lagos' },
                  { href: '/blog/lagos-customs-guide', label: 'Lagos customs guide 2026' },
                  { href: '/pricing', label: 'Traveler pricing explained' },
                  { href: '/trust', label: 'How CarryMate protects you' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} style={{ fontSize: '13px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '10px' }}>Average earnings by corridor</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '13px' }}>
                {CORRIDOR_EARNINGS.map(({ route, earn }) => (
                  <div key={route} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{route}</span>
                    <span style={{ fontWeight: 700, color: 'var(--teal)' }}>{earn}</span>
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

function ArticleP({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '16px', color: 'var(--ink)', marginBottom: '20px', lineHeight: 1.8 }}>{children}</p>
}
function ArticleH2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif" style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)', margin: '40px 0 16px', letterSpacing: '-0.3px' }}>{children}</h2>
}
function ArticleH3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', margin: '28px 0 10px' }}>{children}</h3>
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--teal-pale)', borderLeft: '3px solid var(--teal)', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '24px 0', fontSize: '15px', color: '#0a3d2b', lineHeight: 1.7 }}>
      {children}
    </div>
  )
}
