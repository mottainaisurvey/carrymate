import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'About CarryMate — Built for the community, by the community',
  description: 'Learn the story behind CarryMate — how we are formalising the diaspora parcel-carrying tradition with verified identities, escrow payments, and customs intelligence.',
}

const TEAM = [
  {
    initials: 'AO',
    bg: 'var(--teal)',
    name: 'Adey Olawale',
    role: 'Chief Executive Officer',
    bio: 'Lagos-born, London-based entrepreneur with 25+ years in waste management, real estate, and logistics across Nigeria and the UK. Founder of Urban Spirit Ventures and Mottainai Recycling. CarryMate is built on the same community-first principles that have defined every business Adey has built.',
  },
  {
    initials: 'CTO',
    bg: 'var(--gold)',
    name: 'Chief Technology Officer',
    role: 'Platform Architecture & Engineering',
    bio: 'Full-stack engineer with deep experience in marketplace platforms, payment systems, and mobile-first products for African markets. Architect of the CarryMate matching engine, escrow system, and customs intelligence infrastructure.',
  },
  {
    initials: 'COO',
    bg: '#c04a2a',
    name: 'Chief Operating Officer',
    role: 'Corridors, Trust & Community',
    bio: 'Operations lead with a background in logistics and marketplace operations across West Africa and the UK. Owns corridor management, traveler onboarding, dispute resolution, and the community networks that power CarryMate\'s supply side.',
  },
]

const ADVISORS = [
  { initials: 'LI', name: 'Logistics Insider', role: 'Former senior leader, Africa logistics — DHL or equivalent', tag: 'Logistics' },
  { initials: 'FF', name: 'Fintech Founder', role: 'Founder, payments platform — Nigeria/Ghana market', tag: 'Fintech' },
  { initials: 'CL', name: 'Community Leader', role: 'Respected voice in Nigerian and Ghanaian diaspora communities, UK', tag: 'Community' },
  { initials: 'TL', name: 'Trade Lawyer', role: 'International trade law specialist — UK, Nigeria, Ghana, Kenya', tag: 'Legal' },
  { initials: 'VC', name: 'Platform Investor', role: 'Partner, Africa-focused venture fund', tag: 'Investor' },
]

const VALUES = [
  { title: 'Community first', desc: 'Every product decision runs through one question: does this make the diaspora community trust us more? Revenue follows trust, never the reverse.' },
  { title: 'Earn your journey back', desc: 'A traveler who earns £150 offset against their ticket is a traveler who will use CarryMate on every flight. We are built around the carrier\'s income goal, not as an afterthought.' },
  { title: 'Own the delivery', desc: 'When something goes wrong, CarryMate steps in — even when it is technically not our fault. Trust is built in the hard moments.' },
  { title: 'Customs intelligence as a feature', desc: 'No traveler should arrive at a border uncertain about what they are carrying. Our per-corridor customs guide is a product feature, not a legal disclaimer.' },
]

const NUMBERS = [
  { big: '£96B', label: 'Diaspora remittances into Africa in 2024 — the community is huge and connected' },
  { big: '£85', label: 'Average DHL cost for a 2kg parcel from London to Lagos' },
  { big: '£22', label: 'Average CarryMate delivery cost for the same parcel' },
  { big: '£150', label: 'Average earnings for a traveler on a return trip to Lagos or Accra' },
]

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
        {/* Hero */}
        <section style={{ padding: '120px 5vw 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', background: 'radial-gradient(circle,rgba(29,122,95,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '20px' }}>
            Our story
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, marginBottom: '24px', maxWidth: '820px', marginLeft: 'auto', marginRight: 'auto' }}>
            Built for the community,<br />by the <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 300 }}>community</em>
          </h1>
          <p style={{ fontSize: '19px', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
            CarryMate started with a problem every diaspora family knows. Getting things home safely, affordably, and through someone you trust.
          </p>
        </section>

        {/* Story */}
        <section style={{ maxWidth: '720px', margin: '0 auto', padding: '80px 5vw' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>
            Where it started
          </div>
          <p className="font-serif" style={{ fontSize: '22px', fontWeight: 300, fontStyle: 'italic', color: 'var(--teal)', lineHeight: 1.55, marginBottom: '28px' }}>
            "My aunty needed her blood pressure medication. DHL quoted £95 and said eight days. My cousin was flying to Lagos on Thursday."
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.8, marginBottom: '24px' }}>
            That is the moment CarryMate began. Not in a boardroom. Not with a pitch deck. In a WhatsApp group, the way most things in the diaspora community actually get sorted.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.8, marginBottom: '24px' }}>
            For decades, diaspora communities have been sending parcels home the same way: asking friends, calling relatives, posting in WhatsApp groups, hoping someone is flying home soon. It works — most of the time. But it is informal, uninsured, and entirely dependent on trust between individuals with no safety net when something goes wrong.
          </p>
          <blockquote style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '24px', margin: '36px 0' }}>
            <p className="font-serif" style={{ fontSize: '22px', fontWeight: 300, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.55 }}>
              "There are thousands of people flying London to Lagos every week with half-empty bags, and thousands more trying to send parcels. We just needed to connect them safely."
            </p>
          </blockquote>
          <p style={{ fontSize: '17px', lineHeight: 1.8, marginBottom: '24px' }}>
            CarryMate formalises that connection. Verified identities. Escrow-held payments. Photo proof at pickup. OTP confirmation at delivery. And a customs guide built specifically for diaspora corridors — something no courier and no competitor has ever bothered to build.
          </p>
          <p style={{ fontSize: '17px', lineHeight: 1.8 }}>
            We are not disrupting logistics. We are recognising that a logistics system for our community has existed for years. We are just building the infrastructure to make it safe, reliable, and fair — so travelers get paid for what they have always done for free, and senders get the protection they deserve.
          </p>
        </section>

        {/* Numbers */}
        <section style={{ background: 'var(--ink)', padding: '80px 5vw', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(245,240,232,0.4)', marginBottom: '48px' }}>
            The problem we are solving
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2px', maxWidth: '900px', margin: '0 auto' }}>
            {NUMBERS.map(({ big, label }) => (
              <div key={big} style={{ padding: '32px 24px', background: 'rgba(255,255,255,0.04)' }}>
                <div className="font-serif" style={{ fontSize: '48px', fontWeight: 900, color: 'var(--teal-light)', lineHeight: 1, marginBottom: '8px' }}>{big}</div>
                <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.5)', lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: '80px 5vw', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '20px' }}>Our mission</div>
              <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.05, marginBottom: '20px' }}>
                Make every diaspora flight a delivery
              </h2>
              <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                Every traveler becomes a carrier. Every sender saves money. Every parcel arrives through a trusted community member. That is the world CarryMate is building — one corridor, one delivery, one community at a time.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {VALUES.map(({ title, desc }) => (
                <div key={title} style={{ background: 'var(--warm)', borderRadius: '14px', padding: '20px 22px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--teal)', flexShrink: 0, display: 'inline-block' }} />
                    {title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section style={{ background: 'var(--warm)', padding: '80px 5vw' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>The team</div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px' }}>
              Built by people who felt the problem
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', maxWidth: '480px', margin: '12px auto 0', lineHeight: 1.7 }}>
              Every member of the CarryMate team has a personal connection to the diaspora communities we serve.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {TEAM.map(({ initials, bg, name, role, bio }) => (
              <div key={initials} style={{ background: 'var(--cream)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: 'white' }}>
                  <span className="font-serif" style={{ fontSize: '22px', fontWeight: 700 }}>{initials}</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{name}</div>
                <div style={{ fontSize: '13px', color: 'var(--teal)', fontWeight: 600, marginBottom: '10px' }}>{role}</div>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Advisors */}
        <section style={{ padding: '80px 5vw', maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>Advisory board</div>
            <h2 className="font-serif" style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.5px' }}>Strategic advisors</h2>
          </div>
          <div>
            {ADVISORS.map(({ initials, name, role, tag }) => (
              <div key={initials} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: 'var(--teal)', border: '1px solid var(--border)', flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: '2px' }}>{name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{role}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)', background: 'var(--teal-pale)', padding: '3px 10px', borderRadius: '99px', whiteSpace: 'nowrap' }}>{tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: 'var(--teal)', padding: '80px 5vw', textAlign: 'center' }}>
          <h2 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '16px' }}>
            Join the community
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', marginBottom: '36px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            Whether you are sending your first parcel home or looking to earn on your next flight — CarryMate is built for you.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{ background: 'white', color: 'var(--teal)', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
              Send a parcel →
            </Link>
            <Link href="/signup" style={{ background: 'transparent', color: 'white', padding: '14px 28px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.4)' }}>
              Earn as a traveler
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
