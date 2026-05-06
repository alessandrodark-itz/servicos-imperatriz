'use client'

import { useEffect, useState } from 'react'
import { createBrowser } from '@/lib/supabase'
import type { Emblema } from '@/types/emblemas'

interface Props {
  prestadorId: string
}

export default function EmblemasSelector({ prestadorId }: Props) {
  const [todos,        setTodos]        = useState<Emblema[]>([])
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [loading,      setLoading]      = useState(true)
  const [busy,         setBusy]         = useState<string | null>(null)
  const [toast,        setToast]        = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = createBrowser() as any
        const [{ data: allEmblemas }, { data: meus }] = await Promise.all([
          db.from('emblemas').select('*').eq('ativo', true).order('titulo'),
          db.from('prestador_emblemas').select('emblema_id').eq('prestador_id', prestadorId),
        ])
        setTodos(allEmblemas ?? [])
        setSelecionados((meus ?? []).map((m: { emblema_id: string }) => m.emblema_id))
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [prestadorId])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  async function toggle(emblema: Emblema) {
    if (busy) return
    setBusy(emblema.id)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createBrowser() as any
      if (selecionados.includes(emblema.id)) {
        await db
          .from('prestador_emblemas')
          .delete()
          .eq('prestador_id', prestadorId)
          .eq('emblema_id', emblema.id)
        setSelecionados(prev => prev.filter(id => id !== emblema.id))
        showToast(`${emblema.icone} "${emblema.titulo}" removido`)
      } else {
        if (selecionados.length >= 4) {
          showToast('Máximo de 4 emblemas atingido')
          setBusy(null)
          return
        }
        await db.from('prestador_emblemas').insert({
          prestador_id: prestadorId,
          emblema_id:   emblema.id,
          ordem:        selecionados.length,
        })
        setSelecionados(prev => [...prev, emblema.id])
        showToast(`${emblema.icone} "${emblema.titulo}" adicionado!`)
      }
    } catch {
      showToast('Erro ao atualizar emblema')
    }
    setBusy(null)
  }

  if (loading) return (
    <div className="grid grid-cols-2 gap-2 animate-pulse">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-xl bg-white/5" />)}
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">Seus Emblemas</p>
          <p className="text-[11px] text-white/35">Aparecem no seu perfil público</p>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-bold"
          style={{
            background: selecionados.length >= 4 ? 'rgba(245,158,11,0.15)' : 'rgba(139,92,246,0.15)',
            color:       selecionados.length >= 4 ? '#f59e0b' : '#a78bfa',
          }}
        >
          {selecionados.length}/4
        </span>
      </div>

      {/* Toast */}
      {toast && (
        <div className="rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300">
          {toast}
        </div>
      )}

      {/* Grid de emblemas */}
      <div className="grid grid-cols-2 gap-2">
        {todos.map((e) => {
          const ativo     = selecionados.includes(e.id)
          const cheio     = !ativo && selecionados.length >= 4
          const isBusy    = busy === e.id

          return (
            <button
              key={e.id}
              type="button"
              onClick={() => toggle(e)}
              disabled={isBusy || (cheio)}
              className="relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                background:  ativo ? e.cor_fundo : '#ffffff08',
                border:      ativo ? `1.5px solid ${e.cor}` : '1px solid #ffffff18',
                boxShadow:   ativo ? `0 0 14px ${e.cor}33` : 'none',
                opacity:     cheio ? 0.35 : 1,
                transform:   ativo ? 'scale(1.01)' : 'scale(1)',
              }}
            >
              <span className="text-xl shrink-0 relative z-10">
                {isBusy ? '⏳' : e.icone}
              </span>

              <div className="flex min-w-0 flex-col relative z-10">
                <span
                  className="text-xs font-bold leading-tight"
                  style={{ color: ativo ? e.cor : '#ffffff99' }}
                >
                  {e.titulo}
                </span>
                <span className="mt-0.5 text-[10px] leading-tight text-white/30">
                  {e.descricao}
                </span>
              </div>

              {ativo && (
                <span
                  className="absolute right-2 top-2 text-[11px] font-black relative z-10"
                  style={{ color: e.cor }}
                >
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="text-[10px] text-white/25 text-center">
        Os emblemas aparecem instantaneamente no seu perfil público
      </p>
    </div>
  )
}
