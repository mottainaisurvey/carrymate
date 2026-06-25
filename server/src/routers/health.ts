import { router, publicProcedure } from "../router.js";
import { sql } from "drizzle-orm";

export const healthRouter = router({
  ping: publicProcedure.query(async ({ ctx }) => {
    // Verify database connectivity
    await ctx.db.execute(sql`SELECT 1`);
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    };
  }),
});
