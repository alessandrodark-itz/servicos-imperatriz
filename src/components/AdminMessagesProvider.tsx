'use client'

import {
  createContext, useContext, useEffect, useState, useCallback, useRef,
  type ReactNode,
} from 'react'
import { createBrowser } from '@/lib/supabase'
import {
  AlertTriangle, AlertCircle, Info, CheckCircle,
  Shield, Zap, DollarSign, Lock, Clock,
} from 'lucide-react'

/* ─── Types ─────────────────────────────────────── */
export type AdminMsgReceipt = {
  id: string
  message_id: string
  acknowledgment_deadline: string | null
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

type Ctx = { pendingCount: number }

/* ─── Context ────────────────────────────────────── */
const AdminMsgCtx = createContext<Ctx>({ pendingCount: 0 })
export function useAdminMessages() { return useContext(AdminMsgCtx) }

/* ─── Config maps ────────────────────────────────── */
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

const PRIORITY_ACCENT = {
  low:      { glow: 'rgba(139,92,246,0.25)', ring: 'rgba(139,92,246,0.45)', bar: 'from-violet-600 via-fuchsia-500 to-violet-600', shadow: '0_0_60px_rgba(139,92,246,0.3)' },
  medium:   { glow: 'rgba(139,92,246,0.30)', ring: 'rgba(139,92,246,0.55)', bar: 'from-violet-500 via-fuchsia-400 to-violet-500', shadow: '0_0_80px_rgba(139,92,246,0.4)' },
  high:     { glow: 'rgba(251,146,60,0.25)', ring: 'rgba(251,146,60,0.50)', bar: 'from-orange-500 via-red-400 to-orange-500',    shadow: '0_0_80px_rgba(251,146,60,0.35)' },
  critical: { glow: 'rgba(220,38,38,0.35)',  ring: 'rgba(220,38,38,0.70)', bar: 'from-red-600 via-red-400 to-red-600',          shadow: '0_0_100px_rgba(220,38,38,0.5)' },
} as const

/* ─── Keyframes shared ───────────────────────────── */
const KEYFRAMES = `
  @keyframes adminFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes adminScaleIn { from{opacity:0;transform:scale(0.90) translateY(24px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes suspensionPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
  .admin-overlay { animation: adminFadeIn 0.25s ease forwards }
  .admin-card    { animation: adminScaleIn 0.38s cubic-bezier(0.34,1.42,0.64,1) forwards }
  .suspension-pulse { animation: suspensionPulse 2.5s ease-in-out infinite }
`

/* ═══════════════════════════════════════════════════
   MURO DE SUSPENSÃO — bloqueia 100% do site
═══════════════════════════════════════════════════ */
function SuspensionWall({ receipt, onConfirm }: {
  receipt: AdminMsgReceipt
  onConfirm: () => Promise<void>
}) {
  const [loading, setLoading] = useState(false)
  const m = receipt.admin_messages

  async function confirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className="admin-overlay fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 sm:p-6"
        style={{
          backdropFilter: 'blur(20px) saturate(0.4)',
          background: 'radial-gradient(ellipse at center, rgba(80,0,0,0.95) 0%, rgba(3,0,8,0.99) 100%)',
        }}
      >
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div style={{ width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="admin-card relative w-full max-w-lg"
          style={{ borderRadius: 28, border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 100px rgba(0,0,0,0.95)', outline: '2px solid rgba(220,38,38,0.6)', outlineOffset: 3, background: '#08020e' }}>

          {/* Top bar */}
          <div className="h-1.5 w-full rounded-t-[28px] bg-gradient-to-r from-red-700 via-red-400 to-red-700 suspension-pulse" />

          {/* Header */}
          <div className="flex flex-col items-center px-8 pt-8 pb-6"
            style={{ background: 'linear-gradient(180deg, rgba(180,0,0,0.15) 0%, transparent 100%)' }}>
            <div className="relative mb-4">
              <div className="absolute inset-0 rounded-2xl suspension-pulse" style={{ background: 'rgba(220,38,38,0.4)', filter: 'blur(16px)', transform: 'scale(1.5)' }} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #991b1b, #dc2626)', boxShadow: '0 8px 32px rgba(220,38,38,0.5)' }}>
                <Lock className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400/80">
              Conta Suspensa Temporariamente
            </p>
            <p className="mt-0.5 text-base font-black text-white">Serviços Imperatriz</p>
            <div className="mt-4 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent)' }} />
          </div>

          {/* Conteúdo */}
          <div className="px-8 pb-2">
            <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
              <span className="rounded-full bg-red-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-red-300">
                Confirmação Obrigatória Vencida
              </span>
              <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white/40">
                Acesso Restrito
              </span>
            </div>

            <p className="mb-3 text-center text-sm font-medium text-white/50">
              A comunicação administrativa abaixo não foi confirmada dentro do prazo legal.
            </p>

            <h2 className="text-center text-xl font-black leading-tight text-white">{m.title}</h2>

            <div className="my-5 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)' }} />

            <p className="text-center text-[15px] leading-relaxed text-white/70">{m.body}</p>

            {/* Aviso de suspensão */}
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/8 px-5 py-4">
              <p className="text-center text-xs leading-relaxed text-red-300/90">
                🔒 Sua conta permanecerá restrita até que você confirme oficialmente o recebimento deste comunicado.
                Após a confirmação, o acesso será restaurado automaticamente.
              </p>
            </div>

            <p className="mt-4 text-center text-[10px] text-white/20">
              Emitido em {new Date(m.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Ação */}
          <div className="px-8 pb-8 pt-5">
            <button
              onClick={confirm}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold text-white disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #991b1b, #dc2626)', boxShadow: '0 8px 32px rgba(220,38,38,0.5)' }}
            >
              {loading
                ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Confirmando...</>
                : <><CheckCircle className="h-5 w-5" />Confirmar Recebimento e Restaurar Acesso</>}
            </button>
            <p className="mt-3 text-center text-xs text-white/25">
              Ao confirmar, você declara ciência oficial deste comunicado administrativo.
            </p>
          </div>

          <div className="h-0.5 w-full rounded-b-[28px] bg-gradient-to-r from-red-700 via-red-400 to-red-700 opacity-40 suspension-pulse" />
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   MODAL OFICIAL — para mensagens normais
═══════════════════════════════════════════════════ */
function AdminOfficialModal({ msg, onAck, onDismiss, total }: {
  msg: AdminMsgReceipt
  onAck: () => Promise<void>
  onDismiss: () => Promise<void>
  total: number
}) {
  const [loading, setLoading] = useState(false)
  const m      = msg.admin_messages
  const tcfg   = TYPE_CFG[m.type as keyof typeof TYPE_CFG] ?? TYPE_CFG.info
  const pcfg   = PRIORITY_ACCENT[m.priority as keyof typeof PRIORITY_ACCENT] ?? PRIORITY_ACCENT.medium
  const isCrit = m.priority === 'critical'
  const canDismiss = !m.requires_acknowledgment && !isCrit

  // Deadline countdown
  const deadline = msg.acknowledgment_deadline ? new Date(msg.acknowledgment_deadline) : null
  const now = new Date()
  const msLeft = deadline ? deadline.getTime() - now.getTime() : null
  const hoursLeft = msLeft != null ? Math.max(0, Math.floor(msLeft / 3_600_000)) : null
  const minutesLeft = msLeft != null ? Math.max(0, Math.floor((msLeft % 3_600_000) / 60_000)) : null
  const isUrgent = msLeft != null && msLeft < 3_600_000 // menos de 1h

  async function ack() { setLoading(true); await onAck(); setLoading(false) }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div
        className="admin-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
        style={{
          backdropFilter: 'blur(14px) saturate(0.6)',
          background: isCrit
            ? 'radial-gradient(ellipse at center, rgba(60,0,0,0.88) 0%, rgba(5,1,10,0.96) 100%)'
            : 'radial-gradient(ellipse at center, rgba(20,5,40,0.88) 0%, rgba(5,1,10,0.96) 100%)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
          <div style={{ width: 520, height: 520, borderRadius: '50%', background: `radial-gradient(circle, ${pcfg.glow} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
        </div>

        <div className="admin-card relative w-full max-w-lg overflow-hidden"
          style={{ borderRadius: 28, border: '1px solid rgba(255,255,255,0.08)', boxShadow: `0 32px 80px rgba(0,0,0,0.9), ${pcfg.shadow}`, outline: `2px solid ${pcfg.ring}`, outlineOffset: 2, background: '#080312' }}>

          <div className={`h-1 w-full bg-gradient-to-r ${pcfg.bar}`} />

          <div className="flex flex-col items-center px-8 pt-8 pb-6"
            style={{ background: 'linear-gradient(180deg, rgba(109,40,217,0.12) 0%, transparent 100%)' }}>
            <div className="relative mb-4">
              <div className="absolute inset-0 animate-pulse rounded-2xl" style={{ background: pcfg.glow, filter: 'blur(12px)', transform: 'scale(1.4)' }} />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #6d28d9, #a21caf)', boxShadow: `0 8px 32px ${pcfg.glow}` }}>
                <Shield className="h-8 w-8 text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-400/80">Administração Oficial</p>
            <p className="mt-0.5 text-base font-black text-white">Serviços Imperatriz</p>
            <div className="mt-4 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />
          </div>

          <div className="px-8 pb-2">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${tcfg.bg} ${tcfg.text}`}>
                {tcfg.label}
              </span>
              {isCrit && <span className="rounded-full bg-red-500/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-red-300">Prioridade Crítica</span>}
              {m.requires_acknowledgment && <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-300">Confirmação Obrigatória</span>}
              {total > 1 && <span className="ml-auto text-[10px] text-white/30">1 de {total}</span>}
            </div>

            {/* Countdown de prazo */}
            {deadline && msLeft != null && msLeft > 0 && (
              <div className={`mb-4 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 ${isUrgent ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/20 bg-amber-500/8'}`}>
                <Clock className={`h-4 w-4 flex-shrink-0 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`} />
                <p className={`text-xs font-semibold ${isUrgent ? 'text-red-300' : 'text-amber-300'}`}>
                  {isUrgent
                    ? `⚠️ Prazo vencendo em ${minutesLeft} minutos — confirme agora!`
                    : `Prazo para confirmação: ${hoursLeft}h ${minutesLeft}min restantes`}
                </p>
              </div>
            )}
            {deadline && msLeft != null && msLeft <= 0 && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/15 px-4 py-2.5">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                <p className="text-xs font-semibold text-red-300">Prazo expirado — confirme imediatamente para evitar suspensão.</p>
              </div>
            )}

            <p className="mb-3 text-center text-sm font-medium text-white/50">Você tem um comunicado oficial da administração</p>
            <h2 className="text-center text-2xl font-black leading-tight text-white">{m.title}</h2>
            <div className="my-5 h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
            <p className="text-center text-[15px] leading-relaxed text-white/70">{m.body}</p>

            {m.requires_acknowledgment && (
              <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/6 px-5 py-4">
                <p className="text-center text-xs leading-relaxed text-amber-300/80">
                  ⚠️ Ao confirmar, você declara ciência oficial deste comunicado e das obrigações descritas.
                </p>
              </div>
            )}

            <p className="mt-5 text-center text-[10px] text-white/20">
              Emitido pela administração em {new Date(m.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="flex flex-col gap-2 px-8 pb-8 pt-5">
            <button onClick={ack} disabled={loading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold text-white disabled:opacity-60"
              style={{ backgroundImage: `linear-gradient(135deg, ${isCrit ? '#dc2626, #ef4444' : '#7c3aed, #a21caf'})`, boxShadow: isCrit ? '0 8px 32px rgba(220,38,38,0.45)' : '0 8px 32px rgba(109,40,217,0.45)' }}>
              {loading ? <><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />Confirmando...</> : <><CheckCircle className="h-5 w-5" />Confirmar Recebimento</>}
            </button>
            {canDismiss && (
              <button onClick={onDismiss} className="w-full rounded-2xl border border-white/10 py-3 text-sm text-white/40 hover:border-white/20 hover:text-white/60">
                Ler depois
              </button>
            )}
          </div>

          <div className={`h-0.5 w-full bg-gradient-to-r ${pcfg.bar} opacity-30`} />
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════
   PROVIDER GLOBAL
═══════════════════════════════════════════════════ */
const POLL_INTERVAL = 30_000

export default function AdminMessagesProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue]             = useState<AdminMsgReceipt[]>([])
  const [suspended, setSuspended]     = useState(false)
  const [overdueReceipt, setOverdue]  = useState<AdminMsgReceipt | null>(null)
  const tokenRef                      = useRef<string | null>(null)
  const timerRef                      = useRef<ReturnType<typeof setInterval> | null>(null)
  const dismissedRef                  = useRef<Set<string>>(new Set())

  const checkCompliance = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/account/compliance', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.suspended && data.overdue_receipt) {
        setSuspended(true)
        setOverdue(data.overdue_receipt as AdminMsgReceipt)
      } else {
        setSuspended(false)
        setOverdue(null)
      }
    } catch { /* silent */ }
  }, [])

  const fetchPending = useCallback(async (token: string) => {
    try {
      const res = await fetch('/api/messages/me', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      if (!res.ok) return
      const data: AdminMsgReceipt[] = await res.json()
      const fresh = data.filter(r => r.admin_messages?.id && !dismissedRef.current.has(r.id))
      setQueue(fresh)

      // Verifica se algum receipt tem prazo vencido
      const now = Date.now()
      const overdue = fresh.filter(r =>
        r.admin_messages.requires_acknowledgment &&
        r.acknowledgment_deadline &&
        new Date(r.acknowledgment_deadline).getTime() < now
      )
      if (overdue.length > 0) {
        // Chama compliance para registrar suspensão no DB
        await checkCompliance(token)
      }
    } catch { /* silent */ }
  }, [checkCompliance])

  useEffect(() => {
    const supabase = createBrowser()
    let channel: ReturnType<typeof supabase.channel> | null = null

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      const tok = session.access_token
      tokenRef.current = tok
      checkCompliance(tok)
      fetchPending(tok)
      timerRef.current = setInterval(() => {
        fetchPending(tok)
      }, POLL_INTERVAL)

      try {
        channel = supabase
          .channel(`admin_global_${session.user.id}`)
          .on('postgres_changes' as any, {
            event: 'INSERT', schema: 'public',
            table: 'user_message_receipts',
            filter: `user_id=eq.${session.user.id}`,
          }, () => fetchPending(tok))
          .subscribe()
      } catch { /* polling covers it */ }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) {
        const tok = session.access_token
        tokenRef.current = tok
        checkCompliance(tok)
        fetchPending(tok)
        if (!timerRef.current) {
          timerRef.current = setInterval(() => fetchPending(tok), POLL_INTERVAL)
        }
      } else {
        tokenRef.current = null
        setQueue([])
        setSuspended(false)
        setOverdue(null)
        dismissedRef.current.clear()
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
      }
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
      if (timerRef.current) clearInterval(timerRef.current)
      subscription.unsubscribe()
    }
  }, [fetchPending, checkCompliance])

  async function acknowledge(receiptId: string, messageId: string) {
    dismissedRef.current.add(receiptId)
    setQueue(q => q.filter(r => r.id !== receiptId))

    const tok = tokenRef.current
    if (!tok) return
    await fetch(`/api/messages/${messageId}/acknowledge`, { method: 'POST', headers: { Authorization: `Bearer ${tok}` } })

    // Re-verifica compliance após confirmar (pode ter desuspendido)
    if (suspended) {
      await checkCompliance(tok)
      await fetchPending(tok)
    }
  }

  async function acknowledgeOverdue() {
    if (!overdueReceipt || !tokenRef.current) return
    const tok = tokenRef.current
    const msgId = overdueReceipt.admin_messages.id
    dismissedRef.current.add(overdueReceipt.id)
    setOverdue(null)
    await fetch(`/api/messages/${msgId}/acknowledge`, { method: 'POST', headers: { Authorization: `Bearer ${tok}` } })
    // Re-verifica compliance — pode ainda ter outros vencidos
    await checkCompliance(tok)
    await fetchPending(tok)
  }

  async function dismiss(receiptId: string, messageId: string) {
    await acknowledge(receiptId, messageId)
  }

  const PRIO_ORDER = { critical: 4, high: 3, medium: 2, low: 1 }
  const sorted = [...queue].sort((a, b) =>
    (PRIO_ORDER[b.admin_messages.priority as keyof typeof PRIO_ORDER] ?? 0) -
    (PRIO_ORDER[a.admin_messages.priority as keyof typeof PRIO_ORDER] ?? 0)
  )
  const current = sorted[0]

  return (
    <AdminMsgCtx.Provider value={{ pendingCount: queue.length }}>
      {children}

      {/* Muro de suspensão — máxima prioridade, z-index absoluto */}
      {suspended && overdueReceipt && (
        <SuspensionWall receipt={overdueReceipt} onConfirm={acknowledgeOverdue} />
      )}

      {/* Modal oficial para mensagens normais — só aparece se não suspenso */}
      {!suspended && current && (
        <AdminOfficialModal
          msg={current}
          total={queue.length}
          onAck={() => acknowledge(current.id, current.admin_messages.id)}
          onDismiss={() => dismiss(current.id, current.admin_messages.id)}
        />
      )}
    </AdminMsgCtx.Provider>
  )
}

/* Badge */
export function AdminMessageBadge() {
  const { pendingCount } = useAdminMessages()
  if (pendingCount === 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg">
      {pendingCount > 9 ? '9+' : pendingCount}
    </span>
  )
}
