import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema/index.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(process.env.DATABASE_URL, {
  ssl: { rejectUnauthorized: false },
  max: 1,
});
const db = drizzle(client, { schema });

async function seed() {
  console.log("🌱 Seeding CarryMate staging database...");

  // ── Corridor Rules ─────────────────────────────────────────────────────────
  console.log("  → Seeding corridor rules...");
  await db.insert(schema.corridorRules).values([
    {
      corridorKey: "LHR-LOS",
      originCity: "London",
      originCode: "LHR",
      destCity: "Lagos",
      destCode: "LOS",
      isActive: true,
      surgeMultiplier: "1.00",
      basePricePerKg: "8.00",
      maxWeightKg: "30.00",
    },
    {
      corridorKey: "LHR-ABV",
      originCity: "London",
      originCode: "LHR",
      destCity: "Abuja",
      destCode: "ABV",
      isActive: true,
      surgeMultiplier: "1.00",
      basePricePerKg: "8.50",
      maxWeightKg: "25.00",
    },
    {
      corridorKey: "LHR-ACC",
      originCity: "London",
      originCode: "LHR",
      destCity: "Accra",
      destCode: "ACC",
      isActive: true,
      surgeMultiplier: "1.10",
      basePricePerKg: "7.50",
      maxWeightKg: "30.00",
    },
    {
      corridorKey: "LHR-NBO",
      originCity: "London",
      originCode: "LHR",
      destCity: "Nairobi",
      destCode: "NBO",
      isActive: true,
      surgeMultiplier: "1.00",
      basePricePerKg: "9.00",
      maxWeightKg: "25.00",
    },
    {
      corridorKey: "LHR-JNB",
      originCity: "London",
      originCode: "LHR",
      destCity: "Johannesburg",
      destCode: "JNB",
      isActive: true,
      surgeMultiplier: "1.00",
      basePricePerKg: "9.50",
      maxWeightKg: "30.00",
    },
    {
      corridorKey: "CDG-DKR",
      originCity: "Paris",
      originCode: "CDG",
      destCity: "Dakar",
      destCode: "DKR",
      isActive: true,
      surgeMultiplier: "1.00",
      basePricePerKg: "7.00",
      maxWeightKg: "25.00",
    },
    {
      corridorKey: "JFK-LOS",
      originCity: "New York",
      originCode: "JFK",
      destCity: "Lagos",
      destCode: "LOS",
      isActive: false,
      surgeMultiplier: "1.20",
      basePricePerKg: "10.00",
      maxWeightKg: "20.00",
    },
  ]).onConflictDoNothing();

  // ── Customs Rules ──────────────────────────────────────────────────────────
  console.log("  → Seeding customs rules...");
  await db.insert(schema.customsRules).values([
    {
      corridorKey: "LHR-LOS",
      prohibitedItems: ["firearms", "ammunition", "narcotics", "counterfeit goods", "hazardous chemicals"],
      restrictions: "Electronics over £500 require customs declaration. Food items must be commercially packaged.",
      maxValueGbp: "500.00",
      requiresDeclaration: false,
    },
    {
      corridorKey: "LHR-ABV",
      prohibitedItems: ["firearms", "ammunition", "narcotics", "counterfeit goods", "hazardous chemicals", "used clothing in bulk"],
      restrictions: "Electronics over £500 require customs declaration.",
      maxValueGbp: "500.00",
      requiresDeclaration: false,
    },
    {
      corridorKey: "LHR-ACC",
      prohibitedItems: ["firearms", "narcotics", "counterfeit goods", "pornographic material"],
      restrictions: "Medicines require prescription documentation.",
      maxValueGbp: "600.00",
      requiresDeclaration: false,
    },
    {
      corridorKey: "LHR-NBO",
      prohibitedItems: ["firearms", "narcotics", "counterfeit goods", "soil", "plants without phytosanitary certificate"],
      restrictions: "Agricultural products require phytosanitary certificate.",
      maxValueGbp: "400.00",
      requiresDeclaration: true,
    },
    {
      corridorKey: "LHR-JNB",
      prohibitedItems: ["firearms", "narcotics", "counterfeit goods", "ivory", "endangered species products"],
      restrictions: "Medicines require prescription. Declare all items over R5000.",
      maxValueGbp: "500.00",
      requiresDeclaration: false,
    },
  ]).onConflictDoNothing();

  // ── Waitlist ───────────────────────────────────────────────────────────────
  console.log("  → Seeding waitlist entries...");
  await db.insert(schema.waitlist).values([
    { email: "amara.okonkwo@gmail.com", role: "sender", name: "Amara Okonkwo", phone: "+447700900001" },
    { email: "kwame.asante@yahoo.com", role: "traveler", name: "Kwame Asante", phone: "+447700900002" },
    { email: "fatima.diallo@outlook.com", role: "both", name: "Fatima Diallo", phone: "+447700900003" },
    { email: "chidi.eze@gmail.com", role: "sender", name: "Chidi Eze", phone: "+447700900004" },
    { email: "ngozi.ibrahim@gmail.com", role: "traveler", name: "Ngozi Ibrahim", phone: "+447700900005" },
  ]).onConflictDoNothing();

  console.log("✅ Seed complete.");
  console.log("   Corridor rules: 7");
  console.log("   Customs rules: 5");
  console.log("   Waitlist entries: 5");
  console.log("");
  console.log("Note: Users, trips, parcels, bookings, payments, and disputes");
  console.log("are created through the application auth flow, not seeded.");

  await client.end();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
