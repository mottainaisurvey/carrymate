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

function statusVariant(status: string) {
  const map: Record<string, 'green' | 'amber' | 'red' | 'teal' | 'blue' | 'muted'> = {
    delivered: 'green', disputed: 'red', confirmed: 'teal',
    collecting: 'amber', delivering: 'green', pending: 'muted',
    cancelled: 'red', in_transit: 'blue',
  }
  return map[status] ?? 'muted'
}

export default function DeliveriesPage() {
  const [search, setSearch] = useState('')
  const [corridor, setCorridor] = useState('All corridors')
  const [status, setStatus] = useState('All statuses')
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: bookings } = trpc.admin.bookings.useQuery({ limit: 50 })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = (bookings ?? []).filter(b => {
    const q = search.toLowerCase()
    return !q || b.id.toLowerCase().includes(q)
  })

  return (
    <AdminLayout>
      <Topbar title="Deliveries" subtitle="All active and historical deliveries" actions={
        <Btn onClick={() => showToast('Exported', 'deliveries.csv downloaded')}>Export CSV</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex gap-2.5 mb-4 flex-wrap items-center">
          <SearchInput placeholder="Search parcel ID, traveler, sender…" value={search} onChange={setSearch} />
          <FilterSelect
            options={['All corridors', 'LHR→LOS', 'LHR→ACC', 'JFK→LOS', 'LHR→NBO']}
            value={corridor} onChange={setCorridor}
          />
          <FilterSelect
            options={['All statuses', 'In transit', 'Collecting', 'Delivering', 'Delivered', 'Disputed']}
            value={status} onChange={setStatus}
          />
        </div>
        <Card>
          <CardTitle right={<span className="font-mono text-[11px] text-[#7a8699]">Showing {filtered.length} results</span>}>
            All deliveries <Badge variant="muted">{filtered.length} active</Badge>
          </CardTitle>
          <Table headers={['Booking ID', 'Status', 'Amount', 'Service fee', 'Created', 'Action']}>
            {filtered.map(b => (
              <TR key={b.id} onClick={() => showToast(b.id.slice(0, 8).toUpperCase(), `Status: ${b.status}`)}>
                <TD mono>{b.id.slice(0, 8).toUpperCase()}</TD>
                <TD><Badge variant={statusVariant(b.status)}>{b.status}</Badge></TD>
                <TD mono>£{Number(b.totalAmount).toFixed(2)}</TD>
                <TD mono>£{Number(b.serviceFee).toFixed(2)}</TD>
                <TD muted mono>{new Date(b.createdAt).toLocaleDateString()}</TD>
                <TD>
                  <Btn onClick={() => showToast(b.id.slice(0, 8).toUpperCase(), `Status: ${b.status}`)}>View</Btn>
                </TD>
              </TR>
            ))}
          </Table>
          {filtered.length === 0 && (
            <div className="text-center text-[#7a8699] text-xs py-8">No deliveries found</div>
          )}
        </Card>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
