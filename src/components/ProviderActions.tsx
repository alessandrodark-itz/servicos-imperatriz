'use client'

import { useState, useEffect } from 'react'
import { Share2, Check, MessageCircle } from 'lucide-react'
import WhatsAppLink from '@/components/WhatsAppLink'

/* ── Botão compartilhar ─────────────────────────────────── */
export function ShareButton({ name }: { name: string }) {
  const [state, setState] = useState<'idle' | 'copied'>('idle')

  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Confira o perfil de ${name} no Serviços Imperatriz!`,
          url,
        })
        return
      } catch { /* usuário cancelou — cai no clipboard */ }
    }
    try {
      await navigator.clipboard.writeText(url)
      setState('copied')
      setTimeout(() => setState('idle'), 2500)
    } catch { /* ignore */ }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
        state === 'copied'
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
          : 'border-white/10 bg-white/5 text-white/50 hover:border-violet-500/35 hover:bg-violet-500/10 hover:text-violet-300'
      }`}
    >
      {state === 'copied' ? (
        <><Check className="h-3.5 w-3.5" /> Link copiado!</>
      ) : (
        <><Share2 className="h-3.5 w-3.5" /> Compartilhar perfil</>
      )}
    </button>
  )
}

/* ── Botão flutuante WhatsApp ───────────────────────────── */
export function FloatingWhatsApp({ waLink, name }: { waLink: string; name: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  if (!waLink) return null

  return (
    <div
      className={`fixed bottom-6 right-4 z-50 sm:right-6 transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
    >
      <WhatsAppLink
        href={waLink}
        aria-label={`Falar com ${name} no WhatsApp`}
        className="flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.05] hover:brightness-110 active:scale-[0.97]"
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)',
          boxShadow: '0 8px 32px rgba(16,185,129,0.5)',
          animation: 'pulseFloat 2.8s ease-in-out infinite',
        }}
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="hidden sm:inline">💬 Falar no WhatsApp</span>
        <span className="sm:hidden">WhatsApp</span>
      </WhatsAppLink>
    </div>
  )
}
