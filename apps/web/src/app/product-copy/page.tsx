import type { Metadata } from 'next'
import { Nav } from '@/components/marketing/Nav'

export const metadata: Metadata = {
  title: 'Product Copy — CarryMate Internal',
  description: 'App Store listings, email templates, empty states, onboarding copy, and SMS messages. Internal reference document.',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const APP_STORE = [
  { label: 'iOS App Store — App Name', chars: '30 char max', content: 'CarryMate — Send parcels home' },
  { label: 'iOS App Store — Subtitle', chars: '30 char max', content: 'Earn on flights. Send for less.' },
  {
    label: 'iOS App Store — Full description', chars: '4,000 char max · 1,847 used',
    content: `Send parcels from London to Lagos for £22. Earn £150 on your next flight home.

CarryMate connects diaspora communities with verified travelers who have available luggage space on flights they are already taking. Cheaper than DHL. Faster than post. Carried by someone from your community.

FOR SENDERS
Send your parcel home for up to 70% less than traditional couriers — and have it arrive in 24–48 hours instead of 4–7 days.

• Post your parcel in minutes — describe what you're sending, where it's going, and when you need it there
• Our AI checks customs rules for your corridor instantly — no guesswork at the border
• Choose a verified traveler from our matched list — see their rating, departure date, and price before you commit
• Pay securely into escrow — your money is held until delivery is confirmed
• Track your parcel in real time — from collection to delivery
• Recipient confirms with a one-time code — escrow is released to the traveler only when they do

FOR TRAVELERS
You're flying home anyway. CarryMate turns your spare luggage space into real income.

• Post your trip and set an earning goal — £100, £150, £200, your call
• Browse matched parcels on your route — screened against customs rules for your corridor
• Collect from senders before your flight — photograph every parcel for legal protection
• Our customs guide tells you exactly what to declare at the border
• Get paid when the recipient confirms delivery — to your UK or Nigerian bank account

SAFE, VERIFIED, COMMUNITY-BACKED
• Every traveler passes biometric ID verification, liveness check, and sanctions screening
• Escrow holds your money until delivery is confirmed — nobody gets paid before the parcel arrives
• Photo proof at every pickup — timestamped, tamper-evident
• Dual one-time password system at both ends of every delivery
• Full dispute resolution with 48-hour SLA

CORRIDORS LIVE NOW
🇬🇧 → 🇳🇬 London → Lagos
🇬🇧 → 🇬🇭 London → Accra
🇺🇸 → 🇳🇬 New York → Lagos
🇬🇧 → 🇰🇪 London → Nairobi
🇫🇷 → 🇨🇮 Paris → Abidjan
🇬🇧 → 🇯🇲 London → Kingston

More corridors launching throughout 2026.

CarryMate Ltd is registered in England and Wales. Questions? support@carrymate.io`,
  },
  { label: 'iOS App Store — Keywords', chars: '100 char max · comma separated', content: 'Nigeria parcel,Lagos delivery,diaspora,courier,send package,Ghana,earn travel,luggage,remittance' },
  { label: 'Google Play — Short description', chars: '80 char max', content: 'Send parcels to Nigeria & Ghana for 70% less. Earn £150 on your next flight.' },
  { label: 'Google Play — Full description', chars: '4,000 char max · identical to iOS is acceptable', content: 'Use the iOS full description above. Google Play does not require a distinct description. The same copy is approved for both stores.' },
  { label: 'Both stores — Privacy Policy URL', chars: '', content: 'https://carrymate.io/legal/privacy' },
  { label: 'Both stores — Support URL', chars: '', content: 'https://carrymate.io/faq' },
  { label: 'Both stores — Age rating', chars: '', content: '4+ (iOS) / Everyone (Android) — no content triggers age restriction. Financial transactions are standard for this category.' },
  { label: 'Both stores — Category', chars: '', content: 'Primary: Travel\nSecondary: Lifestyle (iOS) / Shopping (Android)' },
]

const EMAILS = [
  {
    subject: 'Subject: Welcome to CarryMate, {{first_name}}',
    title: 'You are in.',
    headerBg: 'var(--teal)',
    body: [
      'Hi {{first_name}},',
      'Your CarryMate account is active. Here is what you can do now:',
      '<strong>If you want to send a parcel:</strong> Post a parcel listing and we will match you with a verified traveler flying your route. Average price from London to Lagos: £22.<br/><br/><strong>If you want to earn on your next flight:</strong> Complete identity verification in the app (takes under 5 minutes), then post your trip and start accepting parcels.',
      'If you have questions, the FAQ covers most of them. For anything else, reply to this email or message support@carrymate.io.',
      'Welcome to the community.<br/><strong>The CarryMate team</strong>',
    ],
    cta: { text: 'Open CarryMate →', href: 'https://carrymate.io/dashboard' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io\nYou are receiving this because you created a CarryMate account.',
  },
  {
    subject: 'Subject: Identity verified — you can start carrying parcels',
    title: 'You are verified. ✓',
    headerBg: 'var(--teal)',
    body: [
      'Hi {{first_name}},',
      'Your identity has been verified. You are now a Bronze carrier on CarryMate.',
      'Post your next trip in the app and start earning. Average earnings on the London to Lagos route: £150 per round trip.',
      '<strong>A few things to know before your first trip:</strong>',
      '• Inspect every parcel at collection. If anything looks different from the description, do not collect it.<br/>• Photograph every parcel using the in-app camera. This protects you legally.<br/>• Check the customs guide for your corridor in the app before departure.<br/>• If you are stopped at customs, contact us immediately at support@carrymate.io.',
      'Your first trip will feel new. By the third, it is second nature.',
      '<strong>The CarryMate team</strong>',
    ],
    cta: { text: 'Post your first trip →', href: 'https://carrymate.io/trips/new' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io',
  },
  {
    subject: 'Subject: Your parcel has been matched — {{traveler_name}} is flying {{departure_date}}',
    title: 'Match confirmed.',
    headerBg: 'var(--teal)',
    body: [
      'Hi {{first_name}},',
      'Good news. Your parcel has been matched with a CarryMate carrier.',
      '<strong>Carrier:</strong> {{traveler_name}} · {{carrier_tier}} · ★{{traveler_rating}}<br/><strong>Departure:</strong> {{departure_date}} from {{origin_city}}<br/><strong>Your pickup OTP:</strong> <strong style="font-size:20px;letter-spacing:4px;font-family:var(--font-fraunces)">{{pickup_otp}}</strong>',
      'Arrange a meetup with {{traveler_name}} before their flight. When you meet, show them this OTP. They will enter it in the CarryMate app to confirm collection.',
      'Once the parcel is collected, you can track it in real time from your app. You will be notified when it is delivered.',
      '<strong>The CarryMate team</strong>',
    ],
    cta: { text: 'View parcel details →', href: 'https://carrymate.io/parcels/{{parcel_id}}' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io\nBooking reference: {{parcel_id}}',
  },
  {
    subject: 'Subject: Delivered — your parcel arrived safely',
    title: 'It arrived. ✓',
    headerBg: 'var(--teal)',
    body: [
      'Hi {{first_name}},',
      'Your parcel has been delivered and confirmed by the recipient.',
      '<strong>Delivered:</strong> {{delivery_date}} at {{delivery_time}}<br/><strong>Received by:</strong> {{recipient_name}}<br/><strong>You saved:</strong> £{{savings_amount}} vs DHL Express',
      'The payment has been released to your carrier, {{traveler_name}}.',
      'Please take a moment to rate your experience. Your rating helps other senders know who to trust.',
      'Ready to send another parcel? Your saved corridors and preferences are already in your account.',
      '<strong>The CarryMate team</strong>',
    ],
    cta: { text: 'Rate {{traveler_name}} →', href: 'https://carrymate.io/parcels/{{parcel_id}}/rate' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io\nBooking reference: {{parcel_id}} · Carrier: {{traveler_name}}',
  },
  {
    subject: 'Subject: Dispute opened — we are investigating · ref {{dispute_id}}',
    title: 'We are on it.',
    headerBg: '#c04a2a',
    body: [
      'Hi {{first_name}},',
      'Your dispute has been received (ref: {{dispute_id}}).',
      'Here is what happens next:',
      '<strong>Right now:</strong> The escrow for this delivery is frozen. No funds will move until we issue a decision.<br/><br/><strong>Within 2 hours:</strong> A member of our trust team will contact you to gather more information.<br/><br/><strong>Within 48 hours:</strong> We will issue a decision based on the available evidence — parcel photos, OTP records, and both parties\' accounts.',
      'If you have any additional evidence — photos, messages, or other documentation — please upload it to the dispute page or reply to this email.',
      'We resolve disputes within 48 hours in most cases. We will keep you updated at every stage.',
      '<strong>The CarryMate Trust Team</strong>',
    ],
    cta: { text: 'View dispute →', href: 'https://carrymate.io/disputes/{{dispute_id}}', bg: '#c04a2a' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io\nDispute reference: {{dispute_id}} · Trust team: support@carrymate.io',
  },
  {
    subject: 'Subject: £{{payout_amount}} is on its way to your account',
    title: '£{{payout_amount}} sent. ✓',
    headerBg: 'var(--ink)',
    body: [
      'Hi {{first_name}},',
      'Your payout has been processed.',
      '<strong>Amount:</strong> £{{payout_amount}}<br/><strong>Destination:</strong> {{bank_name}} ending {{account_last4}}<br/><strong>Expected arrival:</strong> {{arrival_date}} (3–5 business days)<br/><strong>Deliveries included:</strong> {{delivery_count}} deliveries from your {{trip_route}} trip',
      'Your current carrier tier: <strong>{{carrier_tier}}</strong>. {{tier_progress_message}}',
      'Ready for your next trip? Post it in the app and start matching with parcels on your corridor.',
      '<strong>The CarryMate team</strong>',
    ],
    cta: { text: 'View earnings history →', href: 'https://carrymate.io/earnings', bg: 'var(--ink)' },
    footer: 'CarryMate Ltd · London, United Kingdom · carrymate.io\nPayment reference: {{payment_ref}} · Questions about this payout: support@carrymate.io',
  },
]

const EMPTY_STATES = [
  { context: 'Sender dashboard — no active parcels', icon: '📦', title: 'No active parcels yet', body: 'Send your first parcel home for up to 70% less than a courier — and have it there in 48 hours.', cta: 'Send a parcel →' },
  { context: 'Sender parcel history — no completed deliveries', icon: '🕐', title: 'Your delivery history will appear here', body: 'Once a delivery completes, you will see the full record — including how much you saved versus a courier.', cta: 'Send your first parcel', ghost: true },
  { context: 'Traveler dashboard — no active trips posted', icon: '✈', title: 'Flying home soon?', body: 'Post your trip and we will match you with parcels on your route. Average earnings: £150 per round trip.', cta: 'Post a trip →' },
  { context: 'Browse parcels — no matches on this route yet', icon: '🔍', title: 'No parcels available on this route right now', body: 'We will notify you the moment a parcel matches your trip. Most corridors have new listings daily.', cta: 'Set a notification', ghost: true },
  { context: 'Traveler earnings — no earnings yet', icon: '£', title: 'Your earnings will appear here', body: 'Complete your first delivery to start building your earnings history and your carrier rating.', cta: 'Post a trip →' },
  { context: 'Notifications — inbox empty', icon: '🔔', title: 'All clear', body: 'No new notifications. We will let you know when a parcel is matched, collected, or delivered.' },
  { context: 'Disputes — no open disputes', icon: '✓', title: 'No open disputes', body: 'If something ever goes wrong with a delivery, you can open a dispute from the parcel detail page.' },
  { context: 'Sender — no travelers available for route', icon: '⏳', title: 'No travelers available on this route yet', body: 'Post your parcel listing and we will notify you the moment a traveler flying your route becomes available — usually within 24 hours.', cta: 'Post my parcel' },
]

const ONBOARDING_SLIDES = [
  { num: 'Slide 1', icon: '✈', title: 'Send parcels home for half the price', body: 'From London to Lagos in 48 hours. Carried by someone from your community.' },
  { num: 'Slide 2', icon: '💰', title: 'Turn your flight into £150', body: 'Have luggage space on your next flight home? Earn real money carrying parcels for your community.' },
  { num: 'Slide 3 · CTA', icon: '🔐', title: 'Safe, verified, community-backed', body: 'Escrow payments. Biometric ID checks. Customs guidance. Every delivery protected.' },
]

const ONBOARDING_COPY = [
  { label: 'Slide 3 — CTA button text', content: 'Get started' },
  { label: 'Below CTA — secondary action', content: 'Already have an account? Sign in' },
  { label: 'KYC screen — instructions text', content: `Before you can carry parcels, we need to verify your identity. This takes under 5 minutes and is required by law. You will need:\n\n• Your passport or national ID\n• Good lighting for the selfie check\n\nYour documents are processed securely by our KYC partner and are never stored on your device.` },
  { label: 'Role selection screen — heading', content: 'How do you want to use CarryMate?' },
  { label: 'Role selection — Sender option', content: 'Send parcels home\nI want to send packages to Nigeria, Ghana, or another CarryMate corridor.' },
  { label: 'Role selection — Traveler option', content: 'Earn on my flights\nI fly home regularly and want to earn by carrying parcels.' },
  { label: 'Role selection — Both option', content: 'Both\nI want to send parcels and earn as a carrier.' },
]

const SMS = [
  { context: 'OTP verification — account sign-up', text: 'CarryMate: Your verification code is {{otp}}. Valid for 10 minutes. Do not share this code with anyone.', chars: '96 characters' },
  { context: 'Parcel matched — sent to sender', text: 'CarryMate: Your parcel is matched! {{traveler_name}} flies {{departure_date}}. Pickup code: {{otp}}. Show this to your carrier. carrymate.io', chars: '134 characters' },
  { context: 'Delivery OTP — sent to recipient', text: 'CarryMate: Your parcel from {{sender_name}} is being delivered. Confirm receipt with code: {{otp}}. Do not share.', chars: '108 characters' },
  { context: 'Parcel collected — sent to sender', text: "CarryMate: {{traveler_name}} has collected your parcel. It's on its way to {{destination_city}}. Track at carrymate.io", chars: '110 characters' },
  { context: 'Parcel delivered — sent to sender', text: 'CarryMate: Delivered! {{recipient_name}} confirmed receipt of your parcel. Payment released to carrier. Rate your experience at carrymate.io', chars: '142 characters' },
  { context: 'Dispute opened — sent to both parties', text: 'CarryMate: A dispute has been opened on booking {{parcel_id}}. Our team will contact you within 2 hours. Ref: {{dispute_id}}', chars: '124 characters' },
  { context: 'Payout processed — sent to traveler', text: 'CarryMate: £{{amount}} sent to your account. Expected arrival: {{date}}. Ref: {{ref}}. Keep carrying! carrymate.io', chars: '109 characters' },
  { context: 'KYC approved — sent to traveler', text: 'CarryMate: Identity verified! You can now carry parcels. Post your first trip at carrymate.io and start earning on your next flight.', chars: '135 characters' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductCopyPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ background: 'var(--ink)', padding: '56px 5vw 40px', textAlign: 'center' }}>
          <h1 className="font-serif" style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: '8px' }}>
            CarryMate — Product Copy
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(245,240,232,0.5)' }}>
            App Store listings · Email templates · Empty states · Onboarding copy · SMS messages<br />
            Internal reference document — implement all copy exactly as written.
          </p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '56px 5vw 96px' }}>

          {/* Section 1: App Store */}
          <Section eyebrow="Section 1 of 5" title="App Store listing copy" note="iOS App Store allows 4,000 characters for the full description and 170 characters for the subtitle. Google Play allows 500 characters for the short description and 4,000 for the full description. Keyword fields are separate. Use copy exactly as written.">
            {APP_STORE.map(({ label, chars, content }) => (
              <CopyBlock key={label} label={label} chars={chars} content={content} />
            ))}
          </Section>

          {/* Section 2: Emails */}
          <Section eyebrow="Section 2 of 5" title="Email templates" note="Six transactional emails. All use the CarryMate brand voice — direct, warm, no filler. From address: noreply@carrymate.io. Reply-to: support@carrymate.io. All subject lines are final — do not A/B test transactional subjects.">
            {EMAILS.map(({ subject, title, headerBg, body, cta, footer }) => (
              <div key={subject} style={{ border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', marginBottom: '20px' }}>
                <div style={{ background: headerBg, padding: '20px 24px' }}>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginBottom: '4px', fontWeight: 600, letterSpacing: '.04em' }}>{subject}</div>
                  <div className="font-serif" style={{ fontSize: '20px', fontWeight: 700, color: 'white' }}>{title}</div>
                </div>
                <div style={{ padding: '24px', background: 'white', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.8 }}>
                  {body.map((p, i) => (
                    <p key={i} style={{ marginBottom: '14px' }} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                  {cta && (
                    <a href={cta.href} style={{ background: (cta as any).bg || 'var(--teal)', color: 'white', padding: '11px 22px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', margin: '6px 0' }}>
                      {cta.text}
                    </a>
                  )}
                </div>
                <div style={{ padding: '16px 24px', background: 'var(--warm)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, borderTop: '1px solid var(--border)', whiteSpace: 'pre-line' }}>
                  {footer}
                </div>
              </div>
            ))}
          </Section>

          {/* Section 3: Empty states */}
          <Section eyebrow="Section 3 of 5" title="Empty states" note="Every list screen needs an empty state. These are not error states — they are invitations to act. Each one has a title, a body (one sentence), and a primary CTA. Do not use 'No data found' or 'Nothing here' — these are CarryMate's voice, not a system voice.">
            {EMPTY_STATES.map(({ context, icon, title, body, cta, ghost }) => (
              <div key={context} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '28px 24px', textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>{context}</div>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</div>
                <div className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>{title}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '320px', margin: '0 auto 16px' }}>{body}</div>
                {cta && (
                  <button style={{ background: ghost ? 'transparent' : 'var(--teal)', color: ghost ? 'var(--teal)' : 'white', padding: '10px 20px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, border: ghost ? '1.5px solid var(--teal)' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {cta}
                  </button>
                )}
              </div>
            ))}
          </Section>

          {/* Section 4: Onboarding */}
          <Section eyebrow="Section 4 of 5" title="Mobile app onboarding slides" note="Three slides on the welcome screen. Each has a headline (max 6 words), a body (max 18 words), and an icon. Slide 3 has the primary CTA. Slides auto-advance on swipe or tap. 'Get started' button appears on slide 3 only.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '16px' }}>
              {ONBOARDING_SLIDES.map(({ num, icon, title, body }) => (
                <div key={num} style={{ background: 'var(--ink)', borderRadius: '20px', padding: '28px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '.08em', marginBottom: '20px' }}>{num}</div>
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
                  <div className="font-serif" style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '8px', lineHeight: 1.2 }}>{title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(245,240,232,0.55)', lineHeight: 1.6 }}>{body}</div>
                </div>
              ))}
            </div>
            {ONBOARDING_COPY.map(({ label, content }) => (
              <CopyBlock key={label} label={label} chars="" content={content} />
            ))}
          </Section>

          {/* Section 5: SMS */}
          <Section eyebrow="Section 5 of 5" title="SMS / Termii transactional messages" note="All SMS messages must be under 160 characters to avoid multi-part billing. Sender ID: CarryMate. These are sent via Termii for Nigerian numbers and Twilio for UK/US numbers. Variables in double curly braces.">
            {SMS.map(({ context, text, chars }) => (
              <div key={context} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>{context}</div>
                <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, background: 'var(--teal-pale)', borderRadius: '10px', padding: '12px 14px' }}>{text}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'monospace' }}>{chars}</div>
              </div>
            ))}
          </Section>

        </div>
      </main>
      <footer style={{ background: 'var(--ink)', color: 'rgba(245,240,232,0.5)', padding: '24px 5vw', textAlign: 'center', fontSize: '13px' }}>
        CarryMate Ltd · Product Copy Document · Version 1.0 · June 2026 · For internal use only
      </footer>
    </>
  )
}

function Section({ eyebrow, title, note, children }: { eyebrow: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '64px' }}>
      <div style={{ marginBottom: '28px', paddingBottom: '16px', borderBottom: '2px solid var(--border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>{eyebrow}</div>
        <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.5px' }}>{title}</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.6 }}>{note}</p>
      </div>
      {children}
    </div>
  )
}

function CopyBlock({ label, chars, content }: { label: string; chars: string; content: string }) {
  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', marginBottom: '16px', overflow: 'hidden' }}>
      <div style={{ background: 'var(--warm)', padding: '10px 16px', fontSize: '11px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{label}</span>
        {chars && <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--teal)', fontWeight: 500 }}>{chars}</span>}
      </div>
      <div style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
        {content}
      </div>
    </div>
  )
}
