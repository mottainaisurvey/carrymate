// Shared tRPC types and router type exports
// The actual router is defined in server/ — this package re-exports the type
// so apps/web and apps/mobile can import it without depending on server code.

export type { AppRouter } from "../../../server/src/router.js";
