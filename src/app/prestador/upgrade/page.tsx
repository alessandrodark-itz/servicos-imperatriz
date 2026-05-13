'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Crown, Share2, Camera, Zap, BarChart2, Palette,
  Shield, CheckCircle, Copy, Check, ArrowRight,
  Loader2, ChevronLeft, Sparkles, Users, Clock, Lock, Star,
} from 'lucide-react'
import { createBrowser } from '@/lib/supabase'

/* ─── Benefícios honestos do VIP ───────────────────────── */
const BENEFITS = [
  {
    icon: Share2,
    title: 'Compartilhe seu perfil onde quiser',
    desc: 'Botão exclusivo para enviar sua página direto no WhatsApp, grupos e Instagram. Quem é free não tem essa opção.',
    color: '#34d399',
    badge: 'Exclusivo VIP',
  },
  {
    icon: Crown,
    title: 'Borda animada + selo VIP dourado',
    desc: 'Seu card no catálogo se destaca visualmente com borda neon e badge dourado. Clientes percebem na hora.',
    color: '#f59e0b',
    badge: null,
  },
  {
    icon: Camera,
    title: '7 fotos no portfólio',
    desc: '3 fotos a mais para mostrar mais do seu trabalho. Profissionais com mais fotos recebem mais mensagens.',
    color: '#60a5fa',
    badge: null,
  },
  {
    icon: Zap,
    title: 'Status de disponibilidade',
    desc: 'Um indicador verde mostra que você está online. Clientes preferem quem responde rápido.',
    color: '#4ade80',
    badge: null,
  },
  {
    icon: BarChart2,
    title: 'Veja quem visitou seu perfil',
    desc: 'Saiba quantas pessoas viram sua página e clicaram no WhatsApp. Dados reais do seu alcance.',
    color: '#a78bfa',
    badge: null,
  },
  {
    icon: Palette,
    title: '16 temas exclusivos',
    desc: 'Personalize a aparência do seu perfil: Galaxy, Cyberpunk, Lava, Ocean e mais. Identidade visual única.',
    color: '#f472b6',
    badge: null,
  },
] as const

/* ─── Tipos ────────────────────────────────────────────── */
type Step   = 'form' | 'pix' | 'confirmed'
type PixData = { orderId: string; pixCode: string; qrCodeDataUrl: string; expiresAt: string }

/* ─── Helpers ──────────────────────────────────────────── */
function formatCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}
function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/* ─── Mini card preview ─────────────────────────────────── */
function CardPreview({ variant }: { variant: 'free' | 'vip' }) {
  const isVip = variant === 'vip'
  return (
    <div style={{
      position: 'relative',
      borderRadius: '20px',
      padding: isVip ? '2px' : '1px',
      background: isVip
        ? 'linear-gradient(135deg, #a78bfa, #818cf8, #f472b6, #a78bfa)'
        : 'rgba(255,255,255,0.08)',
      backgroundSize: isVip ? '300% 300%' : '100%',
      animation: isVip ? 'borderSpin 3s linear infinite' : 'none',
      boxShadow: isVip ? '0 0 30px rgba(167,139,250,.35)' : 'none',
      flex: 1,
    }}>
      <div style={{
        borderRadius: '18px',
        background: isVip ? 'linear-gradient(145deg, #0d0521, #120938)' : '#0a0a10',
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {/* Header do card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Avatar */}
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
            background: isVip
              ? 'conic-gradient(from 0deg, #a78bfa, #818cf8, #f472b6, #a78bfa)'
              : 'rgba(255,255,255,0.08)',
            padding: isVip ? '2px' : '0',
            boxSizing: 'border-box',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: isVip ? '#1a0a2e' : '#1a1a24',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px',
            }}>
              {isVip ? '🧹' : '💇'}
            </div>
          </div>
          {/* Nome + categoria */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{isVip ? 'Maria Souza' : 'Ana Lima'}</span>
              {isVip && <Crown style={{ width: '11px', height: '11px', color: '#f59e0b' }} />}
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.45)' }}>{isVip ? 'Faxineira' : 'Cabeleireira'}</span>
          </div>
          {/* Badge */}
          {isVip
            ? <div style={{
                background: 'linear-gradient(135deg,#b45309,#f59e0b)',
                borderRadius: '6px', padding: '2px 7px',
                fontSize: '9px', fontWeight: 800, color: '#fff', letterSpacing: '.5px',
              }}>VIP</div>
            : <div style={{
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '6px', padding: '2px 7px',
                fontSize: '9px', color: 'rgba(255,255,255,.3)',
              }}>FREE</div>
          }
        </div>

        {/* Stars + online */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '2px' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} style={{ width: '9px', height: '9px', fill: '#f59e0b', color: '#f59e0b' }} />
            ))}
          </div>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,.35)' }}>4.8 • 12 avaliações</span>
          {isVip && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80' }} />
              <span style={{ fontSize: '9px', color: '#4ade80' }}>Online</span>
            </div>
          )}
        </div>

        {/* Fotos */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isVip ? 4 : 3}, 1fr)`, gap: '4px' }}>
          {Array.from({ length: isVip ? 7 : 4 }).slice(0, isVip ? 4 : 3).map((_, i) => (
            <div key={i} style={{
              height: '28px', borderRadius: '6px',
              background: isVip
                ? `hsl(${260 + i * 30},60%,${25 + i * 5}%)`
                : 'rgba(255,255,255,.06)',
            }} />
          ))}
        </div>

        {/* Botão compartilhar — só VIP */}
        {isVip ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            padding: '7px', borderRadius: '10px',
            background: 'rgba(139,92,246,.15)', border: '1px solid rgba(139,92,246,.3)',
            fontSize: '11px', fontWeight: 600, color: '#c4b5fd',
          }}>
            <Share2 style={{ width: '11px', height: '11px' }} /> Compartilhar perfil
          </div>
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
            padding: '7px', borderRadius: '10px',
            background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
            fontSize: '11px', color: 'rgba(255,255,255,.2)',
          }}>
            <Lock style={{ width: '11px', height: '11px' }} /> Indisponível no free
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Página principal ─────────────────────────────────── */
export default function UpgradePage() {
  const router = useRouter()

  const [userId, setUserId]           = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [step, setStep]               = useState<Step>('form')
  const [name, setName]               = useState('')
  const [cpf, setCpf]                 = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [formError, setFormError]     = useState('')
  const [pixData, setPixData]         = useState<PixData | null>(null)
  const [timeLeft, setTimeLeft]       = useState(0)
  const [copied, setCopied]           = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* Auth */
  useEffect(() => {
    const sb = createBrowser()
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/login'); return }
      setUserId(session.user.id)
      const { data } = await sb.from('providers').select('name').eq('user_id', session.user.id).single()
      if (data?.name) setName(data.name)
      setAuthLoading(false)
    })
  }, [router])

  /* Countdown */
  useEffect(() => {
    if (!pixData?.expiresAt) return
    const tick = () => setTimeLeft(Math.max(0, new Date(pixData.expiresAt).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [pixData?.expiresAt])

  /* Polling */
  const checkPayment = useCallback(async (orderId: string) => {
    try {
      const r = await fetch(`/api/pagbank/status?orderId=${orderId}`)
      const j = await r.json()
      if (j.isPaid) {
        if (pollRef.current) clearInterval(pollRef.current)
        setStep('confirmed')
        setTimeout(() => router.push('/prestador/dashboard'), 4000)
      }
    } catch { /* silent */ }
  }, [router])

  useEffect(() => {
    if (step !== 'pix' || !pixData?.orderId) return
    pollRef.current = setInterval(() => checkPayment(pixData.orderId), 5000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, pixData?.orderId, checkPayment])

  /* Gerar PIX */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    const rawCpf = cpf.replace(/\D/g, '')
    if (rawCpf.length !== 11) { setFormError('CPF inválido'); return }
    setSubmitting(true); setFormError('')
    try {
      const res  = await fetch('/api/pagbank/create-pix', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: name, customerCpf: rawCpf, userId }),
      })
      const data = await res.json()
      if (!res.ok) { setFormError(data.error ?? 'Erro ao gerar PIX'); return }
      setPixData(data); setStep('pix')
    } catch { setFormError('Erro de conexão. Tente novamente.') }
    finally  { setSubmitting(false) }
  }

  /* Copiar */
  async function copyCode() {
    if (!pixData?.pixCode) return
    await navigator.clipboard.writeText(pixData.pixCode)
    setCopied(true); setTimeout(() => setCopied(false), 3000)
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#060112' }}>
        <Loader2 style={{ width: '32px', height: '32px', color: '#818cf8' }} className="animate-spin" />
      </div>
    )
  }

  /* ─── RENDER ─────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes borderSpin {
          0%   { background-position: 0%   50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0%   50%; }
        }
        @keyframes floatPx {
          0%   { transform: translateY(0)      scale(1);   opacity: 0; }
          10%  { opacity: .3; }
          90%  { opacity: .1; }
          100% { transform: translateY(-100vh) scale(.3);  opacity: 0; }
        }
        @keyframes priceShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes pulseCard {
          0%, 100% { box-shadow: 0 0 28px rgba(139,92,246,.28), 0 0 56px rgba(139,92,246,.10); }
          50%       { box-shadow: 0 0 44px rgba(139,92,246,.52), 0 0 80px rgba(139,92,246,.20); }
        }
        @keyframes dotBounce {
          0%, 100% { transform: scale(1); opacity: .6; }
          50%       { transform: scale(1.5); opacity: 1; }
        }
        .particle { position:absolute; border-radius:50%; pointer-events:none;
          animation: floatPx var(--dur) ease-in var(--delay) infinite; will-change:transform,opacity; }
        .price-gold {
          background: linear-gradient(90deg,#d97706 0%,#fbbf24 35%,#f59e0b 55%,#d97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          animation: priceShimmer 2.4s linear infinite;
        }
        .pay-card { animation: pulseCard 3.5s ease-in-out infinite; }
        .inp {
          width:100%; box-sizing:border-box; background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.12); border-radius:12px;
          padding:13px 16px; color:#fff; font-size:15px; outline:none;
          transition: border-color .2s;
        }
        .inp:focus { border-color:rgba(139,92,246,.6); }
        .btn-pix {
          width:100%; padding:15px; border-radius:14px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#32ba7c,#0da05a);
          font-size:16px; font-weight:700; color:#fff;
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 0 28px rgba(50,186,124,.38); transition: all .2s;
        }
        .btn-pix:hover:not(:disabled){ box-shadow:0 0 44px rgba(50,186,124,.6); transform:translateY(-1px); }
        .btn-pix:disabled { opacity:.6; cursor:not-allowed; }
        .copy-btn {
          flex-shrink:0; padding:9px 16px; border-radius:10px; border:none; cursor:pointer;
          background:linear-gradient(135deg,#7c3aed,#6d28d9);
          color:#fff; font-size:12px; font-weight:700;
          display:flex; align-items:center; gap:6px; transition: all .2s;
        }
        .copy-btn:hover { filter:brightness(1.15); transform:translateY(-1px); }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#060112', position: 'relative', overflow: 'hidden' }}>

        {/* Atmosphere */}
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: [
              'radial-gradient(ellipse 75% 55% at 15% 8%,  rgba(139,92,246,.24) 0%, transparent 58%)',
              'radial-gradient(ellipse 65% 75% at 85% 85%, rgba(99,40,200,.18)  0%, transparent 52%)',
            ].join(', '),
          }} />
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="particle" style={{
              left:     `${5 + (i * 5.8 + 2) % 90}%`,
              bottom:   `-${4 + (i * 5) % 14}px`,
              width:    `${1.5 + (i % 3) * .8}px`,
              height:   `${1.5 + (i % 3) * .8}px`,
              background: ['#a78bfa','#818cf8','#c4b5fd'][i % 3],
              '--dur':   `${12 + (i * 1.4) % 8}s`,
              '--delay': `${(i * .85) % 11}s`,
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1080px', margin: '0 auto', padding: '0 16px 96px' }}>

          {/* Nav */}
          <div style={{ paddingTop: '24px', marginBottom: '40px' }}>
            <Link href="/prestador/dashboard"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(255,255,255,.45)', textDecoration: 'none' }}>
              <ChevronLeft style={{ width: '16px', height: '16px' }} /> Voltar ao painel
            </Link>
          </div>

          {/* ── HERO ── */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(139,92,246,.12)', border: '1px solid rgba(139,92,246,.28)',
              borderRadius: '999px', padding: '6px 18px', marginBottom: '22px',
            }}>
              <Sparkles style={{ width: '14px', height: '14px', color: '#a78bfa' }} />
              <span style={{ fontSize: '13px', color: '#c4b5fd', fontWeight: 600 }}>R$&nbsp;7,99/mês — sem contrato</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(26px, 5vw, 50px)', fontWeight: 900, color: '#fff',
              lineHeight: 1.1, marginBottom: '16px',
            }}>
              A vitrine já existe.{' '}
              <span style={{
                background: 'linear-gradient(135deg,#a78bfa,#818cf8,#c4b5fd)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Agora seja visto.
              </span>
            </h1>

            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,.5)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              O Serv-Itz é um catálogo de profissionais em Imperatriz. Você já está cadastrado — o VIP faz você se destacar de verdade.
            </p>

            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '12px', padding: '10px 20px',
            }}>
              <Users style={{ width: '15px', height: '15px', color: '#a78bfa' }} />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,.55)' }}>
                <strong style={{ color: '#fff' }}>+47 profissionais</strong> já são VIP em Imperatriz
              </span>
            </div>
          </div>

          {/* ── COMPARATIVO VISUAL ── */}
          <div style={{ marginBottom: '64px' }}>
            <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,.35)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              É assim que os clientes veem você no catálogo
            </p>
            <div style={{ display: 'flex', gap: '16px', maxWidth: '540px', margin: '0 auto', alignItems: 'stretch' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px' }}>
                  Plano Gratuito
                </div>
                <CardPreview variant="free" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'rgba(255,255,255,.2)', fontSize: '18px', fontWeight: 300 }}>vs</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.8px' }}>
                  ✦ Plano VIP
                </div>
                <CardPreview variant="vip" />
              </div>
            </div>
          </div>

          {/* ── GRID PRINCIPAL ── */}
          <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))', alignItems: 'start' }}>

            {/* Benefícios */}
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '18px' }}>
                O que muda no seu perfil
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {BENEFITS.map((b, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
                    borderRadius: '16px', padding: '14px 16px',
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '11px', flexShrink: 0,
                      background: `${b.color}1a`, border: `1px solid ${b.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <b.icon style={{ width: '17px', height: '17px', color: b.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>{b.title}</span>
                        {b.badge && (
                          <span style={{
                            fontSize: '10px', fontWeight: 700, color: '#34d399',
                            background: 'rgba(52,211,153,.12)', border: '1px solid rgba(52,211,153,.25)',
                            borderRadius: '999px', padding: '1px 8px',
                          }}>{b.badge}</span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nota de transparência */}
              <div style={{
                marginTop: '20px', padding: '14px 16px',
                background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)',
                borderRadius: '14px',
              }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.35)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'rgba(255,255,255,.5)' }}>Transparência:</strong> o Serv-Itz é um catálogo. Clientes buscam aqui e entram em contato pelo WhatsApp. O VIP não garante contratos — ele garante que <em>mais pessoas te encontrem e vejam quem você é</em>.
                </p>
              </div>
            </div>

            {/* Card de pagamento */}
            <div>
              <div className="pay-card" style={{
                background: 'linear-gradient(145deg, #0d0521, #120938, #0d0521)',
                border: '1px solid rgba(139,92,246,.38)', borderRadius: '24px', overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,.22), rgba(109,40,217,.12))',
                  padding: '22px 26px', borderBottom: '1px solid rgba(139,92,246,.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <Crown style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '17px' }}>Plano VIP</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)' }}>30 dias de acesso</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="price-gold" style={{ fontSize: '34px', fontWeight: 900 }}>R$&nbsp;7,99</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)' }}>/mês</div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '26px' }}>

                  {/* FORM */}
                  {step === 'form' && (
                    <form onSubmit={handleSubmit}>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.5)', marginBottom: '20px', lineHeight: 1.6 }}>
                        Pague via PIX e o acesso VIP é ativado automaticamente — sem burocracia.
                      </p>

                      {formError && (
                        <div style={{
                          marginBottom: '16px', padding: '11px 14px',
                          background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)',
                          borderRadius: '10px', fontSize: '13px', color: '#fca5a5',
                        }}>
                          {formError}
                        </div>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '7px', fontWeight: 600 }}>
                            Nome completo
                          </label>
                          <input type="text" required value={name} onChange={e => setName(e.target.value)}
                            placeholder="Seu nome completo" className="inp" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,.5)', marginBottom: '7px', fontWeight: 600 }}>
                            CPF
                          </label>
                          <input type="text" required inputMode="numeric" value={cpf}
                            onChange={e => setCpf(formatCpf(e.target.value))}
                            placeholder="000.000.000-00" maxLength={14} className="inp" />
                          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.25)', marginTop: '5px' }}>
                            Necessário para emissão do PIX pelo Mercado Pago
                          </p>
                        </div>
                        <button type="submit" disabled={submitting} className="btn-pix">
                          {submitting
                            ? <><Loader2 style={{ width: '18px', height: '18px' }} className="animate-spin" /> Gerando PIX...</>
                            : <><Zap style={{ width: '18px', height: '18px' }} /> Gerar QR code PIX — R$&nbsp;7,99</>
                          }
                        </button>
                      </div>

                      <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        {[
                          [Shield, 'Pagamento seguro', '#4ade80'],
                          [Zap,    'Ativação na hora',  '#a78bfa'],
                          [CheckCircle, 'Bancário', '#60a5fa'],
                        ].map(([Icon, label, color], i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Icon style={{ width: '13px', height: '13px', color: color as string }} />
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)' }}>{label as string}</span>
                          </div>
                        ))}
                      </div>
                    </form>
                  )}

                  {/* PIX */}
                  {step === 'pix' && pixData && (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: '#fff', fontSize: '16px', marginBottom: '5px' }}>
                        Escaneie ou copie o código
                      </p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)', marginBottom: '22px' }}>
                        Qualquer banco ou carteira digital aceita PIX
                      </p>

                      <div style={{
                        display: 'inline-block', padding: '14px', background: '#fff',
                        borderRadius: '18px', boxShadow: '0 0 40px rgba(139,92,246,.3)', marginBottom: '20px',
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={pixData.qrCodeDataUrl} alt="QR Code PIX" width={200} height={200}
                          style={{ display: 'block', borderRadius: '8px' }} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', marginBottom: '18px' }}>
                        <Clock style={{ width: '14px', height: '14px', color: '#f59e0b' }} />
                        <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 600 }}>
                          Expira em {formatMs(timeLeft)}
                        </span>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,.35)', marginBottom: '7px' }}>
                          Ou copie o código PIX:
                        </p>
                        <div style={{
                          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)',
                          borderRadius: '12px', padding: '10px 12px',
                          display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                          <code style={{
                            flex: 1, fontSize: '10px', color: 'rgba(255,255,255,.5)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left',
                          }}>
                            {pixData.pixCode}
                          </code>
                          <button onClick={copyCode} className="copy-btn">
                            {copied
                              ? <><Check style={{ width: '14px', height: '14px', color: '#86efac' }} /> Copiado!</>
                              : <><Copy style={{ width: '14px', height: '14px' }} /> Copiar</>
                            }
                          </button>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        padding: '11px', borderRadius: '12px',
                        background: 'rgba(139,92,246,.08)', border: '1px solid rgba(139,92,246,.18)',
                      }}>
                        <Loader2 style={{ width: '14px', height: '14px', color: '#a78bfa' }} className="animate-spin" />
                        <span style={{ fontSize: '12px', color: '#c4b5fd' }}>
                          Aguardando confirmação do pagamento…
                        </span>
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,.25)' }}>
                        Não feche esta tela. O VIP ativa sozinho após o PIX.
                      </p>
                    </div>
                  )}

                  {/* CONFIRMADO */}
                  {step === 'confirmed' && (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: 'rgba(52,211,153,.12)', border: '2px solid rgba(52,211,153,.38)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
                        boxShadow: '0 0 30px rgba(52,211,153,.25)',
                      }}>
                        <CheckCircle style={{ width: '36px', height: '36px', color: '#34d399' }} />
                      </div>
                      <h3 style={{ fontWeight: 800, color: '#fff', fontSize: '20px', marginBottom: '8px' }}>
                        Pagamento confirmado!
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,.55)', marginBottom: '22px' }}>
                        Seu perfil VIP está ativo por <strong style={{ color: '#a78bfa' }}>30 dias</strong>.
                        Redirecionando...
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} style={{
                            width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa',
                            animation: `dotBounce 1s ease-in-out ${i * .28}s infinite`,
                          }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Garantia */}
              <div style={{
                marginTop: '14px', padding: '13px 16px',
                background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)',
                borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '11px',
              }}>
                <Shield style={{ width: '18px', height: '18px', flexShrink: 0, color: '#4ade80' }} />
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,.4)', lineHeight: 1.5 }}>
                  Pagamento via <strong style={{ color: 'rgba(255,255,255,.6)' }}>Mercado Pago</strong>. Seus dados nunca são armazenados em nossos servidores.
                </p>
              </div>

              <p style={{ marginTop: '14px', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,.28)' }}>
                Dúvidas?{' '}
                <a href="https://wa.me/5599982149784" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#a78bfa', textDecoration: 'none' }}>
                  Fale pelo WhatsApp
                </a>
              </p>
            </div>
          </div>

          {/* ── CTA FINAL ── */}
          <div style={{ textAlign: 'center', marginTop: '72px' }}>
            <div style={{ marginBottom: '8px', fontSize: '13px', color: 'rgba(255,255,255,.3)' }}>
              Sem contrato. Cancele quando quiser. Renova mensalmente.
            </div>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg,#7c3aed,#6d28d9)',
                border: 'none', borderRadius: '16px', padding: '15px 34px',
                fontSize: '15px', fontWeight: 700, color: '#fff', cursor: 'pointer',
                boxShadow: '0 0 36px rgba(124,58,237,.38)', transition: 'all .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 56px rgba(124,58,237,.6)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 36px rgba(124,58,237,.38)' }}
            >
              <Crown style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              Ativar meu VIP agora
              <ArrowRight style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
