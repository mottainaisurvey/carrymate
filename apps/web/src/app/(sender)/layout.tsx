import type { ReactNode } from 'react'
import { SenderNav } from '@/components/SenderNav'
import { TrpcProvider } from '@/components/TrpcProvider'
import { NoSSR } from '@/components/NoSSR'

export default function SenderLayout({ children }: { children: ReactNode }) {
  return (
    <NoSSR>
      <TrpcProvider>
        <div className="min-h-screen" style={{ background: 'var(--cream)' }}>
          <SenderNav />
          <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
        </div>
      </TrpcProvider>
    </NoSSR>
  )
}
