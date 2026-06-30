import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy — CarryMate',
  description: 'CarryMate Cookie Policy — what cookies we use, why, and how to manage your preferences.',
}

const COOKIES = [
  { name: 'sb-access-token', type: 'Essential', typeBg: '#e8f5e2', typeColor: '#2a6b0f', purpose: 'Supabase authentication session token. Required to keep you logged in.', duration: 'Session' },
  { name: 'sb-refresh-token', type: 'Essential', typeBg: '#e8f5e2', typeColor: '#2a6b0f', purpose: 'Supabase session refresh token. Keeps your session alive without requiring re-login.', duration: '7 days' },
  { name: 'carrymate-pref', type: 'Essential', typeBg: '#e8f5e2', typeColor: '#2a6b0f', purpose: 'Stores your cookie consent preference and UI preferences (currency, language).', duration: '1 year' },
  { name: '_vercel_jwt', type: 'Essential', typeBg: '#e8f5e2', typeColor: '#2a6b0f', purpose: 'Set by Vercel for deployment authentication on staging environments.', duration: 'Session' },
  { name: '_ga, _ga_*', type: 'Analytics', typeBg: 'rgba(59,130,246,0.12)', typeColor: '#1e3a6e', purpose: 'Google Analytics 4. Collects anonymised data on how visitors use the site — pages visited, time on site, device type. Used to improve the product.', duration: '13 months' },
  { name: 'ph_*', type: 'Analytics', typeBg: 'rgba(59,130,246,0.12)', typeColor: '#1e3a6e', purpose: 'PostHog product analytics. Tracks feature usage and user flows within the authenticated portal to help us identify what is working and what is not.', duration: '1 year' },
  { name: 'stripe-mid, __stripe_sid', type: 'Essential', typeBg: '#e8f5e2', typeColor: '#2a6b0f', purpose: 'Set by Stripe to prevent fraud during payment processing. Required for checkout to function.', duration: 'Session / 1 year' },
]

export default function CookiesPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--ink)', padding: '64px 5vw 48px', color: 'white' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(224,242,236,0.7)', marginBottom: '16px' }}>
            Legal
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: '12px' }}>
            Cookie Policy
          </h1>
          <div style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>Effective: 1 July 2026</span>
            <span>Last updated: 27 June 2026</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 5vw 96px' }}>
          <Section num="01" title="What are cookies?">
            <p>Cookies are small text files placed on your device when you visit a website. They help websites remember information about your visit — like your login state, your preferences, and how you use the site — so that the experience works correctly on your next visit.</p>
            <p>Some cookies are set by CarryMate directly. Others are set by third-party services we use (such as our analytics or payment providers). This policy covers both.</p>
          </Section>

          <Section num="02" title="The cookies we use">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', margin: '16px 0' }}>
                <thead>
                  <tr>
                    {['Cookie name', 'Type', 'Purpose', 'Duration'].map(h => (
                      <th key={h} style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'white', background: 'var(--ink)', padding: '10px 12px', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COOKIES.map(({ name, type, typeBg, typeColor, purpose, duration }, i) => (
                    <tr key={name}>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined, fontFamily: 'monospace', fontSize: '12px' }}>{name}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>
                        <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: typeBg, color: typeColor }}>{type}</span>
                      </td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{purpose}</td>
                      <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined, whiteSpace: 'nowrap' }}>{duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ background: 'var(--teal-pale)', borderLeft: '3px solid var(--teal)', borderRadius: '0 10px 10px 0', padding: '14px 18px', margin: '16px 0', fontSize: '14px', color: '#0a3d2b', fontWeight: 500 }}>
              We do not use advertising or tracking cookies. We do not share your cookie data with advertising networks. We do not use cookies to build profiles for targeted advertising.
            </div>
          </Section>

          <Section num="03" title="Essential cookies">
            <p>Essential cookies are required for CarryMate to function. They include your authentication session, your cookie preference, and the fraud prevention cookies set by our payment processor (Stripe). You cannot opt out of essential cookies while continuing to use CarryMate — without them, login, checkout, and session management will not work.</p>
          </Section>

          <Section num="04" title="Analytics cookies">
            <p>We use Google Analytics 4 and PostHog to understand how people use CarryMate. The data we collect is anonymised — we cannot identify you personally from analytics data. We use it to understand which features people use most, where users encounter problems, and how to prioritise improvements.</p>
            <p>You can opt out of analytics cookies at any time using the cookie preference centre (accessible via the "Cookie settings" link in the footer). Opting out will not affect your ability to use CarryMate.</p>
          </Section>

          <Section num="05" title="Managing your cookie preferences">
            <p>You can manage your cookie preferences in several ways:</p>
            <ul>
              <li><strong>Cookie preference centre:</strong> Click "Cookie settings" in the footer of any page on carrymate.io to update your preferences at any time.</li>
              <li><strong>Browser settings:</strong> Most browsers allow you to block or delete cookies through their settings. Note that blocking essential cookies will prevent CarryMate from functioning correctly.</li>
              <li>
                <strong>Google Analytics opt-out:</strong> You can install the{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>
                  Google Analytics opt-out browser add-on
                </a>{' '}
                to prevent your data from being used by Google Analytics across all websites you visit.
              </li>
            </ul>
          </Section>

          <Section num="06" title="Mobile app">
            <p>The CarryMate mobile app (iOS and Android) does not use browser cookies. Instead, we use AsyncStorage (a local device storage mechanism) to persist your session token. We also use your device's unique push notification token (if you have granted permission) to send delivery alerts. You can revoke push notification permission at any time in your device settings.</p>
          </Section>

          <Section num="07" title="Changes to this policy">
            <p>We may update this Cookie Policy from time to time. Material changes will be communicated via a notice on the website and, where appropriate, by email. The current version is always available at carrymate.io/legal/cookies.</p>
          </Section>

          {/* Contact box */}
          <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '26px 30px', marginTop: '44px' }}>
            <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Questions about cookies</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '6px' }}>For any questions about how we use cookies or your privacy rights:</p>
            <p style={{ fontSize: '14px', marginBottom: '6px' }}>
              <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>privacy@carrymate.io</a>
            </p>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Data Protection Officer: <a href="mailto:dpo@carrymate.io" style={{ color: 'var(--teal)' }}>dpo@carrymate.io</a> · CarryMate Ltd · London, United Kingdom
            </p>
          </div>

          {/* Legal cross-links */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
            <Link href="/legal/terms" style={{ color: 'var(--teal)', fontWeight: 500 }}>Terms of Service</Link>
            <Link href="/legal/privacy" style={{ color: 'var(--teal)', fontWeight: 500 }}>Privacy Policy</Link>
            <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>privacy@carrymate.io</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '44px' }}>
      <h2
        className="font-serif"
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: '14px',
          paddingBottom: '10px',
          borderBottom: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--teal)',
            background: 'var(--teal-pale)',
            padding: '2px 8px',
            borderRadius: '99px',
          }}
        >
          {num}
        </span>
        {title}
      </h2>
      <div style={{ fontSize: '15px', lineHeight: 1.75 }}>
        {children}
      </div>
    </div>
  )
}
