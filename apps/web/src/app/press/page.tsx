import type { Metadata } from 'next'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Press — CarryMate',
  description: 'Resources for journalists, broadcasters, and content creators covering CarryMate, the diaspora economy, and community-powered logistics.',
}

const STATS = [
  { num: '6', label: 'Live corridors at launch' },
  { num: '~50%', label: 'Cost saving vs traditional courier' },
  { num: '£150', label: 'Average traveler earnings per round trip' },
  { num: '£96B', label: 'Africa diaspora remittances 2024' },
]

const KEY_FACTS = [
  { label: 'Founded', val: '2026' },
  { label: 'Headquarters', val: 'London, United Kingdom' },
  { label: 'Stage', val: 'Pre-seed · seeking £500k on SAFE · £3M post-money cap' },
  { label: 'Incorporation', val: 'CarryMate Ltd · registered in England and Wales' },
  { label: 'Launch corridors', val: 'LHR→LOS, LHR→ACC, JFK→LOS, LHR→NBO, CDG→ABJ, LHR→KIN' },
  { label: 'Mobile app', val: 'iOS and Android · Expo React Native' },
  { label: 'Primary markets', val: 'United Kingdom, United States, Nigeria, Ghana, Kenya, France, Jamaica' },
  { label: 'Target communities', val: 'Nigerian, Ghanaian, Kenyan, Ivorian, Jamaican diaspora' },
]

const EXECS = [
  {
    initials: 'AO', bg: 'var(--teal)',
    name: 'Adey Olawale',
    role: 'Founder & Chief Executive Officer',
    bio: 'Lagos-born, London-based entrepreneur with 25+ years experience in waste management, real estate development, and logistics across Nigeria and the UK. Founder of Urban Spirit Ventures (LAWMA franchisee, Ikeja GRA) and Mottainai Recycling & Digital Solutions. Built CarryMate from a personal need to send things home safely and affordably.',
  },
  {
    initials: 'CTO', bg: 'var(--gold)',
    name: 'Chief Technology Officer',
    role: 'Platform Architecture & Engineering',
    bio: "Full-stack engineer specialising in marketplace platforms, payment systems, and mobile-first products for African and diaspora markets. Architect of CarryMate's matching engine, escrow infrastructure, and customs intelligence system.",
  },
  {
    initials: 'COO', bg: '#c04a2a',
    name: 'Chief Operating Officer',
    role: 'Corridors, Trust & Community',
    bio: "Operations lead with a background in logistics and marketplace platforms across West Africa and the UK. Owns corridor management, traveler onboarding, dispute resolution, and the community networks that power CarryMate's supply side.",
  },
]

const ANGLES = [
  { label: 'The diaspora economy', val: "Africa's diaspora sent £96 billion home in 2024 — more than twice the level of overseas development aid. CarryMate serves the communities behind that number." },
  { label: 'The gig economy meets logistics', val: 'Travelers have always carried parcels for free as a social obligation. CarryMate turns that into income — typically £150 per round trip — without changing their travel plans at all.' },
  { label: 'Customs as a product feature', val: 'No courier explains customs rules. CarryMate built a per-corridor customs intelligence guide that tells every carrier exactly what they can and cannot carry before they ever pack a bag.' },
  { label: 'Tech built for the community', val: 'Unlike generic gig economy platforms, CarryMate is built by and for diaspora communities — with Pidgin English support, WhatsApp-native distribution, and cultural fluency at every touchpoint.' },
  { label: 'The trust infrastructure gap', val: 'The informal parcel economy already exists. What has been missing is identity verification, escrow payment, photo proof, and a dispute process. CarryMate is the infrastructure layer that makes it safe.' },
]

const LOGOS = [
  { bg: 'var(--ink)', label: 'Primary logo · dark', format: 'SVG · PNG · available on request', preview: <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', fontWeight: 900, color: 'var(--teal)' }}>Carry<span style={{ color: 'white' }}>Mate</span></span> },
  { bg: 'var(--cream)', label: 'Primary logo · light', format: 'SVG · PNG · available on request', preview: <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', fontWeight: 900, color: 'var(--ink)' }}>Carry<span style={{ color: 'var(--teal)' }}>Mate</span></span> },
  { bg: 'var(--teal)', label: 'Reversed logo · teal', format: 'SVG · PNG · available on request', preview: <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: '24px', fontWeight: 900, color: 'white' }}>CarryMate</span> },
]

export default function PressPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--ink)', padding: '80px 5vw 64px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '16px' }}>
            Press & media
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: 'white', marginBottom: '16px' }}>
            Press room
          </h1>
          <p style={{ fontSize: '17px', color: 'rgba(245,240,232,0.6)', maxWidth: '560px', lineHeight: 1.7 }}>
            Resources for journalists, broadcasters, and content creators covering CarryMate, the diaspora economy, and community-powered logistics.
          </p>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '72px 5vw 96px' }}>
          {/* Boilerplate */}
          <Section eyebrow="About CarryMate" title="Company boilerplate">
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 32px', fontSize: '15px', color: 'var(--ink)', lineHeight: 1.8, marginBottom: '12px' }}>
              CarryMate is a London-based technology platform that connects diaspora communities with everyday travelers who have unused luggage space on flights they are already taking. Senders get a cheaper, faster alternative to traditional couriers — typically saving 50–70% versus DHL or FedEx. Travelers earn an average of £150 per round trip from luggage space that would otherwise go empty. Every delivery is protected by biometric identity verification, escrow-held payments, photo proof at pickup, and a one-time password confirmation system at delivery. CarryMate is live on six corridors including London–Lagos, London–Accra, and New York–Lagos, with 12 corridors seeded in the platform and further expansion planned throughout 2026.
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              This boilerplate is approved for use without further clearance. For quotes from leadership, contact <a href="mailto:press@carrymate.io" style={{ color: 'var(--teal)' }}>press@carrymate.io</a>.
            </p>
          </Section>

          {/* Stats */}
          <Section eyebrow="Key metrics" title="Fast facts">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '16px', marginBottom: '24px' }}>
              {STATS.map(({ num, label }) => (
                <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                  <div className="font-serif" style={{ fontSize: '32px', fontWeight: 900, color: 'var(--teal)', marginBottom: '4px' }}>{num}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{label}</div>
                </div>
              ))}
            </div>
            <FactTable rows={KEY_FACTS} />
          </Section>

          {/* Leadership */}
          <Section eyebrow="Leadership" title="Executive team">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '20px' }}>
              {EXECS.map(({ initials, bg, name, role, bio }) => (
                <div key={name} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-fraunces)', fontSize: '18px', fontWeight: 700, color: 'white', background: bg }}>
                    {initials}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '3px' }}>{name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--teal)', fontWeight: 600, marginBottom: '10px' }}>{role}</div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{bio}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Brand assets */}
          <Section eyebrow="Brand assets" title="Logo and visual identity">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
              {LOGOS.map(({ bg, label, format, preview }) => (
                <div key={label} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
                    {preview}
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginBottom: '3px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{format}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.65 }}>
              Brand guidelines, high-resolution logos, app screenshots, and product photography are available on request. Please do not alter the logo, change its colours, or use it in a way that implies endorsement without written consent. Contact <a href="mailto:press@carrymate.io" style={{ color: 'var(--teal)' }}>press@carrymate.io</a> for the full brand pack.
            </p>
          </Section>

          {/* Story angles */}
          <Section eyebrow="Story angles" title="Suggested angles for coverage">
            <FactTable rows={ANGLES} />
          </Section>

          {/* Contact */}
          <div style={{ background: 'var(--teal-pale)', border: '1px solid rgba(29,122,95,0.2)', borderRadius: '20px', padding: '36px', textAlign: 'center' }}>
            <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, color: 'var(--teal)', marginBottom: '8px' }}>Press enquiries</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '4px' }}>For interviews, media requests, quotes, and press kit access:</p>
            <a href="mailto:press@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '16px' }}>press@carrymate.io</a>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '16px', lineHeight: 1.6 }}>
              We aim to respond to all press enquiries within 4 hours on weekdays and within 24 hours at weekends. For urgent broadcast enquiries, please indicate "URGENT" in the subject line.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>{eyebrow}</div>
      <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '20px' }}>{title}</h2>
      {children}
    </div>
  )
}

function FactTable({ rows }: { rows: { label: string; val: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {rows.map(({ label, val }, i) => (
        <div key={label} style={{ display: 'flex', gap: '16px', padding: '14px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink)', minWidth: '180px', flexShrink: 0 }}>{label}</span>
          <span style={{ color: 'var(--text-muted)' }}>{val}</span>
        </div>
      ))}
    </div>
  )
}
