'use client'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, Table, TR, TD, Btn } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const monthlyGmv = [
  { month: 'Jan', value: 12000, color: '#374355' },
  { month: 'Feb', value: 18000, color: '#374355' },
  { month: 'Mar', value: 22000, color: '#145c44' },
  { month: 'Apr', value: 28000, color: '#1d9e75' },
  { month: 'May', value: 34000, color: '#1d9e75' },
  { month: 'Jun', value: 39200, color: '#1d9e75' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c2330] border border-[#2a3444] rounded-lg px-3 py-2 text-xs">
      <div className="text-[#7a8699] mb-1">{label}</div>
      <div className="font-mono text-[#e6e2da]">£{(payload[0].value / 1000).toFixed(1)}k</div>
    </div>
  )
}

export default function FinancialsPage() {
  const { data: payments } = trpc.admin.payments.useQuery({ limit: 50 })

  const totalGmv = (payments ?? []).reduce((s, p) => s + Number(p.amount), 0)
  const held = (payments ?? []).filter(p => p.status === 'held')
  const released = (payments ?? []).filter(p => p.status === 'released')

  return (
    <AdminLayout>
      <Topbar title="Financials" subtitle="GMV, escrow, and revenue overview" actions={
        <Btn>Export report</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          <MetricCard label="Total GMV" value={`£${(totalGmv / 1000).toFixed(1)}k`} accent="teal"
            sub={<><span className="text-[#22c55e]">↑ 23%</span> month-on-month</>} />
          <MetricCard label="In escrow" value={`£${(held.reduce((s, p) => s + Number(p.amount), 0) / 1000).toFixed(1)}k`} accent="amber"
            sub={`${held.length} active holds`} />
          <MetricCard label="Released" value={`£${(released.reduce((s, p) => s + Number(p.amount), 0) / 1000).toFixed(1)}k`} accent="green"
            sub={`${released.length} completed`} />
          <MetricCard label="Platform revenue" value="£5,092" accent="gold"
            sub="13% blended take rate" />
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <Card>
            <CardTitle>Monthly GMV trend</CardTitle>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={monthlyGmv} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#7a8699', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {monthlyGmv.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card>
            <CardTitle>Escrow breakdown</CardTitle>
            <div className="space-y-3 mt-2">
              {[
                { label: 'Pending', count: (payments ?? []).filter(p => p.status === 'pending').length, color: '#7a8699' },
                { label: 'Held (escrow)', count: held.length, color: '#f59e0b' },
                { label: 'Released', count: released.length, color: '#22c55e' },
                { label: 'Refunded', count: (payments ?? []).filter(p => p.status === 'refunded').length, color: '#ef4444' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-xs text-[#e6e2da]">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs text-[#e6e2da]">{item.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardTitle right={<span className="font-mono text-[11px] text-[#7a8699]">Last {payments?.length ?? 0} transactions</span>}>
            Recent payments
          </CardTitle>
          <Table headers={['Payment ID', 'Amount', 'Currency', 'Status', 'Method', 'Created']}>
            {(payments ?? []).slice(0, 20).map(p => (
              <TR key={p.id}>
                <TD mono>{p.id.slice(0, 8).toUpperCase()}</TD>
                <TD mono>£{Number(p.amount).toFixed(2)}</TD>
                <TD mono>{p.currency.toUpperCase()}</TD>
                <TD>
                  <Badge variant={
                    p.status === 'released' ? 'green' :
                    p.status === 'held' ? 'amber' :
                    p.status === 'refunded' ? 'red' : 'muted'
                  }>{p.status}</Badge>
                </TD>
                <TD muted>
                  {p.stripePaymentIntentId ? 'Stripe' : p.paystackReference ? 'Paystack' : '—'}
                </TD>
                <TD muted mono>{new Date(p.createdAt).toLocaleDateString()}</TD>
              </TR>
            ))}
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
