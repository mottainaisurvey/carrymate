import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Use vi.hoisted so mockGetUser is available before vi.mock hoisting ────────
const { mockGetUser } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
}))

// ── Mock @carrymate/db before any imports that use it ────────────────────────
vi.mock('@carrymate/db/client', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    execute: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@carrymate/db/schema', () => ({
  users: {
    id: 'id',
    authId: 'authId',
    email: 'email',
    name: 'name',
    kycStatus: 'kycStatus',
    isBanned: 'isBanned',
    role: 'role',
  },
}))

// ── Mock supabaseAdmin ────────────────────────────────────────────────────────
vi.mock('../lib/supabase.js', () => ({
  supabaseAdmin: {
    auth: {
      getUser: mockGetUser,
    },
  },
}))

// ── Mock drizzle-orm eq ───────────────────────────────────────────────────────
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((a, b) => ({ field: a, value: b })),
}))

import { createContext } from '../context.js'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeCtxOptions(authorization?: string): CreateFastifyContextOptions {
  return {
    req: { headers: { authorization } } as unknown as CreateFastifyContextOptions['req'],
    res: {} as CreateFastifyContextOptions['res'],
  }
}

// ── createContext tests ───────────────────────────────────────────────────────
describe('createContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns null user when no Authorization header', async () => {
    const ctx = await createContext(makeCtxOptions())
    expect(ctx.user).toBeNull()
  })

  it('returns null user when Authorization header is empty string', async () => {
    const ctx = await createContext(makeCtxOptions(''))
    expect(ctx.user).toBeNull()
  })

  it('returns null user when Supabase returns an error', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'invalid token' },
    })
    const ctx = await createContext(makeCtxOptions('Bearer bad-token'))
    expect(ctx.user).toBeNull()
  })

  it('returns null user when Supabase returns null user', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    })
    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user).toBeNull()
  })

  it('returns null user when no matching DB user found', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: 'auth-uuid-1', email: 'test@example.com', app_metadata: {} } },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user).toBeNull()
  })

  it('returns user with sender role from app_metadata', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'auth-uuid-2',
          email: 'sender@example.com',
          app_metadata: { user_role: 'sender' },
        },
      },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([
      { id: 'db-uuid-2', authId: 'auth-uuid-2', email: 'sender@example.com', name: 'Test Sender', kycStatus: 'pending', isBanned: false },
    ])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user).not.toBeNull()
    expect(ctx.user?.role).toBe('sender')
    expect(ctx.user?.id).toBe('db-uuid-2')
    expect(ctx.user?.email).toBe('sender@example.com')
  })

  it('returns user with traveler role from app_metadata', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'auth-uuid-3',
          email: 'traveler@example.com',
          app_metadata: { user_role: 'traveler' },
        },
      },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([
      { id: 'db-uuid-3', authId: 'auth-uuid-3', email: 'traveler@example.com', name: 'Test Traveler', kycStatus: 'verified', isBanned: false },
    ])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user?.role).toBe('traveler')
  })

  it('returns user with admin role from app_metadata', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'auth-uuid-4',
          email: 'admin@carrymate.io',
          app_metadata: { user_role: 'admin' },
        },
      },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([
      { id: 'db-uuid-4', authId: 'auth-uuid-4', email: 'admin@carrymate.io', name: 'Admin User', kycStatus: 'verified', isBanned: false },
    ])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user?.role).toBe('admin')
  })

  it('defaults role to sender when app_metadata has no user_role', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'auth-uuid-5',
          email: 'new@example.com',
          app_metadata: {},
        },
      },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([
      { id: 'db-uuid-5', authId: 'auth-uuid-5', email: 'new@example.com', name: 'New User', kycStatus: 'pending', isBanned: false },
    ])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user?.role).toBe('sender')
  })

  it('returns null user when Supabase throws an exception', async () => {
    mockGetUser.mockRejectedValueOnce(new Error('Network error'))
    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user).toBeNull()
  })

  it('always includes db in context', async () => {
    const ctx = await createContext(makeCtxOptions())
    expect(ctx.db).toBeDefined()
  })

  it('strips Bearer prefix correctly from token', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'invalid' },
    })
    await createContext(makeCtxOptions('Bearer my-jwt-token'))
    expect(mockGetUser).toHaveBeenCalledWith('my-jwt-token')
  })

  it('returns isBanned true when DB user is banned', async () => {
    mockGetUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'auth-uuid-6',
          email: 'banned@example.com',
          app_metadata: { user_role: 'sender' },
        },
      },
      error: null,
    })
    const { db } = await import('@carrymate/db/client')
    vi.mocked(db.limit).mockResolvedValueOnce([
      { id: 'db-uuid-6', authId: 'auth-uuid-6', email: 'banned@example.com', name: 'Banned User', kycStatus: 'pending', isBanned: true },
    ])

    const ctx = await createContext(makeCtxOptions('Bearer valid-token'))
    expect(ctx.user?.isBanned).toBe(true)
  })
})
