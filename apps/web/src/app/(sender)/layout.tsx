'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/sender/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/sender/send', label: 'Send parcel', icon: '📦' },
]

export default function SenderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 border-b"
        style={{ background: 'white', borderColor: 'var(--border)' }}
      >
        <Link href="/" className="font-serif text-lg font-black" style={{ color: 'var(--ink)' }}>
          Carry<span style={{ color: 'var(--teal)' }}>Mate</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                pathname.startsWith(item.href)
                  ? { background: 'var(--teal-pale)', color: 'var(--teal)' }
                  : { color: 'var(--text-muted)' }
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="text-sm font-medium px-4 py-2 rounded-xl transition-all hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
