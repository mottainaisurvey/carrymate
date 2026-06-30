'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

// Renders children only on the client — prevents SSR prerender errors
// for pages that use React Router context (useRouter, usePathname, etc.)
function NoSSRInner({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export const NoSSR = dynamic(() => Promise.resolve(NoSSRInner), {
  ssr: false,
  loading: () => (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--cream)' }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--teal)', borderTopColor: 'transparent' }}
      />
    </div>
  ),
})
