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

function tierVariant(tier: string | null | undefined): 'gold' | 'teal' | 'blue' | 'muted' {
  if (tier === 'platinum') return 'gold'
  if (tier === 'gold')     return 'gold'
  if (tier === 'silver')   return 'blue'
  return 'muted'
}

export default function TravelersPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All tiers')
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: users, refetch } = trpc.admin.users.useQuery({ limit: 200 })
  const banUser = trpc.admin.banUser.useMutation({ onSuccess: () => refetch() })
  const updateRole = trpc.admin.updateUserRole.useMutation({ onSuccess: () => refetch() })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  const travelers = (users ?? []).filter(u =>
    u.role === 'traveler' &&
    (!search || (u.name ?? '').toLowerCase().includes(search.toLowerCase())) &&
    (tierFilter === 'All tiers' || u.carrierTier === tierFilter.toLowerCase())
  )

  return (
    <AdminLayout>
      <Topbar title="Travelers" subtitle="All traveler / carrier accounts" actions={
        <Btn onClick={() => showToast('Exported', 'travelers.csv downloaded')}>Export</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2.5 mb-4 flex-wrap items-center">
          <SearchInput placeholder="Search by name, corridor, tier…" value={search} onChange={setSearch} />
          <FilterSelect
            options={['All tiers', 'Platinum', 'Gold', 'Silver', 'Bronze']}
            value={tierFilter} onChange={setTierFilter}
          />
        </div>
        <Card>
          <CardTitle right={<Badge variant="muted">{travelers.length} total</Badge>}>
            All travelers
          </CardTitle>
          <Table headers={['Name', 'Tier', 'Deliveries', 'Rating', 'KYC', 'Status', 'Action']}>
            {travelers.map(u => (
              <TR key={u.id}>
                <TD><AvatarRow initials={initials(u.name)} name={u.name ?? 'Unknown'} color="teal" /></TD>
                <TD><Badge variant={tierVariant(u.carrierTier)}>{u.carrierTier ?? 'bronze'}</Badge></TD>
                <TD mono>{u.completedDeliveries}</TD>
                <TD mono>★ {Number(u.averageRating ?? 0).toFixed(1)}</TD>
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
                <TD>
                  <div className="flex gap-1.5">
                    <Btn onClick={() => showToast(u.name ?? 'Traveler', `Deliveries: ${u.completedDeliveries}`)}>View</Btn>
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
          {travelers.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No travelers found</div>
          )}
        </Card>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
