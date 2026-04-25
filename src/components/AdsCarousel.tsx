'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react'

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

type Props = {
  ads: AdItem[]
}

const GAP = 16

function AdCard({ ad }: { ad: AdItem }) {
  const inner = (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f0f18] transition-all duration-300 hover:-translate-y-1 hover:border-[#7F77DD]/30 hover:shadow-[0_8px_32px_rgba(127,119,221,0.2)]">
      {/* Image */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden">
        <img
          src={ad.image_url}
          alt={ad.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        {/* Patrocinado badge */}
        <span className="absolute left-3 top-3 rounded-full bg-[#7F77DD]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          Patrocinado
        </span>
        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="truncate text-base font-bold text-white drop-shadow-lg">{ad.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        {ad.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-white/60">{ad.description}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          {ad.button_text && (
            <span className="inline-flex rounded-xl bg-[#7F77DD] px-4 py-1.5 text-xs font-semibold text-white shadow-[0_0_12px_rgba(127,119,221,0.4)]">
              {ad.button_text}
            </span>
          )}
          {ad.phone && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/50">
              <Phone className="h-3 w-3" />
              {ad.phone}
            </span>
          )}
        </div>
      </div>
    </div>
  )

  if (ad.link_url) {
    return (
      <a href={ad.link_url} target="_blank" rel="noreferrer" className="group block h-full">
        {inner}
      </a>
    )
  }
  return <div className="group h-full">{inner}</div>
}

export default function AdsCarousel({ ads }: Props) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [slideW, setSlideW] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const currentRef = useRef(current)
  currentRef.current = current

  const total = ads.length

  // Measure slide width accounting for responsive peek
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      const isLg = window.innerWidth >= 1024
      setSlideW(isLg ? Math.floor(w / 1.18) : w)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const goTo = useCallback(
    (index: number) => setCurrent(((index % total) + total) % total),
    [total]
  )
  const prev = useCallback(() => goTo(currentRef.current - 1), [goTo])
  const next = useCallback(() => goTo(currentRef.current + 1), [goTo])

  // Auto-advance
  useEffect(() => {
    if (isPaused || slideW === 0) return
    const timer = setInterval(next, 3500)
    return () => clearInterval(timer)
  }, [isPaused, slideW, next])

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 48) {
      diff > 0 ? next() : prev()
    }
    touchStartX.current = null
  }

  if (!ads || ads.length === 0) return null

  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-4">

        {/* Label */}
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full bg-[#7F77DD]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#7F77DD]">
            Publicidade
          </span>
          <span className="text-sm font-semibold text-white/50">Patrocinados</span>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel viewport */}
          <div
            ref={containerRef}
            className="overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Track */}
            <div
              className="flex"
              style={{
                gap: `${GAP}px`,
                transform:
                  slideW > 0
                    ? `translateX(-${current * (slideW + GAP)}px)`
                    : 'translateX(0)',
                transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="flex-shrink-0 w-full"
                  style={slideW > 0 ? { width: slideW } : undefined}
                >
                  <AdCard ad={ad} />
                </div>
              ))}
            </div>
          </div>

          {/* Prev arrow */}
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            aria-label="Próximo"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/70"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {ads.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-[22px] bg-[#7F77DD]'
                  : 'w-2 bg-white/25 hover:bg-white/45'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
