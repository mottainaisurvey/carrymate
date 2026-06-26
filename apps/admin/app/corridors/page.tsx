'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { Badge, Btn, Toggle, ProgressBar, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const FLAG: Record<string, string> = {
  LHR: '🇬🇧', LOS: '🇳🇬', ACC: '🇬🇭', JFK: '🇺🇸', NBO: '🇰🇪',
  CDG: '🇫🇷', ABJ: '🇨🇮', KIN: '🇯🇲', DXB: '🇦🇪',
}

function surgeVariant(m: number): 'red' | 'amber' | 'teal' | 'muted' {
  if (m >= 1.2) return 'red'
  if (m >= 1.1) return 'amber'
  if (m > 1.0)  return 'teal'
  return 'muted'
}

export default function CorridorsPage() {
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const { data: corridors, refetch } = trpc.admin.corridors.useQuery()
  const updateCorridor = trpc.admin.updateCorridor.useMutation({
    onSuccess: () => { refetch(); showToast('Corridor updated', 'Changes saved') }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AdminLayout>
      <Topbar title="Corridors" subtitle="Active route management" actions={
        <Btn variant="primary" onClick={() => showToast('New corridor', 'Corridor creation wizard opened')}>
          + Add corridor
        </Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-3 mb-3.5">
          {(corridors ?? []).map(c => {
            const surge = Number(c.surgeMultiplier)
            const pct = Math.round((surge - 1) * 100)
            const originFlag = FLAG[c.originCode] ?? '🌍'
            const destFlag = FLAG[c.destCode] ?? '🌍'
            return (
              <div
                key={c.id}
                className={`bg-[#1c2330] border rounded-lg p-3.5 ${
                  surge >= 1.2 ? 'border-[rgba(239,68,68,0.4)]' :
                  surge >= 1.1 ? 'border-[rgba(245,158,11,0.4)]' :
                  'border-[#2a3444]'
                }`}
              >
                <div className="font-mono text-xs font-medium text-[#e6e2da] mb-1">
                  {originFlag} {c.originCode} → {c.destCode} {destFlag}
                </div>
                <div className="text-[11px] text-[#7a8699] mb-2.5">
                  {c.originCity} → {c.destCity}
                </div>
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-mono text-sm font-medium text-[#e6e2da]">
                      £{Number(c.basePricePerKg).toFixed(2)}/kg
                    </div>
                    <div className="text-[10px] text-[#7a8699] mt-0.5">Base price</div>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-medium text-[#e6e2da]">
                      {Number(c.maxWeightKg).toFixed(0)}kg
                    </div>
                    <div className="text-[10px] text-[#7a8699] mt-0.5">Max weight</div>
                  </div>
                </div>
                <ProgressBar value={Math.min(100, surge * 50)} color={surge >= 1.2 ? '#ef4444' : surge >= 1.1 ? '#f59e0b' : '#1d9e75'} />
                <div className="flex justify-between items-center mt-2">
                  <Badge variant={surgeVariant(surge)}>
                    {pct > 0 ? `+${pct}% surge active` : 'Standard'}
                  </Badge>
                  <Toggle
                    checked={c.isActive}
                    onChange={(v) => updateCorridor.mutate({ id: c.id, isActive: v })}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {(!corridors || corridors.length === 0) && (
          <div className="text-center text-[#7a8699] text-xs py-12">No corridors configured</div>
        )}
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
