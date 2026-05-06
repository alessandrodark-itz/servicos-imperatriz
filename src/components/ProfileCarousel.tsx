'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Award } from 'lucide-react'

interface Props {
  images: string[]
  coverPosition?: string
  name: string
}

export default function ProfileCarousel({ images, coverPosition = 'center', name }: Props) {
  const [current,       setCurrent]       = useState(0)
  const [isTransition,  setIsTransition]  = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const valid = images.filter(Boolean)
  const count = valid.length

  const startTimer = useCallback(() => {
    if (count <= 1) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % count), 5000)
  }, [count])

  useEffect(() => {
    startTimer()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [startTimer])

  const goTo = useCallback((idx: number) => {
    if (isTransition || idx === current) return
    setIsTransition(true)
    setCurrent(idx)
    startTimer()
    setTimeout(() => setIsTransition(false), 700)
  }, [isTransition, current, startTimer])

  if (count === 0) return (
    <div className="flex h-full w-full items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0a3a 0%, #2d1b69 50%, #4a1080 100%)' }}>
      <Award className="h-24 w-24 text-white/10" />
    </div>
  )

  return (
    <div className="group relative h-full w-full overflow-hidden">

      {/* ── Slides with crossfade ── */}
      {valid.map((img, i) => (
        <div key={i}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity:    i === current ? 1 : 0,
            zIndex:     i === current ? 1 : 0,
            transition: 'opacity 850ms ease-in-out',
            background: '#07010f',
          }}>
          <img src={img} alt={`${name} · foto ${i + 1}`}
            className="h-full w-full"
            style={{ objectFit: 'contain', objectPosition: 'center' }} />
        </div>
      ))}

      {/* ── Left arrow ── */}
      {count > 1 && (
        <button onClick={() => goTo((current - 1 + count) % count)} aria-label="Anterior"
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-black/65 hover:shadow-[0_0_24px_rgba(0,0,0,0.6)] group-hover:opacity-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      {/* ── Right arrow ── */}
      {count > 1 && (
        <button onClick={() => goTo((current + 1) % count)} aria-label="Próxima"
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:border-white/35 hover:bg-black/65 hover:shadow-[0_0_24px_rgba(0,0,0,0.6)] group-hover:opacity-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* ── Pill progress dots ── */}
      {count > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 flex items-center gap-1.5">
          {valid.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Foto ${i + 1}`}
              className={[
                'rounded-full transition-all duration-500 ease-out',
                i === current
                  ? 'h-[5px] w-10 bg-white shadow-[0_0_14px_rgba(255,255,255,0.95)]'
                  : 'h-[5px] w-[5px] bg-white/35 hover:bg-white/65',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {/* ── Counter badge ── */}
      {count > 1 && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
          <span className="text-white">{current + 1}</span>
          <span className="text-white/30">/</span>
          <span className="text-white/50">{count}</span>
        </div>
      )}

    </div>
  )
}
