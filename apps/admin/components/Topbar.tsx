'use client'
import { Btn } from './ui'

export function Topbar({
  title, subtitle, actions, live = false
}: {
  title: string; subtitle?: string; actions?: React.ReactNode; live?: boolean
}) {
  return (
    <div className="bg-[#161b22] border-b border-[#2a3444] px-6 h-[52px] flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <div className="text-[15px] font-semibold text-[#e6e2da]">{title}</div>
          {subtitle && <div className="text-xs text-[#7a8699]">{subtitle}</div>}
        </div>
        {live && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#22c55e] font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
            LIVE
          </div>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
