'use client'

import { getVipBadgeConfig } from '@/lib/plans'

interface Props {
  size?: 'xs' | 'sm' | 'md'
  badgeType?: string | null
  className?: string
}

export default function PlanBadge({ size = 'sm', badgeType, className = '' }: Props) {
  const cfg = getVipBadgeConfig(badgeType)

  const padding: Record<NonNullable<Props['size']>, string> = {
    xs: 'gap-0.5 px-1.5 py-0.5 text-[9px]',
    sm: 'gap-1 px-2 py-0.5 text-[10px]',
    md: 'gap-1.5 px-3 py-1 text-xs',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${padding[size]} ${className}`}
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
      }}
    >
      <span style={{ fontSize: size === 'xs' ? 8 : size === 'sm' ? 10 : 12 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  )
}
