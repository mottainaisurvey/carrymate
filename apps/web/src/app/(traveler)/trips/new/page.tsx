'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

export default function NewTripPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    originCity: '',
    originCode: '',
    destCity: '',
    destCode: '',
    departureDate: '',
    availableKg: '',
    pricePerKg: '',
    notes: '',
  })
  const [error, setError] = useState('')

  const createTrip = trpc.trips.create.useMutation({
    onSuccess: (data) => {
      router.push(`/traveler/trips/${data.id}`)
    },
    onError: (err) => setError(err.message),
  })

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    createTrip.mutate({
      originCity: form.originCity,
      originCode: form.originCode,
      destCity: form.destCity,
      destCode: form.destCode,
      departureDate: form.departureDate,
      availableKg: parseFloat(form.availableKg),
      pricePerKg: parseFloat(form.pricePerKg),
      notes: form.notes || undefined,
    })
  }

  return (
    <div className="max-w-xl mx-auto">
      <div
        className="rounded-3xl p-8"
        style={{ background: 'white', border: '1px solid var(--border)' }}
      >
        <h1 className="font-serif text-2xl font-black mb-1" style={{ color: 'var(--ink)' }}>
          Post a trip
        </h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          Tell us about your upcoming flight and how much luggage space you can offer.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Route */}
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

          {/* Departure date */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Departure date
            </label>
            <input
              type="date"
              value={form.departureDate}
              onChange={(e) => handleChange('departureDate', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
            />
          </div>

          {/* Capacity + price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Available space (kg)
              </label>
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={form.availableKg}
                onChange={(e) => handleChange('availableKg', e.target.value)}
                placeholder="10"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                Price per kg (£)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={form.pricePerKg}
                onChange={(e) => handleChange('pricePerKg', e.target.value)}
                placeholder="8"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--warm)', border: '1px solid var(--border)', color: 'var(--ink)' }}
              />
            </div>
          </div>

          {/* Earnings preview */}
          {form.availableKg && form.pricePerKg && (
            <div
              className="rounded-2xl p-4 text-sm"
              style={{ background: 'var(--teal-pale)', color: 'var(--teal)' }}
            >
              💰 Potential earnings: up to{' '}
              <strong>
                £{(parseFloat(form.availableKg) * parseFloat(form.pricePerKg) * 0.9).toFixed(2)}
              </strong>{' '}
              (after 10% platform fee) if fully booked
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any restrictions on parcel types, collection arrangements, etc."
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
            disabled={createTrip.isPending}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--teal)', color: 'white' }}
          >
            {createTrip.isPending ? 'Posting…' : 'Post trip →'}
          </button>
        </form>
      </div>
    </div>
  )
}
