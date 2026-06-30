'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { Card, CardTitle, Badge, SearchInput, Btn } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const ACTION_ICONS: Record<string, { icon: string; bg: string; color: string }> = {
  ban_user:        { icon: '🚫', bg: 'bg-[rgba(192,74,42,0.15)]',  color: 'text-[#c04a2a]' },
  unban_user:      { icon: '✅', bg: 'bg-[rgba(34,197,94,0.12)]',  color: 'text-[#22c55e]' },
  resolve_dispute: { icon: '⚖️', bg: 'bg-[rgba(29,158,117,0.12)]', color: 'text-[#1d9e75]' },
  update_corridor: { icon: '🗺️', bg: 'bg-[rgba(59,130,246,0.12)]', color: 'text-[#3b82f6]' },
  update_user_role:{ icon: '👤', bg: 'bg-[rgba(200,150,62,0.12)]', color: 'text-[#c8963e]' },
  approve_kyc:     { icon: '🪪', bg: 'bg-[rgba(34,197,94,0.12)]',  color: 'text-[#22c55e]' },
  reject_kyc:      { icon: '❌', bg: 'bg-[rgba(239,68,68,0.12)]',  color: 'text-[#ef4444]' },
}

function timeAgo(date: Date | string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const { data: logs } = trpc.admin.auditLogs.useQuery({ limit: 100 })

  const filtered = (logs ?? []).filter(l =>
    !search ||
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.adminName ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <Topbar title="Audit Log" subtitle="All admin actions with full trail" actions={
        <Btn>Export</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2.5 mb-4">
          <SearchInput placeholder="Search action, admin…" value={search} onChange={setSearch} />
        </div>
        <Card>
          <CardTitle right={<span className="font-mono text-[11px] text-[#7a8699]">{filtered.length} entries</span>}>
            Admin audit trail
          </CardTitle>
          <div>
            {filtered.map(log => {
              const style = ACTION_ICONS[log.action] ?? { icon: '📝', bg: 'bg-[rgba(255,255,255,0.06)]', color: 'text-[#7a8699]' }
              return (
                <div key={log.id} className="flex gap-3 py-2.5 border-b border-[#2a3444] last:border-0">
                  <div className="font-mono text-[10px] text-[#7a8699] whitespace-nowrap pt-0.5 min-w-[68px]">
                    {timeAgo(log.createdAt)}
                  </div>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] flex-shrink-0 ${style.bg} ${style.color}`}>
                    {style.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-[#e6e2da] mb-0.5">
                      <span className="font-semibold">{log.adminName ?? 'Admin'}</span>
                      {' '}
                      <span className="text-[#7a8699]">{log.action.replace(/_/g, ' ')}</span>
                      {log.targetType && (
                        <> on <span className="font-mono text-[11px] text-[#7a8699]">{log.targetType}/{log.targetId?.slice(0, 8)}</span></>
                      )}
                    </div>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-[11px] text-[#7a8699] font-mono">
                        {JSON.stringify(log.metadata)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div className="text-center text-[#7a8699] text-xs py-8">No audit logs found</div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
