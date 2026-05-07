'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Phone, ExternalLink, Zap } from 'lucide-react'

type AdItem = {
  id: string
  title: string
  description: string | null
  image_url: string
  link_url: string | null
  button_text: string | null
  phone: string | null
  is_active: boolean
  position: number
}

const INTERVAL = 5500

/* ─── Card ─────────────────────────────────────────────────── */
function AdCard({ ad, active }: { ad: AdItem; active: boolean }) {
  const inner = (
    <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: 26 }}>

      {/* Imagem com parallax sutil */}
      <img
        src={ad.image_url}
        alt={ad.title}
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{
          transform: active ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 6s cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* Overlay cinematográfico */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(5,1,20,0.97) 0%, rgba(5,1,20,0.65) 36%, rgba(5,1,20,0.2) 65%, rgba(5,1,20,0.04) 100%)',
        }}
      />

      {/* Vignette lateral */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, transparent 35%, rgba(5,1,20,0.55) 100%)',
        }}
      />

      {/* Badge PATROCINADO */}
      <div className="absolute left-3 top-3 z-20 sm:left-5 sm:top-5">
        <span
          className="flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-0.5 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white"
          style={{
            background: 'rgba(138,92,255,0.22)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(138,92,255,0.5)',
            boxShadow: '0 0 18px rgba(138,92,255,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Zap className="h-2 w-2 sm:h-2.5 sm:w-2.5 fill-[#B18CFF] text-[#B18CFF]" />
          Patrocinado
        </span>
      </div>

      {/* Conteúdo inferior */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-2.5 sm:p-6 lg:p-10">
        <h3
          className="mb-1 sm:mb-2 text-[13px] sm:text-xl lg:text-3xl xl:text-4xl font-black tracking-tight text-white"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.95), 0 0 48px rgba(138,92,255,0.2)' }}
        >
          {ad.title}
        </h3>

        {ad.description && (
          <p className="hidden sm:block mb-4 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/60 sm:text-base lg:text-base lg:max-w-xl lg:text-white/70">
            {ad.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
          {ad.button_text && (
            <span
              className="inline-flex items-center gap-1 sm:gap-2 rounded-full px-2.5 py-1 sm:px-5 sm:py-2.5 lg:px-7 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.04] hover:brightness-110 hover:shadow-[0_0_48px_rgba(138,92,255,0.9)]"
              style={{
                background: 'linear-gradient(135deg, #7b2ff7 0%, #9b5cff 60%, #b47fff 100%)',
                boxShadow: '0 0 28px rgba(138,92,255,0.6), 0 4px 16px rgba(0,0,0,0.45)',
              }}
            >
              {ad.link_url && <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 lg:h-3.5 lg:w-3.5" />}
              {ad.button_text}
            </span>
          )}

          {ad.phone && (
            <button
              type="button"
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.location.href = `tel:${ad.phone}` }}
              className="flex items-center gap-1 sm:gap-2 rounded-full px-2.5 py-1 sm:px-4 sm:py-2.5 lg:px-5 lg:py-3 text-[10px] sm:text-xs lg:text-sm font-semibold text-white/80 transition-all hover:text-white hover:bg-white/12"
              style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <Phone className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-[#B18CFF]" />
              {ad.phone}
            </button>
          )}
        </div>
      </div>

      {/* Borda glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          borderRadius: 26,
          border: '1px solid rgba(138,92,255,0.28)',
          boxShadow: active
            ? '0 0 48px rgba(138,92,255,0.22), 0 0 0 1px rgba(138,92,255,0.1), inset 0 1px 0 rgba(255,255,255,0.07)'
            : '0 0 20px rgba(138,92,255,0.06)',
        }}
      />
    </div>
  )

  if (ad.link_url) {
    return (
      <a href={ad.link_url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
        {inner}
      </a>
    )
  }
  return <div className="h-full w-full">{inner}</div>
}

/* ─── Carousel ──────────────────────────────────────────────── */
export default function AdsCarousel({ ads }: { ads: AdItem[] }) {
  const [current, setCurrent]   = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const touchStartX             = useRef<number | null>(null)
  const currentRef              = useRef(current)
  currentRef.current = current
  const total = ads.length

  const goTo = useCallback((index: number) => {
    setCurrent(((index % total) + total) % total)
    setProgress(0)
  }, [total])

  const next = useCallback(() => goTo(currentRef.current + 1), [goTo])
  const prev = useCallback(() => goTo(currentRef.current - 1), [goTo])

  /* Auto-play */
  useEffect(() => {
    if (isPaused) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [isPaused, next])

  /* Barra de progresso */
  useEffect(() => {
    setProgress(0)
    if (isPaused) return
    const step = 100 / (INTERVAL / 40)
    const t = setInterval(() => setProgress(p => Math.min(p + step, 100)), 40)
    return () => clearInterval(t)
  }, [current, isPaused])

  /* Offset circular */
  function getOffset(i: number) {
    let off = i - current
    if (off > total / 2)  off -= total
    if (off < -total / 2) off += total
    return off
  }

  /* Estilos por posição */
  function cardStyle(i: number): React.CSSProperties {
    const off = getOffset(i)
    const common: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 'var(--ads-card-left, 15%)',
      width: 'var(--ads-card-width, 70%)',
      transition: 'transform 0.62s cubic-bezier(0.4,0,0.2,1), opacity 0.62s ease, filter 0.62s ease',
    }
    if (off === 0) {
      return { ...common, transform: 'translateX(0) scale(1)', opacity: 1, zIndex: 10, filter: 'none' }
    }
    if (Math.abs(off) === 1) {
      return {
        ...common,
        transform: `translateX(${off > 0 ? 100 : -100}%) scale(0.87)`,
        opacity: 0.52,
        zIndex: 5,
        filter: 'blur(1.5px) brightness(0.62) saturate(0.8)',
      }
    }
    return {
      ...common,
      transform: `translateX(${off > 0 ? 260 : -260}%) scale(0.72)`,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }
  }

  /* Touch */
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const d = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(d) > 44) d > 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!ads.length) return null

  return (
    <section
      className="relative py-10 lg:py-16 select-none overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #07010f 0%, #060116 45%, #05010d 100%)' }}
    >
      {/* ── Ambient glow orbs (desktop only) ── */}
      <div className="pointer-events-none hidden lg:block" aria-hidden>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 opacity-35"
          style={{ width: 900, height: 420, background: 'radial-gradient(ellipse at center, rgba(138,92,255,0.28) 0%, transparent 68%)', filter: 'blur(32px)' }}
        />
        <div
          className="absolute -bottom-24 left-1/4 -translate-x-1/2 opacity-20"
          style={{ width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, #d946ef, transparent 70%)', filter: 'blur(56px)' }}
        />
        <div
          className="absolute -bottom-24 right-1/4 translate-x-1/2 opacity-20"
          style={{ width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, #6d28d9, transparent 70%)', filter: 'blur(56px)' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4">

        {/* ── Header ── */}
        <div className="mb-7 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-5 w-[3px] rounded-full"
              style={{ background: 'linear-gradient(180deg,#8A5CFF 0%,rgba(138,92,255,0.08) 100%)' }}
            />
            <span
              className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[9px] font-black uppercase tracking-[0.25em]"
              style={{
                color: '#B18CFF',
                background: 'rgba(138,92,255,0.1)',
                border: '1px solid rgba(138,92,255,0.28)',
                boxShadow: '0 0 14px rgba(138,92,255,0.12)',
              }}
            >
              <Zap className="h-2.5 w-2.5 fill-current" />
              Publicidade
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: 'rgba(169,163,201,0.45)' }}>
            Patrocinados
          </span>
          <div
            className="ml-2 h-px flex-1"
            style={{ background: 'linear-gradient(90deg,rgba(138,92,255,0.22) 0%,transparent 100%)' }}
          />
        </div>

        {/* ── Stage ── */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Cards container */}
          <div
            className="relative overflow-hidden"
            style={{
              aspectRatio: '16/9',
              maxHeight: 'var(--ads-max-height, 440px)',
              borderRadius: 32,
              boxShadow: '0 0 0 1px rgba(138,92,255,0.18), 0 0 80px rgba(138,92,255,0.18), 0 40px 80px rgba(0,0,0,0.55)',
            }}
          >
            {/* Glows laterais */}
            <div className="pointer-events-none absolute -left-10 top-1/2 z-0 h-48 w-48 -translate-y-1/2 rounded-full opacity-25"
              style={{ background: 'radial-gradient(circle,#8A5CFF,transparent 70%)', filter: 'blur(36px)' }} />
            <div className="pointer-events-none absolute -right-10 top-1/2 z-0 h-48 w-48 -translate-y-1/2 rounded-full opacity-25"
              style={{ background: 'radial-gradient(circle,#8A5CFF,transparent 70%)', filter: 'blur(36px)' }} />

            {/* Cards desktop (3D) */}
            <div className="hidden lg:block h-full">
              {ads.map((ad, i) => (
                <div key={ad.id} style={cardStyle(i)}>
                  <AdCard ad={ad} active={i === current} />
                </div>
              ))}
            </div>

            {/* Card mobile (full width) */}
            <div className="absolute inset-0 lg:hidden" style={{ zIndex: 10, borderRadius: 26, overflow: 'hidden' }}>
              <AdCard ad={ads[current]} active />
            </div>
          </div>

          {/* ── Seta esquerda ── */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="hidden sm:flex absolute left-3 top-1/2 z-30 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_32px_rgba(138,92,255,0.5)] sm:left-4 sm:h-12 sm:w-12 lg:-left-7 lg:h-14 lg:w-14"
            style={{
              background: 'rgba(7,1,20,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(138,92,255,0.38)',
              boxShadow: '0 0 24px rgba(138,92,255,0.2), 0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            <ChevronLeft className="h-5 w-5 text-white lg:h-6 lg:w-6" strokeWidth={2.5} />
          </button>

          {/* ── Seta direita ── */}
          <button
            onClick={next}
            aria-label="Próximo"
            className="hidden sm:flex absolute right-3 top-1/2 z-30 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:shadow-[0_0_32px_rgba(138,92,255,0.5)] sm:right-4 sm:h-12 sm:w-12 lg:-right-7 lg:h-14 lg:w-14"
            style={{
              background: 'rgba(7,1,20,0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(138,92,255,0.38)',
              boxShadow: '0 0 24px rgba(138,92,255,0.2), 0 4px 20px rgba(0,0,0,0.6)',
            }}
          >
            <ChevronRight className="h-5 w-5 text-white lg:h-6 lg:w-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Barras de progresso ── */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="relative overflow-hidden rounded-full transition-all duration-400"
              style={{
                height: 3,
                width: i === current ? 52 : 14,
                background: 'rgba(138,92,255,0.18)',
                transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {i === current && (
                <div
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #8A5CFF, #B18CFF)',
                    boxShadow: '0 0 8px rgba(138,92,255,0.9)',
                    transition: 'width 0.04s linear',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Contador */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <span className="text-xs font-bold tabular-nums" style={{ color: '#8A5CFF' }}>
            {String(current + 1).padStart(2, '0')}
          </span>
          <span className="text-xs" style={{ color: 'rgba(169,163,201,0.25)' }}>/</span>
          <span className="text-xs tabular-nums" style={{ color: 'rgba(169,163,201,0.35)' }}>
            {String(total).padStart(2, '0')}
          </span>
        </div>

      </div>
    </section>
  )
}
