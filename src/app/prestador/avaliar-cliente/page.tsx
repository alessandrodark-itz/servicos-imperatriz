'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StarRating from '@/components/StarRating'
import { createBrowser } from '@/lib/supabase'
import {
  Mail, User, FileText, Send, Loader2, CheckCircle,
  AlertCircle, Star, Shield, ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'

export default function AvaliarClientePage() {
  const router = useRouter()
  const supabase = createBrowser()

  const [checking, setChecking] = useState(true)
  const [isProvider, setIsProvider] = useState(false)
  const [token, setToken] = useState('')

  const [form, setForm] = useState({
    client_email: '',
    client_name: '',
    rating: 0,
    comment: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      setToken(session.access_token)

      const { data: prov } = await supabase
        .from('providers')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      setIsProvider(!!prov)
      setChecking(false)
    }
    checkAuth()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.rating === 0) { setError('Selecione uma nota'); return }
    if (!form.client_email) { setError('Informe o e-mail do cliente'); return }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/client-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar avaliação')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#05010a] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
      </div>
    )
  }

  if (!isProvider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16 text-center">
          <div>
            <Shield className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <h1 className="text-xl font-bold text-white">Acesso exclusivo para prestadores</h1>
            <p className="mt-2 text-white/50">Você precisa ter um perfil de prestador para avaliar clientes.</p>
            <Link href="/prestador/cadastro" className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500">
              Cadastrar como Prestador
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Avaliação enviada!</h1>
            <p className="mt-3 text-white/50">
              Sua avaliação sobre o cliente foi registrada com sucesso.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => { setSuccess(false); setForm({ client_email: '', client_name: '', rating: 0, comment: '' }) }}
                className="rounded-xl bg-white/5 px-6 py-3 text-sm text-white/70 hover:bg-white/10"
              >
                Avaliar outro cliente
              </button>
              <Link href="/" className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white text-center">
                Voltar ao início
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-xl">
          {/* Voltar */}
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-violet-400 transition-colors">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </Link>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
              <Star className="h-8 w-8 fill-white text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Avaliar Cliente</h1>
            <p className="mt-2 text-white/50">
              Compartilhe sua experiência com este cliente e ajude outros profissionais
            </p>
          </div>

          {/* Card info */}
          <div className="mb-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
            <p className="text-sm text-violet-300">
              💡 O cliente receberá sua avaliação no perfil dele. Seja honesto e respeitoso.
            </p>
          </div>

          {/* Formulário */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email do cliente */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  E-mail do cliente *
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={form.client_email}
                    onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
                    placeholder="email@cliente.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-white/30">O cliente precisa estar cadastrado na plataforma</p>
              </div>

              {/* Nome (caso não encontre) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Nome do cliente <span className="text-white/30">(opcional)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    value={form.client_name}
                    onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
                    placeholder="Nome do cliente"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Estrelas */}
              <div>
                <label className="mb-3 block text-sm font-medium text-white/70">
                  Nota geral *
                </label>
                <StarRating
                  value={form.rating}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                  size="lg"
                />
              </div>

              {/* Comentário */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Comentário <span className="text-white/30">(opcional)</span>
                  </span>
                </label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Como foi trabalhar com este cliente? Pontualidade, comunicação, pagamento..."
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none"
                />
                <p className="mt-1 text-right text-xs text-white/30">{form.comment.length}/500</p>
              </div>

              <button
                type="submit"
                disabled={loading || form.rating === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-4 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                ) : (
                  <><Send className="h-4 w-4" /> Publicar Avaliação</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
