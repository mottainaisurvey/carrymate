import type { Metadata } from 'next'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Careers — CarryMate',
  description: 'Join the team building the infrastructure for the diaspora. Open roles at CarryMate — remote-first, equity at all levels.',
}

const VALUES = [
  { title: 'Community first', body: 'Every product decision runs through one question: does this make the diaspora community trust us more? Revenue follows trust, never the reverse.' },
  { title: 'Hire for mission fit', body: 'Someone who has personally felt this problem will outperform a more technically experienced hire who has not. Cultural proximity to our community is not optional.' },
  { title: 'Own the delivery', body: 'When something goes wrong, we fix it — even when it is technically not our fault. Trust is built in the hard moments.' },
  { title: 'Speed over perfection early', body: 'Ship fast in the first six months. Tighten every process once we have users. Perfection in the wrong order is procrastination.' },
  { title: 'Radical internal transparency', body: 'Weekly metrics shared with the whole team, including burn rate and runway. No one should be surprised by a difficult month.' },
  { title: 'Direct and kind', body: 'We say what we think and we say it with care. Honesty without kindness is cruelty. Kindness without honesty is cowardice.' },
]

const ROLES = [
  {
    icon: '🤝', deptBg: 'var(--teal-pale)',
    title: 'Trust & Operations Manager',
    meta: ['📍 London (hybrid)', '🕐 Full-time', '💰 £32–40k + equity'],
    desc: 'Runs dispute resolution, traveler KYC manual reviews, corridor operations, and customer support. The person who keeps CarryMate trustworthy. Must have high emotional intelligence and strong judgment — not just the ability to follow a process. Diaspora background strongly preferred.',
    tags: [{ label: 'Operations', style: 'teal' }, { label: 'Customer trust', style: 'teal' }, { label: 'Diaspora community', style: 'ink' }, { label: 'Hiring now', style: 'gold' }],
    email: 'Trust & Operations Manager',
  },
  {
    icon: '📣', deptBg: 'rgba(200,150,62,0.15)',
    title: 'Community Growth Lead',
    meta: ['📍 London (hybrid)', '🕐 Full-time', '💰 £35–45k + equity'],
    desc: 'Owns community acquisition, WhatsApp group strategy, church and faith network partnerships, university African society programmes, and content creation for diaspora audiences. Must be deeply embedded in Nigerian and/or Ghanaian diaspora communities in the UK. This is not a standard marketing role.',
    tags: [{ label: 'Growth', style: 'gold' }, { label: 'Community', style: 'teal' }, { label: 'WhatsApp-native', style: 'ink' }, { label: 'Hiring now', style: 'gold' }],
    email: 'Community Growth Lead',
  },
  {
    icon: '⚙', deptBg: '#e8f0fe',
    title: 'Backend Engineer',
    meta: ['📍 Remote', '🕐 Full-time', '💰 £55–70k + equity'],
    desc: 'Works on the Fastify + tRPC backend — matching engine, escrow logic, payment integrations, customs intelligence API, and background workers. Node.js + TypeScript + PostgreSQL. Second engineering hire after the CTO. Choose someone who improves the codebase, not just adds to it.',
    tags: [{ label: 'Engineering', style: 'teal' }, { label: 'Node.js', style: 'ink' }, { label: 'TypeScript', style: 'ink' }, { label: 'PostgreSQL', style: 'ink' }],
    email: 'Backend Engineer',
  },
  {
    icon: '⚖', deptBg: '#fceee8',
    title: 'Compliance & Partnerships Associate',
    meta: ['📍 London (hybrid)', '🕐 Part-time or full-time', '💰 £28–38k + equity'],
    desc: 'Supports the KYC programme, AML monitoring, corridor-specific customs guide updates, and business development with corridor partners (airports, airlines, community organisations). Background in compliance, trade law, or financial services preferred. Nigeria or Ghana market knowledge a significant advantage.',
    tags: [{ label: 'Compliance', style: 'teal' }, { label: 'Partnerships', style: 'gold' }, { label: 'AML/KYC', style: 'ink' }],
    email: 'Compliance & Partnerships Associate',
  },
]

const PERKS = [
  { icon: '📈', title: 'Meaningful equity', body: 'Every full-time hire gets options in the company. We are early — your equity matters. Vesting over 4 years with a 1-year cliff.' },
  { icon: '🌍', title: 'Remote-first', body: 'Work from wherever you do your best thinking. We are a distributed team with members in London, Lagos, and Accra.' },
  { icon: '✈', title: 'Travel on the corridors', body: 'We encourage team members to fly the corridors we serve. Understanding the experience is part of the job.' },
  { icon: '📚', title: 'Learning budget', body: '£500 per year for books, courses, and conferences. If it makes you better at your job, we cover it.' },
  { icon: '🏥', title: 'Health coverage', body: 'Private health insurance for UK-based employees from month one. Equivalent support for non-UK team members.' },
  { icon: '🤝', title: 'Community first', body: 'You will work on something that genuinely matters to people who look like us. That is not a perk — it is the whole point.' },
]

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  teal: { bg: 'var(--teal-pale)', color: 'var(--teal)' },
  gold: { bg: 'rgba(200,150,62,0.15)', color: 'var(--gold)' },
  ink: { bg: 'rgba(26,18,8,0.07)', color: 'var(--ink)' },
}

export default function CareersPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '80px 5vw 64px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            Join the team
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '20px', lineHeight: 1.0 }}>
            Build the <em style={{ fontStyle: 'italic', color: 'var(--gold)', fontWeight: 300 }}>infrastructure</em><br />
            for the diaspora
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '560px', lineHeight: 1.75, marginBottom: '32px' }}>
            CarryMate is an early-stage startup solving a real problem for diaspora communities worldwide. If you have felt this problem personally, we want to hear from you.
          </p>
          <div style={{ background: 'var(--teal-pale)', border: '1px solid rgba(29,122,95,0.2)', borderRadius: '12px', padding: '16px 20px', fontSize: '14px', color: '#0a3d2b', maxWidth: '560px', lineHeight: 1.65 }}>
            We are a small, focused team at pre-seed stage. Every hire shapes the company. We move fast, trust each other, and build for the community we come from.
          </div>
        </div>

        {/* Values */}
        <section style={{ background: 'var(--ink)', padding: '72px 5vw' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.5)', marginBottom: '16px' }}>
              How we work
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 900, letterSpacing: '-1px', color: 'white', marginBottom: '40px' }}>
              Five things we believe
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '2px' }}>
              {VALUES.map(({ title, body }) => (
                <div key={title} style={{ background: 'rgba(255,255,255,0.04)', padding: '28px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.65 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Roles */}
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 5vw 96px' }}>
          <div style={{ padding: '72px 0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>
              Open roles
            </div>
            <h2 className="font-serif" style={{ fontSize: 'clamp(28px,3.5vw,40px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '8px' }}>
              We are hiring
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '40px', maxWidth: '520px', lineHeight: 1.7 }}>
              All roles are remote-first with a preference for candidates based in London, Lagos, or Accra. Equity offered at all levels.
            </p>

            {ROLES.map(({ icon, deptBg, title, meta, desc, tags, email }) => (
              <div key={title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px 28px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', background: deptBg }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {meta.map(m => <span key={m}>{m}</span>)}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65 }}>{desc}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {tags.map(({ label, style }) => (
                      <span key={label} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '99px', background: TAG_STYLES[style].bg, color: TAG_STYLES[style].color }}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={`mailto:careers@carrymate.io?subject=${encodeURIComponent(email)}`}
                  style={{ background: 'var(--teal)', color: 'white', padding: '9px 18px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', marginTop: '4px' }}
                >
                  Apply
                </a>
              </div>
            ))}

            <div style={{ background: 'var(--warm)', borderRadius: '20px', padding: '40px', marginTop: '48px', textAlign: 'center' }}>
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>Don&apos;t see your role?</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.7, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
                We are always interested in exceptional people who believe in what we are building. If you have relevant experience and a personal connection to the diaspora community we serve, send us a note.
              </p>
              <a href="mailto:careers@carrymate.io?subject=Open application" style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '15px' }}>
                Send an open application →
              </a>
            </div>
          </div>

          {/* Perks */}
          <div style={{ paddingBottom: '72px' }}>
            <h2 className="font-serif" style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '32px' }}>
              What we offer
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
              {PERKS.map(({ icon, title, body }) => (
                <div key={title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '22px' }}>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{icon}</div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--ink)', marginBottom: '6px' }}>{title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
