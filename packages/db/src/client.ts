import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Use connection pooling URL for application queries
// Use direct URL for migrations (drizzle-kit)
const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(client, { schema });

export type Database = typeof db;
