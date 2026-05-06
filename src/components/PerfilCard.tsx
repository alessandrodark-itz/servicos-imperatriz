'use client'

import { CheckCircle2, MapPin, MessageCircle, Share2, Shield, Zap, Star, Award } from 'lucide-react'

/* ── Tipos ─────────────────────────────────────────────── */
interface EmblemaItem {
  icone: string
  titulo: string
  descricao: string
  cor: string
  corFundo: string
}

interface Props {
  name?: string
  verified?: boolean
  categoria?: string
  localizacao?: string
  avatarUrl?: string | null
  whatsappLink?: string
  emblemas?: EmblemaItem[]
}

/* ── Emblemas padrão (fallback visual) ──────────────────── */
const DEFAULT_EMBLEMAS: EmblemaItem[] = [
  { icone: '💜', titulo: 'Atencioso/a',  descricao: 'Atendimento especial',   cor: '#c084fc', corFundo: 'rgba(192,132,252,0.08)' },
  { icone: '⚔️', titulo: 'Guerreiro/a',  descricao: 'Determinado/a e forte',  cor: '#f472b6', corFundo: 'rgba(236,72,153,0.08)'  },
]

const INDICATORS = [
  { icon: Shield,  label: 'Seguro',    color: '#34d399' },
  { icon: Zap,     label: 'Rápido',    color: '#a78bfa' },
  { icon: Star,    label: 'Premium',   color: '#fbbf24' },
  { icon: Award,   label: 'Confiável', color: '#60a5fa' },
]

/* ══════════════════════════════════════════════════════════
   COMPONENTE
══════════════════════════════════════════════════════════ */
export default function PerfilCard({
  name       = 'Leticia',
  verified   = true,
  categoria  = 'Beleza',
  localizacao = 'Imperatriz, MA',
  avatarUrl  = null,
  whatsappLink = '#',
  emblemas   = DEFAULT_EMBLEMAS,
}: Props) {
  const initials = name.charAt(0).toUpperCase()

  return (
    <>
      {/* ── Keyframes injetados uma vez ── */}
      <style>{`
        @keyframes pc-border-glow {
          0%,100% {
            box-shadow:
              0 0 0 1px rgba(168,85,247,0.35),
              0 0 48px rgba(124,58,237,0.55),
              0 0 96px rgba(124,58,237,0.18);
          }
          33% {
            box-shadow:
              0 0 0 1px rgba(236,72,153,0.3),
              0 0 48px rgba(236,72,153,0.5),
              0 0 96px rgba(236,72,153,0.15);
          }
          66% {
            box-shadow:
              0 0 0 1px rgba(6,182,212,0.25),
              0 0 48px rgba(6,182,212,0.45),
              0 0 96px rgba(6,182,212,0.12);
          }
        }
        @keyframes pc-neon-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pc-photo-glow {
          0%,100% { filter: drop-shadow(0 0 18px rgba(168,85,247,0.85)); }
          33%     { filter: drop-shadow(0 0 18px rgba(236,72,153,0.85)); }
          66%     { filter: drop-shadow(0 0 18px rgba(6,182,212,0.85));  }
        }
        @keyframes pc-online {
          0%,100% { opacity:1; transform:scale(1);    }
          50%      { opacity:.5; transform:scale(.8); }
        }
        @keyframes pc-wa-glow {
          0%,100% { box-shadow: 0 0 22px rgba(16,185,129,0.5); }
          50%      { box-shadow: 0 0 40px rgba(16,185,129,0.85), 0 0 0 4px rgba(16,185,129,0.1); }
        }
        .pc-card    { animation: pc-border-glow  5s ease-in-out infinite; }
        .pc-spin    { animation: pc-neon-spin    3.5s linear infinite; }
        .pc-pglow   { animation: pc-photo-glow   5s ease-in-out infinite; }
        .pc-dot     { animation: pc-online       2s ease-in-out infinite; }
        .pc-wa      { animation: pc-wa-glow      2.5s ease-in-out infinite; }
      `}</style>

      <div
        className="pc-card relative w-full max-w-[780px] overflow-hidden"
        style={{
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0b0120 0%, #0f0630 45%, #080320 75%, #050014 100%)',
        }}
      >
        {/* Linha brilhante no topo */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.7) 50%, transparent)' }}
        />
        {/* Glow radial de fundo */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: 'rgba(124,58,237,0.12)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-40 h-48 w-48 rounded-full blur-3xl"
          style={{ background: 'rgba(236,72,153,0.07)' }}
        />

        <div className="flex">

          {/* ══ FOTO 9:16 com borda neon giratória ══ */}
          <div
            className="pc-pglow relative shrink-0"
            style={{ width: '200px', minHeight: '420px', overflow: 'hidden', borderRadius: '22px 0 0 22px' }}
          >
            {/* Conic gradient girando */}
            <div
              className="pc-spin absolute"
              style={{
                width: '200%',
                height: '200%',
                top: '-50%',
                left: '-50%',
                background:
                  'conic-gradient(from 0deg, #7b2ff7 0%, #a855f7 14%, #ec4899 28%, #f43f5e 40%, #fb923c 50%, #facc15 58%, #06b6d4 68%, #3b82f6 80%, #8b5cf6 90%, #7b2ff7 100%)',
              }}
            />

            {/* Foto — 3px inset nas bordas visíveis */}
            <div
              className="absolute overflow-hidden"
              style={{ top: '3px', left: '3px', right: '0', bottom: '3px' }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full select-none items-center justify-center text-[5rem] font-black text-white"
                  style={{ background: 'linear-gradient(155deg, #1a0640 0%, #4c1d95 55%, #6d28d9 100%)' }}
                >
                  {initials}
                </div>
              )}

              {/* Reflexo brilhante */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 45%)' }}
              />
              {/* Degradê base para o indicador online */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28"
                style={{ background: 'linear-gradient(0deg, rgba(5,0,20,0.85) 0%, transparent 100%)' }}
              />
            </div>

            {/* Indicador Online */}
            <div
              className="absolute bottom-4 left-3 z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1.5"
              style={{
                background: 'rgba(4,0,18,0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(52,211,153,0.3)',
              }}
            >
              <div
                className="pc-dot h-2 w-2 rounded-full bg-emerald-400"
                style={{ boxShadow: '0 0 8px rgba(52,211,153,1)' }}
              />
              <span className="text-[10px] font-bold text-emerald-400">Online agora</span>
            </div>
          </div>

          {/* ══ CONTEÚDO DIREITO ══ */}
          <div className="flex flex-1 flex-col justify-center gap-5 p-6">

            {/* Nome + verificação + categoria + localização */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2
                  className="text-[2rem] font-black leading-none tracking-tight"
                  style={{
                    background: 'linear-gradient(90deg, #ffffff 0%, #e9d5ff 55%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {name}
                </h2>
                {verified && (
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0"
                    style={{ color: '#a78bfa', filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.9))' }}
                  />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-0.5 text-[11px] font-bold"
                  style={{
                    background: 'rgba(139,92,246,0.18)',
                    border: '1px solid rgba(139,92,246,0.4)',
                    color: '#c4b5fd',
                    boxShadow: '0 0 10px rgba(139,92,246,0.15)',
                  }}
                >
                  {categoria}
                </span>
                {localizacao && (
                  <span className="flex items-center gap-1 text-xs text-white/40">
                    <MapPin className="h-3 w-3 text-fuchsia-400" />
                    {localizacao}
                  </span>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span
                  className="pc-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 6px rgba(52,211,153,1)' }}
                />
                Disponível agora
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-violet-300/70">
                <Zap className="h-3 w-3 text-violet-400" />
                Responde rápido
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-white/35">
                <Shield className="h-3 w-3 text-emerald-400/60" />
                Perfil verificado
              </span>
            </div>

            {/* Botões */}
            <div className="flex flex-wrap gap-2.5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="pc-wa group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 55%, #34d399 100%)' }}
              >
                {/* Shimmer */}
                <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-[100%]" />
                <MessageCircle className="relative h-4 w-4" />
                <span className="relative">Chamar no WhatsApp</span>
              </a>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-white/65 transition-all hover:border-white/25 hover:bg-white/8 hover:text-white"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                <Share2 className="h-3.5 w-3.5" />
                Compartilhar perfil
              </button>
            </div>

            {/* Separador neon */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.45) 0%, rgba(236,72,153,0.18) 55%, transparent 100%)' }}
            />

            {/* Emblemas */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white/28">
                ✦ Emblemas
              </p>
              <div className="flex flex-col gap-2">
                {emblemas.slice(0, 4).map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-transform duration-200 hover:scale-[1.02]"
                    style={{
                      background: e.corFundo,
                      border: `1px solid ${e.cor}33`,
                      boxShadow: `0 0 18px ${e.cor}18`,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[15px]"
                      style={{
                        background: `${e.cor}1a`,
                        boxShadow: `0 0 12px ${e.cor}55`,
                      }}
                    >
                      {e.icone}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-tight" style={{ color: e.cor }}>
                        {e.titulo}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-tight text-white/35">
                        {e.descricao}
                      </p>
                    </div>

                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold"
                      style={{
                        background: `${e.cor}15`,
                        color: e.cor,
                        border: `0.8px solid ${e.cor}40`,
                      }}
                    >
                      SELO
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ══ RODAPÉ — 4 indicadores ══ */}
        <div
          className="flex items-center justify-around px-6 py-4"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.018)',
          }}
        >
          {INDICATORS.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{
                  background: `${color}12`,
                  border: `1px solid ${color}28`,
                  boxShadow: `0 0 12px ${color}25`,
                }}
              >
                <Icon className="h-4 w-4" style={{ color, filter: `drop-shadow(0 0 4px ${color}90)` }} />
              </div>
              <span className="text-[10px] font-semibold" style={{ color: `${color}cc` }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Linha brilhante no rodapé */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4) 50%, transparent)' }}
        />
      </div>
    </>
  )
}
