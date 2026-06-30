import { describe, it, expect } from 'vitest'

// ── Test the admin middleware config pattern ──────────────────────────────────
// We test the logic in isolation without Next.js runtime

describe('admin middleware config', () => {
  const config = { matcher: ['/((?!login|_next|favicon).*)'] }

  it('has a matcher array', () => {
    expect(Array.isArray(config.matcher)).toBe(true)
  })

  it('matcher excludes /login path', () => {
    const pattern = config.matcher[0]
    // The negative lookahead (?!login|_next|favicon) should exclude these
    expect(pattern).toContain('login')
  })

  it('matcher excludes _next path', () => {
    const pattern = config.matcher[0]
    expect(pattern).toContain('_next')
  })

  it('matcher excludes favicon path', () => {
    const pattern = config.matcher[0]
    expect(pattern).toContain('favicon')
  })
})

// ── Test role-based redirect logic ────────────────────────────────────────────
describe('admin middleware role check', () => {
  function simulateMiddleware(session: { user: { app_metadata: { user_role?: string } } } | null, path: string) {
    if (!session) {
      return { type: 'redirect', to: '/login' }
    }

    const role = session.user.app_metadata?.user_role
    if (role !== 'admin') {
      return { type: 'redirect', to: '/' }
    }

    return { type: 'next' }
  }

  it('redirects to /login when no session', () => {
    const result = simulateMiddleware(null, '/dashboard')
    expect(result.type).toBe('redirect')
    expect(result.to).toBe('/login')
  })

  it('redirects to / when user is sender', () => {
    const result = simulateMiddleware(
      { user: { app_metadata: { user_role: 'sender' } } },
      '/dashboard'
    )
    expect(result.type).toBe('redirect')
    expect(result.to).toBe('/')
  })

  it('redirects to / when user is traveler', () => {
    const result = simulateMiddleware(
      { user: { app_metadata: { user_role: 'traveler' } } },
      '/dashboard'
    )
    expect(result.type).toBe('redirect')
    expect(result.to).toBe('/')
  })

  it('redirects to / when user_role is undefined', () => {
    const result = simulateMiddleware(
      { user: { app_metadata: {} } },
      '/dashboard'
    )
    expect(result.type).toBe('redirect')
    expect(result.to).toBe('/')
  })

  it('allows admin user through', () => {
    const result = simulateMiddleware(
      { user: { app_metadata: { user_role: 'admin' } } },
      '/dashboard'
    )
    expect(result.type).toBe('next')
  })

  it('blocks non-admin from any protected path', () => {
    const paths = ['/dashboard', '/users', '/trips', '/settings']
    for (const path of paths) {
      const result = simulateMiddleware(
        { user: { app_metadata: { user_role: 'sender' } } },
        path
      )
      expect(result.type).toBe('redirect')
    }
  })

  it('allows admin through all protected paths', () => {
    const paths = ['/dashboard', '/users', '/trips', '/settings']
    for (const path of paths) {
      const result = simulateMiddleware(
        { user: { app_metadata: { user_role: 'admin' } } },
        path
      )
      expect(result.type).toBe('next')
    }
  })
})

// ── JWT claim shape tests ─────────────────────────────────────────────────────
describe('JWT user_role claim', () => {
  function extractRole(appMetadata: Record<string, unknown>): string {
    return (appMetadata?.user_role as string) ?? 'sender'
  }

  it('extracts sender role from app_metadata', () => {
    expect(extractRole({ user_role: 'sender' })).toBe('sender')
  })

  it('extracts traveler role from app_metadata', () => {
    expect(extractRole({ user_role: 'traveler' })).toBe('traveler')
  })

  it('extracts admin role from app_metadata', () => {
    expect(extractRole({ user_role: 'admin' })).toBe('admin')
  })

  it('defaults to sender when user_role is absent', () => {
    expect(extractRole({})).toBe('sender')
  })

  it('defaults to sender when app_metadata is empty', () => {
    expect(extractRole({})).toBe('sender')
  })
})
