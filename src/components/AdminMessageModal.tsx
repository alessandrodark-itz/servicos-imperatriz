'use client'

import { AlertTriangle, AlertCircle, Info, CheckCircle, Shield, Zap, DollarSign, Lock } from 'lucide-react'
import { useState } from 'react'

export type AdminMsgReceipt = {
  id: string
  message_id: string
  admin_messages: {
    id: string
    title: string
    body: string
    type: string
    priority: string
    requires_acknowledgment: boolean
    created_at: string
  }
}

const TYPE_CFG = {
  info:      { icon: Info,          label: 'Informativo',       bg: 'bg-blue-500/20',    text: 'text-blue-300',    border: 'border-blue-500/30' },
  warning:   { icon: AlertTriangle, label: 'Aviso',             bg: 'bg-orange-500/20',  text: 'text-orange-300',  border: 'border-orange-500/30' },
  legal:     { icon: Shield,        label: 'Atualização Legal', bg: 'bg-violet-500/20',  text: 'text-violet-300',  border: 'border-violet-500/30' },
  strike:    { icon: AlertCircle,   label: 'Advertência',       bg: 'bg-red-500/20',     text: 'text-red-300',     border: 'border-red-500/30' },
  emergency: { icon: Zap,           label: 'Emergencial',       bg: 'bg-red-600/30',     text: 'text-red-200',     border: 'border-red-400/50' },
  financial: { icon: DollarSign,    label: 'Financeiro',        bg: 'bg-green-500/20',   text: 'text-green-300',   border: 'border-green-500/30' },
  security:  { icon: Lock,          label: 'Segurança',         bg: 'bg-yellow-500/20',  text: 'text-yellow-300',  border: 'border-yellow-500/30' },
  success:   { icon: CheckCircle,   label: 'Notícia',           bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
} as const

const PRIO_CFG = {
  low:      { label: 'Baixa',   ring: 'ring-white/10',      grad: 'from-[#0c0618] to-[#0c0618]' },
  medium:   { label: 'Média',   ring: 'ring-violet-500/30', grad: 'from-violet-900/50 to-[#0c0618]' },
  high:     { label: 'Alta',    ring: 'ring-orange-500/50', grad: 'from-orange-900/40 to-[#0c0618]' },
  critical: { label: 'Crítica', ring: 'ring-red-500/70',    grad: 'from-red-900/60 to-[#0c0618]' },
} as const

export default function AdminMessageModal({
  msg,
  total,
  current,
  onAcknowledge,
  onDismiss,
}: {
  msg: AdminMsgReceipt
  total: number
  current: number
  onAcknowledge: (receiptId: string, messageId: string) => Promise<void>
  onDismiss?: (receiptId: string, messageId: string) => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const m = msg.admin_messages
  const cfg  = TYPE_CFG[m.type as keyof typeof TYPE_CFG]  ?? TYPE_CFG.info
  const prio = PRIO_CFG[m.priority as keyof typeof PRIO_CFG] ?? PRIO_CFG.medium
  const Icon = cfg.icon
  const isCritical = m.priority === 'critical'

  async function handleAck() {
    setLoading(true)
    await onAcknowledge(msg.id, m.id)
    setLoading(false)
  }

  async function handleDismiss() {
    if (!onDismiss) return
    setLoading(true)
    await onDismiss(msg.id, m.id)
    setLoading(false)
  }

  const canDismiss = !m.requires_acknowledgment && !isCritical && !!onDismiss

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        backdropFilter: 'blur(10px)',
        background: isCritical ? 'rgba(60,0,0,0.72)' : 'rgba(5,1,10,0.78)',
      }}
    >
      {isCritical && (
        <div className="pointer-events-none absolute inset-0 animate-pulse"
          style={{ background: 'radial-gradient(circle at center, rgba(220,38,38,0.14) 0%, transparent 65%)' }} />
      )}

      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.9)] ring-2 ${prio.ring}`}
        style={{ background: '#0c0618' }}
      >
        {/* Top accent line */}
        <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${isCritical ? 'from-red-500 via-red-400 to-orange-500' : 'from-transparent via-violet-500/70 to-transparent'}`} />

        {/* Header gradient zone */}
        <div className={`bg-gradient-to-b ${prio.grad} px-6 pb-5 pt-6`}>
          <div className="flex items-start gap-4">
            <div className={`shrink-0 rounded-2xl p-3 ${cfg.bg} ring-1 ${cfg.border}`}>
              <Icon className={`h-6 w-6 ${cfg.text}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
                  {cfg.label}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  isCritical ? 'bg-red-500/30 text-red-300'
                  : m.priority === 'high' ? 'bg-orange-500/20 text-orange-300'
                  : 'bg-white/8 text-white/35'
                }`}>
                  {prio.label}
                </span>
                {m.requires_acknowledgment && (
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
                    Confirmação obrigatória
                  </span>
                )}
                {total > 1 && (
                  <span className="ml-auto text-[10px] text-white/30">{current} de {total}</span>
                )}
              </div>
              <h2 className="mt-2.5 text-lg font-bold leading-snug text-white">{m.title}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-white/70">{m.body}</p>

          {m.requires_acknowledgment && (
            <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/8 p-3.5">
              <p className="text-xs leading-relaxed text-amber-300/80">
                ⚠️ Esta mensagem requer sua confirmação de recebimento. Ao confirmar, você declara ciência oficial das informações acima e assume as obrigações descritas.
              </p>
            </div>
          )}

          <p className="mt-4 text-[10px] text-white/25">
            Administração · {new Date(m.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-white/8 px-6 py-4">
          {canDismiss && (
            <button
              onClick={handleDismiss}
              disabled={loading}
              className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/50 transition-all hover:bg-white/5 hover:text-white disabled:opacity-40"
            >
              Ler depois
            </button>
          )}
          <button
            onClick={handleAck}
            disabled={loading}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 ${
              isCritical
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
                : 'bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-400'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Confirmando...
              </span>
            ) : (
              <><CheckCircle className="h-4 w-4" /> Confirmo Recebimento</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
