'use client'
import React from 'react'

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'amber' | 'red' | 'teal' | 'blue' | 'muted' | 'gold'
const badgeStyles: Record<BadgeVariant, string> = {
  green: 'bg-[rgba(34,197,94,0.12)] text-[#22c55e]',
  amber: 'bg-[rgba(245,158,11,0.12)] text-[#f59e0b]',
  red:   'bg-[rgba(239,68,68,0.12)] text-[#ef4444]',
  teal:  'bg-[rgba(29,158,117,0.12)] text-[#1d9e75]',
  blue:  'bg-[rgba(59,130,246,0.12)] text-[#3b82f6]',
  muted: 'bg-[rgba(255,255,255,0.06)] text-[#7a8699]',
  gold:  'bg-[rgba(200,150,62,0.12)] text-[#c8963e]',
}
export function Badge({ variant = 'muted', children, className = '' }: {
  variant?: BadgeVariant; children: React.ReactNode; className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap ${badgeStyles[variant]} ${className}`}>
      <span className="w-[5px] h-[5px] rounded-full bg-current" />
      {children}
    </span>
  )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
type AccentColor = 'teal' | 'gold' | 'rust' | 'blue' | 'green' | 'amber' | 'red'
const accentTop: Record<AccentColor, string> = {
  teal:  'bg-[#1d9e75]', gold: 'bg-[#c8963e]', rust: 'bg-[#c04a2a]',
  blue:  'bg-[#3b82f6]', green: 'bg-[#22c55e]', amber: 'bg-[#f59e0b]', red: 'bg-[#ef4444]',
}
export function MetricCard({ label, value, sub, accent = 'teal', icon }: {
  label: string; value: string | number; sub?: React.ReactNode; accent?: AccentColor; icon?: string
}) {
  return (
    <div className="relative bg-[#161b22] border border-[#2a3444] rounded-[10px] p-4 overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentTop[accent]}`} />
      {icon && <span className="absolute top-3 right-3 text-xl opacity-15">{icon}</span>}
      <div className="text-[10px] font-semibold tracking-[0.07em] uppercase text-[#7a8699] mb-2">{label}</div>
      <div className="font-mono text-[26px] font-medium text-[#e6e2da] leading-none">{value}</div>
      {sub && <div className="text-[11px] text-[#7a8699] mt-1.5 flex items-center gap-1">{sub}</div>}
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
type AvatarColor = 'teal' | 'gold' | 'rust' | 'blue'
const avStyles: Record<AvatarColor, string> = {
  teal: 'bg-[#145c44] text-[#1d9e75]',
  gold: 'bg-[rgba(200,150,62,0.2)] text-[#c8963e]',
  rust: 'bg-[rgba(192,74,42,0.2)] text-[#c04a2a]',
  blue: 'bg-[rgba(59,130,246,0.15)] text-[#3b82f6]',
}
export function Avatar({ initials, color = 'teal', size = 28 }: {
  initials: string; color?: AvatarColor; size?: number
}) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold flex-shrink-0 ${avStyles[color]}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-block w-[34px] h-[18px] cursor-pointer flex-shrink-0">
      <input type="checkbox" className="opacity-0 w-0 h-0" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`absolute inset-0 rounded-full transition-colors ${checked ? 'bg-[#1d9e75]' : 'bg-[#374355]'}`} />
      <div className={`absolute w-3 h-3 bg-white rounded-full top-[3px] transition-transform ${checked ? 'translate-x-[19px]' : 'translate-x-[3px]'}`} />
    </label>
  )
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
export function SearchInput({ placeholder, value, onChange }: {
  placeholder?: string; value: string; onChange: (v: string) => void
}) {
  return (
    <input
      className="bg-[#1c2330] border border-[#2a3444] text-[#e6e2da] placeholder-[#7a8699] px-3 py-1.5 rounded-md text-xs outline-none focus:border-[#1d9e75] w-[220px]"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}
export function FilterSelect({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <select
      className="bg-[#1c2330] border border-[#2a3444] text-[#7a8699] px-2.5 py-1.5 rounded-md text-xs outline-none focus:border-[#1d9e75] cursor-pointer"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'default', className = '', disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'default' | 'primary' | 'danger' | 'ghost'
  className?: string; disabled?: boolean
}) {
  const styles = {
    default: 'bg-transparent border border-[#374355] text-[#7a8699] hover:text-[#e6e2da]',
    primary: 'bg-[#1d9e75] text-white border border-[#1d9e75] hover:bg-[#18856200]',
    danger:  'bg-[rgba(192,74,42,0.12)] text-[#c04a2a] border border-[rgba(192,74,42,0.3)]',
    ghost:   'bg-[#161b22] text-[#7a8699] border border-[#2a3444]',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all font-sans disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#161b22] border border-[#2a3444] rounded-[10px] p-[18px] mb-3.5 ${className}`}>
      {children}
    </div>
  )
}
export function CardTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="text-[13px] font-semibold text-[#e6e2da] mb-3.5 flex justify-between items-center">
      <div className="flex items-center gap-2">{children}</div>
      {right && <div>{right}</div>}
    </div>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="text-[10px] font-semibold tracking-[0.07em] uppercase text-[#7a8699] px-3 py-2.5 text-left border-b border-[#2a3444] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}
export function TR({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      className="border-b border-[#2a3444] last:border-0 transition-colors hover:bg-[rgba(255,255,255,0.025)] cursor-pointer"
      onClick={onClick}
    >
      {children}
    </tr>
  )
}
export function TD({ children, mono = false, muted = false, className = '' }: {
  children: React.ReactNode; mono?: boolean; muted?: boolean; className?: string
}) {
  return (
    <td className={`px-3 py-[11px] text-xs align-middle ${mono ? 'font-mono text-[11px]' : ''} ${muted ? 'text-[#7a8699]' : 'text-[#e6e2da]'} ${className}`}>
      {children}
    </td>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ title, body, show }: { title: string; body?: string; show: boolean }) {
  return (
    <div className={`fixed bottom-6 right-6 bg-[#161b22] border border-[#2a3444] border-l-[3px] border-l-[#1d9e75] rounded-lg px-4 py-3 text-xs text-[#e6e2da] shadow-2xl z-50 max-w-[280px] transition-all duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}>
      <div className="font-semibold mb-0.5">{title}</div>
      {body && <div className="text-[#7a8699]">{body}</div>}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#1d9e75' }: { value: number; color?: string }) {
  return (
    <div className="h-[5px] bg-[#2a3444] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

// ─── AvatarRow ────────────────────────────────────────────────────────────────
export function AvatarRow({ initials, name, sub, color = 'teal' }: {
  initials: string; name: string; sub?: string; color?: AvatarColor
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar initials={initials} color={color} />
      <div>
        <div className="text-xs font-medium text-[#e6e2da]">{name}</div>
        {sub && <div className="text-[11px] text-[#7a8699]">{sub}</div>}
      </div>
    </div>
  )
}
