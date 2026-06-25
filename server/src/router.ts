// Re-export tRPC primitives from trpc.ts so existing imports from "./router.js" still work
export { router, publicProcedure, protectedProcedure, adminProcedure } from "./trpc.js";
import { router } from "./trpc.js";

// ── Sub-routers ───────────────────────────────────────────────────────────────
import { authRouter } from "./routers/auth.js";
import { healthRouter } from "./routers/health.js";
import { usersRouter } from "./routers/users.js";
import { parcelsRouter } from "./routers/parcels.js";
import { tripsRouter } from "./routers/trips.js";
import { bookingsRouter } from "./routers/bookings.js";
import { paymentsRouter } from "./routers/payments.js";
import { disputesRouter } from "./routers/disputes.js";
import { corridorsRouter } from "./routers/corridors.js";
import { notificationsRouter } from "./routers/notifications.js";
import { chatRouter } from "./routers/chat.js";
import { reviewsRouter } from "./routers/reviews.js";
import { waitlistRouter } from "./routers/waitlist.js";
import { adminRouter } from "./routers/admin.js";

export const appRouter = router({
  auth: authRouter,
  health: healthRouter,
  users: usersRouter,
  parcels: parcelsRouter,
  trips: tripsRouter,
  bookings: bookingsRouter,
  payments: paymentsRouter,
  disputes: disputesRouter,
  corridors: corridorsRouter,
  notifications: notificationsRouter,
  chat: chatRouter,
  reviews: reviewsRouter,
  waitlist: waitlistRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
