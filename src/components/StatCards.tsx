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
    const id = requestAnimationFrame(raf)
    return () => cancelAnimationFrame(id)
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
    iconColor: 'text-[#7F77DD]',
    iconBg: 'bg-[#7F77DD]/15',
    border: 'border-[#7F77DD]/20',
  },
  {
    Icon: TrendingUp,
    target: 2500,
    duration: 1600,
    suffix: '+',
    format: (v: number) => v >= 1000 ? `${(v / 1000).toFixed(1).replace('.', ',')}K` : `${v}`,
    label: 'Clientes Conectados',
    iconColor: 'text-fuchsia-400',
    iconBg: 'bg-fuchsia-500/15',
    border: 'border-fuchsia-500/20',
  },
  {
    Icon: Star,
    target: 49,
    duration: 1000,
    suffix: '',
    format: (v: number) => (v / 10).toFixed(1),
    label: 'Avaliação Média',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15',
    border: 'border-yellow-500/20',
  },
]

function StatCard({
  stat,
  active,
}: {
  stat: (typeof statDefs)[number]
  active: boolean
}) {
  const count = useCountUp(stat.target, stat.duration, active)
  const { Icon, suffix, format, label, iconColor, iconBg, border } = stat

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border ${border} bg-white/5 px-4 py-3 backdrop-blur-sm`}
    >
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-lg font-black leading-none text-white">
          {format(count)}{suffix}
        </p>
        <p className="mt-0.5 text-xs text-white/50">{label}</p>
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3"
    >
      {statDefs.map((stat) => (
        <StatCard key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  )
}
