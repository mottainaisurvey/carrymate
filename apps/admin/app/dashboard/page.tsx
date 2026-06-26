'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, Table, TR, TD, AvatarRow, Btn, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

function initials(name: string | null | undefined) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function DashboardPage() {
  const { data: analytics } = trpc.admin.analytics.useQuery()
  const { data: disputes } = trpc.admin.disputes.useQuery({ limit: 3 })
  const { data: kyc } = trpc.admin.kycQueue.useQuery({ limit: 3 })
  const { data: bookings } = trpc.admin.bookings.useQuery({ limit: 5 })
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AdminLayout>
      <Topbar title="Dashboard" subtitle="Platform overview" live actions={
        <Btn onClick={() => showToast('Refreshed', 'Dashboard data refreshed')}>Refresh</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        {/* Metrics */}
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          <MetricCard label="Total users" value={analytics?.users ?? '—'} accent="teal" icon="👤"
            sub={<><span className="text-[#22c55e]">↑ 12%</span> this month</>} />
          <MetricCard label="Active parcels" value={analytics?.parcels ?? '—'} accent="blue" icon="📦"
            sub={<><span className="text-[#22c55e]">↑ 8%</span> vs last week</>} />
          <MetricCard label="Open disputes" value={analytics?.disputes ?? '—'} accent="rust" icon="⚖️"
            sub="SLA target: 48hr" />
          <MetricCard label="Waitlist" value={analytics?.waitlist ?? '—'} accent="gold" icon="⏳"
            sub="Pending invites" />
        </div>
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <MetricCard label="Total bookings" value={analytics?.bookings ?? '—'} accent="green" icon="🤝" />
          <MetricCard label="Active trips" value={analytics?.trips ?? '—'} accent="amber" icon="✈️" />
          <MetricCard label="Platform GMV" value="£39.2k" accent="teal" icon="💰"
            sub={<><span className="text-[#22c55e]">↑ 23%</span> month-on-month</>} />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Recent disputes */}
          <Card>
            <CardTitle right={<Btn onClick={() => {}}>View all</Btn>}>
              Open disputes <Badge variant="red">{analytics?.disputes ?? 0}</Badge>
            </CardTitle>
            {disputes?.slice(0, 3).map(d => (
              <div key={d.id} className="flex items-start gap-3 py-2.5 border-b border-[#2a3444] last:border-0">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-[#e6e2da] mb-0.5 truncate">{d.reason}</div>
                  <div className="text-[11px] text-[#7a8699]">
                    {new Date(d.createdAt).toLocaleDateString()} · <Badge variant={d.status === 'open' ? 'amber' : 'green'}>{d.status}</Badge>
                  </div>
                </div>
                <Btn onClick={() => showToast('Dispute', d.reason)}>View</Btn>
              </div>
            ))}
            {(!disputes || disputes.length === 0) && (
              <div className="text-[#7a8699] text-xs py-4 text-center">No open disputes</div>
            )}
          </Card>

          {/* KYC queue */}
          <Card>
            <CardTitle right={<Btn onClick={() => {}}>View all</Btn>}>
              KYC queue <Badge variant="amber">{kyc?.length ?? 0}</Badge>
            </CardTitle>
            {kyc?.slice(0, 3).map(k => (
              <div key={k.id} className="flex items-center gap-3 py-2 border-b border-[#2a3444] last:border-0">
                <AvatarRow
                  initials={initials(k.name)}
                  name={k.name ?? 'Unknown'}
                  sub={k.kycStatus}
                  color="gold"
                />
                <div className="ml-auto flex gap-1.5">
                  <Badge variant={k.kycStatus === 'submitted' ? 'amber' : 'muted'}>{k.kycStatus}</Badge>
                </div>
              </div>
            ))}
            {(!kyc || kyc.length === 0) && (
              <div className="text-[#7a8699] text-xs py-4 text-center">No pending KYC reviews</div>
            )}
          </Card>

          {/* Recent bookings */}
          <div className="col-span-2">
            <Card>
              <CardTitle right={<span className="font-mono text-[11px] text-[#7a8699]">Showing last 5</span>}>
                Recent bookings
              </CardTitle>
              <Table headers={['Booking', 'Status', 'Amount', 'Created']}>
                {bookings?.map(b => (
                  <TR key={b.id}>
                    <TD mono>{b.id.slice(0, 8).toUpperCase()}</TD>
                    <TD><Badge variant={
                      b.status === 'delivered' ? 'green' :
                      b.status === 'disputed' ? 'red' :
                      b.status === 'confirmed' ? 'teal' : 'amber'
                    }>{b.status}</Badge></TD>
                    <TD mono>£{Number(b.totalAmount).toFixed(2)}</TD>
                    <TD muted mono>{new Date(b.createdAt).toLocaleDateString()}</TD>
                  </TR>
                ))}
              </Table>
            </Card>
          </div>
        </div>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
