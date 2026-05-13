'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import { validarSenhaForte } from '@/lib/validarSenha'
import {
  Mail, Lock, User, Phone, Eye, EyeOff,
  AlertCircle, CheckCircle, Loader2, Briefcase, ArrowLeft, RefreshCw,
} from 'lucide-react'

type Step     = 'select' | 'form'
type UserType = 'cliente' | 'prestador'
type FormData = {
  name:            string
  email:           string
  phone:           string
  password:        string
  confirmPassword: string
}
type FieldErrors = Partial<Record<keyof FormData, string>>
type NameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'reserved'

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (!d.length)     return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

const inputBase =
  'w-full rounded-xl border bg-white/5 py-3 pl-12 pr-4 text-white ' +
  'placeholder:text-white/40 focus:bg-white/10 focus:outline-none transition-colors'
const cls = {
  input:      `${inputBase} border-white/10 focus:border-[#7F77DD]/50`,
  inputError: `${inputBase} border-red-500/50 focus:border-red-500/70`,
  inputOk:    `${inputBase} border-green-500/50 focus:border-green-500/70`,
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

export default function CadastroPage() {
  const router = useRouter()

  const [step,         setStep]         = useState<Step>('select')
  const [userType,     setUserType]     = useState<UserType | null>(null)
  const [formData,     setFormData]     = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [fieldErrors,  setFieldErrors]  = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [globalError,  setGlobalError]  = useState('')

  // verificação de nome
  const [nameStatus,      setNameStatus]      = useState<NameStatus>('idle')
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([])
  const [nameReason,      setNameReason]      = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // verifica disponibilidade do nome com debounce
  useEffect(() => {
    const name = formData.name.trim()
    if (name.length < 2) { setNameStatus('idle'); setNameSuggestions([]); return }

    setNameStatus('checking')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-name?name=${encodeURIComponent(name)}`)
        const data = await res.json()
        if (data.available) {
          setNameStatus('available')
          setNameSuggestions([])
          setNameReason('')
        } else {
          setNameStatus(data.reason?.includes('reservado') ? 'reserved' : 'taken')
          setNameSuggestions(data.suggestions ?? [])
          setNameReason(data.reason ?? '')
        }
      } catch {
        setNameStatus('idle')
      }
    }, 500)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [formData.name])

  function updateField(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const e: FieldErrors = {}
    if (!formData.name.trim())              e.name            = 'Nome obrigatório'
    else if (nameStatus === 'taken')        e.name            = 'Este nome já está em uso'
    else if (nameStatus === 'reserved')     e.name            = 'Nome reservado — escolha outro'
    else if (nameStatus === 'checking')     e.name            = 'Aguarde a verificação do nome'
    if (!formData.email.trim())             e.email           = 'E-mail obrigatório'
    else if (!isValidEmail(formData.email)) e.email           = 'E-mail inválido'
    if (!formData.password) {
      e.password = 'Senha obrigatória'
    } else {
      const { valida, erros } = validarSenhaForte(formData.password)
      if (!valida) e.password = erros[0]
    }
    if (!formData.confirmPassword)          e.confirmPassword = 'Confirmação obrigatória'
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Senhas não conferem'
    setFieldErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError('')
    if (!validate()) return
    setLoading(true)
    try {
      const supabase = createBrowser()

      const { data, error } = await supabase.auth.signUp({
        email:    formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            phone:     formData.phone,
            user_type: userType,
          },
        },
      })
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already exists')) {
          setGlobalError('Este e-mail já está cadastrado. Tente fazer login.')
        } else {
          setGlobalError('Erro ao criar conta. Tente novamente.')
        }
        return
      }

      if (data.user?.id) {
        await fetch('/api/auth/auto-confirm', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ userId: data.user.id }),
        })
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email:    formData.email,
        password: formData.password,
      })
      if (signInError) {
        setGlobalError('Conta criada! Faça login para continuar.')
        router.push('/login')
        return
      }

      router.push(userType === 'prestador' ? '/prestador/dashboard' : '/')
      router.refresh()
    } catch {
      setGlobalError('Não foi possível conectar ao servidor. Verifique sua conexão.')
    } finally {
      setLoading(false)
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
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  { type: 'cliente' as UserType, Icon: User, title: 'Sou Cliente', desc: 'Quero encontrar e contratar prestadores de serviços' },
                  { type: 'prestador' as UserType, Icon: Briefcase, title: 'Sou Prestador', desc: 'Quero oferecer meus serviços e conquistar clientes' },
                ] as const
              ).map(({ type, Icon, title, desc }) => {
                const selected = userType === type
                return (
                  <button key={type} onClick={() => setUserType(type)}
                    className={['group flex flex-col items-start gap-4 rounded-2xl border p-6 text-left transition-all',
                      selected ? 'border-[#7F77DD] bg-[#7F77DD]/10 shadow-[0_0_24px_rgba(127,119,221,0.2)]'
                               : 'border-white/10 bg-white/5 hover:border-[#7F77DD]/40 hover:bg-white/8'].join(' ')}>
                    <div className={['flex h-14 w-14 items-center justify-center rounded-2xl transition-all',
                      selected ? 'bg-[#7F77DD]' : 'bg-white/10 group-hover:bg-[#7F77DD]/25'].join(' ')}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{title}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">{desc}</p>
                    </div>
                    {selected && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#7F77DD]">
                        <CheckCircle className="h-4 w-4" /> Selecionado
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {userType && (
              <button onClick={() => setStep('form')}
                className="mt-8 w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8]">
                Continuar
              </button>
            )}
            <p className="mt-6 text-center text-sm text-white/60">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-[#7F77DD] hover:text-violet-300">Fazer login</Link>
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ══════════════════════════════════ STEP: form ══ */
  const nameInputCls = fieldErrors.name
    ? cls.inputError
    : nameStatus === 'available'
    ? cls.inputOk
    : cls.input

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <Card>
            <div className="mb-6 flex items-center gap-3">
              <button onClick={() => setStep('select')}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="rounded-full bg-[#7F77DD]/20 px-3 py-1 text-xs font-semibold text-[#7F77DD]">
                {userType === 'cliente' ? 'Cliente' : 'Prestador de Serviços'}
              </span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
              <p className="mt-1 text-sm text-white/55">Preencha seus dados para continuar</p>
            </div>

            {globalError && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{globalError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Nome com verificação de unicidade */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Nome de Perfil Público <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => updateField('name', e.target.value)}
                    placeholder="Ex: Luis, Maria Souza, JoãoPro..."
                    className={`${nameInputCls} !pr-10`}
                  />
                  {/* Indicador de status */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nameStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
                    {nameStatus === 'available' && <CheckCircle className="h-4 w-4 text-green-400" />}
                    {(nameStatus === 'taken' || nameStatus === 'reserved') && <AlertCircle className="h-4 w-4 text-red-400" />}
                  </div>
                </div>

                {/* Status do nome */}
                {nameStatus === 'available' && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-green-400">
                    <CheckCircle className="h-3 w-3" /> Nome disponível
                  </p>
                )}
                {(nameStatus === 'taken' || nameStatus === 'reserved') && (
                  <div className="mt-2 rounded-xl border border-red-500/20 bg-red-500/8 p-3">
                    <p className="flex items-center gap-1 text-xs text-red-400">
                      <AlertCircle className="h-3 w-3 flex-shrink-0" />
                      {nameReason || 'Este nome já está em uso. Escolha outro nome exclusivo.'}
                    </p>
                    {nameSuggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1.5 text-xs text-white/40">Sugestões disponíveis:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {nameSuggestions.map(s => (
                            <button key={s} type="button"
                              onClick={() => updateField('name', s)}
                              className="flex items-center gap-1 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300 hover:bg-violet-500/20 transition-colors">
                              <RefreshCw className="h-2.5 w-2.5" /> {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <FieldError msg={fieldErrors.name} />
                <p className="mt-1 text-xs text-white/30">
                  Este nome aparecerá em avaliações e no seu perfil público.
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type="email" value={formData.email} onChange={e => updateField('email', e.target.value)}
                    placeholder="seu@email.com"
                    className={fieldErrors.email ? cls.inputError : cls.input} />
                </div>
                <FieldError msg={fieldErrors.email} />
              </div>

              {/* Telefone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Telefone <span className="font-normal text-white/40">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type="tel" value={formData.phone} onChange={e => updateField('phone', formatPhone(e.target.value))}
                    placeholder="(99) 99999-9999" className={cls.input} />
                </div>
              </div>

              {/* Senha */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.password}
                    onChange={e => updateField('password', e.target.value)} placeholder="Mínimo 8 caracteres"
                    className={`${fieldErrors.password ? cls.inputError : cls.input} !pr-12`} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <FieldError msg={fieldErrors.password} />
              </div>

              {/* Confirmar senha */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-white/80">
                  Confirmar Senha <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword}
                    onChange={e => updateField('confirmPassword', e.target.value)} placeholder="Repita sua senha"
                    className={fieldErrors.confirmPassword ? cls.inputError : cls.input} />
                </div>
                <FieldError msg={fieldErrors.confirmPassword} />
              </div>

              <button type="submit" disabled={loading || nameStatus === 'taken' || nameStatus === 'reserved' || nameStatus === 'checking'}
                className="mt-2 w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Criando conta...
                  </span>
                ) : 'Criar Conta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/60">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-[#7F77DD] hover:text-violet-300">Fazer login</Link>
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
