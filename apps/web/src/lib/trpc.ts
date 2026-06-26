import { createTRPCNext } from '@trpc/next'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '@carrymate/api'
import { inferRouterOutputs } from '@trpc/server'
import { supabase } from './supabase'

export type RouterOutputs = inferRouterOutputs<AppRouter>

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  return 'http://localhost:3001'
}

export const trpc = createTRPCNext<AppRouter>({
  // tRPC v11 requires transformer at the top-level opts when the router uses one
  transformer: superjson,
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
          async headers() {
            const {
              data: { session },
            } = await supabase.auth.getSession()
            if (session?.access_token) {
              return { Authorization: `Bearer ${session.access_token}` }
            }
            return {}
          },
        }),
      ],
    }
  },
  ssr: false,
})
