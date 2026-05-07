'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, UserCheck, MessageCircle, Star } from 'lucide-react'

const steps = [
  {
    number: 1,
    Icon: Search,
    title: 'Busque o serviço',
    description: 'Encontre o que precisa entre dezenas de categorias disponíveis na plataforma',
    gradient: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
    glow: 'rgba(138,92,255,0.4)',
    borderGlow: 'rgba(138,92,255,0.25)',
  },
  {
    number: 2,
    Icon: UserCheck,
    title: 'Escolha o prestador',
    description: 'Compare avaliações, portfólio e escolha um profissional verificado com segurança',
    gradient: 'linear-gradient(135deg, #c026d3, #9333ea)',
    glow: 'rgba(192,38,211,0.4)',
    borderGlow: 'rgba(192,38,211,0.25)',
  },
  {
    number: 3,
    Icon: MessageCircle,
    title: 'Entre em contato',
    description: 'Conecte-se diretamente via WhatsApp ou telefone, sem intermediários',
    gradient: 'linear-gradient(135deg, #2563eb, #7c3aed)',
    glow: 'rgba(99,102,241,0.4)',
    borderGlow: 'rgba(99,102,241,0.25)',
  },
  {
    number: 4,
    Icon: Star,
    title: 'Avalie e indique',
    description: 'Avalie o serviço recebido e ajude outros moradores a escolherem melhor',
    gradient: 'linear-gradient(135deg, #059669, #0891b2)',
    glow: 'rgba(5,150,105,0.4)',
    borderGlow: 'rgba(5,150,105,0.25)',
  },
]

export default function HowItWorks() {
  const [visible, setVisible] = useState([false, false, false, false])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = stepRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((prev) => {
              const next = [...prev]
              next[i] = true
              return next
            })
            obs.disconnect()
          }
        },
        { threshold: 0.2 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:py-24"
      style={{ backgroundColor: '#070114' }}
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 800, height: 400,
          background: 'radial-gradient(ellipse, rgba(138,92,255,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative mx-auto max-w-7xl">

        {/* ── Header ── */}
        <div className="mb-8 sm:mb-16 text-center">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{
              background: 'rgba(138,92,255,0.1)',
              border: '1px solid rgba(138,92,255,0.22)',
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: '#8A5CFF', boxShadow: '0 0 6px #8A5CFF' }}
            />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#8A5CFF' }}>
              Simples assim
            </span>
          </div>
          <h2 className="text-2xl font-black text-white sm:text-4xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
            Conectar-se ao melhor profissional da sua cidade nunca foi tão fácil
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="relative">

          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-[2.25rem] hidden h-px lg:block"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(138,92,255,0.35) 15%, rgba(138,92,255,0.35) 85%, transparent)',
            }}
          />
          {[0,1,2,3].map(i => (
            <div
              key={i}
              aria-hidden
              className="absolute top-[calc(2.25rem-3px)] hidden h-1.5 w-1.5 rounded-full lg:block"
              style={{
                left: `calc(12.5% + ${i * 25}% - 3px)`,
                background: 'rgba(138,92,255,0.6)',
                boxShadow: '0 0 8px rgba(138,92,255,0.6)',
              }}
            />
          ))}

          <div className="grid gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, Icon, title, description, gradient, glow, borderGlow }, i) => (
              <div
                key={number}
                ref={(el) => { stepRefs.current[i] = el }}
                className="group"
                style={{
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? 'translateY(0)' : 'translateY(32px)',
                  transition: `opacity 0.65s ease-out ${i * 0.14}s, transform 0.65s ease-out ${i * 0.14}s`,
                }}
              >
                {/* Card — horizontal no mobile, vertical no sm+ */}
                <div
                  className="relative flex w-full overflow-hidden rounded-2xl sm:rounded-3xl transition-all duration-300
                             flex-row items-center gap-4 px-4 py-4
                             sm:flex-col sm:items-center sm:text-center sm:px-5 sm:py-8
                             group-hover:-translate-y-1 group-hover:shadow-[0_16px_48px_rgba(138,92,255,0.12)]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    border: `1px solid ${borderGlow}`,
                  }}
                >
                  {/* Background glow on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${glow.replace('0.4','0.1')}, transparent 70%)` }}
                  />

                  {/* Number badge */}
                  <div
                    className="absolute right-3 top-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-black text-white z-10"
                    style={{ background: gradient, boxShadow: `0 0 12px ${glow}` }}
                  >
                    {number}
                  </div>

                  {/* Icon */}
                  <div className="relative shrink-0 sm:mb-6">
                    <div
                      className="flex h-12 w-12 sm:h-[4.5rem] sm:w-[4.5rem] items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: gradient,
                        boxShadow: `0 4px 20px ${glow}, 0 0 0 1px rgba(255,255,255,0.1)`,
                      }}
                    >
                      <Icon className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col text-left sm:text-center sm:items-center">
                    <h3 className="text-sm font-bold text-white transition-colors group-hover:text-violet-300">
                      {title}
                    </h3>
                    <p className="mt-1 sm:mt-2.5 text-xs leading-relaxed text-white/42">
                      {description}
                    </p>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="pointer-events-none absolute bottom-0 left-6 right-6 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${glow.replace('0.4','0.8')}, transparent)` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA strip ── */}
        <div
          className="mt-8 sm:mt-16 flex flex-col items-center gap-5 rounded-3xl px-6 py-8 sm:px-8 sm:py-10 text-center sm:flex-row sm:justify-between sm:text-left"
          style={{
            background: 'linear-gradient(135deg, rgba(138,92,255,0.12) 0%, rgba(217,70,239,0.08) 100%)',
            border: '1px solid rgba(138,92,255,0.2)',
          }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Pronto para começar?</p>
            <h3 className="mt-1 text-xl font-black text-white sm:text-2xl">
              Encontre o profissional ideal agora
            </h3>
            <p className="mt-1 text-sm text-white/45">
              Mais de 500 prestadores verificados esperando por você
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/buscar"
              className="flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 hover:shadow-[0_0_24px_rgba(138,92,255,0.5)]"
              style={{
                background: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
                boxShadow: '0 0 20px rgba(138,92,255,0.35)',
              }}
            >
              🔍 Buscar Serviços
            </a>
            <a
              href="/prestador/cadastro"
              className="flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-bold text-white/80 transition-all hover:border-violet-500/50 hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
            >
              🚀 Sou Prestador
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
