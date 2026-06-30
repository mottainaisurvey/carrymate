import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/router'
import { supabase } from './supabase'

export const trpc = createTRPCReact<AppRouter>()

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.EXPO_PUBLIC_API_URL}/api/trpc`,
        transformer: superjson,
        headers: async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession()
          return session?.access_token
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}
        },
      }),
    ],
  })
}
