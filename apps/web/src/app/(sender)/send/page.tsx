'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

export default function SendParcelPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    contents: '',
    originCity: 'London',
    originCode: 'LHR',
    destCity: '',
    destCode: '',
    weightKg: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    notes: '',
  })
  const [error, setError] = useState('')

  const createParcel = trpc.parcels.create.useMutation({
    onSuccess: (data) => {
      router.push(`/sender/send/match?parcelId=${data.id}`)
    },
    onError: (err) => setError(err.message),
  })

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    createParcel.mutate({
      contents: form.contents,
      originCity: form.originCity,
      originCode: form.originCode,
      destCity: form.destCity,
      destCode: form.destCode,
      weightKg: parseFloat(form.weightKg),
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      recipientAddress: form.recipientAddress || undefined,
      notes: form.notes || undefined,
    })
  }

  const isPending = createParcel.isPending

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {['Parcel details', 'Match traveler', 'Payment', 'Confirm'].map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={
                i === 0
                  ? { background: 'var(--teal)', color: 'white' }
                  : { background: 'var(--warm)', color: 'var(--text-muted)' }
              }
            >
              {i + 1}
            </div>
            <span
              className="text-xs font-medium hidden sm:block"
              style={{ color: i === 0 ? 'var(--teal)' : 'var(--text-muted)' }}
            >
              {step}
            </span>
            {i < 3 && <span className="text-xs opacity-30">›</span>}
          </div>
        ))}
      </div>

      <div
        className="rounded-3xl p-8"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: 'var(--ink)' }}>
          Parcel details
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Tell us what you're sending and where it needs to go.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contents */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              What are you sending?
            </label>
            <input
              type="text"
              value={form.contents}
              onChange={(e) => handleChange('contents', e.target.value)}
              placeholder="e.g. Birthday gift, clothing, documents"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Weight (kg)
            </label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={form.weightKg}
              onChange={(e) => handleChange('weightKg', e.target.value)}
              placeholder="1.5"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {/* Origin */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Origin city
              </label>
              <input
                type="text"
                value={form.originCity}
                onChange={(e) => handleChange('originCity', e.target.value)}
                placeholder="London"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Airport code
              </label>
              <input
                type="text"
                value={form.originCode}
                onChange={(e) => handleChange('originCode', e.target.value.toUpperCase())}
                placeholder="LHR"
                maxLength={10}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          {/* Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Destination city
              </label>
              <input
                type="text"
                value={form.destCity}
                onChange={(e) => handleChange('destCity', e.target.value)}
                placeholder="Lagos"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Airport code
              </label>
              <input
                type="text"
                value={form.destCode}
                onChange={(e) => handleChange('destCode', e.target.value.toUpperCase())}
                placeholder="LOS"
                maxLength={10}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Recipient name
            </label>
            <input
              type="text"
              value={form.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              placeholder="Full name of recipient"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Recipient phone
            </label>
            <input
              type="tel"
              value={form.recipientPhone}
              onChange={(e) => handleChange('recipientPhone', e.target.value)}
              placeholder="+234 800 000 0000"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Delivery address (optional)
            </label>
            <input
              type="text"
              value={form.recipientAddress}
              onChange={(e) => handleChange('recipientAddress', e.target.value)}
              placeholder="Street address for final delivery"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any special instructions..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {error && (
            <div
              className="text-sm px-4 py-3 rounded-xl"
              style={{ background: 'rgba(192,74,42,0.08)', color: 'var(--rust)' }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            {isPending ? 'Saving…' : 'Find travelers →'}
          </button>
        </form>
      </div>
    </div>
  )
}
