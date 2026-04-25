'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, UserCheck, MessageCircle, Star } from 'lucide-react'

const steps = [
  {
    number: 1,
    Icon: Search,
    title: 'Busque o serviço',
    description: 'Encontre o que precisa entre dezenas de categorias disponíveis na plataforma',
    gradient: 'from-violet-600 to-violet-700',
    glow: 'rgba(124,58,237,0.35)',
  },
  {
    number: 2,
    Icon: UserCheck,
    title: 'Escolha o prestador',
    description: 'Compare avaliações, portfólio e escolha um profissional verificado com segurança',
    gradient: 'from-fuchsia-600 to-violet-600',
    glow: 'rgba(192,38,211,0.35)',
  },
  {
    number: 3,
    Icon: MessageCircle,
    title: 'Entre em contato',
    description: 'Conecte-se diretamente via WhatsApp ou telefone, sem intermediários',
    gradient: 'from-blue-600 to-fuchsia-600',
    glow: 'rgba(37,99,235,0.35)',
  },
  {
    number: 4,
    Icon: Star,
    title: 'Avalie e indique',
    description: 'Avalie o serviço recebido e ajude outros moradores a escolherem melhor',
    gradient: 'from-emerald-600 to-blue-600',
    glow: 'rgba(5,150,105,0.35)',
  },
]

export default function HowItWorks() {
  const [visible, setVisible] = useState([false, false, false, false])
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRef = useRef<HTMLElement>(null)

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
      ref={sectionRef}
      className="px-4 py-16 sm:py-20"
      style={{ backgroundColor: '#07021a' }}
    >
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#7F77DD]">
            Simples assim
          </p>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Como funciona</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
            Conectar-se ao melhor profissional da sua cidade nunca foi tão fácil
          </p>
        </div>

        {/* Steps grid */}
        <div className="relative">

          {/* Connector line — desktop only */}
          <div
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px lg:block"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(127,119,221,0.4) 15%, rgba(127,119,221,0.4) 85%, transparent)',
            }}
          />

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ number, Icon, title, description, gradient, glow }, i) => (
              <div
                key={number}
                ref={(el) => { stepRefs.current[i] = el }}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i] ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.6s ease-out ${i * 0.15}s, transform 0.6s ease-out ${i * 0.15}s`,
                }}
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
                    style={{ boxShadow: `0 8px 32px ${glow}` }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#7F77DD] text-[11px] font-black text-white shadow-md">
                    {number}
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
