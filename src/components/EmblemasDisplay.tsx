'use client'

import { useEffect, useState } from 'react'
import { createBrowser } from '@/lib/supabase'
import type { PrestadorEmblema } from '@/types/emblemas'

interface Props {
  prestadorId: string
}

export default function EmblemasDisplay({ prestadorId }: Props) {
  const [emblemas, setEmblemas] = useState<PrestadorEmblema[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function fetchEmblemas() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = createBrowser() as any
        const { data } = await db
          .from('prestador_emblemas')
          .select('*, emblema:emblemas(*)')
          .eq('prestador_id', prestadorId)
          .order('ordem', { ascending: true })
          .limit(4)
        setEmblemas(data ?? [])
      } catch {
        setEmblemas([])
      }
      setLoading(false)
    }
    fetchEmblemas()
  }, [prestadorId])

  if (loading) return (
    <div className="flex flex-col gap-2 w-full animate-pulse">
      {[1, 2].map(i => (
        <div key={i} className="h-14 rounded-xl bg-white/5" />
      ))}
    </div>
  )

  if (emblemas.length === 0) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400/80 mb-0.5">
        ✦ Emblemas
      </p>
      {emblemas.map((pe) => {
        const e = pe.emblema
        if (!e) return null
        return (
          <div
            key={pe.id}
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 transition-transform duration-200 hover:scale-[1.02] cursor-default"
            style={{
              background:  e.cor_fundo,
              border:      `1.2px solid ${e.cor}44`,
              boxShadow:   `0 0 18px 0 ${e.cor}22`,
            }}
          >
            {/* Ícone com anel giratório */}
            <div className="relative shrink-0">
              <div
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-lg"
                style={{ background: `${e.cor}1a` }}
              >
                {e.icone}
              </div>
              {/* anel spin */}
              <div
                className="absolute inset-[-3px] rounded-full border-2 border-transparent"
                style={{
                  borderTopColor:   e.cor,
                  borderRightColor: `${e.cor}44`,
                  animation: 'spin 3s linear infinite',
                }}
              />
            </div>

            {/* Texto */}
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-bold leading-tight" style={{ color: e.cor }}>
                {e.titulo}
              </span>
              <span className="mt-0.5 text-[10px] leading-tight text-white/40">
                {e.descricao}
              </span>
            </div>

            {/* Tag SELO */}
            <span
              className="absolute right-2 top-1.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold"
              style={{
                background: `${e.cor}1a`,
                color:       e.cor,
                border:      `0.8px solid ${e.cor}44`,
              }}
            >
              SELO
            </span>

            {/* Glow radial */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 10% 50%, ${e.cor}18 0%, transparent 65%)` }}
            />
          </div>
        )
      })}
    </div>
  )
}
