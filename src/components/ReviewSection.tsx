'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Star, MessageSquare, Send, Loader2, CheckCircle,
  LogIn, AlertCircle, Flag, Reply, X, CornerDownRight,
} from 'lucide-react'
import Link from 'next/link'
import StarRating from './StarRating'
import { createBrowser } from '@/lib/supabase'

/* ─── Tipos ─────────────────────────────────────── */
type ReviewReply = { id: string; reply_comment: string; created_at: string }

type Review = {
  id: string
  user_id: string
  rating: number
  comment: string | null
  reviewer_name: string | null
  created_at: string
  reply: ReviewReply | null
}

type CurrentUser = {
  id: string
  name: string
  token: string
  isOwner: boolean
} | null

type ReportTarget = { type: 'review' | 'reply'; id: string; preview: string }

/* ─── Constantes ─────────────────────────────────── */
const REPORT_REASONS = [
  'Ofensa ou linguagem abusiva',
  'Informação falsa ou enganosa',
  'Spam',
  'Difamação',
  'Conteúdo impróprio',
  'Assédio',
  'Outro',
]

/* ─── Helpers ────────────────────────────────────── */
function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (s < 60) return 'agora mesmo'
  if (s < 3600) return `há ${Math.floor(s / 60)} min`
  if (s < 86400) return `há ${Math.floor(s / 3600)}h`
  if (s < 604800) return `há ${Math.floor(s / 86400)} dias`
  return `há ${Math.floor(s / 2592000)} meses`
}

function initials(name: string | null): string {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 text-xs text-white/50">{star}</span>
      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-white/40">{count}</span>
    </div>
  )
}

/* ─── Modal de Denúncia ─────────────────────────── */
function ReportModal({ target, token, onClose }: { target: ReportTarget; token: string; onClose: () => void }) {
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!reason) { setError('Selecione um motivo'); return }
    setLoading(true); setError('')
    const url = target.type === 'review'
      ? `/api/reviews/${target.id}/report`
      : `/api/reviews/replies/${target.id}/report`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason, details }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Erro ao enviar denúncia'); setLoading(false); return }
    setDone(true)
    setTimeout(onClose, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0618] p-6 shadow-2xl">
        {done ? (
          <div className="py-8 text-center">
            <CheckCircle className="mx-auto mb-3 h-10 w-10 text-green-400" />
            <p className="font-semibold text-white">Denúncia enviada!</p>
            <p className="mt-1 text-sm text-white/50">Nossa equipe irá analisar em breve.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-white">
                  Denunciar {target.type === 'review' ? 'avaliação' : 'resposta'}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/40 italic">"{target.preview}"</p>
              </div>
              <button onClick={onClose} className="mt-0.5 text-white/30 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium text-white/70">Motivo</p>
              {REPORT_REASONS.map(r => (
                <label key={r} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 transition-all ${
                  reason === r ? 'border-violet-500/50 bg-violet-500/15' : 'border-white/10 bg-white/5 hover:border-violet-500/20 hover:bg-white/8'
                }`}>
                  <input type="radio" name="reason" value={r} onChange={() => setReason(r)} className="accent-violet-500" />
                  <span className="text-sm text-white/80">{r}</span>
                </label>
              ))}
            </div>

            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Detalhes adicionais (opcional)..."
              rows={2}
              maxLength={500}
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
            />

            <button
              onClick={submit}
              disabled={loading || !reason}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-3 font-semibold text-white shadow-lg disabled:opacity-50 transition-all hover:shadow-red-500/30"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
              Enviar Denúncia
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════ */
export default function ReviewSection({ providerSlug, providerName }: { providerSlug: string; providerName: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [providerId, setProviderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null)

  // form de nova avaliação
  const [showForm, setShowForm] = useState(false)
  const [stars, setStars] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  // reply
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)
  const [replyError, setReplyError] = useState('')

  // report
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/reviews?slug=${providerSlug}`)
      const json = res.ok ? await res.json() : { reviews: [], providerId: null }
      setReviews(json.reviews ?? [])
      setProviderId(json.providerId ?? null)

      // usuário logado
      const supabase = createBrowser()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const u = session.user
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', u.id).single()
        const { data: prov } = await supabase.from('providers').select('id, user_id').eq('slug', providerSlug).single()
        const isOwner = prov?.user_id === u.id
        setCurrentUser({
          id: u.id,
          name: (profile as { full_name?: string } | null)?.full_name ?? 'Usuário',
          token: session.access_token,
          isOwner,
        })
        const already = (json.reviews ?? []).some((r: Review) => r.user_id === u.id)
        setAlreadyReviewed(already)
      }
    } catch {
      // silencia erros de rede — a UI já lida com lista vazia
    }
    setLoading(false)
  }, [providerSlug])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (stars === 0) { setFormError('Selecione uma nota'); return }
    if (!currentUser) return
    setSubmitting(true); setFormError('')

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentUser.token}` },
      body: JSON.stringify({ provider_slug: providerSlug, rating: stars, comment }),
    })
    const data = await res.json()
    if (!res.ok) { setFormError(data.error || 'Erro ao enviar. Tente novamente.'); setSubmitting(false); return }

    setSubmitted(true); setShowForm(false)
    fetchData()
    setSubmitting(false)
  }

  async function handleReply(reviewId: string) {
    if (!currentUser || !replyText.trim()) return
    setSubmittingReply(true); setReplyError('')
    const res = await fetch(`/api/reviews/${reviewId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${currentUser.token}` },
      body: JSON.stringify({ reply_comment: replyText }),
    })
    const data = await res.json()
    if (!res.ok) { setReplyError(data.error || 'Erro ao responder'); setSubmittingReply(false); return }
    setReplyingTo(null); setReplyText('')
    fetchData()
    setSubmittingReply(false)
  }

  const total = reviews.length
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
  const dist = [5, 4, 3, 2, 1].map(s => ({ star: s, count: reviews.filter(r => r.rating === s).length }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {reportTarget && currentUser && (
        <ReportModal target={reportTarget} token={currentUser.token} onClose={() => setReportTarget(null)} />
      )}

      {/* Resumo de notas */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/20 p-8 text-center">
          <div className="text-6xl font-black text-white">{avg > 0 ? avg.toFixed(1) : '—'}</div>
          <div className="mt-2"><StarRating value={Math.round(avg)} readonly size="md" /></div>
          <p className="mt-2 text-sm text-white/50">
            {total > 0 ? `${total} avaliação${total > 1 ? 'ões' : ''}` : 'Sem avaliações ainda'}
          </p>
        </div>
        <div className="flex flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-6 space-y-2">
          {dist.map(({ star, count }) => <RatingBar key={star} star={star} count={count} total={total} />)}
        </div>
      </div>

      {/* Área de ação do usuário */}
      {submitted ? (
        <div className="flex items-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
          <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-300">Avaliação publicada!</p>
            <p className="text-sm text-green-400/70">Obrigado pelo seu feedback.</p>
          </div>
        </div>
      ) : currentUser?.isOwner ? null : alreadyReviewed ? (
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5 text-center text-sm text-violet-300">
          Você já avaliou este profissional. Obrigado! 🙏
        </div>
      ) : !currentUser ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="rounded-2xl bg-violet-500/20 p-4"><MessageSquare className="h-8 w-8 text-violet-400" /></div>
          <div>
            <p className="font-semibold text-white">Avalie este profissional</p>
            <p className="mt-1 text-sm text-white/50">Entre na sua conta para deixar uma avaliação</p>
          </div>
          <Link href="/login" className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <LogIn className="h-4 w-4" /> Entrar para Avaliar
          </Link>
        </div>
      ) : !showForm ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-900/20 to-fuchsia-900/10 p-8 text-center">
          <div className="rounded-2xl bg-violet-500/20 p-4"><Star className="h-8 w-8 text-violet-400" /></div>
          <div>
            <p className="font-semibold text-white">Contratou {providerName}?</p>
            <p className="mt-1 text-sm text-white/50">Compartilhe sua experiência e ajude outros clientes</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:scale-105">
            <Star className="h-4 w-4 fill-white" /> Deixar Avaliação
          </button>
        </div>
      ) : (
        /* Formulário */
        <div className="rounded-3xl border border-violet-500/30 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Sua avaliação</h3>
            <button onClick={() => { setShowForm(false); setStars(0); setComment('') }} className="text-sm text-white/40 hover:text-white/70">
              Cancelar
            </button>
          </div>
          {formError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-300">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-3 block text-sm font-medium text-white/70">Qual nota você dá?</label>
              <StarRating value={stars} onChange={setStars} size="lg" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">Comentário <span className="text-white/30">(opcional)</span></label>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Como foi sua experiência? Descreva o profissional, pontualidade e atenção..."
                rows={4} maxLength={600}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['👍','👏','⭐','🔥','💯','😊','🙏','✅','💪','🎉','😃','❤️','👌','🚀','😍'].map(emoji => (
                  <button key={emoji} type="button" onClick={() => setComment(c => c.length < 600 ? c + emoji : c)}
                    className="rounded-lg bg-white/5 px-2 py-1 text-base transition-all hover:bg-violet-500/20 hover:scale-110 active:scale-95">
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-right text-xs text-white/30">{comment.length}/600</p>
            </div>
            <button type="submit" disabled={submitting || stars === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : <><Send className="h-4 w-4" /> Publicar Avaliação</>}
            </button>
          </form>
        </div>
      )}

      {/* Lista de avaliações */}
      {reviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white/80">O que os clientes dizem</h3>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all hover:border-violet-500/20">
                {/* Cabeçalho */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-sm font-bold text-white">
                    {initials(r.reviewer_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-white">{r.reviewer_name ?? 'Cliente'}</p>
                      <span className="flex-shrink-0 text-xs text-white/30">{timeAgo(r.created_at)}</span>
                    </div>
                    <div className="mt-1"><StarRating value={r.rating} readonly size="sm" /></div>
                  </div>
                </div>

                {r.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{r.comment}</p>
                )}

                {/* Ações da avaliação */}
                <div className="mt-3 flex items-center gap-3">
                  {/* Botão responder — só para o dono do perfil */}
                  {currentUser?.isOwner && !r.reply && (
                    <button
                      onClick={() => { setReplyingTo(replyingTo === r.id ? null : r.id); setReplyText(''); setReplyError('') }}
                      className="flex items-center gap-1.5 text-xs text-violet-400/70 hover:text-violet-400 transition-colors"
                    >
                      <Reply className="h-3.5 w-3.5" /> Responder
                    </button>
                  )}
                  {/* Botão denunciar avaliação — só para quem não é o autor */}
                  {currentUser && currentUser.id !== r.user_id && (
                    <button
                      onClick={() => setReportTarget({ type: 'review', id: r.id, preview: r.comment || `${r.rating} estrelas` })}
                      className="ml-auto flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400/70 transition-colors"
                    >
                      <Flag className="h-3 w-3" /> Denunciar
                    </button>
                  )}
                </div>

                {/* Form de resposta */}
                {replyingTo === r.id && currentUser?.isOwner && (
                  <div className="mt-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                    {replyError && <p className="mb-2 text-xs text-red-400">{replyError}</p>}
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Escreva sua resposta pública..."
                      rows={3}
                      maxLength={1000}
                      className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-white/30">{replyText.length}/1000</span>
                      <div className="flex gap-2">
                        <button onClick={() => setReplyingTo(null)} className="text-xs text-white/40 hover:text-white">Cancelar</button>
                        <button
                          onClick={() => handleReply(r.id)}
                          disabled={submittingReply || !replyText.trim()}
                          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 hover:bg-violet-500 transition-colors"
                        >
                          {submittingReply ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Publicar resposta
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resposta do prestador */}
                {r.reply && (
                  <div className="mt-3 ml-4 rounded-xl border border-white/8 bg-violet-500/8 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <CornerDownRight className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-violet-300">Resposta do prestador</span>
                      <span className="ml-auto text-xs text-white/30">{timeAgo(r.reply.created_at)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{r.reply.reply_comment}</p>
                    {/* Denunciar resposta */}
                    {currentUser && !currentUser.isOwner && (
                      <button
                        onClick={() => setReportTarget({ type: 'reply', id: r.reply!.id, preview: r.reply!.reply_comment })}
                        className="mt-2 flex items-center gap-1.5 text-xs text-white/20 hover:text-red-400/70 transition-colors"
                      >
                        <Flag className="h-3 w-3" /> Denunciar resposta
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && providerId && !loading && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <Star className="h-10 w-10 text-white/15" />
          <p className="text-white/40">Nenhuma avaliação ainda.</p>
          <p className="text-sm text-white/25">Seja o primeiro a avaliar este profissional!</p>
        </div>
      )}
    </div>
  )
}
