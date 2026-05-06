'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createBrowser } from '@/lib/supabase'
import { categories } from '@/lib/mock-data'
import {
  User, Mail, Phone, MapPin, Briefcase, FileText,
  AlertCircle, Loader2, Star, Shield, TrendingUp, ArrowLeft,
} from 'lucide-react'

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white ' +
  'placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none transition-colors'

function formatPhone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (!d.length)     return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

type Step = 1 | 2 | 3 | 'verify'

export default function PrestadorCadastroPage() {
  const router    = useRouter()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [step,          setStep]         = useState<Step>(1)
  const [loading,       setLoading]      = useState(false)
  const [error,         setError]        = useState('')
  const [cooldown,      setCooldown]     = useState(0)
  const [otp,           setOtp]          = useState(['','','','','','','',''])
  const [termsChecked,  setTermsChecked] = useState(false)
  const [otpError, setOtpError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', whatsapp: '',
    location: '', category: '', description: '',
    password: '', confirmPassword: '',
  })

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(c => c - 1), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem'); return
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres'); return
    }
    if (!formData.category) {
      setError('Selecione uma categoria'); return
    }
    if (!termsChecked) {
      setError('Você precisa aceitar os Termos de Uso para continuar.'); return
    }

    setLoading(true)
    try {
      const supabase = createBrowser()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email:    formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone:     formData.phone,
            user_type: 'prestador',
          },
        },
      })

      if (authError) {
        const msg = authError.message.toLowerCase()
        if (msg.includes('already registered') || msg.includes('already exists')) {
          setError('Este e-mail já está cadastrado. Faça login.')
        } else {
          setError(authError.message)
        }
        return
      }

      if (authData.user) {
        const slug = formData.fullName
          .toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('providers') as any).insert({
          user_id:           authData.user.id,
          name:              formData.fullName,
          slug,
          category_id:       formData.category,
          description:       formData.description || null,
          phone:             formData.phone       || null,
          whatsapp:          formData.whatsapp    || null,
          location:          formData.location    || null,
          terms_accepted:    true,
          terms_accepted_at: new Date().toISOString(),
          terms_version:     '1.0',
        })
      }

      setStep('verify')
      setCooldown(60)
    } catch {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function submitOtp(code: string) {
    setOtpError('')
    setLoading(true)
    try {
      const supabase = createBrowser()
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: code,
        type:  'signup',
      })
      if (error) {
        setOtpError('Código inválido ou expirado. Tente reenviar.')
        setOtp(['','','','','','','',''])
        setTimeout(() => inputRefs.current[0]?.focus(), 50)
        return
      }
      router.push('/prestador/dashboard')
      router.refresh()
    } catch {
      setOtpError('Erro ao verificar código. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next  = [...otp]
    next[index] = digit
    setOtp(next)
    if (otpError) setOtpError('')
    if (digit && index < 7) {
      inputRefs.current[index + 1]?.focus()
    } else if (digit && index === 7 && next.every(d => d !== '')) {
      submitOtp(next.join(''))
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8)
    if (!paste) return
    const next = Array.from({ length: 8 }, (_, i) => paste[i] ?? '')
    setOtp(next)
    if (paste.length >= 8) {
      inputRefs.current[7]?.focus()
      submitOtp(paste.slice(0, 8))
    } else {
      inputRefs.current[Math.min(paste.length, 7)]?.focus()
    }
  }

  async function handleResend() {
    if (cooldown > 0) return
    try {
      const supabase = createBrowser()
      await supabase.auth.resend({ type: 'signup', email: formData.email })
      setCooldown(60)
      setOtp(['','','','','','','',''])
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    } catch { /* silencioso */ }
  }

  /* ══════════════════════════ STEP: verify ══ */
  if (step === 'verify') {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-600/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />

              <div className="relative">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7F77DD] to-fuchsia-500">
                    <Mail className="h-7 w-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">Confirme seu e-mail</h1>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    Enviamos um código para{' '}
                    <span className="font-semibold text-white">{formData.email}</span>
                  </p>
                </div>

                {otpError && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <p className="text-sm text-red-400">{otpError}</p>
                  </div>
                )}

                <p className="mb-4 text-center text-sm font-medium text-white/70">
                  Digite o código de verificação
                </p>

                <div className="mb-6 flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      disabled={loading}
                      className={[
                        'h-14 w-11 rounded-xl border text-center text-2xl font-bold text-white',
                        'bg-white/5 focus:outline-none transition-all disabled:opacity-50 caret-transparent',
                        digit
                          ? 'border-[#7F77DD]/70 bg-[#7F77DD]/10 shadow-[0_0_12px_rgba(127,119,221,0.2)]'
                          : 'border-white/10 focus:border-[#7F77DD]/50 focus:bg-white/10',
                      ].join(' ')}
                    />
                  ))}
                </div>

                <button
                  onClick={() => submitOtp(otp.join(''))}
                  disabled={loading || otp.join('').length < 8}
                  className="w-full rounded-xl bg-[#7F77DD] py-3.5 text-base font-semibold text-white shadow-[0_0_20px_rgba(127,119,221,0.3)] transition-all hover:bg-[#9089e8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verificando...
                    </span>
                  ) : 'Verificar código'}
                </button>

                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    onClick={handleResend}
                    disabled={cooldown > 0 || loading}
                    className="text-sm text-white/50 transition-colors hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cooldown > 0 ? `Reenviar código em ${cooldown}s` : 'Reenviar código'}
                  </button>
                  <Link
                    href="/"
                    className="flex items-center gap-1.5 text-sm text-white/40 transition-colors hover:text-white/60"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Voltar para o início
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  /* ══════════════════════════ STEPS: 1, 2, 3 ══ */
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Cabeçalho */}
        <section className="relative overflow-hidden px-4 py-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-400">
              Área do profissional
            </p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Cadastre-se como{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Prestador
              </span>
            </h1>
            <p className="mt-3 max-w-xl mx-auto text-white/60">
              Alcance milhares de clientes em Imperatriz e aumente seu faturamento
            </p>
          </div>
        </section>

        {/* Benefícios */}
        <section className="px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { Icon: TrendingUp, color: 'violet', title: '+40% de ganhos',          desc: 'Profissionais cadastrados reportam aumento significativo' },
                { Icon: Shield,     color: 'green',  title: 'Selo de verificação',      desc: 'Ganhe a confiança dos clientes' },
                { Icon: Star,       color: 'yellow', title: 'Avaliações transparentes', desc: 'Construa sua reputação online' },
              ].map(({ Icon, color, title, desc }) => (
                <div key={title} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <div className={`mb-3 rounded-xl bg-${color}-500/20 p-3`}>
                    <Icon className={`h-6 w-6 text-${color}-400`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-xs text-white/50">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="px-4 py-8 pb-16">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Progress */}
              <div className="mb-8 flex items-center justify-center gap-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      s <= (step as number)
                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white'
                        : 'bg-white/10 text-white/40'
                    }`}>
                      {s}
                    </div>
                    {s < 3 && <div className={`h-px w-8 ${s < (step as number) ? 'bg-violet-500' : 'bg-white/10'}`} />}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* ── Step 1 ── */}
                {step === 1 && (
                  <>
                    <h2 className="text-lg font-semibold text-white">Dados Pessoais</h2>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">Nome Completo / Razão Social</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                        <input type="text" value={formData.fullName} onChange={e => set('fullName', e.target.value)}
                          placeholder="Seu nome ou nome da empresa" required className={inputCls} />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">E-mail</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                        <input type="email" value={formData.email} onChange={e => set('email', e.target.value)}
                          placeholder="seu@email.com" required className={inputCls} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">Telefone</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                          <input type="tel" value={formData.phone}
                            onChange={e => set('phone', formatPhone(e.target.value))}
                            placeholder="(99) 99999-9999" required className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white/80">
                          WhatsApp <span className="text-white/40">(opcional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                          <input type="tel" value={formData.whatsapp}
                            onChange={e => set('whatsapp', formatPhone(e.target.value))}
                            placeholder="(99) 99999-9999" className={inputCls} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Localização <span className="text-white/40">(opcional)</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                        <input type="text" value={formData.location} onChange={e => set('location', e.target.value)}
                          placeholder="Bairro, cidade" className={inputCls} />
                      </div>
                    </div>

                    <button type="button" onClick={() => { setError(''); setStep(2) }}
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                      Próximo
                    </button>
                  </>
                )}

                {/* ── Step 2 ── */}
                {step === 2 && (
                  <>
                    <h2 className="text-lg font-semibold text-white">Dados Profissionais</h2>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">Categoria</label>
                      <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                        <select value={formData.category} onChange={e => set('category', e.target.value)}
                          required className={`${inputCls} appearance-none`}>
                          <option value="" className="bg-[#0f0918]">Selecione sua categoria</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id} className="bg-[#0f0918]">
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">
                        Descrição dos Serviços <span className="text-white/40">(opcional)</span>
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 h-5 w-5 text-white/40" />
                        <textarea value={formData.description} onChange={e => set('description', e.target.value)}
                          placeholder="Descreva seus serviços, experiência e diferenciais..."
                          rows={4}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none resize-none" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 rounded-xl border border-white/10 py-3.5 font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                        Voltar
                      </button>
                      <button type="button" onClick={() => { setError(''); setStep(3) }}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                        Próximo
                      </button>
                    </div>
                  </>
                )}

                {/* ── Step 3 ── */}
                {step === 3 && (
                  <>
                    <h2 className="text-lg font-semibold text-white">Criar Senha</h2>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">Senha</label>
                      <input type="password" value={formData.password}
                        onChange={e => set('password', e.target.value)}
                        placeholder="Mínimo 6 caracteres" required minLength={6}
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none" />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/80">Confirmar Senha</label>
                      <input type="password" value={formData.confirmPassword}
                        onChange={e => set('confirmPassword', e.target.value)}
                        placeholder="Repita sua senha" required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/40 focus:border-violet-500/50 focus:bg-white/10 focus:outline-none" />
                    </div>

                    {/* Terms checkbox */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={termsChecked}
                          onChange={e => setTermsChecked(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={[
                          'flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200',
                          termsChecked ? 'border-violet-500 bg-violet-500' : 'border-white/25 bg-transparent',
                        ].join(' ')}>
                          {termsChecked && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-sm leading-snug text-white/65">
                        Li e aceito os{' '}
                        <a href="/termos" target="_blank" className="font-semibold text-violet-400 hover:underline">
                          Termos de Uso e Responsabilidade
                        </a>{' '}
                        da plataforma. <span className="text-red-400">*</span>
                      </span>
                    </label>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)}
                        className="flex-1 rounded-xl border border-white/10 py-3.5 font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                        Voltar
                      </button>
                      <button type="submit" disabled={loading || !termsChecked}
                        className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3.5 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Cadastrando...
                          </span>
                        ) : 'Finalizar Cadastro'}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <p className="mt-6 text-center text-sm text-white/60">
                Já tem uma conta?{' '}
                <Link href="/login" className="font-semibold text-violet-400 hover:text-violet-300">
                  Fazer login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
