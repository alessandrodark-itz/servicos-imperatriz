'use client'

import Link from 'next/link'
import { MapPin, Star, Phone, MessageCircle, ChevronRight, Heart, CheckCircle, Zap } from 'lucide-react'
import WhatsAppLink from '@/components/WhatsAppLink'
import PlanBadge from '@/components/PlanBadge'
import { isPremiumActive } from '@/lib/plans'

type Provider = {
  id: string
  name: string
  slug: string
  category: string
  rating: number
  reviews: number
  description: string
  image: string
  phone?: string
  whatsapp?: string
  location?: string
  featured?: boolean
  plan?: string
  planExpiresAt?: string | null
}

type Props = {
  provider: Provider
  variant?: 'default' | 'compact' | 'featured'
}

export default function ProviderCard({ provider, variant = 'default' }: Props) {
  const premium = isPremiumActive(provider.plan, provider.planExpiresAt)

  /* ── COMPACT ── */
  if (variant === 'compact') {
    return (
      <Link
        href={`/prestadores/${provider.slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-gradient-to-r from-white/4 to-white/2 p-3.5 transition-all duration-300 hover:border-violet-500/30 hover:from-violet-500/8 hover:to-violet-500/4 hover:shadow-[0_0_20px_rgba(138,92,255,0.12)]"
      >
        <div className="relative flex-shrink-0">
          <img
            src={provider.image}
            alt={provider.name}
            className="h-14 w-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {provider.featured && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]">
              <CheckCircle className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-violet-300">
            {provider.name}
          </h3>
          <p className="truncate text-xs font-medium text-violet-400/80">{provider.category}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">{provider.rating}</span>
            <span className="text-xs text-white/30">({provider.reviews})</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-violet-400" />
      </Link>
    )
  }

  /* ── FEATURED ── */
  if (variant === 'featured') {
    return (
      <Link
        href={`/prestadores/${provider.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-b from-[#190f2e] to-[#0c0718] transition-all duration-300 hover:border-violet-400/45 hover:shadow-[0_8px_48px_rgba(138,92,255,0.22)] hover:-translate-y-1.5"
      >
        {/* Featured badge */}
        {provider.featured && (
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1 text-xs font-bold text-white shadow-[0_0_14px_rgba(138,92,255,0.5)]">
            <Zap className="h-2.5 w-2.5 fill-white" />
            Destaque
          </div>
        )}

        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={provider.image}
            alt={provider.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0718] via-[#0c0718]/30 to-transparent" />
          {/* Rating overlay on image */}
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{provider.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <h3 className="text-lg font-bold text-white transition-colors group-hover:text-violet-300">
              {provider.name}
            </h3>
            <p className="text-sm font-semibold text-violet-400/90">{provider.category}</p>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/50">{provider.description}</p>
          {provider.location && (
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              {provider.location}
            </div>
          )}
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.round(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'}`} />
            ))}
            <span className="ml-1 text-xs text-white/40">({provider.reviews} avaliações)</span>
          </div>
          <div className="flex gap-2 pt-1">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                onClick={e => e.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg,#7b2ff7,#8A5CFF)', boxShadow: '0 0 14px rgba(138,92,255,0.3)' }}
              >
                <Phone className="h-3.5 w-3.5" />
                Ligar
              </a>
            )}
            {provider.whatsapp && (
              <WhatsAppLink
                href={`https://wa.me/55${provider.whatsapp.replace(/\D/g, '')}`}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/25 hover:text-emerald-200"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                <MessageCircle className="h-3.5 w-3.5" />
                WhatsApp
              </WhatsAppLink>
            )}
          </div>
        </div>

        {/* Bottom neon glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(138,92,255,0.7), transparent)' }}
        />
      </Link>
    )
  }

  /* ── DEFAULT ── */
  return (
    <div className="group relative flex flex-col w-full overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-[#130a20] to-[#0c0718] transition-all duration-300 hover:border-violet-500/35 hover:shadow-[0_8px_40px_rgba(138,92,255,0.2)]">

      {/* ── Image — padding-bottom intrínseco 16:9 ── */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img
          src={provider.image}
          alt={provider.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0718]/80 via-transparent to-transparent" />

        {/* category + premium + heart */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className="min-w-0 truncate rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
              style={{
                background: 'rgba(138,92,255,0.25)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(138,92,255,0.35)',
              }}
            >
              {provider.category}
            </span>
            {premium && <PlanBadge size="xs" />}
          </div>
          <button
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
            aria-label="Favoritar"
          >
            <Heart className="h-3.5 w-3.5 text-white/55" />
          </button>
        </div>

        {/* verified badge */}
        {provider.featured && (
          <div className="absolute bottom-3 left-3">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-emerald-300"
              style={{
                background: 'rgba(16,185,129,0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(16,185,129,0.35)',
              }}
            >
              <CheckCircle className="h-2.5 w-2.5 flex-shrink-0" />
              Verificado
            </span>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">

        <div>
          <h3 className="text-sm font-bold leading-snug text-white transition-colors group-hover:text-violet-300">
            {provider.name}
          </h3>
          {provider.location && (
            <div className="mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0 text-white/30" />
              <span className="truncate text-xs text-white/40">{provider.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-yellow-400">{provider.rating}</span>
          <span className="text-xs text-white/30">({provider.reviews} aval.)</span>
        </div>

        {provider.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-white/45">
            {provider.description}
          </p>
        )}

        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={`/prestadores/${provider.slug}`}
            className="flex flex-1 items-center justify-center rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:brightness-110"
            style={{
              background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 100%)',
              boxShadow: '0 0 14px rgba(138,92,255,0.25)',
            }}
          >
            Ver Perfil
          </Link>
          {provider.whatsapp && (
            <WhatsAppLink
              href={`https://wa.me/55${provider.whatsapp.replace(/\D/g, '')}`}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/25"
              style={{
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
              }}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </WhatsAppLink>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-8 right-8 h-px opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(138,92,255,0.65), transparent)' }}
      />
    </div>
  )
}
