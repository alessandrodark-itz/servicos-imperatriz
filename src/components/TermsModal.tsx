'use client'

import { useState, useRef } from 'react'
import { ScrollText, Shield, CheckCircle2, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface Props {
  userType: 'prestador' | 'cliente'
  onAccept: () => void
  onDecline: () => void
}

export default function TermsModal({ userType, onAccept, onDecline }: Props) {
  const [checked,  setChecked]  = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    const el = bodyRef.current
    if (!el || scrolled) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 30) setScrolled(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/12 shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
        style={{ background: 'linear-gradient(180deg, #0e0625 0%, #09031a 100%)' }}
      >
        {/* Top gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/15 blur-3xl" />

        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/8 px-7 py-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600">
            <ScrollText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white">Termos de Uso e Responsabilidade</h2>
            <p className="text-xs text-white/45">Versão 1.0 · Última atualização: 01/05/2026</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400">
            <Shield className="h-3 w-3" /> Proteção Legal
          </div>
        </div>

        {/* Scrollable body */}
        <div
          ref={bodyRef}
          onScroll={handleScroll}
          className="max-h-[48vh] space-y-4 overflow-y-auto px-7 py-5 text-sm leading-relaxed text-white/65"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(127,119,221,0.4) transparent' }}
        >
          <p className="font-semibold text-white/90">
            Ao utilizar a plataforma Serviços Imperatriz, você concorda com os termos abaixo:
          </p>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-violet-400">Cláusula Geral</p>
            <p>
              A plataforma atua exclusivamente como ponte digital entre clientes e prestadores independentes,{' '}
              <strong className="text-white/85">não sendo responsável</strong> por serviços executados, negociações,
              valores, promessas, condutas, danos materiais, morais, financeiros ou resultados decorrentes
              das relações entre usuários.
            </p>
          </div>

          {userType === 'prestador' ? (
            <div className="space-y-3">
              <p className="font-semibold text-white/80">Termos para Prestadores de Serviço</p>
              <ul className="space-y-2.5">
                {[
                  'Você é inteiramente responsável pela qualidade, segurança e execução dos serviços prestados.',
                  'As informações fornecidas no perfil devem ser verdadeiras e atualizadas.',
                  'Você deve possuir as licenças, registros e habilitações legais exigidas para sua área de atuação.',
                  'Atendimento, qualidade e segurança são de sua exclusiva responsabilidade — a plataforma atua apenas como intermediadora digital.',
                  'Você responde por danos, fraudes, promessas falsas ou prejuízos causados a clientes.',
                  'Denúncias fundamentadas, fraudes ou violações a estes termos podem resultar em suspensão ou exclusão do perfil.',
                  'A plataforma reserva-se o direito de remover perfis que violem estes termos sem aviso prévio.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-white/80">Termos para Clientes</p>
              <ul className="space-y-2.5">
                {[
                  'A contratação de serviços é realizada por sua conta e risco.',
                  'Cabe a você avaliar a reputação e as avaliações do prestador antes de contratar.',
                  'Negociações externas à plataforma são de responsabilidade exclusiva das partes envolvidas.',
                  'A plataforma não garante execução, qualidade ou resultado dos serviços contratados.',
                  'Você deve agir legalmente e com respeito em relação aos prestadores.',
                  'Fraudes, calúnias ou abusos podem resultar em suspensão da conta.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-amber-400">Cláusula de Isenção</p>
            <p>
              Ao aceitar estes termos, você reconhece que utiliza a plataforma por livre escolha, compreendendo que
              a responsabilidade por qualquer contratação, prestação, pagamento ou disputa pertence exclusivamente
              às partes envolvidas, salvo obrigações legais inegociáveis.
            </p>
          </div>

          <p className="text-xs text-white/35">
            Dúvidas?{' '}
            <Link href="/termos" target="_blank" className="text-violet-400 hover:underline">
              Ver termos completos
            </Link>
          </p>
        </div>

        {/* Scroll hint */}
        {!scrolled && (
          <div className="flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-white/30">
            <ChevronDown className="h-3 w-3 animate-bounce" />
            Role para ler os termos completos
          </div>
        )}

        {/* Footer */}
        <div className="space-y-4 border-t border-white/8 px-7 py-5">
          {/* Checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={checked}
                onChange={e => setChecked(e.target.checked)}
                className="sr-only"
              />
              <div
                className={[
                  'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                  checked ? 'border-violet-500 bg-violet-500' : 'border-white/25 bg-transparent',
                ].join(' ')}
              >
                {checked && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-snug text-white/70">
              Li, compreendi e{' '}
              <strong className="text-white/90">aceito integralmente</strong>{' '}
              os Termos de Uso, Responsabilidade e Política da Plataforma.
            </span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 rounded-2xl border border-white/12 bg-white/5 py-3.5 text-sm font-semibold text-white/60 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white/80"
            >
              Não Aceito
            </button>
            <button
              onClick={onAccept}
              disabled={!checked}
              className="flex-1 rounded-2xl py-3.5 text-sm font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={checked ? {
                background: 'linear-gradient(135deg, #7b2ff7 0%, #8A5CFF 50%, #9b5cff 100%)',
                boxShadow: '0 0 30px rgba(138,92,255,0.45)',
              } : { background: 'rgba(138,92,255,0.2)' }}
            >
              Aceitar e Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
