'use client'

import { useState, useEffect } from 'react'
import { X, Download, Zap, WifiOff, BellRing } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner]         = useState(false)
  const [isInstalled, setIsInstalled]       = useState(false)
  const [dismissed, setDismissed]           = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // User dismissed before
    if (sessionStorage.getItem('pwa-banner-dismissed')) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowBanner(true), 4000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowBanner(false)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
    setShowBanner(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-banner-dismissed', '1')
  }

  if (isInstalled || !showBanner || dismissed) return null

  return (
    <div
      className="fixed bottom-[72px] left-3 right-3 z-[60] md:hidden rounded-2xl p-3 flex items-center gap-3 animate-slideUp"
      style={{
        background: 'linear-gradient(135deg, rgba(13,5,30,0.97) 0%, rgba(20,8,40,0.97) 100%)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(138,92,255,0.35)',
        boxShadow: '0 8px 40px rgba(138,92,255,0.35), 0 0 0 1px rgba(138,92,255,0.1)',
      }}
    >
      <img
        src="/icons/icon-192x192.png"
        alt="Serv-Itz"
        className="h-11 w-11 rounded-xl flex-shrink-0 object-cover"
        style={{ boxShadow: '0 0 14px rgba(138,92,255,0.5)' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-white leading-tight">Instale o Serv-Itz</p>
        <p className="text-[10px] text-white/50 leading-tight mt-0.5">Acesse como um app real, sem Play Store</p>
      </div>
      <button
        onClick={handleInstall}
        className="flex-shrink-0 flex items-center gap-1 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
          boxShadow: '0 0 14px rgba(138,92,255,0.5)',
        }}
      >
        <Download className="h-3 w-3" />
        Instalar
      </button>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-lg"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

/* ── Install Section (used in page.tsx) ── */
export function InstallSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled]       = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setIsInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setDeferredPrompt(null)
  }

  if (isInstalled) return null

  const benefits = [
    { icon: Zap,     text: 'Acesso ultrarrápido' },
    { icon: BellRing,text: 'Notificações em tempo real' },
  ]

  return (
    <section
      className="px-4 py-14 sm:py-16"
      style={{ background: 'linear-gradient(180deg, #05010a 0%, #080318 50%, #05010a 100%)' }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(123,47,247,0.12) 0%, rgba(138,92,255,0.06) 50%, rgba(180,127,255,0.08) 100%)',
            border: '1px solid rgba(138,92,255,0.25)',
            boxShadow: '0 0 80px rgba(138,92,255,0.08)',
          }}
        >
          {/* Background orbs */}
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8A5CFF, transparent 70%)', filter: 'blur(40px)' }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #d946ef, transparent 70%)', filter: 'blur(40px)' }}
          />

          <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:gap-12">

            {/* App icon */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <div
                className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-[28px] overflow-hidden"
                style={{ boxShadow: '0 0 40px rgba(138,92,255,0.5), 0 0 0 1px rgba(138,92,255,0.3)' }}
              >
                <img
                  src="/icons/icon-512x512.png"
                  alt="Serv-Itz App"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.style.display = 'none'
                    el.parentElement!.style.background = 'linear-gradient(135deg, #7b2ff7, #8A5CFF)'
                  }}
                />
              </div>
              {/* Badges */}
              <div className="flex flex-col gap-1.5">
                {['App Oficial', 'Sem Play Store', 'Grátis'].map(b => (
                  <span
                    key={b}
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-center"
                    style={{
                      background: 'rgba(138,92,255,0.15)',
                      border: '1px solid rgba(138,92,255,0.3)',
                      color: '#B18CFF',
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: '#7F77DD' }}>
                Aplicativo Mobile
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Instale o{' '}
                <span
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #8A5CFF, #B18CFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Serv-Itz
                </span>{' '}
                no seu celular
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(169,163,201,0.7)' }}>
                Experiência mais rápida e fluida. Acesse como um aplicativo real, direto da tela inicial.
              </p>

              {/* Benefits */}
              <div className="mt-5 flex flex-wrap justify-center gap-4 sm:justify-start">
                {benefits.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(138,92,255,0.15)', border: '1px solid rgba(138,92,255,0.25)' }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: '#B18CFF' }} />
                    </div>
                    <span className="text-xs font-medium text-white/60">{text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 100%)',
                      boxShadow: '0 0 28px rgba(138,92,255,0.5)',
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Instalar App — Grátis
                  </button>
                ) : (
                  <div
                    className="rounded-2xl px-5 py-3 text-xs text-white/40"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Abra pelo Chrome no Android para instalar
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
