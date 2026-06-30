import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

// Lazy singleton — only connect when the db is first accessed.
// This prevents Railway from crashing at module load time when
// DATABASE_URL is not yet injected (e.g. during build-time imports).
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  const client = postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    ssl: { rejectUnauthorized: false },
  });
  _db = drizzle(client, { schema });
  return _db;
}

// Export a Proxy so callers can use `db.select(...)` etc. without
// calling getDb() explicitly — the proxy forwards all property
// accesses to the lazily-created instance.
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type Database = typeof db;
