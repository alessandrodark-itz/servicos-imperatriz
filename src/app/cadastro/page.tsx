'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import {
  Mail, Lock, User, Phone, Eye, EyeOff,
  AlertCircle, CheckCircle, Loader2, Briefcase,
  ArrowLeft, RefreshCw,
} from 'lucide-react'

/* ─────────────────────────────────────────── tipos ── */
type Step     = 'select' | 'form' | 'success'
type UserType = 'cliente' | 'prestador'
type FormData = {
  name:            string
  email:           string
  phone:           string
  password:        string
  confirmPassword: string
}
type FieldErrors = Partial<Record<keyof FormData, string>>

/* ─────────────────────────────────────────── helpers ── */
function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (!d.length)    return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/* ─────────────────────────────────────────── shared UI ── */
const inputBase =
  'w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white ' +
  'placeholder:text-white/40 focus:bg-white/10 focus:outline-none transition-colors'
const cls = {
  input:      `${inputBase} border-white/10 focus:border-[#7F77DD]/50`,
  inputError: `${inputBase} border-red-500/50 focus:border-red-500/70`,
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function CadastroPage() {
  const [step,        setStep]        = useState<Step>('select')
  const [userType,    setUserType]    = useState<UserType | null>(null)
  const [formData,    setFormData]    = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [globalError,  setGlobalError]  = useState('')
  const [cooldown,     setCooldown]     = useState(0)

  /* cooldown timer para reenvio */
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  /* atualiza campo e limpa erro inline */
  function updateField(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  /* validação client-side */
  function validate(): boolean {
    const e: FieldErrors = {}
    if (!formData.name.trim())           e.name            = 'Nome obrigatório'
    if (!formData.email.trim())          e.email           = 'E-mail obrigatório'
    else if (!isValidEmail(formData.email)) e.email        = 'E-mail inválido'
    if (!formData.password)              e.password        = 'Senha obrigatória'
    else if (formData.password.length < 8) e.password      = 'Mínimo de 8 caracteres'
    if (!formData.confirmPassword)       e.confirmPassword = 'Confirmação obrigatória'
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Senhas não conferem'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  /* ── submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)

    try {
      /* DIAGNÓSTICO — log da URL sem expor a chave */
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
      console.log('[Cadastro] Supabase URL em uso:', supabaseUrl || '⚠ NÃO CONFIGURADA')
      if (!supabaseUrl) {
        setGlobalError('Configuração do servidor incompleta. Contate o suporte.')
        return
      }

      const supabase = createBrowser()
      const { error: signUpError } = await supabase.auth.signUp({
        email:    formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            phone:     formData.phone,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirmar`,
        },
      })

      if (signUpError) {
        const msg = signUpError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already exists')) {
          setGlobalError('Este e-mail já está cadastrado. Tente fazer login.')
        } else {
          setGlobalError(signUpError.message)
        }
        return
      }

      setStep('success')
      setCooldown(60)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      console.error('[Cadastro] Erro inesperado:', err)
      if (
        msg.toLowerCase().includes('fetch') ||
        msg.toLowerCase().includes('network') ||
        msg.toLowerCase().includes('failed')
      ) {
        setGlobalError(
          'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente.'
        )
      } else {
        setGlobalError('Erro inesperado ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  /* ── reenviar e-mail ── */
  async function handleResend() {
    if (cooldown > 0) return
    try {
      const supabase = createBrowser()
      await supabase.auth.resend({ type: 'signup', email: formData.email })
      setCooldown(60)
    } catch {
      /* falha silenciosa */
    }
  }

  /* ══════════════════════════════════ STEP: select ══ */
  if (step === 'select') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg">

            <div className="mb-10 text-center">
              <h1 className="text-3xl font-black text-white">Criar sua conta</h1>
              <p className="mt-3 text-white/60">Como você deseja usar a plataforma?</p>
            </div>

            {/* Cards de tipo */}
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  {
                    type: 'cliente' as UserType,
                    Icon: User,
                    title: 'Sou Cliente',
                    desc: 'Quero encontrar e contratar prestadores de serviços',
                  },
                  {
                    type: 'prestador' as UserType,
                    Icon: Briefcase,
                    title: 'Sou Prestador',
                    desc: 'Quero oferecer meus serviços e conquistar clientes',
                  },
                ] as const
              ).map(({ type, Icon, title, desc }) => {
                const selected = userType === type
                return (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={[
                      'group flex flex-col items-start gap-4 rounded-2xl border p-6 text-left transition-all',
                      selected
                        ? 'border-[#7F77DD] bg-[#7F77DD]/10 shadow-[0_0_24px_rgba(127,119,221,0.2)]'
                        : 'border-white/10 bg-white/5 hover:border-[#7F77DD]/40 hover:bg-white/8',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                        selected
                          ? 'bg-[#7F77DD]'
                          : 'bg-white/10 group-hover:bg-[#7F77DD]/25',
                      ].join(' ')}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{desc}</p>
                    </div>
                    {selected && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7F77DD]">
                        <CheckCircle className="h-4 w-4" />
                        Selecionado
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Botão continuar */}
            {userType && (
              <button
                onClick={() => setStep('form')}
                className="mt-8 w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)]"
              >
                Continuar
              </button>
            )}

            <p className="mt-6 text-center text-sm text-white/60">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-[#7F77DD] hover:text-violet-300">
                Fazer login
              </Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ══════════════════════════════════ STEP: success ══ */
  if (step === 'success') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <Card>
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#7F77DD]/30 bg-[#7F77DD]/15">
                <Mail className="h-12 w-12 text-[#7F77DD]" />
              </div>
              <h1 className="text-2xl font-bold text-white">Verifique seu e-mail!</h1>
              <p className="mt-3 leading-relaxed text-white/60">
                Enviamos um link de confirmação para{' '}
                <span className="font-semibold text-white">{formData.email}</span>.
                Clique no link para ativar sua conta.
              </p>
              <p className="mt-2 text-sm text-white/40">
                Não esqueça de verificar a pasta de spam.
              </p>

              <button
                onClick={handleResend}
                disabled={cooldown > 0}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4" />
                {cooldown > 0 ? `Reenviar em ${cooldown}s` : 'Reenviar e-mail'}
              </button>

              <Link
                href="/"
                className="mt-4 flex items-center justify-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o início
              </Link>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ══════════════════════════════════ STEP: form ══ */
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card>
            {/* Voltar + badge do tipo */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => setStep('select')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="rounded-full bg-[#7F77DD]/20 px-3 py-1 text-xs font-semibold text-[#7F77DD]">
                Cadastrando como:{' '}
                {userType === 'cliente' ? 'Cliente' : 'Prestador de Serviços'}
              </span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
              <p className="mt-1 text-sm text-white/55">Preencha seus dados para continuar</p>
            </div>

            {/* Erro global */}
            {globalError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{globalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Nome */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Nome Completo <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Seu nome completo"
                    className={fieldErrors.name ? cls.inputError : cls.input}
                  />
                </div>
                <FieldError msg={fieldErrors.name} />
              </div>

              {/* E-mail */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => updateField('email', e.target.value)}
                    placeholder="seu@email.com"
                    className={fieldErrors.email ? cls.inputError : cls.input}
                  />
                </div>
                <FieldError msg={fieldErrors.email} />
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Telefone{' '}
                  <span className="font-normal text-white/40">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => updateField('phone', formatPhone(e.target.value))}
                    placeholder="(99) 99999-9999"
                    className={cls.input}
                  />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={e => updateField('password', e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className={`${fieldErrors.password ? cls.inputError : cls.input} !pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError msg={fieldErrors.password} />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Confirmar Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={e => updateField('confirmPassword', e.target.value)}
                    placeholder="Repita sua senha"
                    className={fieldErrors.confirmPassword ? cls.inputError : cls.input}
                  />
                </div>
                <FieldError msg={fieldErrors.confirmPassword} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] hover:shadow-[0_0_30px_rgba(127,119,221,0.5)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Criando conta...
                  </span>
                ) : (
                  'Criar Conta'
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-[#7F77DD] hover:text-violet-300">
                Fazer login
              </Link>
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
