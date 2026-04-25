'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'

/* ─────────────────────────────────────────────────────
   Inner component — usa useSearchParams (precisa de Suspense)
───────────────────────────────────────────────────── */
function ConfirmarContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  type Status = 'loading' | 'success' | 'error'
  const [status,  setStatus]  = useState<Status>('loading')
  const [message, setMessage] = useState('')
  const [counter, setCounter] = useState(3)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    async function verify() {
      try {
        const supabase = createBrowser()

        /* Supabase PKCE: envia ?code=xxx */
        const code = searchParams.get('code')
        /* Supabase token_hash (fluxo alternativo) */
        const tokenHash = searchParams.get('token_hash')
        const type      = searchParams.get('type')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as 'email' | 'signup' | 'invite' | 'magiclink' | 'recovery',
          })
          if (error) throw error
        } else {
          throw new Error('Link de confirmação inválido ou expirado.')
        }

        setStatus('success')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido'
        setMessage(msg)
        setStatus('error')
      }
    }

    verify()
  }, [searchParams])

  /* Contador regressivo após sucesso */
  useEffect(() => {
    if (status !== 'success') return
    if (counter <= 0) {
      router.push('/')
      return
    }
    const t = setTimeout(() => setCounter(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [status, counter, router])

  /* ── LOADING ── */
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#7F77DD]/15 border border-[#7F77DD]/30">
          <Loader2 className="h-10 w-10 animate-spin text-[#7F77DD]" />
        </div>
        <h1 className="text-2xl font-bold text-white">Verificando seu e-mail…</h1>
        <p className="text-white/55">Aguarde enquanto ativamos sua conta.</p>
      </div>
    )
  }

  /* ── SUCCESS ── */
  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/15 border border-green-500/30">
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Conta ativada com sucesso!</h1>
        <p className="max-w-sm leading-relaxed text-white/60">
          Bem-vindo ao <span className="font-semibold text-white">Serviços Imperatriz</span>.
          Sua conta já está pronta para uso.
        </p>
        <p className="text-sm text-white/40">
          Redirecionando em{' '}
          <span className="font-bold text-[#7F77DD]">{counter}</span>
          {counter === 1 ? ' segundo' : ' segundos'}…
        </p>
        <Link
          href="/"
          className="mt-2 rounded-xl bg-[#7F77DD] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8]"
        >
          Ir para o início agora
        </Link>
      </div>
    )
  }

  /* ── ERROR ── */
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 border border-red-500/30">
        <XCircle className="h-10 w-10 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white">Link inválido ou expirado</h1>
      <p className="max-w-sm text-sm leading-relaxed text-white/55">
        {message || 'O link de confirmação não é mais válido. Solicite um novo link de ativação.'}
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cadastro"
          className="rounded-xl bg-[#7F77DD] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8]"
        >
          Criar nova conta
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

/* ─────────────────────────────────────────────────────
   Page — envolve em Suspense (exigido pelo Next.js para
   componentes que usam useSearchParams)
───────────────────────────────────────────────────── */
export default function ConfirmarPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />
            <div className="relative">
              <Suspense
                fallback={
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#7F77DD]/15">
                      <Loader2 className="h-10 w-10 animate-spin text-[#7F77DD]" />
                    </div>
                    <p className="text-white/55">Carregando…</p>
                  </div>
                }
              >
                <ConfirmarContent />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
