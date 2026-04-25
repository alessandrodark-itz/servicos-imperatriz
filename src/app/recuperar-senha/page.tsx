'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import {
  Mail, AlertCircle, ArrowLeft, Loader2, RefreshCw,
} from 'lucide-react'

export default function RecuperarSenhaPage() {
  const [email,       setEmail]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [sent,        setSent]        = useState(false)
  const [error,       setError]       = useState('')
  const [cooldown,    setCooldown]    = useState(0)
  const [emailError,  setEmailError]  = useState('')

  /* cooldown timer */
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  function isValidEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function sendReset(emailAddress: string) {
    setError('')
    setEmailError('')

    if (!emailAddress.trim()) {
      setEmailError('Informe seu e-mail')
      return
    }
    if (!isValidEmail(emailAddress)) {
      setEmailError('E-mail inválido')
      return
    }

    setLoading(true)
    try {
      const supabase = createBrowser()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        emailAddress,
        { redirectTo: `${window.location.origin}/auth/nova-senha` }
      )
      if (resetError) throw resetError

      setSent(true)
      setCooldown(60)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.')
      } else {
        setError('Ocorreu um erro. Tente novamente em instantes.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (cooldown > 0) return
    await sendReset(email)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await sendReset(email)
  }

  /* ── TELA DE SUCESSO ── */
  if (sent) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />
              <div className="relative">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/15">
                  <Mail className="h-12 w-12 text-[#7F77DD]" />
                </div>
                <h1 className="text-2xl font-bold text-white">Verifique seu e-mail</h1>
                <p className="mt-3 leading-relaxed text-white/60">
                  Enviamos um link de recuperação para{' '}
                  <span className="font-semibold text-white">{email}</span>.
                  Clique no link para criar uma nova senha.
                </p>
                <p className="mt-2 text-sm text-white/40">
                  Não encontrou? Verifique a pasta de spam.
                </p>

                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar e-mail'}
                </button>

                <Link
                  href="/login"
                  className="mt-4 flex items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar para o login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ── FORMULÁRIO ── */
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />

            <div className="relative">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F77DD] to-fuchsia-500">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Recuperar senha</h1>
                <p className="mt-2 text-sm text-white/55">
                  Informe seu e-mail e enviaremos um link para criar uma nova senha.
                </p>
              </div>

              {/* Erro global */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* E-mail */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    E-mail cadastrado
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError('')
                      }}
                      placeholder="seu@email.com"
                      className={[
                        'w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white',
                        'placeholder:text-white/40 focus:bg-white/10 focus:outline-none transition-colors',
                        emailError
                          ? 'border-red-500/50 focus:border-red-500/70'
                          : 'border-white/10 focus:border-[#7F77DD]/50',
                      ].join(' ')}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Enviando…
                    </span>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>
              </form>

              <Link
                href="/login"
                className="mt-6 flex items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
