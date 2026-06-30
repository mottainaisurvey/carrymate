'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { Card, CardTitle, Badge, Table, TR, TD, AvatarRow, Btn, SearchInput, FilterSelect, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

function initials(name: string | null | undefined) {
  if (!name) return 'U'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function SendersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: users, refetch } = trpc.admin.users.useQuery({ limit: 100 })
  const banUser = trpc.admin.banUser.useMutation({ onSuccess: () => refetch() })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  const senders = (users ?? []).filter(u =>
    (u.role === 'sender' || u.role === 'user') &&
    (!search || (u.name ?? '').toLowerCase().includes(search.toLowerCase()) || (u.email ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'All status' ||
      (statusFilter === 'Active' && !u.isBanned) ||
      (statusFilter === 'Suspended' && u.isBanned))
  )

  return (
    <AdminLayout>
      <Topbar title="Senders" subtitle="All sender accounts" actions={
        <Btn onClick={() => showToast('Exported', 'senders.csv downloaded')}>Export</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2.5 mb-4 flex-wrap items-center">
          <SearchInput placeholder="Search by name, email, phone…" value={search} onChange={setSearch} />
          <FilterSelect
            options={['All status', 'Active', 'Suspended', 'Flagged']}
            value={statusFilter} onChange={setStatusFilter}
          />
        </div>
        <Card>
          <CardTitle right={<Badge variant="muted">{senders.length} total</Badge>}>
            All senders
          </CardTitle>
          <Table headers={['Name', 'Email', 'Deliveries', 'KYC', 'Status', 'Last active', 'Action']}>
            {senders.map(u => (
              <TR key={u.id}>
                <TD><AvatarRow initials={initials(u.name)} name={u.name ?? 'Unknown'} color="gold" /></TD>
                <TD muted>{u.email ?? '—'}</TD>
                <TD mono>{u.completedDeliveries}</TD>
                <TD>
                  <Badge variant={
                    u.kycStatus === 'verified' ? 'green' :
                    u.kycStatus === 'submitted' ? 'amber' :
                    u.kycStatus === 'rejected' ? 'red' : 'muted'
                  }>{u.kycStatus}</Badge>
                </TD>
                <TD>
                  <Badge variant={u.isBanned ? 'red' : 'green'}>{u.isBanned ? 'Suspended' : 'Active'}</Badge>
                </TD>
                <TD muted mono>{new Date(u.lastSignedIn).toLocaleDateString()}</TD>
                <TD>
                  <div className="flex gap-1.5">
                    <Btn onClick={() => showToast(u.name ?? 'User', `Email: ${u.email ?? '—'}`)}>View</Btn>
                    <Btn
                      variant={u.isBanned ? 'primary' : 'danger'}
                      onClick={() => {
                        banUser.mutate({ userId: u.id, banned: !u.isBanned })
                        showToast(u.isBanned ? 'Unbanned' : 'Banned', u.name ?? 'User')
                      }}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </Btn>
                  </div>
                </TD>
              </TR>
            ))}
          </Table>
          {senders.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No senders found</div>
          )}
        </Card>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
