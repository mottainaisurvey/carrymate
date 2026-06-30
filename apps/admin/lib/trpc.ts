import { type CreateTRPCReact, createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@carrymate/api'

// Explicit type annotation avoids TS2742 "not portable" error
export const trpc: CreateTRPCReact<AppRouter, unknown> = createTRPCReact<AppRouter>()

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/trpc`,
        transformer: superjson,
        async headers() {
          // Cookie-based auth — Supabase session cookie is forwarded automatically
          return {}
        },
      }),
    ],
  })
}
