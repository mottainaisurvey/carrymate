import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CarryMate — Diaspora Logistics Marketplace',
  description:
    'Send parcels home with trusted travelers. Peer-to-peer delivery for the diaspora.',
  openGraph: {
    title: 'CarryMate — Diaspora Logistics Marketplace',
    description: 'Community-powered parcel delivery connecting senders and travelers across 6 corridors.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
