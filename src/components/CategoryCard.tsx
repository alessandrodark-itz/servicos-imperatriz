import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'

type Category = {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  count: number
  color: string
}

type Props = {
  category: Category
  variant?: 'default' | 'compact' | 'grid'
}

export default function CategoryCard({ category, variant = 'default' }: Props) {

  /* ── GRID (homepage) ── */
  if (variant === 'grid') {
    return (
      <Link
        href={`/categorias/${category.slug}`}
        className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/8 p-4 text-center transition-all duration-300 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-[0_8px_28px_rgba(138,92,255,0.18)]"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)' }}
      >
        {/* Radial glow on hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(circle at 50% 0%, rgba(138,92,255,0.14), transparent 72%)' }}
        />

        {/* Icon */}
        <div
          className={`relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_rgba(138,92,255,0.35)]`}
        >
          {category.icon}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-white transition-colors group-hover:text-violet-300">
          {category.name}
        </h3>

        {/* Count badge */}
        <span
          className="mt-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-violet-300 transition-all duration-300 group-hover:text-violet-200"
          style={{
            background: 'rgba(138,92,255,0.12)',
            border: '1px solid rgba(138,92,255,0.2)',
          }}
        >
          {category.count}+
        </span>

        {/* Arrow - appears on hover */}
        <div className="absolute bottom-2 right-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5">
          <ArrowRight className="h-3 w-3 text-violet-400" />
        </div>
      </Link>
    )
  }

  /* ── COMPACT ── */
  if (variant === 'compact') {
    return (
      <Link
        href={`/categorias/${category.slug}`}
        className="group flex items-center gap-3 rounded-xl border border-white/8 p-3 transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_16px_rgba(138,92,255,0.1)]"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-xl shadow-md transition-transform duration-300 group-hover:scale-105`}
        >
          {category.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-violet-300">
            {category.name}
          </h3>
          <p className="text-xs text-white/40">{category.count} profissionais</p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-violet-400" />
      </Link>
    )
  }

  /* ── DEFAULT (full card) ── */
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/8 p-6 text-center transition-all duration-300 hover:border-violet-500/35 hover:shadow-[0_8px_36px_rgba(138,92,255,0.18)] hover:-translate-y-1.5"
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)' }}
    >
      {/* Background glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'radial-gradient(circle at 50% 20%, rgba(138,92,255,0.12), transparent 70%)' }}
      />

      {/* Icon */}
      <div
        className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} p-3 text-3xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(138,92,255,0.4)]`}
      >
        {category.icon}
      </div>

      {/* Name */}
      <h3 className="text-base font-bold text-white transition-colors group-hover:text-violet-300">
        {category.name}
      </h3>

      {/* Description */}
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/45">
        {category.description}
      </p>

      {/* Count pill */}
      <span
        className="mt-3 rounded-full px-3 py-1 text-xs font-bold text-violet-300 transition-all duration-300 group-hover:text-violet-200"
        style={{
          background: 'rgba(138,92,255,0.12)',
          border: '1px solid rgba(138,92,255,0.22)',
        }}
      >
        {category.count} profissionais
      </span>

      {/* Bottom neon accent */}
      <div
        className="pointer-events-none absolute bottom-0 left-6 right-6 h-px opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(138,92,255,0.6), transparent)' }}
      />
    </Link>
  )
}
