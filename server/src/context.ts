import { supabaseAdmin } from './lib/supabase.js'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { db, users } from '@carrymate/db'
import { eq } from 'drizzle-orm'

export type ContextUser = {
  id: string;
  authId: string;
  email: string | null;
  name: string | null;
  role: 'sender' | 'traveler' | 'admin' | 'user';
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  isBanned: boolean;
}

export type Context = {
  user: ContextUser | null;
  db: typeof db;
}

export async function createContext({ req }: CreateFastifyContextOptions): Promise<Context> {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return { user: null, db }

  try {
    const { data: { user: authUser }, error } = await supabaseAdmin.auth.getUser(token)
    if (error || !authUser) return { user: null, db }

    // Look up our users table for profile data
    const [dbUser] = await db
      .select({
        id: users.id,
        authId: users.authId,
        email: users.email,
        name: users.name,
        kycStatus: users.kycStatus,
        isBanned: users.isBanned,
      })
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1)

    if (!dbUser) return { user: null, db }

    // Role comes from the JWT custom claim injected by the access token hook
    const role = (authUser.app_metadata?.user_role ?? 'sender') as ContextUser['role']

    return {
      user: {
        id: dbUser.id,
        authId: dbUser.authId ?? authUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role,
        kycStatus: dbUser.kycStatus,
        isBanned: dbUser.isBanned,
      },
      db,
    }
  } catch {
    return { user: null, db }
  }
}
