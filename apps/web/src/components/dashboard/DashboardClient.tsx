'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { SenderDashboard } from './SenderDashboard'
import { TravelerDashboard } from './TravelerDashboard'
import { TrpcProvider } from '@/components/TrpcProvider'

type UserRole = 'sender' | 'traveler' | 'admin' | 'user' | null

export default function DashboardClient() {
  const router = useRouter()
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/login')
        return
      }
      const userRole =
        (session.user.app_metadata?.user_role as UserRole) ??
        (session.user.user_metadata?.role as UserRole) ??
        'sender'
      setRole(userRole)
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--cream)' }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
          />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Loading your dashboard…
          </p>
        </div>
      </div>
    )
  }

  if (role === 'traveler') {
    return (
      <TrpcProvider>
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
          <DashboardNav role="traveler" />
          <main className="max-w-5xl mx-auto px-5 py-10">
            <TravelerDashboard />
          </main>
        </div>
      </TrpcProvider>
    )
  }

  return (
    <TrpcProvider>
      <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
        <DashboardNav role="sender" />
        <main className="max-w-5xl mx-auto px-5 py-10">
          <SenderDashboard />
        </main>
      </div>
    </TrpcProvider>
  )
}

function DashboardNav({ role }: { role: 'sender' | 'traveler' }) {
  const senderLinks = [
    { href: '/dashboard', label: 'My parcels', icon: '📦' },
    { href: '/send', label: 'Send parcel', icon: '+' },
  ]
  const travelerLinks = [
    { href: '/dashboard', label: 'My trips', icon: '✈️' },
    { href: '/trips/new', label: 'Post a trip', icon: '+' },
  ]
  const links = role === 'traveler' ? travelerLinks : senderLinks

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ background: 'white', borderColor: 'var(--border)' }}
    >
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <span className="font-serif text-xl font-black" style={{ color: 'var(--ink)' }}>
          CarryMate
        </span>
        <nav className="flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-[var(--warm)]"
              style={{ color: 'var(--ink)' }}
            >
              <span>{link.icon}</span>
              <span className="hidden sm:block">{link.label}</span>
            </a>
          ))}
          <button
            onClick={() =>
              supabase.auth.signOut().then(() => (window.location.href = '/login'))
            }
            className="ml-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-[var(--warm)]"
            style={{ color: 'var(--text-muted)' }}
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  )
}
