'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, AvatarRow, Btn, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

function initials(name: string | null | undefined) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function KycPage() {
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: queue, refetch } = trpc.admin.kycQueue.useQuery({ limit: 50 })
  const approveKyc = trpc.admin.approveKyc.useMutation({
    onSuccess: () => { refetch(); showToast('KYC approved', 'Account activated') }
  })
  const rejectKyc = trpc.admin.rejectKyc.useMutation({
    onSuccess: () => { refetch(); showToast('KYC rejected', 'User notified') }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  const pending = (queue ?? []).filter(u => u.kycStatus === 'submitted' || u.kycStatus === 'pending')
  const autoPass = (queue ?? []).filter(u => u.kycStatus === 'verified')

  return (
    <AdminLayout>
      <Topbar title="KYC Queue" subtitle="Identity verification review" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <MetricCard label="Auto-approved today" value={autoPass.length} accent="green"
            sub="87% auto-pass rate" />
          <MetricCard label="Manual review needed" value={pending.length} accent="amber"
            sub="avg review time: 2.1hr" />
          <MetricCard label="Rejected this week" value="2" accent="red"
            sub="PEP flag + ID mismatch" />
        </div>

        <Card>
          <CardTitle>Pending manual review</CardTitle>
          {pending.map(u => (
            <div key={u.id} className="bg-[#1c2330] border border-[#2a3444] rounded-lg px-3.5 py-3 mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[rgba(200,150,62,0.2)] text-[#c8963e] flex items-center justify-center text-sm font-bold flex-shrink-0">
                {initials(u.name)}
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-[#e6e2da]">{u.name ?? 'Unknown'}</div>
                <div className="text-[11px] text-[#7a8699] mt-0.5">
                  {u.role} · KYC {u.kycStatus} · {u.email ?? u.phone ?? ''}
                </div>
              </div>
              <Badge variant={u.kycStatus === 'submitted' ? 'amber' : 'muted'}>{u.kycStatus}</Badge>
              <div className="flex gap-1.5">
                <button
                  className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[rgba(29,158,117,0.12)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)] cursor-pointer"
                  onClick={() => approveKyc.mutate({ userId: u.id })}
                >
                  Approve
                </button>
                <button
                  className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[rgba(192,74,42,0.12)] text-[#c04a2a] border border-[rgba(192,74,42,0.3)] cursor-pointer"
                  onClick={() => rejectKyc.mutate({ userId: u.id, reason: 'Manual review — rejected by admin' })}
                >
                  Reject
                </button>
                <button
                  className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#161b22] text-[#7a8699] border border-[#2a3444] cursor-pointer"
                  onClick={() => showToast('Docs loaded', `${u.name ?? 'User'} — passport + selfie`)}
                >
                  View docs
                </button>
              </div>
            </div>
          ))}
          {pending.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No pending KYC reviews</div>
          )}
        </Card>

        {autoPass.length > 0 && (
          <Card>
            <CardTitle>Auto-approved (human confirm)</CardTitle>
            {autoPass.map(u => (
              <div key={u.id} className="bg-[#1c2330] border border-[#2a3444] rounded-lg px-3.5 py-3 mb-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#145c44] text-[#1d9e75] flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {initials(u.name)}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-[#e6e2da]">{u.name ?? 'Unknown'}</div>
                  <div className="text-[11px] text-[#7a8699] mt-0.5">{u.role} · Auto-passed · {u.email ?? ''}</div>
                </div>
                <Badge variant="green">Auto-pass</Badge>
                <div className="flex gap-1.5">
                  <button
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[rgba(29,158,117,0.12)] text-[#1d9e75] border border-[rgba(29,158,117,0.3)] cursor-pointer"
                    onClick={() => showToast(`${u.name ?? 'User'} confirmed`, 'Human review confirmed auto-pass')}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-md text-[11px] font-semibold bg-[#161b22] text-[#7a8699] border border-[#2a3444] cursor-pointer"
                    onClick={() => showToast('Docs loaded', `${u.name ?? 'User'} — passport verification`)}
                  >
                    View docs
                  </button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
