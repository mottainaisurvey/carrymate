import { describe, it, expect, vi } from 'vitest'
import { initTRPC, TRPCError } from '@trpc/server'

// ── Minimal context type for testing ─────────────────────────────────────────
type TestUser = {
  id: string
  authId: string
  email: string | null
  name: string | null
  role: 'sender' | 'traveler' | 'admin' | 'user'
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected'
  isBanned: boolean
}

type TestContext = {
  user: TestUser | null
  db: Record<string, unknown>
}

// ── Build a local tRPC instance mirroring the real one ────────────────────────
const t = initTRPC.context<TestContext>().create()

const publicProcedure = t.procedure

const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Authentication required' })
  }
  if (ctx.user.isBanned) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Account is suspended' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Admin access required' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

// ── Test router ───────────────────────────────────────────────────────────────
const testRouter = t.router({
  public: publicProcedure.query(() => ({ ok: true })),
  protected: protectedProcedure.query(({ ctx }) => ({ userId: ctx.user.id })),
  admin: adminProcedure.query(({ ctx }) => ({ adminId: ctx.user.id })),
})

// ── Helper to call a procedure ────────────────────────────────────────────────
async function callProcedure(
  path: 'public' | 'protected' | 'admin',
  ctx: TestContext
) {
  const caller = testRouter.createCaller(ctx)
  return caller[path]()
}

const mockDb = {} as Record<string, unknown>

const senderUser: TestUser = {
  id: 'user-1',
  authId: 'auth-1',
  email: 'sender@test.com',
  name: 'Sender',
  role: 'sender',
  kycStatus: 'pending',
  isBanned: false,
}

const adminUser: TestUser = {
  id: 'admin-1',
  authId: 'auth-admin',
  email: 'admin@carrymate.io',
  name: 'Admin',
  role: 'admin',
  kycStatus: 'verified',
  isBanned: false,
}

const bannedUser: TestUser = {
  ...senderUser,
  id: 'user-banned',
  isBanned: true,
}

const travelerUser: TestUser = {
  id: 'user-2',
  authId: 'auth-2',
  email: 'traveler@test.com',
  name: 'Traveler',
  role: 'traveler',
  kycStatus: 'verified',
  isBanned: false,
}

// ── publicProcedure tests ─────────────────────────────────────────────────────
describe('publicProcedure', () => {
  it('succeeds with no user (unauthenticated)', async () => {
    const result = await callProcedure('public', { user: null, db: mockDb })
    expect(result).toEqual({ ok: true })
  })

  it('succeeds with authenticated sender', async () => {
    const result = await callProcedure('public', { user: senderUser, db: mockDb })
    expect(result).toEqual({ ok: true })
  })

  it('succeeds with authenticated admin', async () => {
    const result = await callProcedure('public', { user: adminUser, db: mockDb })
    expect(result).toEqual({ ok: true })
  })
})

// ── protectedProcedure tests ──────────────────────────────────────────────────
describe('protectedProcedure', () => {
  it('throws UNAUTHORIZED when user is null', async () => {
    await expect(callProcedure('protected', { user: null, db: mockDb }))
      .rejects.toThrow(TRPCError)
  })

  it('throws UNAUTHORIZED with correct code when no user', async () => {
    try {
      await callProcedure('protected', { user: null, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('UNAUTHORIZED')
    }
  })

  it('throws UNAUTHORIZED with correct message when no user', async () => {
    try {
      await callProcedure('protected', { user: null, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect((e as TRPCError).message).toBe('Authentication required')
    }
  })

  it('throws FORBIDDEN when user is banned', async () => {
    try {
      await callProcedure('protected', { user: bannedUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('FORBIDDEN')
    }
  })

  it('throws FORBIDDEN with correct message when banned', async () => {
    try {
      await callProcedure('protected', { user: bannedUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect((e as TRPCError).message).toBe('Account is suspended')
    }
  })

  it('succeeds with valid sender user', async () => {
    const result = await callProcedure('protected', { user: senderUser, db: mockDb })
    expect(result).toEqual({ userId: 'user-1' })
  })

  it('succeeds with valid traveler user', async () => {
    const result = await callProcedure('protected', { user: travelerUser, db: mockDb })
    expect(result).toEqual({ userId: 'user-2' })
  })

  it('succeeds with valid admin user', async () => {
    const result = await callProcedure('protected', { user: adminUser, db: mockDb })
    expect(result).toEqual({ userId: 'admin-1' })
  })

  it('injects user into context for downstream use', async () => {
    const result = (await callProcedure('protected', { user: senderUser, db: mockDb })) as { userId: string }
    expect(result.userId).toBe(senderUser.id)
  })
})

// ── adminProcedure tests ──────────────────────────────────────────────────────
describe('adminProcedure', () => {
  it('throws UNAUTHORIZED when user is null', async () => {
    try {
      await callProcedure('admin', { user: null, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('UNAUTHORIZED')
    }
  })

  it('throws UNAUTHORIZED when user is sender', async () => {
    try {
      await callProcedure('admin', { user: senderUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('UNAUTHORIZED')
    }
  })

  it('throws UNAUTHORIZED when user is traveler', async () => {
    try {
      await callProcedure('admin', { user: travelerUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('UNAUTHORIZED')
    }
  })

  it('throws UNAUTHORIZED with correct message for non-admin', async () => {
    try {
      await callProcedure('admin', { user: senderUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect((e as TRPCError).message).toBe('Admin access required')
    }
  })

  it('throws UNAUTHORIZED (not FORBIDDEN) for non-admin', async () => {
    try {
      await callProcedure('admin', { user: senderUser, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect((e as TRPCError).code).not.toBe('FORBIDDEN')
      expect((e as TRPCError).code).toBe('UNAUTHORIZED')
    }
  })

  it('throws FORBIDDEN when admin user is banned (protectedProcedure catches first)', async () => {
    const bannedAdmin = { ...adminUser, isBanned: true }
    try {
      await callProcedure('admin', { user: bannedAdmin, db: mockDb })
      expect.fail('Should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(TRPCError)
      expect((e as TRPCError).code).toBe('FORBIDDEN')
    }
  })

  it('succeeds with admin user', async () => {
    const result = await callProcedure('admin', { user: adminUser, db: mockDb })
    expect(result).toEqual({ adminId: 'admin-1' })
  })

  it('injects admin user into context', async () => {
    const result = (await callProcedure('admin', { user: adminUser, db: mockDb })) as { adminId: string }
    expect(result.adminId).toBe(adminUser.id)
  })
})

// ── Role hierarchy tests ──────────────────────────────────────────────────────
describe('role hierarchy', () => {
  const roles: TestUser['role'][] = ['sender', 'traveler', 'user']

  for (const role of roles) {
    it(`blocks ${role} from adminProcedure`, async () => {
      const user: TestUser = { ...senderUser, role }
      try {
        await callProcedure('admin', { user, db: mockDb })
        expect.fail('Should have thrown')
      } catch (e) {
        expect((e as TRPCError).code).toBe('UNAUTHORIZED')
      }
    })
  }

  it('only admin role passes adminProcedure', async () => {
    const result = await callProcedure('admin', { user: adminUser, db: mockDb })
    expect(result).toBeDefined()
  })
})
