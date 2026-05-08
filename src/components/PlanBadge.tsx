'use client'

import { Crown } from 'lucide-react'

interface Props {
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export default function PlanBadge({ size = 'sm', className = '' }: Props) {
  const styles: Record<NonNullable<Props['size']>, { wrap: string; icon: string }> = {
    xs: { wrap: 'gap-0.5 px-1.5 py-0.5 text-[9px]',  icon: 'h-2 w-2' },
    sm: { wrap: 'gap-1 px-2 py-0.5 text-[10px]',      icon: 'h-2.5 w-2.5' },
    md: { wrap: 'gap-1.5 px-3 py-1 text-xs',           icon: 'h-3.5 w-3.5' },
  }
  const s = styles[size]
  return (
    <span className={`inline-flex items-center rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/25 to-yellow-500/15 font-bold text-amber-300 ${s.wrap} ${className}`}>
      <Crown className={s.icon} />
      Premium
    </span>
  )
}
