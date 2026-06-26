'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Role = 'sender' | 'traveler'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = (searchParams.get('role') as Role) || 'sender'

  const [role, setRole] = useState<Role>(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      })
      if (authError) throw authError
      router.push('/verify')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div
        className="rounded-3xl p-10 shadow-sm"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h1 className="font-serif text-3xl font-black mb-2" style={{ color: 'var(--ink)' }}>
          Create account
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Join the CarryMate community
        </p>

        {/* Role toggle */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ background: 'var(--warm)' }}
        >
          {(['sender', 'traveler'] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all capitalize"
              style={
                role === r
                  ? { background: 'var(--teal)', color: 'white' }
                  : { color: 'var(--text-muted)' }
              }
            >
              {r === 'sender' ? '📦 Sender' : '✈️ Traveler'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--warm)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--warm)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--warm)',
                border: '1px solid var(--border)',
                color: 'var(--ink)',
              }}
            />
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl"
              style={{ background: 'rgba(192,74,42,0.08)', color: 'var(--rust)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-bold hover:underline" style={{ color: 'var(--teal)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
