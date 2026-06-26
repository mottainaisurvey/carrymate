'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { section: 'Overview', items: [
    { href: '/dashboard',      icon: '⊞', label: 'Dashboard' },
    { href: '/analytics',      icon: '↗', label: 'Analytics' },
  ]},
  { section: 'Operations', items: [
    { href: '/deliveries',     icon: '📦', label: 'Deliveries',  badge: null },
    { href: '/disputes',       icon: '⚖️', label: 'Disputes',    badgeColor: 'red' },
    { href: '/kyc',            icon: '🪪', label: 'KYC Queue',   badgeColor: 'amber' },
  ]},
  { section: 'Users', items: [
    { href: '/senders',        icon: '👤', label: 'Senders' },
    { href: '/travelers',      icon: '✈️', label: 'Travelers' },
    { href: '/waitlist',       icon: '⏳', label: 'Waitlist' },
  ]},
  { section: 'Platform', items: [
    { href: '/corridors',      icon: '🗺️', label: 'Corridors' },
    { href: '/financials',     icon: '💰', label: 'Financials' },
    { href: '/customs',        icon: '📋', label: 'Customs Rules' },
    { href: '/notifications',  icon: '📣', label: 'Broadcast' },
  ]},
  { section: 'Compliance', items: [
    { href: '/aml',            icon: '🔍', label: 'AML Monitor' },
    { href: '/audit',          icon: '📜', label: 'Audit Log' },
  ]},
]

export function Sidebar({ adminName }: { adminName?: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#161b22] border-r border-[#2a3444] flex flex-col h-screen overflow-hidden">
      {/* Logo */}
      <div className="px-[18px] py-5 border-b border-[#2a3444]">
        <div className="font-mono text-[15px] font-medium text-[#e6e2da] tracking-tight">
          Carry<span className="text-[#1d9e75]">Mate</span>
        </div>
        <div className="text-[10px] text-[#7a8699] mt-0.5 tracking-[0.06em] uppercase">Super Admin Console</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2.5 scrollbar-none">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#7a8699] px-[18px] pt-3.5 pb-1.5">
              {section}
            </div>
            {items.map(({ href, icon, label }) => {
              const active = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-[18px] py-[9px] border-l-2 transition-all text-[13px] font-medium no-underline
                    ${active
                      ? 'text-[#1d9e75] border-l-[#1d9e75] bg-[rgba(29,158,117,0.12)]'
                      : 'text-[#7a8699] border-l-transparent hover:text-[#e6e2da] hover:bg-[rgba(255,255,255,0.03)]'
                    }`}
                >
                  <span className="text-sm w-[18px] text-center flex-shrink-0">{icon}</span>
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Bottom user */}
      <div className="px-[18px] py-3.5 border-t border-[#2a3444]">
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full bg-[#145c44] flex items-center justify-center text-[11px] font-bold text-[#1d9e75] flex-shrink-0">
            {adminName ? adminName.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#e6e2da] truncate">{adminName ?? 'Admin'}</div>
            <div className="text-[10px] text-[#7a8699]">Super Admin</div>
          </div>
          <div className="w-[7px] h-[7px] rounded-full bg-[#22c55e] flex-shrink-0" />
        </div>
      </div>
    </aside>
  )
}
