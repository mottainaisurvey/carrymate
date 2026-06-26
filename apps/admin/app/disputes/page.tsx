'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, Btn, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

function slaHoursRemaining(createdAt: Date | string): number {
  const SLA_HOURS = 48
  const elapsed = (Date.now() - new Date(createdAt).getTime()) / 3_600_000
  return Math.max(0, SLA_HOURS - elapsed)
}

function slaClass(hours: number) {
  if (hours > 24) return 'text-[#22c55e]'
  if (hours > 8)  return 'text-[#f59e0b]'
  return 'text-[#ef4444]'
}

export default function DisputesPage() {
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: disputes, refetch } = trpc.admin.disputes.useQuery({ limit: 50 })
  const resolveDispute = trpc.admin.resolveDispute.useMutation({
    onSuccess: () => { refetch(); showToast('Dispute resolved', 'Escrow action triggered') }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3500)
  }

  const open = (disputes ?? []).filter(d => d.status === 'open')
  const resolved = (disputes ?? []).filter(d => d.status === 'resolved')

  return (
    <AdminLayout>
      <Topbar title="Disputes" subtitle="Active dispute queue with SLA tracking" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <MetricCard label="Open" value={open.length} accent="red"
            sub={open.filter(d => slaHoursRemaining(d.createdAt) < 8).length > 0
              ? `${open.filter(d => slaHoursRemaining(d.createdAt) < 8).length} approaching SLA`
              : 'All within SLA'} />
          <MetricCard label="Avg resolution" value="31hr" accent="amber" sub="SLA target: 48hr" />
          <MetricCard label="Resolved this month" value={resolved.length} accent="green"
            sub={`${resolved.length > 0 ? Math.round(resolved.length / (resolved.length + open.length) * 100) : 0}% resolution rate`} />
        </div>

        {open.map(d => {
          const sla = slaHoursRemaining(d.createdAt)
          const slaLabel = sla < 1 ? '<1hr' : `${Math.round(sla)}hr`
          const borderColor = sla < 8 ? 'border-[rgba(239,68,68,0.3)]' : 'border-[#2a3444]'
          return (
            <div key={d.id} className={`bg-[#1c2330] border ${borderColor} rounded-lg p-3.5 mb-2.5 flex gap-3.5 items-start`}>
              <div className="flex-1">
                <div className="font-mono text-[10px] text-[#7a8699] mb-1">
                  DISPUTE #{d.id.slice(0, 6).toUpperCase()} · {new Date(d.createdAt).toLocaleString()}
                </div>
                <div className="text-[13px] font-semibold text-[#e6e2da] mb-1">{d.reason}</div>
                <div className="text-[11px] text-[#7a8699] mb-2.5">
                  Filed {Math.round((Date.now() - new Date(d.createdAt).getTime()) / 3_600_000)} hours ago
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#1d9e75] text-white cursor-pointer"
                    onClick={() => resolveDispute.mutate({ disputeId: d.id, resolution: 'Resolved by admin — traveler wins', outcome: 'release' })}
                  >
                    Resolve — Traveler wins
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[rgba(192,74,42,0.12)] text-[#c04a2a] border border-[rgba(192,74,42,0.3)] cursor-pointer"
                    onClick={() => resolveDispute.mutate({ disputeId: d.id, resolution: 'Partial refund issued', outcome: 'refund' })}
                  >
                    Partial refund
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#161b22] text-[#7a8699] border border-[#2a3444] cursor-pointer"
                    onClick={() => showToast('Evidence', 'Photo proof + OTP log loaded')}
                  >
                    View evidence
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-mono text-[13px] font-medium ${slaClass(sla)}`}>{slaLabel}</div>
                <div className="text-[10px] text-[#7a8699] mt-0.5">SLA remaining</div>
              </div>
            </div>
          )
        })}

        {resolved.length > 0 && (
          <Card>
            <CardTitle>Resolved disputes</CardTitle>
            {resolved.map(d => (
              <div key={d.id} className="flex items-start gap-3 py-2.5 border-b border-[#2a3444] last:border-0 opacity-60">
                <div className="flex-1">
                  <div className="font-mono text-[10px] text-[#7a8699]">DISPUTE #{d.id.slice(0, 6).toUpperCase()}</div>
                  <div className="text-xs text-[#e6e2da] mt-0.5">{d.reason}</div>
                  {d.resolution && <div className="text-[11px] text-[#7a8699] mt-0.5">{d.resolution}</div>}
                </div>
                <Badge variant="green">Resolved</Badge>
              </div>
            ))}
          </Card>
        )}

        {open.length === 0 && (
          <div className="text-center text-[#7a8699] text-xs py-12">No open disputes 🎉</div>
        )}
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
