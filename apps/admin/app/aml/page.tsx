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

export default function AmlPage() {
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: users } = trpc.admin.users.useQuery({ limit: 200 })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  // Simulated AML flags: users with high delivery counts or flagged KYC
  const flagged = (users ?? []).filter(u =>
    u.kycStatus === 'rejected' || u.isBanned || u.completedDeliveries > 50
  )
  const pepFlags = (users ?? []).filter(u => u.kycStatus === 'rejected')
  const highVolume = (users ?? []).filter(u => u.completedDeliveries > 50)

  return (
    <AdminLayout>
      <Topbar title="AML Monitor" subtitle="Anti-money laundering and compliance monitoring" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          <MetricCard label="Active flags" value={flagged.length} accent="red"
            sub="Requires review" />
          <MetricCard label="PEP matches" value={pepFlags.length} accent="rust"
            sub="World-Check hits" />
          <MetricCard label="High-volume users" value={highVolume.length} accent="amber"
            sub=">50 deliveries" />
          <MetricCard label="SARs filed" value="0" accent="blue"
            sub="This month" />
        </div>

        <Card>
          <CardTitle>
            Flagged accounts <Badge variant="red">{flagged.length}</Badge>
          </CardTitle>
          <Table headers={['User', 'Role', 'Flag type', 'Deliveries', 'KYC status', 'Action']}>
            {flagged.map(u => (
              <TR key={u.id}>
                <TD><AvatarRow initials={initials(u.name)} name={u.name ?? 'Unknown'} color="rust" /></TD>
                <TD muted>{u.role}</TD>
                <TD>
                  <Badge variant={
                    u.kycStatus === 'rejected' ? 'red' :
                    u.isBanned ? 'red' :
                    u.completedDeliveries > 50 ? 'amber' : 'muted'
                  }>
                    {u.kycStatus === 'rejected' ? 'KYC rejected' :
                     u.isBanned ? 'Banned' :
                     'High volume'}
                  </Badge>
                </TD>
                <TD mono>{u.completedDeliveries}</TD>
                <TD>
                  <Badge variant={
                    u.kycStatus === 'verified' ? 'green' :
                    u.kycStatus === 'submitted' ? 'amber' :
                    u.kycStatus === 'rejected' ? 'red' : 'muted'
                  }>{u.kycStatus}</Badge>
                </TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Btn onClick={() => showToast('EDD initiated', `Enhanced due diligence for ${u.name ?? 'user'}`)}>
                      EDD
                    </Btn>
                    <Btn variant="danger" onClick={() => showToast('SAR filed', `Suspicious activity report filed for ${u.name ?? 'user'}`)}>
                      File SAR
                    </Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          {flagged.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No AML flags detected</div>
          )}
        </Card>

        <Card>
          <CardTitle>Transaction monitoring rules</CardTitle>
          <div className="space-y-3">
            {[
              { rule: 'Single transaction > £1,000', threshold: '£1,000', status: 'Active', trips: 2 },
              { rule: 'Cumulative monthly > £5,000', threshold: '£5,000/mo', status: 'Active', trips: 0 },
              { rule: 'Rapid successive bookings (>5/day)', threshold: '5 bookings', status: 'Active', trips: 1 },
              { rule: 'Cross-border cash equivalent', threshold: 'Any amount', status: 'Active', trips: 0 },
            ].map(r => (
              <div key={r.rule} className="flex items-center gap-3 py-2.5 border-b border-[#2a3444] last:border-0">
                <div className="flex-1">
                  <div className="text-xs text-[#e6e2da]">{r.rule}</div>
                  <div className="text-[11px] text-[#7a8699] mt-0.5">Threshold: {r.threshold}</div>
                </div>
                <Badge variant="green">{r.status}</Badge>
                {r.trips > 0 && <Badge variant="amber">{r.trips} hit{r.trips > 1 ? 's' : ''}</Badge>}
              </div>
            ))}
          </div>
        </Card>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
