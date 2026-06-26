'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { Card, CardTitle, Badge, Btn, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

export default function CustomsPage() {
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, { maxValueGbp: string; restrictions: string }>>({})
  const { data: rules, refetch } = trpc.admin.customsRules.useQuery()
  const updateRule = trpc.admin.updateCustomsRule.useMutation({
    onSuccess: () => { refetch(); setEditing(null); showToast('Customs rule saved', 'Changes applied') }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <AdminLayout>
      <Topbar title="Customs Rules" subtitle="Per-corridor customs and prohibited items" actions={
        <Btn variant="primary" onClick={() => showToast('New rule', 'Customs rule creation opened')}>+ Add rule</Btn>
      } />
      <div className="flex-1 overflow-y-auto p-6">
        {(rules ?? []).map(r => {
          const isEditing = editing === r.id
          const ev = editValues[r.id] ?? { maxValueGbp: String(r.maxValueGbp ?? '500'), restrictions: r.restrictions ?? '' }
          return (
            <Card key={r.id}>
              <CardTitle right={
                isEditing ? (
                  <div className="flex gap-2">
                    <Btn variant="primary" onClick={() => updateRule.mutate({
                      id: r.id,
                      maxValueGbp: Number(ev.maxValueGbp),
                      restrictions: ev.restrictions,
                    })}>Save</Btn>
                    <Btn onClick={() => setEditing(null)}>Cancel</Btn>
                  </div>
                ) : (
                  <Btn onClick={() => { setEditing(r.id); setEditValues(prev => ({ ...prev, [r.id]: ev })) }}>Edit</Btn>
                )
              }>
                <span className="font-mono">{r.corridorKey}</span>
              </CardTitle>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#e6e2da] min-w-[140px]">Max declared value</span>
                  {isEditing ? (
                    <input
                      className="bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] px-2 py-1 rounded-md text-xs font-mono outline-none focus:border-[#1d9e75] w-24"
                      value={ev.maxValueGbp}
                      onChange={e => setEditValues(prev => ({ ...prev, [r.id]: { ...ev, maxValueGbp: e.target.value } }))}
                    />
                  ) : (
                    <span className="font-mono text-xs text-[#e6e2da]">£{Number(r.maxValueGbp ?? 500).toFixed(0)}</span>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs text-[#e6e2da] min-w-[140px]">Restrictions</span>
                  {isEditing ? (
                    <textarea
                      className="bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] px-2 py-1 rounded-md text-xs font-mono outline-none focus:border-[#1d9e75] w-full resize-none"
                      rows={2}
                      value={ev.restrictions}
                      onChange={e => setEditValues(prev => ({ ...prev, [r.id]: { ...ev, restrictions: e.target.value } }))}
                    />
                  ) : (
                    <span className="text-xs text-[#7a8699]">{r.restrictions ?? 'None'}</span>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-xs text-[#e6e2da] min-w-[140px]">Prohibited items</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(r.prohibitedItems as string[]).map((item: string) => (
                      <Badge key={item} variant="red">{item}</Badge>
                    ))}
                    {(r.prohibitedItems as string[]).length === 0 && (
                      <span className="text-xs text-[#7a8699]">None listed</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#e6e2da] min-w-[140px]">Requires declaration</span>
                  <Badge variant={r.requiresDeclaration ? 'amber' : 'muted'}>
                    {r.requiresDeclaration ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </Card>
          )
        })}
        {(!rules || rules.length === 0) && (
          <div className="text-center text-[#7a8699] text-xs py-12">No customs rules configured</div>
        )}
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
