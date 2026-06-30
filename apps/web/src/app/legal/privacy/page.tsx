import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy — CarryMate',
  description: 'CarryMate Privacy Policy — how we collect, use, and protect your personal data. GDPR compliant.',
}

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <div style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>Effective date: 1 July 2026</span>
            <span>Last updated: 27 June 2026</span>
            <span>GDPR compliant</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 5vw 96px' }}>
          {/* Table of Contents */}
          <div style={{ background: 'var(--warm)', borderRadius: '16px', padding: '28px 32px', marginBottom: '48px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Contents
            </div>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['#p1', 'Who we are'],
                ['#p2', 'What data we collect'],
                ['#p3', 'Why we collect it and our lawful basis'],
                ['#p4', 'How long we keep your data'],
                ['#p5', 'Who we share your data with'],
                ['#p6', 'International transfers'],
                ['#p7', 'Your rights'],
                ['#p8', 'Cookies'],
                ['#p9', 'Children'],
                ['#p10', 'Changes to this policy'],
                ['#p11', 'Contact and complaints'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ fontSize: '14px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Intro highlight */}
          <div style={{ background: 'var(--teal-pale)', borderLeft: '3px solid var(--teal)', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '0 0 40px', fontSize: '14px', color: '#0a3d2b', fontWeight: 500 }}>
            This policy explains what personal data CarryMate collects, why we collect it, who we share it with, and what your rights are. We have written it in plain English. If anything is unclear, contact us at <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)' }}>privacy@carrymate.io</a>.
          </div>

          <Section id="p1" num="01" title="Who we are">
            <p>CarryMate Ltd is the data controller for all personal data processed through the CarryMate platform. We are registered with the UK Information Commissioner's Office (ICO).</p>
            <p>Our Data Protection Officer can be reached at <a href="mailto:dpo@carrymate.io" style={{ color: 'var(--teal)' }}>dpo@carrymate.io</a>.</p>
          </Section>

          <Section id="p2" num="02" title="What data we collect">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', margin: '20px 0' }}>
                <thead>
                  <tr>
                    {['Category', 'Data collected', 'Who it applies to'].map(h => (
                      <th key={h} style={{ background: 'var(--ink)', color: 'white', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px', letterSpacing: '.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Account data', 'Full name, email address, phone number, password (hashed), account role (sender/traveler/both), date of registration', 'All users'],
                    ['Identity verification', 'Passport or national ID scan, selfie photograph, liveness check result, KYC decision and status, PEP/sanctions screening result', 'Travelers; senders for high-value transactions'],
                    ['Trip and parcel data', 'Flight details, departure and arrival cities, luggage capacity, parcel descriptions, declared values, item categories, OTP records, parcel photographs', 'All users'],
                    ['Payment data', 'Escrow transaction records, payout records, payment provider references (Stripe payment intent IDs, Paystack references). We do not store full card numbers — these are handled by our payment processors.', 'All users'],
                    ['Communication data', 'In-app messages between senders and travelers, support messages sent to CarryMate', 'All users'],
                    ['Device and usage data', 'IP address, device type, operating system, app version, pages visited, features used, crash reports', 'All users'],
                    ['Location data', 'Approximate location (derived from IP address). We do not continuously track GPS location.', 'All users'],
                    ['Push notification tokens', 'Expo push notification token for delivering delivery alerts and account notifications', 'Mobile app users'],
                    ['Ratings and reviews', 'Delivery ratings (1–5 stars) and written reviews submitted after deliveries', 'All users'],
                  ].map(([cat, data, who], i) => (
                    <tr key={cat}>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}><strong>{cat}</strong></td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{data}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="p3" num="03" title="Why we collect it and our lawful basis">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', margin: '20px 0' }}>
                <thead>
                  <tr>
                    {['Purpose', 'Lawful basis (UK GDPR)'].map(h => (
                      <th key={h} style={{ background: 'var(--ink)', color: 'white', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px', letterSpacing: '.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Creating and managing your account', 'Contract performance'],
                    ['Matching senders with travelers', 'Contract performance'],
                    ['Processing payments and managing escrow', 'Contract performance; legal obligation (financial regulations)'],
                    ['Identity verification and fraud prevention', 'Legal obligation; legitimate interests'],
                    ['Anti-money laundering screening', 'Legal obligation'],
                    ['Providing customs guidance', 'Legitimate interests (protecting users from legal risk)'],
                    ['Sending transactional notifications (match found, OTP, delivery confirmed)', 'Contract performance'],
                    ['Sending marketing communications', 'Consent (you can withdraw at any time)'],
                    ['Improving the platform (analytics, crash reports)', 'Legitimate interests'],
                    ['Complying with legal requests from authorities', 'Legal obligation'],
                  ].map(([purpose, basis], i) => (
                    <tr key={purpose}>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{purpose}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="p4" num="04" title="How long we keep your data">
            <ul>
              <li><strong>Account data:</strong> For as long as your account is active, plus 6 years after closure (for legal and tax purposes)</li>
              <li><strong>Identity verification documents:</strong> 5 years from the date of verification, in accordance with UK anti-money laundering regulations</li>
              <li><strong>Transaction records:</strong> 7 years from the transaction date (required by financial regulations)</li>
              <li><strong>Parcel photographs:</strong> 90 days after delivery is confirmed, or until a dispute arising from that delivery is resolved</li>
              <li><strong>In-app messages:</strong> 2 years from the date of the conversation</li>
              <li><strong>Marketing data:</strong> Until you withdraw consent or unsubscribe</li>
              <li><strong>Device and usage data:</strong> 13 months (standard analytics retention)</li>
            </ul>
          </Section>

          <Section id="p5" num="05" title="Who we share your data with">
            <p>We share your data only with parties that are necessary to operate the CarryMate platform. We do not sell your data to anyone.</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', margin: '20px 0' }}>
                <thead>
                  <tr>
                    {['Recipient', 'Purpose', 'Location'].map(h => (
                      <th key={h} style={{ background: 'var(--ink)', color: 'white', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px', letterSpacing: '.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sumsub / Smile Identity', 'Identity verification (KYC)', 'EU / Africa'],
                    ['Stripe', 'Payment processing and escrow (GBP/EUR)', 'USA (SCCs in place)'],
                    ['Paystack', 'Payment processing (NGN/GHS)', 'Nigeria'],
                    ['Flutterwave', 'Payouts (mobile money, East Africa)', 'Nigeria/USA'],
                    ['Termii', 'SMS delivery for OTP and notifications', 'Nigeria'],
                    ['Twilio', 'SMS delivery (UK/US fallback)', 'USA (SCCs in place)'],
                    ['Firebase (Google)', 'Push notification delivery', 'USA (SCCs in place)'],
                    ['AWS S3', 'Parcel photograph and document storage', 'South Africa (af-south-1)'],
                    ['Supabase', 'Database hosting and authentication', 'EU (Ireland)'],
                    ['Railway', 'API server hosting', 'USA'],
                    ['Other users', 'Your name, rating, and carrier tier are shown to other users as part of the matching process', 'N/A'],
                    ['Law enforcement / customs authorities', 'When required by law or to investigate suspected fraud or illegal activity', 'Varies'],
                  ].map(([recipient, purpose, location], i) => (
                    <tr key={recipient}>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{recipient}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{purpose}</td>
                      <td style={{ padding: '11px 14px', borderBottom: '1px solid var(--border)', verticalAlign: 'top', lineHeight: 1.55, background: i % 2 === 1 ? 'var(--warm)' : undefined }}>{location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>All third-party processors are bound by Data Processing Agreements that require them to process your data only on our instructions and to maintain appropriate security measures.</p>
          </Section>

          <Section id="p6" num="06" title="International transfers">
            <p>Some of our service providers are based outside the UK and EEA. Where we transfer data to countries that do not have an adequacy decision from the UK ICO, we rely on Standard Contractual Clauses (SCCs) approved by the ICO as the safeguard for that transfer. A list of our transfer mechanisms is available on request from <a href="mailto:dpo@carrymate.io" style={{ color: 'var(--teal)' }}>dpo@carrymate.io</a>.</p>
          </Section>

          <Section id="p7" num="07" title="Your rights">
            <p>Under UK GDPR you have the following rights. To exercise any of them, contact us at <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)' }}>privacy@carrymate.io</a>. We will respond within one month.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', margin: '20px 0' }}>
              {[
                ['Right of access', 'Request a copy of all personal data we hold about you.'],
                ['Right to rectification', 'Ask us to correct inaccurate data or complete incomplete data.'],
                ['Right to erasure', 'Ask us to delete your data. This right is not absolute — we may need to retain some data for legal reasons.'],
                ['Right to restriction', 'Ask us to stop processing your data while a dispute about its accuracy or lawfulness is resolved.'],
                ['Right to portability', 'Receive your data in a structured, machine-readable format and transfer it to another provider.'],
                ['Right to object', 'Object to processing based on legitimate interests. We will stop unless we can demonstrate compelling grounds.'],
                ['Right to withdraw consent', 'Where we rely on consent, you can withdraw it at any time. Withdrawal does not affect the lawfulness of processing before the withdrawal.'],
                ['Rights relating to automated decisions', 'We use automated tools to screen for fraud and prohibited items. You have the right to request human review of any automated decision that significantly affects you.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ background: 'var(--warm)', borderRadius: '12px', padding: '18px 20px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--teal)', marginBottom: '6px' }}>{title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="p8" num="08" title="Cookies">
            <p>We use cookies and similar tracking technologies on our website. For full details of the cookies we use, what they do, and how to control them, please see our <Link href="/legal/cookies" style={{ color: 'var(--teal)', fontWeight: 500 }}>Cookie Policy</Link>.</p>
          </Section>

          <Section id="p9" num="09" title="Children">
            <p>CarryMate is not directed at or intended for use by anyone under the age of 18. We do not knowingly collect personal data from anyone under 18. If you believe we have inadvertently collected data from a child, please contact us immediately at <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)' }}>privacy@carrymate.io</a> and we will delete it promptly.</p>
          </Section>

          <Section id="p10" num="10" title="Changes to this policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email at least 14 days before they take effect. The current version is always available at carrymate.io/legal/privacy.</p>
          </Section>

          <Section id="p11" num="11" title="Contact and complaints">
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 32px', marginTop: '48px' }}>
              <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Privacy enquiries</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Data Protection Officer: <a href="mailto:dpo@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>dpo@carrymate.io</a>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                General privacy questions: <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>privacy@carrymate.io</a>
              </p>
              <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                <strong>Complaints:</strong> If you are unhappy with how we handle your data, you have the right to complain to the UK Information Commissioner's Office at{' '}
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal)' }}>ico.org.uk</a>{' '}
                or by calling 0303 123 1113. We would always appreciate the chance to address your concerns first before you contact the ICO.
              </p>
            </div>
          </Section>

          {/* Legal cross-links */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
            <Link href="/legal/terms" style={{ color: 'var(--teal)', fontWeight: 500 }}>Terms of Service</Link>
            <Link href="/legal/cookies" style={{ color: 'var(--teal)', fontWeight: 500 }}>Cookie Policy</Link>
            <a href="mailto:privacy@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>privacy@carrymate.io</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({ id, num, title, children }: { id: string; num: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginBottom: '48px' }}>
      <h2
        className="font-serif"
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1.5px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--teal)',
            background: 'var(--teal-pale)',
            padding: '3px 8px',
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
