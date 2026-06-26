'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { trpc } from '@/lib/trpc'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { supabase } from '@/lib/supabase'

function getBaseUrl() {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  return 'http://localhost:3001'
}

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    (trpc as unknown as { createClient: (opts: object) => object }).createClient({
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
    })
  )

  const Provider = (trpc as unknown as { Provider: React.ComponentType<{ client: object; queryClient: QueryClient; children: React.ReactNode }> }).Provider

  return (
    <Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  )
}
