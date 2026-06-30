import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Blog — CarryMate',
  description: 'Guides, tips, and insights for the diaspora community — sending parcels, earning on flights, and navigating customs.',
}

const POSTS = [
  {
    slug: 'earn-on-flight',
    category: 'Carrier guide',
    title: 'How to earn £150 on your next flight home — and why you should',
    excerpt: 'A practical guide to earning money carrying parcels on diaspora flights. What to expect, how much you can earn, and how the whole process works.',
    date: 'June 2026',
    readTime: '7 min read',
    headerBg: 'var(--teal)',
  },
  {
    slug: 'send-london-lagos',
    category: 'Sender guide',
    title: 'How to send a parcel from London to Lagos — the complete guide',
    excerpt: 'Everything you need to know about sending parcels from the UK to Nigeria — customs rules, packaging, pricing, and how CarryMate compares to traditional couriers.',
    date: 'June 2026',
    readTime: '8 min read',
    headerBg: 'var(--ink)',
  },
  {
    slug: 'lagos-customs-guide',
    category: 'Customs guide',
    title: 'Nigeria customs guide 2026: what you can and cannot bring into Lagos',
    excerpt: 'A complete, plain-English guide to Nigerian customs rules for travelers arriving at Murtala Muhammed International Airport — duty-free limits, prohibited items, and what to do if you are stopped.',
    date: 'June 2026',
    readTime: '9 min read',
    headerBg: 'var(--gold)',
  },
]

export default function BlogPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '72px 5vw 56px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            Guides & insights
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: '16px' }}>
            The CarryMate blog
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
            Practical guides for senders and travelers. Customs intelligence. Community stories.
          </p>
        </div>

        {/* Posts */}
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 5vw 96px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {POSTS.map(({ slug, category, title, excerpt, date, readTime, headerBg }) => (
            <Link key={slug} href={`/blog/${slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', transition: 'box-shadow .2s' }}>
                <div style={{ background: headerBg, padding: '28px 32px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 10px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    {category}
                  </span>
                </div>
                <div style={{ padding: '28px 32px' }}>
                  <h2 className="font-serif" style={{ fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '10px', lineHeight: 1.15, color: 'var(--ink)' }}>
                    {title}
                  </h2>
                  <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>{excerpt}</p>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                    <span>CarryMate Editorial</span>
                    <span>{date}</span>
                    <span>{readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
