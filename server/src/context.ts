import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { createClient } from "@supabase/supabase-js";
import { db } from "@carrymate/db/client";
import { users } from "@carrymate/db/schema";
import { eq } from "drizzle-orm";

// Lazy singleton — only created when first request arrives (avoids module-level env crash)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;
function getSupabaseAdmin() {
  if (_supabaseAdmin) return _supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL is required");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  _supabaseAdmin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  return _supabaseAdmin;
}

export type ContextUser = {
  id: string;
  authId: string;
  email: string | null;
  name: string | null;
  role: "user" | "sender" | "traveler" | "admin";
  kycStatus: "pending" | "submitted" | "verified" | "rejected";
  isBanned: boolean;
};

export type Context = {
  user: ContextUser | null;
  db: typeof db;
};

export async function createContext({ req }: CreateFastifyContextOptions): Promise<Context> {
  // Extract Bearer token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, db };
  }

  const token = authHeader.slice(7);

  try {
    // Verify token with Supabase
    const { data: { user: authUser }, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !authUser) return { user: null, db };

    // Look up our users table for role and profile
    const [dbUser] = await db
      .select({
        id: users.id,
        authId: users.authId,
        email: users.email,
        name: users.name,
        role: users.role,
        kycStatus: users.kycStatus,
        isBanned: users.isBanned,
      })
      .from(users)
      .where(eq(users.authId, authUser.id))
      .limit(1);

    if (!dbUser) return { user: null, db };

    return {
      user: {
        id: dbUser.id,
        authId: dbUser.authId ?? authUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        kycStatus: dbUser.kycStatus,
        isBanned: dbUser.isBanned,
      },
      db,
    };
  } catch {
    return { user: null, db };
  }
}
