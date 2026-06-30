'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,18,8,0.08)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-black" style={{ color: 'var(--ink)' }}>
          Carry<span style={{ color: '#1d7a5f' }}>Mate</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {([
            { label: 'How it works', href: '/how-it-works' },
            { label: 'Routes', href: '/corridors' },
            { label: 'Trust', href: '/trust' },
            { label: 'Earn', href: '/how-it-works#traveler' },
          ] as { label: string; href: string }[]).map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: 'var(--ink)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium px-4 py-2 rounded-full transition-all hover:opacity-70"
            style={{ color: 'var(--ink)' }}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-bold px-5 py-2.5 rounded-full transition-all hover:opacity-90"
            style={{ background: 'var(--ink)', color: 'var(--cream)' }}
          >
            Get early access
          </Link>
        </div>
      </div>
    </nav>
  )
}
