'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

const FAQ_SECTIONS = [
  {
    id: 'getting-started',
    icon: '✈',
    title: 'Getting started',
    items: [
      {
        q: 'What is CarryMate?',
        a: 'CarryMate connects people who want to send parcels home with travelers who have spare luggage space on flights they are already taking. Senders get a cheaper, faster alternative to traditional couriers. Travelers earn real income — typically £100–£200 per round trip — from luggage space that would otherwise go empty.\n\nWe are not a courier company. We are a platform that makes the informal community practice of sending things home with a "friend on a flight" safe, structured, and financially rewarding for everyone involved.',
      },
      {
        q: 'Which routes does CarryMate cover?',
        a: 'We are live on two corridors at launch:\n\n• London → Lagos (LHR → LOS) — launch route\n• London → Accra (LHR → ACC) — launch route\n\nWe are expanding to additional corridors later in 2026, starting with New York → Lagos (JFK → LOS), London → Nairobi (LHR → NBO), Paris → Abidjan (CDG → ABJ), and London → Kingston (LHR → KIN). If your route is not listed, join the waitlist and we will notify you when it opens.',
        link: { href: '/corridors', text: 'View all corridors' },
      },
      {
        q: 'How do I sign up?',
        a: 'Download the CarryMate app from the App Store or Google Play, or visit carrymate.io on your browser. Registration takes about 3 minutes:\n\n• Enter your phone number and verify with a one-time code\n• Tell us your name and whether you want to send parcels, carry parcels, or both\n• If you want to carry parcels as a Traveler, complete our identity verification step (passport scan + selfie) — this usually takes under 5 minutes',
      },
      {
        q: 'Is CarryMate free to use?',
        a: 'Signing up and browsing is free. CarryMate charges a platform fee on each delivery, which is built into the price you see at checkout — there are no hidden fees added afterwards.\n\nFor Senders: the price you see when you select a Traveler is the total amount you pay, including the platform fee and any optional insurance.\n\nFor Travelers: you receive 75% of the delivery fee set for your route. The remaining 25% is CarryMate\'s platform fee. Payout is made to your registered bank account within 3–5 business days of delivery confirmation.',
        link: { href: '/pricing', text: 'See full pricing' },
      },
      {
        q: 'What countries is CarryMate available in?',
        a: 'CarryMate is currently available to users based in the United Kingdom, United States, France, Nigeria, Ghana, Kenya, Côte d\'Ivoire, and Jamaica. We are expanding to additional countries throughout 2026. If you are based somewhere not listed, you can still join the waitlist.',
      },
    ],
  },
  {
    id: 'sending',
    icon: '📦',
    title: 'Sending a parcel',
    items: [
      {
        q: 'What can I send through CarryMate?',
        a: 'You can send most everyday items, including clothing, shoes, electronics (up to 1 unit per parcel), non-prescription cosmetics and personal care products, dried or commercially packaged food, documents, baby products, and gifts.\n\nSome items require a customs declaration and may attract duty — our customs check at the point of listing will flag these for you and provide guidance specific to your corridor.',
        note: 'Items that can never be sent through CarryMate: cash, weapons, narcotics, prescription medication (without documentation), live animals, fresh food, and counterfeit goods.',
        noteLink: { href: '/legal/terms#s7', text: 'See full prohibited items list' },
      },
      {
        q: 'How do I describe my parcel accurately?',
        a: 'When posting a parcel, describe what you are sending clearly and honestly. Include the category (clothing, electronics, food, documents, etc.), approximate weight, and declared value in GBP.\n\nThe declared value should reflect the genuine market value of the item — not a lower figure to avoid customs duty. Declaring a false value can expose the Traveler to legal consequences at customs, and you are liable for any resulting fines or costs.\n\nOur AI checks your description against customs rules for your corridor and will flag any potential issues before you proceed.',
      },
      {
        q: 'How do I find a traveler for my parcel?',
        a: 'Once you have posted your parcel details, CarryMate automatically matches you with verified travelers flying your route. You will see a list of available travelers with their departure date, available luggage space, carrier rating, and price. Select the one that works best for you and proceed to payment. You can also set a deadline for when you need the parcel to arrive, and we will filter travelers accordingly.',
      },
      {
        q: 'How do I hand over my parcel to the traveler?',
        a: 'Once you have confirmed a match and paid, you will arrange a meetup with the Traveler — typically at a location convenient to both of you, or at the departure airport. The app will give you a 4-digit pickup OTP. When you meet the Traveler, show them this code. They enter it into the CarryMate app to confirm collection, and the parcel is on its way.\n\nThe Traveler will also photograph your parcel at this point, creating a timestamped record of its condition.',
      },
      {
        q: 'How does my recipient confirm delivery?',
        a: 'When the Traveler is ready to hand over the parcel, they will ask your recipient to enter a delivery OTP in the CarryMate app. This OTP is separate from the pickup OTP and confirms that the parcel has been received by the right person. Once the delivery OTP is confirmed, the funds in escrow are released to the Traveler.\n\nYour recipient does not need a CarryMate account to receive a parcel, but they will need the delivery OTP — we send this to the mobile number you provide when posting the parcel.',
      },
      {
        q: 'How much does it cost to send a parcel?',
        a: 'The cost depends on the route, the size and weight of your parcel, and the Traveler you choose. As a guide:\n\n• London → Lagos: typically £18–£28 for a 2kg parcel\n• London → Accra: typically £16–£24 for a 2kg parcel\n• New York → Lagos: typically $24–$38 for a 2kg parcel\n\nThis compares to £75–£120 for the same parcel via DHL Express. Optional insurance (1–3% of declared value) is offered at checkout.',
        link: { href: '/pricing', text: 'Full pricing details' },
      },
      {
        q: 'What if no traveler is available for my route?',
        a: 'If no Traveler matches your parcel within 48 hours, we will notify you and keep your listing active. You will receive a £5 account credit if we cannot find a match within 48 hours. You can also set your listing to "flexible date" so it is visible to travelers across a wider time window.',
      },
      {
        q: 'Can I cancel after I have paid?',
        a: 'You can cancel at any point before the Traveler confirms pickup using the OTP. If you cancel before pickup confirmation, you will receive a full refund of the delivery fee. The platform fee is refunded if you cancel more than 24 hours before the Traveler\'s scheduled departure. If you cancel within 24 hours of departure, the platform fee (but not the Traveler fee) may be retained.\n\nAfter the Traveler has confirmed pickup, cancellation is not possible. If there is a problem, you must open a dispute.',
      },
    ],
  },
  {
    id: 'traveling',
    icon: '💰',
    title: 'Earning as a traveler',
    items: [
      {
        q: 'How much can I earn?',
        a: 'Travelers on the London → Lagos route earn an average of £150 per round trip. Earnings depend on how much luggage space you have available, which parcels you accept, and how many deliveries you complete per trip. On a single LHR → LOS flight with 8kg available, a typical carrier completes 3–4 deliveries and earns £80–£130.\n\nThe more trips you complete, the higher your carrier tier — and higher tiers earn a commission bonus of up to 15%.',
      },
      {
        q: 'Do I need to verify my identity to carry parcels?',
        a: 'Yes. All Travelers must complete identity verification before they can accept any parcel. This involves scanning your passport or national ID and completing a quick liveness check using your phone\'s camera. The process typically takes under 5 minutes and is powered by our KYC partner.\n\nWe also screen against international sanctions and politically exposed persons (PEP) lists. If your verification is flagged, a member of our team will review it manually within 4 hours.',
      },
      {
        q: 'How do I set my earning goal?',
        a: 'When you post a trip on CarryMate, you set an earning goal (for example, £150). The app then shows you which combination of available parcels on your route would get you closest to that goal, taking into account your available luggage space. You can browse and accept individual parcels, or let CarryMate suggest the optimal combination.',
      },
      {
        q: 'What do I need to do when I collect a parcel?',
        a: 'When you meet the Sender to collect the parcel:\n\n• Inspect the parcel — make sure it matches the description and looks as expected\n• If anything looks wrong (the parcel is heavier than described, or the contents appear different from what was listed), do not collect it and contact CarryMate support immediately\n• Ask the Sender to show you their pickup OTP and enter it into the CarryMate app\n• Photograph the parcel using the in-app camera — this creates a timestamped record\n\nNever accept a parcel that you have not inspected and that does not match its description. You are responsible for what you carry.',
      },
      {
        q: 'What if I cannot complete a delivery after collecting the parcel?',
        a: 'If something prevents you from completing a delivery after you have collected the parcel (for example, your flight is cancelled or a family emergency arises), contact CarryMate support immediately. We will help coordinate with the Sender and, where possible, arrange an alternative. Your carrier rating will not be affected by cancellations caused by circumstances outside your control, provided you notify us promptly.',
      },
      {
        q: 'How and when do I get paid?',
        a: 'Payment is released to you when the recipient confirms delivery by entering the delivery OTP. Once released, the payout is processed to your registered bank account or mobile money account within 3–5 business days. UK bank accounts receive payouts via Stripe. Nigerian bank accounts receive payouts via Paystack. Ghanaian and East African accounts receive payouts via Flutterwave (mobile money supported).',
      },
      {
        q: 'What are the carrier tiers and how do they work?',
        a: 'CarryMate has four carrier tiers based on your total number of completed deliveries:\n\n• Bronze (0–9 deliveries): Standard commission rate\n• Silver (10–49 deliveries): +5% commission bonus, priority parcel matching\n• Gold (50–99 deliveries): +10% commission bonus, dedicated support line, early access to high-value parcels\n• Platinum (100+ deliveries): +15% commission bonus, brand ambassador status, exclusive B2B parcel access',
      },
    ],
  },
  {
    id: 'payments',
    icon: '🔐',
    title: 'Payments & escrow',
    items: [
      {
        q: 'What is escrow and why does CarryMate use it?',
        a: 'Escrow means your payment is held by a neutral third party (our licensed payment processor) until the delivery is confirmed. Neither the Sender nor the Traveler can access the funds while they are in escrow.\n\nThis protects Senders from paying for a delivery that never happens, and it protects Travelers from collecting a parcel and not getting paid. The funds are only released when both sides confirm the delivery using the OTP system.',
      },
      {
        q: 'What payment methods are accepted?',
        a: 'For UK and European senders: Visa, Mastercard, and debit cards via Stripe. Apple Pay and Google Pay are also supported.\n\nFor Nigerian and Ghanaian senders: card payments, bank transfers, and USSD via Paystack.\n\nFor Travelers receiving payouts: UK bank accounts (Faster Payments), Nigerian bank accounts (Paystack), Ghanaian bank accounts (Flutterwave), and East African mobile money (M-Pesa, MTN Mobile Money).',
      },
      {
        q: 'What happens if the delivery OTP is not confirmed within 72 hours?',
        a: 'If the delivery OTP is not confirmed within 72 hours of the expected delivery date, our system automatically flags the delivery and creates a support case. Our team will contact both the Sender and Traveler to investigate. The escrow funds remain held until the situation is resolved — they are not automatically released or refunded.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. CarryMate does not store your card details. All payment processing is handled by Stripe (UK/EU) and Paystack (Nigeria/Ghana) — both are PCI-DSS compliant payment processors subject to regular security audits. CarryMate only retains a transaction reference, never your full card number.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Yes, in the following circumstances:\n\n• You cancel before the Traveler confirms pickup: full refund\n• The Traveler cancels or fails to collect: full refund including platform fee\n• A dispute is resolved in the Sender\'s favour: full or partial refund as determined by CarryMate\n• Parcel is not delivered and cannot be located: refund processed after investigation\n\nRefunds are returned to the original payment method and typically appear within 5–10 business days.',
      },
      {
        q: 'Do I need to pay tax on my CarryMate earnings?',
        a: 'Travelers are independent contractors, not employees of CarryMate. You are responsible for reporting your CarryMate earnings to your relevant tax authority and paying any applicable income tax or self-employment tax. In the UK, earnings above the trading allowance (currently £1,000 per tax year) must be declared to HMRC. CarryMate does not withhold tax on your behalf. We recommend speaking to a tax advisor if you are unsure of your obligations.',
      },
    ],
  },
  {
    id: 'customs',
    icon: '📋',
    title: 'Customs & safety',
    items: [
      {
        q: 'Is it legal to send parcels through CarryMate?',
        a: 'Yes. Individuals have always been permitted to carry personal goods for others while travelling. CarryMate provides the technology to make this safer and more structured. However, the legality of any specific parcel depends on its contents, declared value, and the customs rules of the countries on the Traveler\'s itinerary.\n\nCustoms rules are complex and vary by country. Our per-corridor customs guide provides general guidance, but you should always verify current rules with the relevant customs authority if you are unsure.',
      },
      {
        q: 'What are Nigerian customs duty-free limits?',
        a: 'Nigerian customs allows personal effects and gifts up to approximately NGN 50,000 (around £30) duty-free per traveler. Items above this value must be declared and may attract duty. Electronics are treated as commercial goods if carried in multiples — a single laptop may be accepted as personal use, but two or more laptops will typically be assessed for commercial import duty.',
        note: 'Customs rules change frequently. Always check the latest guidelines before travelling.',
      },
      {
        q: 'What are Ghanaian customs duty-free limits?',
        a: 'Ghana Customs allows personal effects valued at up to GHS 200 (approximately £13) duty-free. Goods above this value must be declared to CEPS (Customs Excise and Preventive Service) on arrival. Electronics and new items are inspected closely. CarryMate requires all parcels to have a declared value entered at posting — this is used to generate a declaration form for the Traveler if required.',
      },
      {
        q: 'What happens if a traveler is stopped at customs?',
        a: 'If you are stopped at customs while carrying parcels booked through CarryMate, contact our support team immediately via WhatsApp or the in-app chat. We will provide all relevant documentation — including parcel booking records, photos, and sender declarations — to support your position with the customs officer.\n\nCarryMate is not liable for any customs duty, fine, or detention, but we will do everything we can to support you. The carrier indemnity clause in our Terms of Service means that if a Sender misrepresented the contents of their parcel, the Sender — not you — is legally liable.',
      },
      {
        q: 'Can I carry medicine or healthcare products?',
        a: 'Over-the-counter medications and healthcare products (such as vitamins, paracetamol packs, plasters, and similar) in quantities consistent with personal use are generally permitted. Prescription medications require valid documentation and are subject to the import laws of the destination country.\n\nNigeria has specific prohibitions on certain medications — including codeine-based products and some opioids. Do not carry prescription medications through CarryMate without verifying that they are permitted in the destination country.',
        note: 'CarryMate\'s prohibited items check will flag prescription medications. If you believe your medication is permitted, contact support before posting.',
      },
      {
        q: 'What should a traveler do if they are unsure about a parcel?',
        a: 'If you are ever unsure whether a parcel is safe to carry — because the description seems unusual, the weight does not match, or something looks different from what was described — do not collect it. Contact CarryMate support and we will investigate. You are always within your rights to decline a parcel you are not comfortable carrying, and declining will not affect your carrier rating.',
      },
      {
        q: 'How does CarryMate screen for prohibited items?',
        a: 'When a Sender posts a parcel, our AI classifies the item description against our prohibited items database. Items that are clearly prohibited are blocked before the listing is created. Items that may require customs declaration are flagged with guidance. Parcels that trigger a higher-risk classification are reviewed by a member of our trust team before matching proceeds. Travelers are also required to physically inspect every parcel at collection and photograph it.',
      },
    ],
  },
  {
    id: 'disputes',
    icon: '⚠',
    title: 'Disputes & problems',
    items: [
      {
        q: 'What do I do if my parcel does not arrive?',
        a: 'Open a dispute in the CarryMate app immediately. Go to your parcel detail page and tap "Report a problem." We will acknowledge your dispute within 2 hours and aim to resolve it within 48 hours. Do not wait — if you wait more than 7 days after the expected delivery date to open a dispute, it may affect the outcome.',
      },
      {
        q: 'What do I do if the parcel arrives damaged?',
        a: 'Take photographs of the damage immediately and open a dispute in the app. If you purchased insurance at checkout, you can file an insurance claim through the same dispute interface. Include photos, a description of the damage, and evidence of the item\'s value (receipt or price listing). Claims must be submitted within 14 days of delivery.',
      },
      {
        q: "What if the sender's parcel contents do not match what was described?",
        a: "If you collect a parcel and notice at any point before departure that its contents differ from the description — do not carry it. Return it to the Sender and contact CarryMate support. The Sender's account will be reviewed and potentially suspended. You will be paid a partial fee for the collection if the parcel was returned due to a misdescription.\n\nIf you discover the misdescription after the fact (for example, at customs), CarryMate's indemnity clause means the Sender — not you — bears legal and financial responsibility.",
      },
      {
        q: 'How does CarryMate decide who is right in a dispute?',
        a: 'Our disputes team reviews all available evidence: parcel booking records, the description both parties agreed to, collection photos taken by the Traveler, OTP confirmation records, and any communication between the parties. We contact both parties for their account of events. Our decision is based on this evidence and is typically issued within 48 hours.\n\nOur decision is final for amounts up to £500. For larger amounts, either party may refer the matter to LCIA arbitration.',
      },
      {
        q: 'Can I leave a review for my traveler or sender?',
        a: 'Yes. After every completed delivery, you will be prompted to leave a star rating (1–5) and an optional written review. Ratings are visible on Traveler profiles and inform future matching. Senders with a history of disputes or misdescriptions may see reduced matching priority. Travelers with consistently high ratings earn higher carrier tiers and access to better parcels.',
      },
    ],
  },
  {
    id: 'account',
    icon: '👤',
    title: 'Your account',
    items: [
      {
        q: 'How do I change my registered phone number or email?',
        a: 'Go to your Profile in the app and tap "Account settings." You can update your email address from there. Changing your phone number requires re-verification with a new OTP — tap "Change phone number" and follow the steps. For security reasons, some account changes require confirmation from the existing phone number before the new one is activated.',
      },
      {
        q: 'How do I delete my account?',
        a: 'You can request account deletion by emailing privacy@carrymate.io. We will process your request within 30 days. Any pending escrow transactions will be resolved before your account is closed. We are required to retain certain transaction and identity records for up to 7 years under UK financial regulations — these will be securely deleted at the end of the required retention period.',
      },
      {
        q: 'My KYC verification was rejected — what do I do?',
        a: 'If your verification was rejected, you will receive an email explaining the reason. Common reasons include: the ID document was expired, the photo was unclear or glare-affected, or the liveness check failed. You can resubmit using the same link in the email. If you have resubmitted and are still having issues, contact support@carrymate.io and a member of our team will review your application manually.',
      },
      {
        q: 'Can I use CarryMate as both a sender and a traveler?',
        a: 'Yes. You can select "Both" when you sign up, or change your role at any time in your profile settings. If you want to start carrying parcels as a Traveler in addition to sending, you will need to complete identity verification (if you have not already done so). Both roles are available under the same account — you do not need to create separate accounts.',
      },
    ],
  },
]

function FaqItem({ q, a, note, noteLink, link }: { q: string; a: string; note?: string; noteLink?: { href: string; text: string }; link?: { href: string; text: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        border: `1px solid ${open ? 'var(--teal)' : 'var(--border)'}`,
        borderRadius: '14px',
        overflow: 'hidden',
        background: 'white',
        transition: 'border-color .2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          padding: '18px 20px',
          fontSize: '15px',
          fontWeight: 600,
          color: 'var(--ink)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'inherit',
          lineHeight: 1.4,
        }}
      >
        {q}
        <span style={{ fontSize: '12px', color: open ? 'var(--teal)' : 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0 }}>▼</span>
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.75, borderTop: '1px solid var(--border)' }}>
          {a.split('\n\n').map((para, i) => {
            if (para.startsWith('•')) {
              return (
                <ul key={i} style={{ paddingLeft: '18px', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {para.split('\n').filter(l => l.startsWith('•')).map((line, j) => (
                    <li key={j} style={{ lineHeight: 1.6 }}>{line.replace('• ', '')}</li>
                  ))}
                </ul>
              )
            }
            return <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
          })}
          {note && (
            <div style={{ background: 'var(--teal-pale)', borderRadius: '8px', padding: '12px 14px', marginTop: '10px', fontSize: '13px', color: '#0a3d2b', fontWeight: 500 }}>
              {note}{' '}
              {noteLink && <Link href={noteLink.href} style={{ color: 'var(--teal)' }}>{noteLink.text}</Link>}
            </div>
          )}
          {link && (
            <p style={{ marginTop: '8px', marginBottom: 0 }}>
              <Link href={link.href} style={{ color: 'var(--teal)', fontWeight: 500 }}>{link.text} →</Link>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <>
      <Nav />
      <main style={{ background: 'var(--cream)', color: 'var(--ink)', paddingTop: '64px' }}>
        {/* Hero */}
        <div style={{ padding: '72px 5vw 56px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '16px' }}>
            Help centre
          </div>
          <h1 className="font-serif" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '16px' }}>
            Frequently asked questions
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '0' }}>
            Everything you need to know about sending and carrying with CarryMate.
          </p>
        </div>

        {/* Layout: sidebar + content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,240px) 1fr', gap: '48px', maxWidth: '1000px', margin: '0 auto', padding: '0 5vw 96px' }}>
          {/* Sidebar */}
          <aside style={{ position: 'sticky', top: '80px', height: 'fit-content' }} className="hidden md:block">
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Categories
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {FAQ_SECTIONS.map(({ id, icon, title, items }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{ fontSize: '14px', color: 'var(--text-muted)', textDecoration: 'none', padding: '7px 12px', borderRadius: '8px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>{icon}</span>
                  {title}
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 400 }}>{items.length}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* FAQ sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
            {FAQ_SECTIONS.map(({ id, icon, title, items }) => (
              <div key={id} id={id}>
                <h2 className="font-serif" style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  {title}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {items.map((item) => (
                    <FaqItem key={item.q} {...item} />
                  ))}
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <div style={{ background: 'var(--ink)', borderRadius: '20px', padding: '36px 32px', textAlign: 'center', marginTop: '48px' }}>
              <h3 className="font-serif" style={{ fontSize: '22px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Still have a question?</h3>
              <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.6)', marginBottom: '20px' }}>Our support team is available 7 days a week and responds to all messages within 4 hours.</p>
              <a
                href="mailto:support@carrymate.io"
                style={{ background: 'var(--teal)', color: 'white', padding: '12px 24px', borderRadius: '100px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
              >
                Contact support →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
