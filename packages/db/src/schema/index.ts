import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  unique,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ─── ENUMS ────────────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["user", "sender", "traveler", "admin"]);
export const carrierTierEnum = pgEnum("carrier_tier", ["bronze", "silver", "gold", "platinum"]);
export const kycStatusEnum = pgEnum("kyc_status", ["pending", "submitted", "verified", "rejected"]);
export const tripStatusEnum = pgEnum("trip_status", ["open", "full", "completed", "cancelled"]);
export const parcelStatusEnum = pgEnum("parcel_status", [
  "pending", "matched", "booked", "collected", "in_transit", "delivered", "cancelled",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending", "confirmed", "collected", "in_transit", "delivered", "disputed", "cancelled",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending", "held", "released", "refunded", "failed",
]);
export const waitlistRoleEnum = pgEnum("waitlist_role", ["sender", "traveler", "both"]);
export const disputeStatusEnum = pgEnum("dispute_status", [
  "open", "investigating", "resolved", "closed",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "booking_created", "booking_confirmed", "booking_accepted",
  "collection_verified", "delivery_confirmed", "dispute_raised",
  "new_message", "review_received",
]);
export const reviewDirectionEnum = pgEnum("review_direction", [
  "sender_to_traveler", "traveler_to_sender",
]);

// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // authId links to Supabase auth.users.id
  authId: uuid("auth_id").unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  avatar: text("avatar"),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  carrierTier: carrierTierEnum("carrier_tier").default("bronze"),
  completedDeliveries: integer("completed_deliveries").default(0).notNull(),
  averageRating: numeric("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalRatings: integer("total_ratings").default(0).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isBanned: boolean("is_banned").default(false).notNull(),
  suspendedAt: timestamp("suspended_at", { withTimezone: true }),
  suspendReason: text("suspend_reason"),
  kycStatus: kycStatusEnum("kyc_status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
  pushToken: text("push_token"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── KYC SUBMISSIONS ─────────────────────────────────────────────────────────
export const kycSubmissions = pgTable('kyc_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  provider: text('provider').notNull().default('sumsub'),
  applicantId: text('applicant_id'),
  status: text('status').notNull().default('pending'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type KycSubmission = typeof kycSubmissions.$inferSelect;
export type InsertKycSubmission = typeof kycSubmissions.$inferInsert;

// ─── TRIPS ────────────────────────────────────────────────────────────────────
export const trips = pgTable("trips", {
  id: uuid("id").primaryKey().defaultRandom(),
  travelerId: uuid("traveler_id").notNull().references(() => users.id),
  originCity: varchar("origin_city", { length: 100 }).notNull(),
  originCode: varchar("origin_code", { length: 10 }).notNull(),
  destCity: varchar("dest_city", { length: 100 }).notNull(),
  destCode: varchar("dest_code", { length: 10 }).notNull(),
  departureDate: timestamp("departure_date", { withTimezone: true }).notNull(),
  availableKg: numeric("available_kg", { precision: 5, scale: 2 }).notNull(),
  remainingKg: numeric("remaining_kg", { precision: 5, scale: 2 }).notNull(),
  pricePerKg: numeric("price_per_kg", { precision: 8, scale: 2 }).notNull(),
  notes: text("notes"),
  status: tripStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;

// ─── PARCELS ──────────────────────────────────────────────────────────────────
export const parcels = pgTable("parcels", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  originCity: varchar("origin_city", { length: 100 }).notNull(),
  originCode: varchar("origin_code", { length: 10 }).notNull(),
  destCity: varchar("dest_city", { length: 100 }).notNull(),
  destCode: varchar("dest_code", { length: 10 }).notNull(),
  weightKg: numeric("weight_kg", { precision: 5, scale: 2 }).notNull(),
  contents: text("contents").notNull(),
  recipientName: varchar("recipient_name", { length: 200 }).notNull(),
  recipientPhone: varchar("recipient_phone", { length: 32 }).notNull(),
  recipientAddress: text("recipient_address"),
  isCustomsSafe: boolean("is_customs_safe").default(true).notNull(),
  notes: text("notes"),
  status: parcelStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Parcel = typeof parcels.$inferSelect;
export type InsertParcel = typeof parcels.$inferInsert;

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  parcelId: uuid("parcel_id").notNull().references(() => parcels.id),
  tripId: uuid("trip_id").notNull().references(() => trips.id),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  travelerId: uuid("traveler_id").notNull().references(() => users.id),
  agreedPrice: numeric("agreed_price", { precision: 8, scale: 2 }).notNull(),
  serviceFee: numeric("service_fee", { precision: 8, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 8, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").default("pending").notNull(),
  collectionOtp: varchar("collection_otp", { length: 6 }),
  deliveryOtp: varchar("delivery_otp", { length: 6 }),
  collectionVerifiedAt: timestamp("collection_verified_at", { withTimezone: true }),
  deliveryVerifiedAt: timestamp("delivery_verified_at", { withTimezone: true }),
  travelerRating: integer("traveler_rating"),
  travelerReview: text("traveler_review"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ─── PAYMENTS ─────────────────────────────────────────────────────────────────
export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  travelerId: uuid("traveler_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 8, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("gbp").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeTransferId: varchar("stripe_transfer_id", { length: 255 }),
  status: paymentStatusEnum("status").default("pending").notNull(),
  heldAt: timestamp("held_at", { withTimezone: true }),
  releasedAt: timestamp("released_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─── WAITLIST ─────────────────────────────────────────────────────────────────
export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  role: waitlistRoleEnum("role").default("both"),
  name: varchar("name", { length: 200 }),
  phone: varchar("phone", { length: 32 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = typeof waitlist.$inferInsert;

// ─── DISPUTES ─────────────────────────────────────────────────────────────────
export const disputes = pgTable("disputes", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  raisedBy: uuid("raised_by").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  status: disputeStatusEnum("status").default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

// ─── CHAT MESSAGES ────────────────────────────────────────────────────────────
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  senderId: uuid("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id),
  reviewerId: uuid("reviewer_id").notNull().references(() => users.id),
  revieweeId: uuid("reviewee_id").notNull().references(() => users.id),
  direction: reviewDirectionEnum("direction").notNull(),
  rating: integer("rating").notNull(), // 1–5
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ─── TRAVELER LOCATIONS ───────────────────────────────────────────────────────
export const travelerLocations = pgTable("traveler_locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").notNull().references(() => bookings.id).unique(),
  travelerId: uuid("traveler_id").notNull().references(() => users.id),
  lat: numeric("lat", { precision: 10, scale: 7 }).notNull(),
  lng: numeric("lng", { precision: 10, scale: 7 }).notNull(),
  isSharing: boolean("is_sharing").default(true).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type TravelerLocation = typeof travelerLocations.$inferSelect;
export type InsertTravelerLocation = typeof travelerLocations.$inferInsert;

// ─── CORRIDOR RULES ───────────────────────────────────────────────────────────
export const corridorRules = pgTable("corridor_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  corridorKey: varchar("corridor_key", { length: 20 }).notNull().unique(),
  originCity: varchar("origin_city", { length: 100 }).notNull(),
  originCode: varchar("origin_code", { length: 10 }).notNull(),
  destCity: varchar("dest_city", { length: 100 }).notNull(),
  destCode: varchar("dest_code", { length: 10 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  surgeMultiplier: numeric("surge_multiplier", { precision: 4, scale: 2 }).default("1.00").notNull(),
  basePricePerKg: numeric("base_price_per_kg", { precision: 8, scale: 2 }).default("5.00").notNull(),
  maxWeightKg: numeric("max_weight_kg", { precision: 5, scale: 2 }).default("30.00").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
});

export type CorridorRule = typeof corridorRules.$inferSelect;
export type InsertCorridorRule = typeof corridorRules.$inferInsert;

// ─── CUSTOMS RULES ────────────────────────────────────────────────────────────
export const customsRules = pgTable("customs_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  corridorKey: varchar("corridor_key", { length: 20 }).notNull().unique(),
  prohibitedItems: jsonb("prohibited_items").notNull().$type<string[]>(),
  restrictions: text("restrictions"),
  maxValueGbp: numeric("max_value_gbp", { precision: 10, scale: 2 }).default("500.00"),
  requiresDeclaration: boolean("requires_declaration").default(false).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  updatedBy: uuid("updated_by").references(() => users.id),
});

export type CustomsRule = typeof customsRules.$inferSelect;
export type InsertCustomsRule = typeof customsRules.$inferInsert;

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminId: uuid("admin_id").notNull().references(() => users.id),
  adminName: varchar("admin_name", { length: 200 }),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 50 }),
  targetId: uuid("target_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;
