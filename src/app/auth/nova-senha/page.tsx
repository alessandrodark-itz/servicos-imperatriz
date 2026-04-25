'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import {
  Lock, Eye, EyeOff, AlertCircle, CheckCircle,
  Loader2, ArrowLeft,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────
   Inner component
───────────────────────────────────────────────────── */
function NovaSenhaContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  type Phase = 'init' | 'ready' | 'success' | 'expired'
  const [phase,        setPhase]        = useState<Phase>('init')
  const [password,     setPassword]     = useState('')
  const [confirm,      setConfirm]      = useState('')
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [globalError,  setGlobalError]  = useState('')
  const [passError,    setPassError]    = useState('')
  const [confirmError, setConfirmError] = useState('')
  const exchanged = useRef(false)

  /* Troca o code da URL por uma sessão válida */
  useEffect(() => {
    if (exchanged.current) return
    exchanged.current = true

    async function init() {
      try {
        const supabase = createBrowser()
        const code = searchParams.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setPhase('expired')
            return
          }
        }
        /* Verifica se há sessão ativa (pode já estar autenticado via hash) */
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setPhase('expired')
          return
        }
        setPhase('ready')
      } catch {
        setPhase('expired')
      }
    }
    init()
  }, [searchParams])

  /* Redireciona para login após sucesso */
  useEffect(() => {
    if (phase !== 'success') return
    const t = setTimeout(() => router.push('/login'), 2000)
    return () => clearTimeout(t)
  }, [phase, router])

  /* Validação */
  function validate(): boolean {
    let ok = true
    setPassError('')
    setConfirmError('')
    if (!password) {
      setPassError('Nova senha obrigatória')
      ok = false
    } else if (password.length < 8) {
      setPassError('Mínimo de 8 caracteres')
      ok = false
    }
    if (!confirm) {
      setConfirmError('Confirmação obrigatória')
      ok = false
    } else if (password !== confirm) {
      setConfirmError('Senhas não conferem')
      ok = false
    }
    return ok
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)
    try {
      const supabase = createBrowser()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        if (
          error.message.toLowerCase().includes('expired') ||
          error.message.toLowerCase().includes('invalid')
        ) {
          setPhase('expired')
        } else {
          setGlobalError(error.message)
        }
        return
      }
      setPhase('success')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('fetch') || msg.toLowerCase().includes('network')) {
        setGlobalError('Não foi possível conectar ao servidor. Tente novamente.')
      } else {
        setGlobalError('Erro ao alterar senha. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputBase =
    'w-full rounded-xl border bg-white/5 py-3 pl-12 pr-12 text-white ' +
    'placeholder:text-white/40 focus:bg-white/10 focus:outline-none transition-colors'

  /* ── INIT ── */
  if (phase === 'init') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7F77DD]/15">
          <Loader2 className="h-8 w-8 animate-spin text-[#7F77DD]" />
        </div>
        <p className="text-white/55">Verificando link de recuperação…</p>
      </div>
    )
  }

  /* ── EXPIRED ── */
  if (phase === 'expired') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-red-500/30 bg-red-500/15">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Link expirado</h1>
        <p className="max-w-sm text-sm leading-relaxed text-white/55">
          O link de redefinição de senha expirou ou já foi usado.
          Solicite um novo link para continuar.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/recuperar-senha"
            className="rounded-xl bg-[#7F77DD] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8]"
          >
            Solicitar novo link
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    )
  }

  /* ── SUCCESS ── */
  if (phase === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/15">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Senha alterada!</h1>
        <p className="text-white/60">
          Sua senha foi atualizada com sucesso. Redirecionando para o login…
        </p>
        <Link
          href="/login"
          className="mt-2 rounded-xl bg-[#7F77DD] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8]"
        >
          Ir para o login
        </Link>
      </div>
    )
  }

  /* ── FORM ── */
  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F77DD] to-fuchsia-500">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Nova senha</h1>
        <p className="mt-2 text-sm text-white/55">Escolha uma senha forte para sua conta.</p>
      </div>

      {globalError && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
          <p className="text-sm text-red-400">{globalError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Nova senha */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">
            Nova senha <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                if (passError) setPassError('')
              }}
              placeholder="Mínimo 8 caracteres"
              className={[
                inputBase,
                passError
                  ? 'border-red-500/50 focus:border-red-500/70'
                  : 'border-white/10 focus:border-[#7F77DD]/50',
              ].join(' ')}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {passError}
            </p>
          )}
        </div>

        {/* Confirmar senha */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/80">
            Confirmar nova senha <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type={showPass ? 'text' : 'password'}
              value={confirm}
              onChange={e => {
                setConfirm(e.target.value)
                if (confirmError) setConfirmError('')
              }}
              placeholder="Repita a nova senha"
              className={[
                inputBase,
                confirmError
                  ? 'border-red-500/50 focus:border-red-500/70'
                  : 'border-white/10 focus:border-[#7F77DD]/50',
              ].join(' ')}
            />
          </div>
          {confirmError && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              {confirmError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Salvando…
            </span>
          ) : (
            'Salvar nova senha'
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
    </>
  )
}

/* ─────────────────────────────────────────────────────
   Page wrapper
───────────────────────────────────────────────────── */
export default function NovaSenhaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />
            <div className="relative">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#7F77DD]" />
                    <p className="text-white/55">Carregando…</p>
                  </div>
                }
              >
                <NovaSenhaContent />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
