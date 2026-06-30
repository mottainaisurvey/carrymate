'use client'
import { useState } from 'react'
import { AdminLayout } from '@/components/AdminLayout'
import { Topbar } from '@/components/Topbar'
import { Card, CardTitle, Badge, Btn, Toast } from '@/components/ui'
import { trpc } from '@/lib/trpc'

const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All users', desc: 'Every active account' },
  { value: 'senders', label: 'Senders only', desc: 'Users who have posted parcels' },
  { value: 'travelers', label: 'Travelers only', desc: 'Verified carriers' },
  { value: 'kyc_pending', label: 'KYC pending', desc: 'Users awaiting verification' },
  { value: 'waitlist', label: 'Waitlist', desc: 'Pre-launch signups' },
]

const TEMPLATE_MESSAGES = [
  { title: 'New corridor live', body: 'We\'ve just launched the {{corridor}} route! Book your first delivery today.' },
  { title: 'KYC reminder', body: 'Complete your identity verification to unlock all CarryMate features.' },
  { title: 'Surge pricing alert', body: 'High demand on the {{corridor}} corridor — prices may be elevated.' },
  { title: 'Maintenance window', body: 'CarryMate will be under maintenance on {{date}} from 2–4am UTC.' },
]

export default function NotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState('all')
  const [toast, setToast] = useState<{ title: string; body?: string } | null>(null)
  const broadcast = trpc.admin.broadcastNotification.useMutation({
    onSuccess: () => {
      showToast('Broadcast sent', `Notification dispatched to ${audience}`)
      setTitle('')
      setBody('')
    }
  })

  function showToast(title: string, body?: string) {
    setToast({ title, body })
    setTimeout(() => setToast(null), 3500)
  }

  function applyTemplate(t: typeof TEMPLATE_MESSAGES[0]) {
    setTitle(t.title)
    setBody(t.body)
  }

  return (
    <AdminLayout>
      <Topbar title="Broadcast" subtitle="Send push notifications and in-app messages" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Compose */}
          <Card>
            <CardTitle>Compose broadcast</CardTitle>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-[#7a8699] block mb-1.5">Audience</label>
                <div className="grid grid-cols-1 gap-1.5">
                  {AUDIENCE_OPTIONS.map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer border transition-colors ${audience === opt.value ? 'border-[#1d9e75] bg-[rgba(29,158,117,0.08)]' : 'border-[#2a3444] hover:border-[#374355]'}`}>
                      <input
                        type="radio"
                        name="audience"
                        value={opt.value}
                        checked={audience === opt.value}
                        onChange={() => setAudience(opt.value)}
                        className="accent-[#1d9e75]"
                      />
                      <div>
                        <div className="text-xs font-medium text-[#e6e2da]">{opt.label}</div>
                        <div className="text-[11px] text-[#7a8699]">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] text-[#7a8699] block mb-1.5">Title</label>
                <input
                  className="w-full bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] placeholder-[#7a8699] px-3 py-2 rounded-md text-xs outline-none focus:border-[#1d9e75]"
                  placeholder="Notification title…"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] text-[#7a8699] block mb-1.5">Message body</label>
                <textarea
                  className="w-full bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] placeholder-[#7a8699] px-3 py-2 rounded-md text-xs outline-none focus:border-[#1d9e75] resize-none"
                  placeholder="Notification message…"
                  rows={4}
                  value={body}
                  onChange={e => setBody(e.target.value)}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <Btn
                  variant="primary"
                  disabled={!title || !body || broadcast.isPending}
                  onClick={() =>     broadcast.mutate({ title, body, audience: audience as 'all' | 'senders' | 'travelers' | 'kyc_pending' | 'waitlist' })}
                >
                  {broadcast.isPending ? 'Sending…' : 'Send broadcast'}
                </Btn>
                <Btn onClick={() => { setTitle(''); setBody('') }}>Clear</Btn>
              </div>
            </div>
          </Card>

          {/* Templates */}
          <div>
            <Card>
              <CardTitle>Message templates</CardTitle>
              <div className="space-y-2">
                {TEMPLATE_MESSAGES.map(t => (
                  <div
                    key={t.title}
                    className="bg-[#1c2330] border border-[#2a3444] rounded-lg px-3 py-2.5 cursor-pointer hover:border-[#374355] transition-colors"
                    onClick={() => applyTemplate(t)}
                  >
                    <div className="text-xs font-semibold text-[#e6e2da] mb-0.5">{t.title}</div>
                    <div className="text-[11px] text-[#7a8699] truncate">{t.body}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>Broadcast history</CardTitle>
              <div className="text-[11px] text-[#7a8699] text-center py-4">
                No broadcasts sent yet
              </div>
            </Card>
          </div>
        </div>
      </div>
      {toast && <Toast title={toast.title} body={toast.body} show />}
    </AdminLayout>
  )
}
