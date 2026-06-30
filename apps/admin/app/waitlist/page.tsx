'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, Table, TR, TD, Btn, SearchInput, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

export default function WaitlistPage() {
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: entries, refetch } = trpc.admin.waitlist.useQuery({ limit: 100 })
  const invite = trpc.admin.inviteWaitlistUser.useMutation({
    onSuccess: () => { refetch(); showToast('Invite sent', 'User notified via email') }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = (entries ?? []).filter(e =>
    !search ||
    (e.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (e.name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  // Waitlist table has no status column — treat all as pending
  const pending = filtered
  const invited: typeof filtered = []
  const joined: typeof filtered = []

  return (
    <AdminLayout>
      <Topbar title="Waitlist" subtitle="Pre-launch signups and invite management" actions={
        <div className="flex gap-2">
          <Btn onClick={() => showToast('Bulk invite', `${pending.length} invites queued`)}>
            Invite all pending
          </Btn>
          <Btn onClick={() => showToast('Exported', 'waitlist.csv downloaded')}>Export</Btn>
        </div>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-3.5 mb-5">
          <MetricCard label="Total signups" value={entries?.length ?? 0} accent="teal" />
          <MetricCard label="Pending invite" value={pending.length} accent="amber"
            sub="Ready to onboard" />
          <MetricCard label="Converted" value={joined.length} accent="green"
            sub={entries?.length ? `${Math.round(joined.length / entries.length * 100)}% conversion` : '0%'} />
        </div>

        <div className="flex gap-2.5 mb-4">
          <SearchInput placeholder="Search by email or name…" value={search} onChange={setSearch} />
        </div>

        <Card>
          <CardTitle right={<Badge variant="muted">{filtered.length} total</Badge>}>
            Waitlist entries
          </CardTitle>
          <Table headers={['Name', 'Email', 'Role interest', 'Corridor', 'Status', 'Signed up', 'Action']}>
            {filtered.map(e => (
              <TR key={e.id}>
                <TD>{e.name ?? '—'}</TD>
                <TD muted>{e.email ?? '—'}</TD>
                <TD><Badge variant="muted">{e.role ?? 'any'}</Badge></TD>
                <TD mono>—</TD>
                <TD>
                  <Badge variant="amber">pending</Badge>
                </TD>
                <TD muted mono>{new Date(e.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <Btn variant="primary" onClick={() => invite.mutate({ id: e.id })}>
                      Invite
                    </Btn>
                </TD>
              </TR>
            ))}
          </Table>
          {filtered.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No waitlist entries found</div>
          )}
        </Card>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
