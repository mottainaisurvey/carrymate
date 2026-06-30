import { defineConfig } from "drizzle-kit";

// DATABASE_URL is required for push/migrate/studio but NOT for generate
// (generate only reads the schema files, no live DB connection needed)
export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
  verbose: true,
  strict: true,
});
