'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, Star, Phone, MessageCircle, ChevronRight, Heart, CheckCircle, Zap } from 'lucide-react'
import WhatsAppLink from '@/components/WhatsAppLink'
import PlanBadge from '@/components/PlanBadge'
import OnlineStatus from '@/components/OnlineStatus'
import { isVip, getOnlineStatus } from '@/lib/plans'
import { isFavorite, toggleFavorite } from '@/lib/favorites'

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
  vipBadgeType?: string | null
  updatedAt?: string | null
}

type Props = {
  provider: Provider
  variant?: 'default' | 'compact' | 'featured'
}

/* ── Helpers ─────────────────────────────────────────────── */

const AVATAR_GRADS = [
  'linear-gradient(135deg, #7b2ff7 0%, #a855f7 100%)',
  'linear-gradient(135deg, #c026d3 0%, #9333ea 100%)',
  'linear-gradient(135deg, #0891b2 0%, #6366f1 100%)',
  'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
  'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
  'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  'linear-gradient(135deg, #0e7490 0%, #4338ca 100%)',
]

function avatarGrad(name: string): string {
  const code = (name.charCodeAt(0) || 65) + (name.charCodeAt(1) || 0)
  return AVATAR_GRADS[code % AVATAR_GRADS.length]
}

function initial(name: string): string {
  return name.trim()[0]?.toUpperCase() ?? '?'
}

const DESC_FALLBACKS = [
  'Disponível para novos serviços na região.',
  'Atendendo com profissionalismo e dedicação.',
  'Profissional ativo e pronto para novos atendimentos.',
  'Qualidade e compromisso em cada serviço prestado.',
]

function smartDesc(desc: string, name: string): string {
  if (desc && desc.trim().length > 15) return desc
  return DESC_FALLBACKS[(name.charCodeAt(0) || 0) % DESC_FALLBACKS.length]
}

const REVIEW_LABELS = [
  'Novo na plataforma',
  'Perfil recente',
  'Primeiros atendimentos',
  'Verificado recentemente',
]

function reviewsLabel(reviews: number, name: string): string {
  if (reviews > 0) return `(${reviews} aval.)`
  return REVIEW_LABELS[(name.charCodeAt(0) || 0) % REVIEW_LABELS.length]
}

/* ── Tema por tipo de badge VIP ────────────────────────────── */

const BADGE_THEME: Record<string, {
  border: string
  shadow: string
  glow: string
  accent: string
  btnBg: string
  btnGlow: string
  cardBg: string
  namHover: string
}> = {
  vip: {
    border:   '1px solid rgba(251,191,36,0.45)',
    shadow:   '0 0 24px rgba(251,191,36,0.18), 0 8px 40px rgba(0,0,0,0.4)',
    glow:     'linear-gradient(90deg, transparent, rgba(251,191,36,0.7), transparent)',
    accent:   'rgba(251,191,36,0.08)',
    btnBg:    'linear-gradient(135deg,#d97706,#f59e0b)',
    btnGlow:  '0 0 14px rgba(251,191,36,0.4)',
    cardBg:   'linear-gradient(160deg,#1a1100 0%,#0c0a00 100%)',
    namHover: '#fbbf24',
  },
  premium: {
    border:   '1px solid rgba(167,139,250,0.45)',
    shadow:   '0 0 24px rgba(139,92,246,0.2), 0 8px 40px rgba(0,0,0,0.4)',
    glow:     'linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent)',
    accent:   'rgba(139,92,246,0.08)',
    btnBg:    'linear-gradient(135deg,#6d28d9,#8b5cf6)',
    btnGlow:  '0 0 14px rgba(139,92,246,0.4)',
    cardBg:   'linear-gradient(160deg,#120d1e 0%,#080510 100%)',
    namHover: '#c4b5fd',
  },
  destaque: {
    border:   '1px solid rgba(96,165,250,0.45)',
    shadow:   '0 0 24px rgba(59,130,246,0.18), 0 8px 40px rgba(0,0,0,0.4)',
    glow:     'linear-gradient(90deg, transparent, rgba(96,165,250,0.7), transparent)',
    accent:   'rgba(59,130,246,0.08)',
    btnBg:    'linear-gradient(135deg,#1d4ed8,#3b82f6)',
    btnGlow:  '0 0 14px rgba(59,130,246,0.4)',
    cardBg:   'linear-gradient(160deg,#071020 0%,#030810 100%)',
    namHover: '#93c5fd',
  },
  top_regional: {
    border:   '1px solid rgba(251,113,133,0.45)',
    shadow:   '0 0 24px rgba(239,68,68,0.18), 0 8px 40px rgba(0,0,0,0.4)',
    glow:     'linear-gradient(90deg, transparent, rgba(251,113,133,0.7), transparent)',
    accent:   'rgba(239,68,68,0.08)',
    btnBg:    'linear-gradient(135deg,#be123c,#f43f5e)',
    btnGlow:  '0 0 14px rgba(239,68,68,0.4)',
    cardBg:   'linear-gradient(160deg,#1a0710 0%,#0e0308 100%)',
    namHover: '#fda4af',
  },
  perfil_premium: {
    border:   '1px solid rgba(52,211,153,0.45)',
    shadow:   '0 0 24px rgba(16,185,129,0.18), 0 8px 40px rgba(0,0,0,0.4)',
    glow:     'linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent)',
    accent:   'rgba(16,185,129,0.08)',
    btnBg:    'linear-gradient(135deg,#047857,#10b981)',
    btnGlow:  '0 0 14px rgba(16,185,129,0.4)',
    cardBg:   'linear-gradient(160deg,#041510 0%,#020c08 100%)',
    namHover: '#6ee7b7',
  },
}

const DEFAULT_THEME = BADGE_THEME.vip

function getBadgeTheme(badgeType?: string | null) {
  return BADGE_THEME[badgeType ?? ''] ?? DEFAULT_THEME
}

/* ── Componente ──────────────────────────────────────────── */

export default function ProviderCard({ provider, variant = 'default' }: Props) {
  const vip = isVip(provider.plan, provider.planExpiresAt)
  const onlineStatus = vip ? getOnlineStatus(provider.updatedAt) : null
  const theme = vip ? getBadgeTheme(provider.vipBadgeType) : null

  const [favorited, setFavorited] = useState(false)
  const [imgError, setImgError]   = useState(false)

  useEffect(() => { setFavorited(isFavorite(provider.id)) }, [provider.id])
  useEffect(() => { setImgError(false) }, [provider.image])

  const hasImg = !!provider.image && !imgError
  const grad   = avatarGrad(provider.name)

  function handleFavorite(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFavorited(toggleFavorite(provider.id))
  }

  const vipStyle = vip && theme
    ? { border: theme.border, boxShadow: theme.shadow }
    : { border: '1px solid rgba(255,255,255,0.08)' }

  /* ── COMPACT ── */
  if (variant === 'compact') {
    return (
      <Link
        href={`/prestadores/${provider.slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-white/8 bg-gradient-to-r from-white/4 to-white/2 p-3.5 transition-all duration-300 hover:border-violet-500/30 hover:from-violet-500/8 hover:to-violet-500/4 hover:shadow-[0_0_20px_rgba(138,92,255,0.12)]"
      >
        <div className="relative flex-shrink-0">
          {hasImg
            ? <img
                src={provider.image}
                alt={provider.name}
                onError={() => setImgError(true)}
                className="h-14 w-14 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
              />
            : <div
                className="h-14 w-14 rounded-xl flex items-center justify-center text-xl font-black text-white transition-transform duration-300 group-hover:scale-105"
                style={{ background: grad, boxShadow: '0 0 16px rgba(138,92,255,0.25)' }}
              >
                {initial(provider.name)}
              </div>
          }
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
            <span className="text-xs text-white/30">{reviewsLabel(provider.reviews, provider.name)}</span>
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
        className="group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5"
        style={vip && theme
          ? { background: theme.cardBg, border: theme.border, boxShadow: theme.shadow }
          : { background: 'linear-gradient(160deg,#190f2e 0%,#0c0718 100%)', border: '1px solid rgba(139,92,246,0.25)' }
        }
      >
        {provider.featured && (
          <div
            className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={theme
              ? { background: theme.btnBg, boxShadow: theme.btnGlow }
              : { background: 'linear-gradient(135deg,#7b2ff7,#8A5CFF)', boxShadow: '0 0 14px rgba(138,92,255,0.4)' }
            }
          >
            <Zap className="h-2.5 w-2.5 fill-white" />
            Destaque
          </div>
        )}

        <div className="relative h-52 overflow-hidden">
          {hasImg
            ? <>
                <img
                  src={provider.image}
                  alt={provider.name}
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </>
            : <div className="h-full w-full relative flex items-center justify-center overflow-hidden" style={{ background: grad }}>
                <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 35%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <span className="relative text-8xl font-black text-white/20 select-none leading-none">{initial(provider.name)}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
          }
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-white">{provider.rating}</span>
          </div>
          {vip && (
            <div className="absolute left-3 top-3 z-10">
              <PlanBadge size="xs" badgeType={provider.vipBadgeType} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="text-lg font-bold text-white transition-colors"
                style={{ '--tw-name-hover': theme?.namHover ?? '#c4b5fd' } as React.CSSProperties}
              >
                {provider.name}
              </h3>
              {onlineStatus && <OnlineStatus status={onlineStatus} variant="card" />}
            </div>
            <p className="text-sm font-semibold" style={{ color: theme?.namHover ?? '#c4b5fd', opacity: 0.85 }}>
              {provider.category}
            </p>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/50">
            {smartDesc(provider.description, provider.name)}
          </p>
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
            <span className="ml-1 text-xs text-white/40">{reviewsLabel(provider.reviews, provider.name)}</span>
          </div>
          <div className="flex gap-2 pt-1">
            {provider.phone && (
              <a
                href={`tel:${provider.phone}`}
                onClick={e => e.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:brightness-110"
                style={{ background: theme?.btnBg ?? 'linear-gradient(135deg,#7b2ff7,#8A5CFF)', boxShadow: theme?.btnGlow ?? '0 0 14px rgba(138,92,255,0.3)' }}
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

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: theme?.glow ?? 'linear-gradient(90deg, transparent, rgba(138,92,255,0.7), transparent)' }}
        />
      </Link>
    )
  }

  /* ── DEFAULT ── */
  return (
    <div
      className="group relative flex flex-col w-full overflow-hidden rounded-2xl transition-all duration-300"
      style={vip && theme
        ? { background: theme.cardBg, ...vipStyle }
        : { background: 'linear-gradient(160deg,#130a20 0%,#0c0718 100%)', border: '1px solid rgba(255,255,255,0.08)' }
      }
    >
      {/* Image / Avatar area */}
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        {hasImg
          ? <img
              src={provider.image}
              alt={provider.name}
              onError={() => setImgError(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          : <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden" style={{ background: grad }}>
              <div
                className="pointer-events-none absolute inset-0"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.14) 0%, transparent 55%)' }}
              />
              <span className="relative text-5xl font-black text-white/25 select-none leading-none">
                {initial(provider.name)}
              </span>
              <span className="relative mt-1 text-[8px] font-bold uppercase tracking-[0.15em] text-white/20">
                {provider.category}
              </span>
            </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        {/* Top row: category + favorite */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <span
              className="min-w-0 truncate rounded-full px-2.5 py-1 text-[10px] font-bold text-white"
              style={theme
                ? { background: theme.accent, backdropFilter: 'blur(12px)', border: theme.border }
                : { background: 'rgba(138,92,255,0.25)', backdropFilter: 'blur(12px)', border: '1px solid rgba(138,92,255,0.35)' }
              }
            >
              {provider.category}
            </span>
            {vip && <PlanBadge size="xs" badgeType={provider.vipBadgeType} />}
          </div>
          <button
            onClick={handleFavorite}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-transform active:scale-90"
            style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
            aria-label={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          >
            <Heart
              className="h-3.5 w-3.5 transition-colors"
              style={{ color: favorited ? '#f43f5e' : 'rgba(255,255,255,0.55)', fill: favorited ? '#f43f5e' : 'none' }}
            />
          </button>
        </div>

        {provider.featured && (
          <div className="absolute bottom-3 left-3">
            <span
              className="flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-emerald-300"
              style={{ background: 'rgba(16,185,129,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,185,129,0.35)' }}
            >
              <CheckCircle className="h-2.5 w-2.5 flex-shrink-0" />
              Verificado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="text-sm font-bold leading-snug text-white transition-colors"
              style={{ ['--hover-color' as string]: theme?.namHover ?? '#c4b5fd' }}
            >
              {provider.name}
            </h3>
            {onlineStatus && <OnlineStatus status={onlineStatus} variant="card" />}
          </div>
          {provider.location && (
            <div className="mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0 text-white/30" />
              <span className="truncate text-xs text-white/40">{provider.location}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className={`h-3 w-3 ${s <= Math.round(provider.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-white/10 text-white/10'}`} />
            ))}
          </div>
          <span className="text-xs font-bold text-yellow-400">{provider.rating}</span>
          <span className="text-xs text-white/30">{reviewsLabel(provider.reviews, provider.name)}</span>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-white/45">
          {smartDesc(provider.description, provider.name)}
        </p>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={`/prestadores/${provider.slug}`}
            className="flex flex-1 items-center justify-center rounded-xl py-2.5 text-xs font-bold text-white transition-all hover:brightness-110"
            style={{
              background: theme?.btnBg ?? 'linear-gradient(135deg,#7b2ff7,#8A5CFF)',
              boxShadow: theme?.btnGlow ?? '0 0 14px rgba(138,92,255,0.25)',
            }}
          >
            Ver Perfil
          </Link>
          {provider.whatsapp && (
            <WhatsAppLink
              href={`https://wa.me/55${provider.whatsapp.replace(/\D/g, '')}`}
              className="flex items-center justify-center rounded-xl px-3 py-2.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/25"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </WhatsAppLink>
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-8 right-8 h-px opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{ background: theme?.glow ?? 'linear-gradient(90deg, transparent, rgba(138,92,255,0.65), transparent)' }}
      />
    </div>
  )
}
