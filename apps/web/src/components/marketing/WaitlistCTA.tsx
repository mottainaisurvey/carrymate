'use client'

import { useState } from 'react'

export function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://carrymate-staging.up.railway.app'}/api/trpc/waitlist.join`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ json: { email } }),
        }
      )
      if (res.ok) {
        setStatus('success')
        setMessage("You're on the list! We'll be in touch soon.")
        setEmail('')
      } else {
        throw new Error('Failed')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-24" style={{ background: 'var(--teal)' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="font-serif text-4xl md:text-5xl font-black mb-4 text-white">
          Join the waitlist
        </h2>
        <p className="text-lg mb-10 opacity-80 text-white">
          Be first to know when CarryMate launches in your corridor. Early members get priority access and exclusive rates.
        </p>

        {status === 'success' ? (
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-bold"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}
          >
            <span>✓</span> {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-4 rounded-full text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-7 py-4 rounded-full font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: 'white', color: 'var(--teal)' }}
            >
              {status === 'loading' ? 'Joining…' : 'Join waitlist'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="mt-3 text-sm opacity-70 text-white">{message}</p>
        )}

        <p className="mt-6 text-xs opacity-60 text-white">
          No spam, ever. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
