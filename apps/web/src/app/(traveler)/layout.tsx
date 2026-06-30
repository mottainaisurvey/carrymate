import type { ReactNode } from 'react'
import Link from 'next/link'
import { TrpcProvider } from '@/components/TrpcProvider'
import { NoSSR } from '@/components/NoSSR'

const NAV_LINKS = [
  { href: '/dashboard', label: 'My trips', icon: '✈️' },
  { href: '/trips/new', label: 'Post a trip', icon: '+' },
]

export default function TravelerLayout({ children }: { children: ReactNode }) {
  return (
    <NoSSR>
      <TrpcProvider>
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
          <header
            className="sticky top-0 z-40 border-b"
            style={{ background: 'white', borderColor: 'var(--border)' }}
          >
            <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
              <Link
                href="/dashboard"
                className="font-serif text-xl font-black"
                style={{ color: 'var(--ink)' }}
              >
                CarryMate
              </Link>
              <nav className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-[var(--warm)]"
                    style={{ color: 'var(--ink)' }}
                  >
                    <span>{link.icon}</span>
                    <span className="hidden sm:block">{link.label}</span>
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="ml-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-[var(--warm)]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Sign out
                </Link>
              </nav>
            </div>
          </header>
          <main className="max-w-5xl mx-auto px-5 py-10">{children}</main>
        </div>
      </TrpcProvider>
    </NoSSR>
  )
}
