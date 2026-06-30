import type { Metadata } from 'next'
import Link from 'next/link'
import { Nav } from '@/components/marketing/Nav'
import { Footer } from '@/components/marketing/Footer'

export const metadata: Metadata = {
  title: 'Terms of Service — CarryMate',
  description: 'Read the CarryMate Terms of Service. Understand your rights and obligations as a sender or traveler on the CarryMate platform.',
}

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <div style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <span>Effective date: 1 July 2026</span>
            <span>Last updated: 27 June 2026</span>
            <span>Version 1.0</span>
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
                ['#s1', 'Who we are and what CarryMate does'],
                ['#s2', 'Accepting these terms'],
                ['#s3', 'Your account'],
                ['#s4', 'The CarryMate platform'],
                ['#s5', 'Sender obligations'],
                ['#s6', 'Traveler obligations'],
                ['#s7', 'Prohibited items'],
                ['#s8', 'Payments and escrow'],
                ['#s9', 'Insurance'],
                ['#s10', 'Customs and legal compliance'],
                ['#s11', 'Disputes'],
                ['#s12', 'Liability and indemnification'],
                ['#s13', 'Termination'],
                ['#s14', 'Governing law'],
                ['#s15', 'Changes to these terms'],
                ['#s16', 'Contact us'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ fontSize: '14px', color: 'var(--teal)', textDecoration: 'none', fontWeight: 500 }}>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Highlight notice */}
          <div style={{ background: 'var(--teal-pale)', borderLeft: '3px solid var(--teal)', borderRadius: '0 10px 10px 0', padding: '16px 20px', margin: '20px 0 40px', fontSize: '14px', color: '#0a3d2b', fontWeight: 500 }}>
            Please read these terms carefully before using CarryMate. By creating an account or using our services you agree to be bound by them. If you do not agree, do not use CarryMate.
          </div>

          <Section id="s1" num="01" title="Who we are and what CarryMate does">
            <p>CarryMate Ltd ("CarryMate", "we", "us", "our") is a private limited company registered in England and Wales. We operate a technology platform — accessible via our website at carrymate.io and our mobile applications — that connects people who want to send parcels ("Senders") with people who are travelling and have available luggage space ("Travelers").</p>
            <p>CarryMate is a technology intermediary only. We do not own, possess, transport, or take legal title to any parcel at any point. We are not a courier, freight forwarder, shipping company, or customs agent. The contract for the physical delivery of any parcel is formed directly between the Sender and the Traveler.</p>
            <p>Our role is to provide the platform, facilitate the connection, hold payments in escrow, verify identities, and provide information to support safe and compliant deliveries.</p>
          </Section>

          <Section id="s2" num="02" title="Accepting these terms">
            <p>By registering for a CarryMate account, posting a parcel, posting a trip, or making or receiving any payment through CarryMate, you confirm that:</p>
            <ul>
              <li>You are at least 18 years old</li>
              <li>You have the legal capacity to enter into a binding contract</li>
              <li>You are not subject to any sanctions or on any prohibited persons list</li>
              <li>All information you provide to us is accurate and complete</li>
              <li>You have read, understood, and agree to these Terms of Service, our Privacy Policy, and our Acceptable Use Policy</li>
            </ul>
            <p>If you are using CarryMate on behalf of a business, you confirm that you have authority to bind that business to these terms.</p>
          </Section>

          <Section id="s3" num="03" title="Your account">
            <p>You must register for an account to use CarryMate. You are responsible for maintaining the confidentiality of your login credentials and for all activity that takes place under your account.</p>
            <p>You must complete our identity verification process before you can post a trip or accept parcels as a Traveler. This involves providing a valid government-issued photo ID, completing a liveness check, and in some cases additional verification steps. We use a third-party KYC provider to carry out these checks.</p>
            <p>You must not create more than one CarryMate account, share your account with any other person, or transfer your account to another person.</p>
            <p>We reserve the right to suspend or terminate your account if we have reason to believe that your account information is false or misleading, that you have violated these terms, or that continuing your access poses a risk to other users or to the platform.</p>
          </Section>

          <Section id="s4" num="04" title="The CarryMate platform">
            <p>CarryMate provides technology that enables Senders and Travelers to find each other, agree delivery terms, and complete transactions safely. Specifically, we provide:</p>
            <ul>
              <li>Matching technology that pairs parcel listings with available trip listings</li>
              <li>Identity verification for Travelers</li>
              <li>An escrow payment system that holds funds until delivery is confirmed</li>
              <li>A one-time password (OTP) confirmation system for parcel pickup and delivery</li>
              <li>A per-corridor customs intelligence guide</li>
              <li>A rating and review system</li>
              <li>A dispute resolution process</li>
            </ul>
            <p>We do not guarantee that a match will be found for any given parcel listing, that any delivery will be completed within any particular timeframe, or that any Traveler will complete a delivery they have accepted. Our role ends at the point of providing the technology — the delivery itself is the responsibility of the Traveler.</p>
          </Section>

          <Section id="s5" num="05" title="Sender obligations">
            <p>As a Sender, you agree that:</p>
            <ul>
              <li>The description of your parcel and its contents is accurate and complete. You must not misrepresent the nature, value, or contents of any parcel.</li>
              <li>The declared value of your parcel reflects its true market value.</li>
              <li>Your parcel does not contain any prohibited items as listed in Section 7.</li>
              <li>You will package your parcel securely and appropriately for transport in checked or carry-on luggage.</li>
              <li>You will meet the Traveler at the agreed location and time to hand over the parcel, and provide the correct pickup OTP.</li>
              <li>You are solely responsible for any consequences arising from inaccurate or false descriptions of parcel contents, including customs seizure, fines, or legal proceedings against the Traveler.</li>
            </ul>
            <Warning>You indemnify CarryMate and the Traveler against all losses, costs, claims, and proceedings arising from any inaccuracy or misrepresentation in your parcel description. This includes customs duties, fines, legal fees, and any compensation the Traveler is required to pay as a result of carrying goods you described inaccurately.</Warning>
          </Section>

          <Section id="s6" num="06" title="Traveler obligations">
            <p>As a Traveler, you are an independent contractor. You are not an employee, agent, or representative of CarryMate. You set your own routes, availability, and prices. You are free to use other platforms simultaneously. You are responsible for your own taxes on earnings received through CarryMate.</p>
            <p>As a Traveler, you agree that:</p>
            <ul>
              <li>You will only accept parcels whose contents you have physically inspected and that match the sender's description.</li>
              <li>You will photograph each parcel at pickup using the CarryMate app. This creates a timestamped record.</li>
              <li>You will consult CarryMate's customs guide for your specific corridor before accepting any parcel.</li>
              <li>You will not carry any item that you know or suspect to be prohibited or restricted under the customs rules of any country on your itinerary.</li>
              <li>You are personally responsible for all customs declarations and compliance with the laws of every country you enter.</li>
              <li>You will make reasonable efforts to deliver parcels within the agreed timeframe.</li>
            </ul>
            <Highlight>CarryMate is not liable for any customs seizure, fine, detention, or legal proceeding arising from goods you carry. The customs intelligence guide we provide is for informational purposes only and does not constitute legal or customs advice. If in doubt, do not carry the parcel.</Highlight>
          </Section>

          <Section id="s7" num="07" title="Prohibited items">
            <p>The following items may never be listed on CarryMate or carried by any Traveler under any circumstances:</p>
            <ul>
              <li>Cash, monetary instruments, or bearer instruments of any kind</li>
              <li>Firearms, ammunition, weapons, or replicas of any of the above</li>
              <li>Narcotics, controlled substances, or any illegal drugs</li>
              <li>Prescription pharmaceuticals (unless accompanied by valid prescription documentation and permitted under the laws of all countries on the itinerary)</li>
              <li>Live animals or birds</li>
              <li>Fresh, perishable, or unpackaged food (dried, sealed, and commercially packaged food may be permitted — check the customs guide for your corridor)</li>
              <li>Counterfeit goods or goods that infringe any intellectual property right</li>
              <li>Any item that is illegal to import, export, possess, or transfer under the laws of any country on the itinerary</li>
              <li>Any item classified as dangerous goods under IATA regulations</li>
            </ul>
            <p>CarryMate uses automated screening to identify potentially prohibited items. Listings flagged by our system will be reviewed before matching proceeds. We reserve the right to cancel any listing and refund the Sender if we determine that a parcel contains or is likely to contain a prohibited item.</p>
            <Warning>Attempting to send a prohibited item through CarryMate is grounds for immediate and permanent account termination and may result in your details being shared with relevant law enforcement or customs authorities.</Warning>
          </Section>

          <Section id="s8" num="08" title="Payments and escrow">
            <p>When a Sender confirms a match and proceeds to payment, the full agreed delivery fee is held in escrow by our licensed payment processor (Stripe for GBP/EUR transactions, Paystack for NGN/GHS transactions). Funds held in escrow are not accessible to CarryMate for operational purposes — they are held in a regulated client money account on your behalf.</p>
            <p>Escrow funds are released to the Traveler only when both of the following conditions are met:</p>
            <ul>
              <li>The Traveler has confirmed pickup by entering the Sender's OTP into the CarryMate app</li>
              <li>The recipient has confirmed delivery by entering the delivery OTP provided by CarryMate</li>
            </ul>
            <p>If delivery is not confirmed within 72 hours of the scheduled delivery date, CarryMate may intervene, open a dispute, or issue a refund at its discretion. CarryMate's platform fee (currently 12–18% of the delivery fee, as displayed at checkout) is deducted from the escrow amount before the Traveler payout is calculated. The platform fee is non-refundable in cases where the Sender is found to be at fault.</p>
            <p>Traveler payouts are processed within 3–5 business days of escrow release. Payouts are made to the bank account or mobile money account registered on your profile.</p>
          </Section>

          <Section id="s9" num="09" title="Insurance">
            <p>Senders may purchase optional parcel insurance at checkout. Insurance covers the declared value of the parcel (up to £200 per parcel, or the declared value if lower) against loss or damage in transit. Insurance does not cover:</p>
            <ul>
              <li>Items that were prohibited or misdescribed by the Sender</li>
              <li>Consequential losses of any kind</li>
              <li>Parcels where the Sender cannot provide proof of the item's value</li>
            </ul>
            <p>CarryMate acts as an introducer for the insurance product. The insurance contract is between you and the insurer. Claims must be submitted within 14 days of the expected delivery date. CarryMate will provide the insurer with relevant delivery records to support your claim.</p>
          </Section>

          <Section id="s10" num="10" title="Customs and legal compliance">
            <p>Each Traveler is solely responsible for compliance with the customs laws of every country they enter, including all declaration requirements, duty payments, and import restrictions. CarryMate's customs intelligence guide is provided for general informational purposes only. It is not legal advice and may not reflect the most current rules for your specific corridor.</p>
            <p>Customs thresholds, prohibited items lists, and declaration requirements change frequently. We recommend verifying the current rules with the relevant customs authority before every trip. The key customs thresholds for our primary corridors are available in the app's customs guide, but you must not rely on them as your sole source of guidance.</p>
            <p>If a Traveler is stopped at customs as a result of carrying a parcel booked through CarryMate, they must contact CarryMate support immediately. We will provide all relevant documentation (parcel photos, booking records, sender declarations) to support the Traveler's position. However, CarryMate is not liable for any customs duty, fine, penalty, or detention.</p>
          </Section>

          <Section id="s11" num="11" title="Disputes">
            <p>If something goes wrong with a delivery, either party may open a dispute through the CarryMate app. We will acknowledge all disputes within 2 hours and aim to resolve them within 48 hours.</p>
            <p>Our dispute resolution process includes:</p>
            <ul>
              <li>Reviewing all available evidence, including parcel photos, OTP records, booking history, and communication between the parties</li>
              <li>Contacting both the Sender and Traveler to gather additional information</li>
              <li>Issuing a decision and, where appropriate, releasing or refunding the escrow amount</li>
            </ul>
            <p>CarryMate's dispute decision is final for amounts up to £500. For disputes involving larger amounts, either party may refer the matter to arbitration under the London Court of International Arbitration (LCIA) rules. Both parties agree to submit to arbitration as the exclusive dispute resolution mechanism and waive any right to bring a claim in court except to enforce an arbitration award.</p>
          </Section>

          <Section id="s12" num="12" title="Liability and indemnification">
            <p>CarryMate's total liability to you for any claim arising out of or in connection with your use of the platform is limited to the greater of: (a) the platform fee paid by you in the transaction giving rise to the claim; or (b) £50.</p>
            <p>CarryMate is not liable for any indirect, consequential, special, or exemplary damages, including loss of profit, loss of data, or loss of goodwill, even if we have been advised of the possibility of such damages.</p>
            <p>You agree to indemnify and hold harmless CarryMate, its directors, officers, employees, and agents from and against any claims, losses, damages, costs, and expenses (including legal fees) arising from: (a) your breach of these terms; (b) your violation of any law or the rights of any third party; or (c) any inaccuracy in information you have provided to CarryMate or to another user.</p>
          </Section>

          <Section id="s13" num="13" title="Termination">
            <p>You may close your account at any time by contacting us at <a href="mailto:legal@carrymate.io" style={{ color: 'var(--teal)' }}>legal@carrymate.io</a>. We will process your request within 30 days. Any pending escrow transactions will be resolved before your account is closed.</p>
            <p>We may suspend or terminate your account immediately and without notice if: you breach these terms; you engage in fraudulent, abusive, or illegal activity; we are required to do so by law or a regulatory authority; or we determine that your continued access poses a risk to other users or to the platform.</p>
            <p>On termination, your right to use CarryMate ceases immediately. Sections 5, 6, 10, 11, 12, and 14 of these terms survive termination.</p>
          </Section>

          <Section id="s14" num="14" title="Governing law">
            <p>These terms are governed by the laws of England and Wales. Subject to the arbitration clause in Section 11, both parties submit to the exclusive jurisdiction of the courts of England and Wales for any matter not subject to arbitration.</p>
          </Section>

          <Section id="s15" num="15" title="Changes to these terms">
            <p>We may update these terms from time to time. We will notify you of material changes by email and by displaying a notice in the CarryMate app at least 14 days before the changes take effect. Your continued use of CarryMate after the effective date of any change constitutes your acceptance of the updated terms.</p>
            <p>If you do not accept an update to these terms, you must stop using CarryMate and close your account before the effective date of the change.</p>
          </Section>

          <Section id="s16" num="16" title="Contact us">
            <div style={{ background: 'var(--warm)', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px 32px', marginTop: '48px' }}>
              <h3 className="font-serif" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Get in touch</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                For legal or compliance enquiries: <a href="mailto:legal@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>legal@carrymate.io</a>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                For general support: <a href="mailto:support@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>support@carrymate.io</a>
              </p>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>By post: CarryMate Ltd, London, United Kingdom</p>
              <p style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                CarryMate Ltd is registered in England and Wales. Data Protection Officer: <a href="mailto:dpo@carrymate.io" style={{ color: 'var(--teal)' }}>dpo@carrymate.io</a>
              </p>
            </div>
          </Section>

          {/* Legal cross-links */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
            <Link href="/legal/privacy" style={{ color: 'var(--teal)', fontWeight: 500 }}>Privacy Policy</Link>
            <Link href="/legal/cookies" style={{ color: 'var(--teal)', fontWeight: 500 }}>Cookie Policy</Link>
            <a href="mailto:legal@carrymate.io" style={{ color: 'var(--teal)', fontWeight: 500 }}>legal@carrymate.io</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

// ── Shared sub-components ──────────────────────────────────────────────────

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
      <div
        style={{
          fontSize: '15px',
          lineHeight: 1.75,
        }}
        className="legal-section-body"
      >
        {children}
      </div>
    </div>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--teal-pale)',
        borderLeft: '3px solid var(--teal)',
        borderRadius: '0 10px 10px 0',
        padding: '16px 20px',
        margin: '20px 0',
        fontSize: '14px',
        color: '#0a3d2b',
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  )
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fceee8',
        borderLeft: '3px solid #c04a2a',
        borderRadius: '0 10px 10px 0',
        padding: '16px 20px',
        margin: '20px 0',
        fontSize: '14px',
        color: '#7a2a16',
        fontWeight: 500,
      }}
    >
      {children}
    </div>
  )
}
