'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { X, LogIn, Lock } from 'lucide-react'
import { createBrowser } from '@/lib/supabase'

/* ── Auth singleton ─────────────────────────────────────────────────────────
   Uma única subscription Supabase para todo o app.
   Evita N listeners (um por card) disparando N setStates em cascata.
─────────────────────────────────────────────────────────────────────────── */
type Listener = (v: boolean) => void

let _authed: boolean | null = null
let _booted = false
const _listeners = new Set<Listener>()

function subscribeAuth(fn: Listener): () => void {
  _listeners.add(fn)
  if (_authed !== null) fn(_authed) // entrega valor cacheado imediatamente

  if (!_booted) {
    _booted = true
    const sb = createBrowser()

    sb.auth.getSession().then(({ data: { session } }) => {
      const next = !!session
      if (next !== _authed) {
        _authed = next
        _listeners.forEach(l => l(_authed!))
      }
    })

    sb.auth.onAuthStateChange((_, session) => {
      const next = !!session
      if (next !== _authed) { // só notifica se o estado realmente mudou
        _authed = next
        _listeners.forEach(l => l(_authed!))
      }
    })
  }

  return () => { _listeners.delete(fn) }
}

/* ── Componente ─────────────────────────────────────────────────────────── */
interface Props {
  href: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  'aria-label'?: string
}

export default function WhatsAppLink({
  href,
  className,
  style,
  children,
  'aria-label': ariaLabel,
}: Props) {
  const pathname = usePathname()
  const [authed,    setAuthed]    = useState<boolean | null>(_authed)
  const [showModal, setShowModal] = useState(false)
  const [mounted,   setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)
    return subscribeAuth(setAuthed)
  }, [])

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (authed === true) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      setShowModal(true)
    }
  }

  const closeModal = () => setShowModal(false)

  /* ── Portal: renderiza no document.body ─────────────────────────────────
     CAUSA DO TREMOR ANTERIOR:
     O modal usava position:fixed dentro do ProviderCard, que tem
     hover:-translate-y-1.5. Enquanto esse transform está ativo na
     transição CSS, o browser posiciona o fixed relativo ao card
     (não ao viewport) — causando tremor conforme o card anima.

     Com o portal, o modal é filho direto do <body>, completamente
     fora de qualquer contexto de transform de ancestral.
  ────────────────────────────────────────────────────────────────────── */
  const modal = mounted && showModal
    ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Acesso restrito"
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            // Sem backdrop-filter — recalculado a cada re-render = flicker
            background: 'rgba(2,0,12,0.9)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '360px',
              borderRadius: '28px',
              padding: '36px 32px 32px',
              overflow: 'hidden',
              background: 'linear-gradient(145deg,#0e0524 0%,#09031a 100%)',
              border: '1px solid rgba(139,92,246,0.22)',
              boxShadow: '0 24px 72px rgba(0,0,0,0.7)',
            }}
          >
            {/* Linha neon topo */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.7) 50%,transparent)',
              pointerEvents: 'none',
            }} />

            {/* Botão fechar */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Fechar"
              style={{
                position: 'absolute', top: '14px', right: '14px',
                width: '28px', height: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <X size={14} />
            </button>

            {/* Ícone cadeado */}
            <div style={{
              margin: '0 auto 20px',
              width: '62px', height: '62px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '18px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.2)',
            }}>
              <Lock size={28} color="#34d399" />
            </div>

            <h3 style={{
              textAlign: 'center', margin: '0 0 10px',
              fontSize: '1.2rem', fontWeight: 900, color: '#fff',
            }}>
              Acesso restrito
            </h3>
            <p style={{
              textAlign: 'center', margin: 0,
              fontSize: '0.875rem', lineHeight: 1.65,
              color: 'rgba(255,255,255,0.5)',
            }}>
              Faça login para entrar em contato com o prestador pelo WhatsApp.
            </p>

            <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                onClick={closeModal}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  borderRadius: '16px', padding: '14px',
                  fontSize: '0.875rem', fontWeight: 700, color: '#fff',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg,#7b2ff7 0%,#8A5CFF 50%,#9b5cff 100%)',
                  boxShadow: '0 0 22px rgba(138,92,255,0.35)',
                }}
              >
                <LogIn size={15} />
                Entrar na conta
              </Link>

              <button
                type="button"
                onClick={closeModal}
                style={{
                  borderRadius: '16px', padding: '13px',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: 'rgba(255,255,255,0.38)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent', cursor: 'pointer',
                }}
              >
                Agora não
              </button>
            </div>
          </div>
        </div>,
        document.body  // ← âncora no body, fora de qualquer transform
      )
    : null

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={className}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </button>
      {modal}
    </>
  )
}
