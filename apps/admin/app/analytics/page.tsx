'use client'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { MetricCard, Card, CardTitle, Badge, Table, TR, TD } from '@/components/ui'
import { trpc } from '@/lib/trpc'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const corridorGmv = [
  { name: 'LHR→LOS', value: 18400, color: '#1d9e75' },
  { name: 'LHR→ACC', value: 11100, color: '#3b82f6' },
  { name: 'JFK→LOS', value: 14300, color: '#c8963e' },
  { name: 'LHR→NBO', value: 3800,  color: '#374355' },
  { name: 'CDG→ABJ', value: 2100,  color: '#374355' },
  { name: 'LHR→KIN', value: 800,   color: '#374355' },
]
const userGrowth = [
  { month: 'Jan', users: 180 }, { month: 'Feb', users: 280 },
  { month: 'Mar', users: 420 }, { month: 'Apr', users: 620 },
  { month: 'May', users: 900 }, { month: 'Jun', users: 1241 },
]
const revenueStreams = [
  { stream: 'Platform commission (13% avg)', thisMonth: '£3,841', lastMonth: '£3,120', change: '+23%', pct: '75.4%', up: true },
  { stream: 'Insurance upsell',              thisMonth: '£612',   lastMonth: '£490',   change: '+25%', pct: '12.0%', up: true },
  { stream: 'Carrier subscriptions',         thisMonth: '£340',   lastMonth: '£290',   change: '+17%', pct: '6.7%',  up: true },
  { stream: 'Priority listings',             thisMonth: '£192',   lastMonth: '£145',   change: '+32%', pct: '3.8%',  up: true },
  { stream: 'B2B API access',                thisMonth: '£107',   lastMonth: '£0',     change: 'New',  pct: '2.1%',  up: true },
  { stream: 'Total',                         thisMonth: '£5,092', lastMonth: '£4,045', change: '+26%', pct: '100%',  up: true },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1c2330] border border-[#2a3444] rounded-lg px-3 py-2 text-xs">
      <div className="text-[#7a8699] mb-1">{label}</div>
      <div className="font-mono text-[#e6e2da]">
        {typeof payload[0].value === 'number' && payload[0].value > 1000
          ? `£${(payload[0].value / 1000).toFixed(1)}k`
          : payload[0].value}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { data: analytics } = trpc.admin.analytics.useQuery()

  return (
    <AdminLayout>
      <Topbar title="Analytics" subtitle="Platform performance metrics" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-4 gap-3.5 mb-5">
          <MetricCard label="Monthly GMV" value="£39,200" accent="teal"
            sub={<><span className="text-[#22c55e]">↑ 23%</span> month-on-month</>} />
          <MetricCard label="Active users" value={analytics?.users ?? '1,241'} accent="blue"
            sub={<><span className="text-[#22c55e]">↑ 15%</span> vs last month</>} />
          <MetricCard label="Platform revenue" value="£5,092" accent="gold"
            sub="13% blended take rate" />
          <MetricCard label="NPS score" value="67" accent="green"
            sub="above 60 target" />
        </div>

        <div className="grid grid-cols-2 gap-3.5 mb-3.5">
          <Card>
            <CardTitle>GMV by corridor (this month)</CardTitle>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={corridorGmv} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#7a8699', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                  {corridorGmv.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-1">
              <div><div className="font-mono text-[13px] text-[#1d9e75]">£18.4k</div><div className="text-[10px] text-[#7a8699]">LHR-LOS (47%)</div></div>
              <div><div className="font-mono text-[13px] text-[#3b82f6]">£11.1k</div><div className="text-[10px] text-[#7a8699]">LHR-ACC (28%)</div></div>
              <div><div className="font-mono text-[13px] text-[#c8963e]">£14.3k</div><div className="text-[10px] text-[#7a8699]">JFK-LOS (37%)</div></div>
            </div>
          </Card>

          <Card>
            <CardTitle>User growth — 6 months</CardTitle>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={userGrowth} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fill: '#7a8699', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="users" radius={[3, 3, 0, 0]} fill="#1d9e75" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div><div className="font-mono text-[13px]">{analytics?.users ?? '1,241'}</div><div className="text-[10px] text-[#7a8699]">Total users</div></div>
              <div><div className="font-mono text-[13px] text-[#1d9e75]">32%</div><div className="text-[10px] text-[#7a8699]">Referral rate</div></div>
              <div><div className="font-mono text-[13px]">57%</div><div className="text-[10px] text-[#7a8699]">Repeat senders</div></div>
            </div>
          </Card>
        </div>

        <Card>
          <CardTitle>Revenue breakdown</CardTitle>
          <Table headers={['Stream', 'This month', 'Last month', 'Change', '% of revenue']}>
            {revenueStreams.map((r, i) => (
              <TR key={i}>
                <TD className={i === revenueStreams.length - 1 ? 'font-semibold' : ''}>{r.stream}</TD>
                <TD mono className={i === revenueStreams.length - 1 ? 'text-[#1d9e75] font-semibold' : ''}>{r.thisMonth}</TD>
                <TD mono>{r.lastMonth}</TD>
                <TD><Badge variant={r.change === 'New' ? 'blue' : 'green'}>{r.change}</Badge></TD>
                <TD mono>{r.pct}</TD>
              </TR>
            ))}
          </Table>
        </Card>
      </div>
    </AdminLayout>
  )
}
