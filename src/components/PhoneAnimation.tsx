'use client'

import { useState, useEffect } from 'react'
import { MapPin, Search, Star, Shield, Zap } from 'lucide-react'

export default function PhoneAnimation() {
  const [activeScreen, setActiveScreen] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[540px]">

      {/* Pulsing glow behind phone */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[300px] rounded-full bg-violet-600/30 blur-3xl animate-glow-pulse" />

      {/* ── Floating Card 1 — Left Top — Prestador Verificado ── */}
      <div
        className="absolute left-0 top-10 z-20 hidden md:flex items-start gap-2.5 rounded-2xl border border-[#7F77DD]/30 bg-[#0d0820]/90 p-3.5 shadow-2xl backdrop-blur-xl max-w-[164px] animate-slide-in-left"
        style={{ animationDelay: '0.3s' }}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
          <Star className="h-4 w-4 fill-white text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold leading-tight text-white">Prestador Verificado ✓</p>
          <p className="mt-1 text-[10px] text-white/50">Qualidade Garantida</p>
        </div>
      </div>

      {/* ── Floating Card 2 — Right Middle — Conexão Segura ── */}
      <div
        className="absolute right-0 top-1/2 z-20 -translate-y-1/2 hidden md:flex flex-col gap-2 rounded-2xl border border-[#7F77DD]/30 bg-[#0d0820]/90 p-3.5 shadow-2xl backdrop-blur-xl max-w-[148px] animate-slide-in-right"
        style={{ animationDelay: '0.6s' }}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-[#7F77DD]">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <p className="text-[11px] font-bold leading-tight text-white">Conexão Segura</p>
        <p className="text-[10px] text-white/50">Seus dados protegidos</p>
      </div>

      {/* ── Floating Card 3 — Left Bottom — Resposta rápida ── */}
      <div
        className="absolute left-0 bottom-14 z-20 hidden md:flex items-start gap-2.5 rounded-2xl border border-[#7F77DD]/30 bg-[#0d0820]/90 p-3.5 shadow-2xl backdrop-blur-xl max-w-[164px] animate-slide-in-left"
        style={{ animationDelay: '0.9s' }}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
          <Zap className="h-4 w-4 fill-white text-white" />
        </div>
        <div>
          <p className="text-[11px] font-bold leading-tight text-white">Resposta em minutos</p>
          <p className="mt-1 text-[10px] text-white/50">Contato imediato</p>
        </div>
      </div>

      {/* ── Phone ── */}
      <div className="relative z-10 animate-float">
        {/* Glow under phone */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-14 w-48 rounded-full bg-violet-600/50 blur-2xl" />

        {/* Phone frame */}
        <div className="relative h-[480px] w-[245px] rounded-[44px] border-2 border-white/20 bg-[#0f0918] p-2.5 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
          <div className="relative h-full overflow-hidden rounded-[36px] bg-[#0d0820]">

            {/* Notch */}
            <div className="absolute top-3 left-1/2 z-30 -translate-x-1/2 h-1.5 w-14 rounded-full bg-black/70" />

            {/* ── Screen 0: Home ── */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${activeScreen === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <ScreenHome />
            </div>

            {/* ── Screen 1: Provider Profile ── */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${activeScreen === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <ScreenProfile />
            </div>

            {/* ── Screen 2: Connection Success ── */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${activeScreen === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <ScreenSuccess />
            </div>

            {/* Screen dots */}
            <div className="absolute bottom-[46px] left-1/2 z-20 flex -translate-x-1/2 gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${activeScreen === i ? 'w-4 bg-[#7F77DD]' : 'w-1 bg-white/30'}`}
                />
              ))}
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-white/10 bg-[#0d0820] px-2 py-2">
              {(['🏠', '❤️', '💬', '👤'] as const).map((icon, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-xs">{icon}</span>
                  <span className="text-[6px] text-white/40">
                    {['Início', 'Favoritos', 'Mensagens', 'Perfil'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScreenHome() {
  return (
    <div className="flex flex-col h-full pt-6">
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-500">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          <span className="text-[9px] font-bold text-white">Serviços Imperatriz</span>
        </div>
        <div className="h-3 w-3 rounded-sm border border-white/20" />
      </div>
      <div className="mx-3 mb-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2">
        <Search className="h-3 w-3 text-white/40" />
        <span className="flex-1 text-[9px] text-white/40">O que você precisa?</span>
        <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-violet-600">
          <Search className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
      <div className="px-3 mb-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[9px] font-bold text-white">Categorias</span>
          <span className="text-[8px] text-violet-400">Ver todas</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { icon: '✂️', label: 'Beleza', bg: 'bg-pink-500/25' },
            { icon: '🐾', label: 'Pet', bg: 'bg-blue-500/25' },
            { icon: '🔧', label: 'Manutenção', bg: 'bg-amber-500/25' },
            { icon: '🛵', label: 'Delivery', bg: 'bg-red-500/25' },
          ].map((c) => (
            <div key={c.label} className={`flex flex-col items-center gap-1 rounded-xl ${c.bg} p-1.5`}>
              <span className="text-base">{c.icon}</span>
              <span className="text-[7px] leading-tight text-center text-white/70">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-3 flex-1">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[9px] font-bold text-white">Em Destaque</span>
          <span className="text-[8px] text-violet-400">Ver todos</span>
        </div>
        <div className="overflow-hidden rounded-xl bg-white/5">
          <div className="relative h-20 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/20">
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[8px] font-bold text-white">5.0</span>
            </div>
          </div>
          <div className="p-2.5">
            <p className="text-[9px] font-bold text-white">Studio Beleza &amp; Cia</p>
            <p className="text-[7px] text-white/50">Salão de Beleza</p>
            <button className="mt-1.5 w-full rounded-lg bg-green-500 py-1.5 text-[8px] font-bold text-white">
              📱 WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScreenProfile() {
  return (
    <div className="flex flex-col h-full pt-6">
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="h-4 w-4 rounded-full bg-white/20" />
        <span className="text-[9px] font-bold text-white">Perfil do Prestador</span>
      </div>
      <div className="relative mx-3 h-20 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600/40 to-fuchsia-500/30">
        <div className="absolute bottom-0 left-3 translate-y-1/2">
          <div className="h-12 w-12 rounded-xl border-2 border-[#0d0820] bg-gradient-to-br from-violet-500 to-fuchsia-500" />
        </div>
      </div>
      <div className="px-3 pt-7">
        <div className="flex items-center gap-1">
          <p className="text-[10px] font-bold text-white">Espaço Bella</p>
          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-blue-500">
            <svg className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
        </div>
        <p className="text-[8px] text-violet-400">Salão de Beleza · Centro</p>
        <div className="mt-1 flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="ml-1 text-[8px] text-white/60">5.0 (128)</span>
        </div>
        <p className="mt-2 text-[8px] leading-relaxed text-white/50">
          Especialistas em corte, coloração e tratamentos capilares.
        </p>
      </div>
      <div className="mt-3 space-y-1.5 px-3">
        <button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2 text-[9px] font-bold text-white">
          Ver Portfólio
        </button>
        <button className="w-full rounded-xl bg-green-500 py-2 text-[9px] font-bold text-white">
          📱 Chamar no WhatsApp
        </button>
      </div>
    </div>
  )
}

function ScreenSuccess() {
  return (
    <div className="flex flex-col h-full pt-6">
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="h-4 w-4 rounded-full bg-white/20" />
        <span className="text-[9px] font-bold text-white">Conexão Realizada!</span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 pb-14">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
          <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-center text-[11px] font-bold text-white">Prestador Contactado!</p>
        <p className="mt-1 text-center text-[9px] leading-relaxed text-white/50">
          O prestador recebeu sua mensagem e responderá em breve
        </p>
        <div className="mt-4 w-full space-y-1.5">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 p-2.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
            <div>
              <p className="text-[9px] font-bold text-white">Espaço Bella</p>
              <p className="text-[7px] text-green-400">● Online agora</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#7F77DD]/20 p-2.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <p className="text-[9px] text-white/80">Avalie após o atendimento</p>
          </div>
        </div>
      </div>
    </div>
  )
}
