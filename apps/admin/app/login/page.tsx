'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        <div className="text-center mb-8">
          <div className="font-mono text-[22px] font-medium text-[#e6e2da] mb-1">
            Carry<span className="text-[#1d9e75]">Mate</span>
          </div>
          <div className="text-xs text-[#7a8699] tracking-[0.08em] uppercase">Super Admin Console</div>
        </div>

        <div className="bg-[#161b22] border border-[#2a3444] rounded-[12px] p-6">
          <div className="text-[13px] font-semibold text-[#e6e2da] mb-4">Sign in</div>
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-[11px] text-[#7a8699] block mb-1.5">Email</label>
              <input
                type="email"
                className="w-full bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] placeholder-[#7a8699] px-3 py-2 rounded-md text-xs outline-none focus:border-[#1d9e75]"
                placeholder="admin@carrymate.io"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-[11px] text-[#7a8699] block mb-1.5">Password</label>
              <input
                type="password"
                className="w-full bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] placeholder-[#7a8699] px-3 py-2 rounded-md text-xs outline-none focus:border-[#1d9e75]"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-[11px] text-[#ef4444] bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1d9e75] text-white py-2 rounded-md text-xs font-semibold cursor-pointer disabled:opacity-60 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 text-[11px] text-[#7a8699]">
          Admin access only. Unauthorised access is prohibited.
        </div>
      </div>
    </div>
  )
}
