'use client'
import { Sidebar } from './Sidebar'
import { trpc } from '@/lib/trpc'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: me } = trpc.users.me.useQuery()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d1117]">
      <Sidebar adminName={me?.name ?? undefined} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  )
}
