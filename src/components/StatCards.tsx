'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, TrendingUp, Star } from 'lucide-react'

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    setValue(0)
    const start = Date.now()
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [active, target, duration])
  return value
}

const statDefs = [
  {
    Icon: Users,
    target: 500,
    duration: 1200,
    suffix: '+',
    format: (v: number) => `${v}`,
    label: 'Prestadores Ativos',
    iconGrad: 'from-violet-600 to-[#8A5CFF]',
    glow: 'rgba(138,92,255,0.35)',
    border: 'rgba(138,92,255,0.22)',
    hoverBorder: 'rgba(138,92,255,0.5)',
    valueColor: '#B18CFF',
  },
  {
    Icon: TrendingUp,
    target: 2500,
    duration: 1600,
    suffix: '+',
    format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1).replace('.', ',')}K` : `${v}`,
    label: 'Clientes Conectados',
    iconGrad: 'from-fuchsia-600 to-pink-500',
    glow: 'rgba(217,70,239,0.3)',
    border: 'rgba(217,70,239,0.2)',
    hoverBorder: 'rgba(217,70,239,0.45)',
    valueColor: '#e879f9',
  },
  {
    Icon: Star,
    target: 49,
    duration: 1000,
    suffix: '',
    format: (v: number) => (v / 10).toFixed(1),
    label: 'Avaliação Média',
    iconGrad: 'from-amber-400 to-yellow-500',
    glow: 'rgba(251,191,36,0.3)',
    border: 'rgba(251,191,36,0.2)',
    hoverBorder: 'rgba(251,191,36,0.45)',
    valueColor: '#fbbf24',
  },
]

function StatCard({ stat, active }: { stat: typeof statDefs[number]; active: boolean }) {
  const count = useCountUp(stat.target, stat.duration, active)
  const [hovered, setHovered] = useState(false)
  const { Icon, suffix, format, label, iconGrad, glow, border, hoverBorder, valueColor } = stat

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? 'rgba(255,255,255,0.07)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? hoverBorder : border}`,
        boxShadow: hovered
          ? `0 0 28px ${glow}, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 0 0px transparent, 0 4px 16px rgba(0,0,0,0.2)`,
        borderRadius: 20,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        cursor: 'default',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
    >
      {/* Icon */}
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGrad}`}
        style={{
          boxShadow: hovered ? `0 0 18px ${glow}` : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>

      {/* Text */}
      <div>
        <p
          className="text-xl font-black leading-none tabular-nums"
          style={{ color: valueColor, textShadow: hovered ? `0 0 20px ${glow}` : 'none', transition: 'text-shadow 0.3s ease' }}
        >
          {format(count)}{suffix}
        </p>
        <p className="mt-1 text-xs font-medium" style={{ color: 'rgba(169,163,201,0.65)' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function StatCards() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      {statDefs.map(stat => (
        <StatCard key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  )
}
