'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Shield, Zap, CheckCircle } from 'lucide-react'

export default function PhoneAnimation() {
  const [activeScreen, setActiveScreen] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActiveScreen(p => (p + 1) % 3), 3200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: 640, width: '100%' }}>

      {/* ══════════════════════════════════════
          PORTAL / HALO SYSTEM
      ══════════════════════════════════════ */}

      {/* Ambient purple sphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 640, height: 640,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(138,92,255,0.24) 0%, rgba(93,38,204,0.1) 42%, transparent 72%)',
        filter: 'blur(52px)',
        animation: 'glowPulse 4s ease-in-out infinite',
      }} />

      {/* Fuchsia secondary glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 440, height: 440,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 70%)',
        filter: 'blur(32px)',
        animation: 'glowPulse 4s ease-in-out infinite 2s',
      }} />

      {/* Ring 1 — outermost, subtle */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 572, height: 572,
        borderRadius: '50%',
        border: '1px solid rgba(138,92,255,0.14)',
        boxShadow: '0 0 60px rgba(138,92,255,0.07), inset 0 0 60px rgba(138,92,255,0.04)',
      }} />

      {/* Ring 2 — mid */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 468, height: 468,
        borderRadius: '50%',
        border: '1.5px solid rgba(138,92,255,0.28)',
        boxShadow: '0 0 42px rgba(138,92,255,0.14), inset 0 0 42px rgba(138,92,255,0.05)',
      }} />

      {/* Ring 3 — inner, brightest */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 364, height: 364,
        borderRadius: '50%',
        border: '2px solid rgba(138,92,255,0.44)',
        boxShadow: '0 0 30px rgba(138,92,255,0.22), 0 0 80px rgba(138,92,255,0.08)',
      }} />

      {/* Platform glow beneath phone */}
      <div className="pointer-events-none absolute" style={{
        bottom: 28, left: '50%', transform: 'translateX(-50%)',
        width: 280, height: 60,
        background: 'radial-gradient(ellipse, rgba(138,92,255,0.55) 0%, rgba(138,92,255,0.15) 45%, transparent 80%)',
        filter: 'blur(22px)',
      }} />

      {/* ══════════════════════════════════════
          FLOATING CARDS
      ══════════════════════════════════════ */}

      {/* Card 1: Prestador Verificado (top-left) */}
      <div className="absolute z-20 hidden md:flex items-center gap-3" style={{
        left: 0, top: 48,
        background: 'linear-gradient(135deg, rgba(14,9,36,0.94), rgba(22,15,52,0.90))',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(138,92,255,0.32)',
        boxShadow: '0 0 0 1px rgba(138,92,255,0.08), 0 12px 48px rgba(0,0,0,0.65), 0 0 28px rgba(138,92,255,0.14)',
        borderRadius: 22,
        padding: '14px 18px',
        maxWidth: 196,
        animation: 'floatCard 4.5s ease-in-out infinite',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 15, flexShrink: 0,
          background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}>
          <Star style={{ width: 19, height: 19, fill: 'white', color: 'white' }} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
            Prestador Verificado{' '}
            <span style={{ color: '#4ade80' }}>✓</span>
          </p>
          <p style={{ marginTop: 3, fontSize: 10, color: 'rgba(169,163,201,0.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle style={{ width: 9, height: 9, color: '#4ade80', flexShrink: 0 }} />
            Qualidade Garantida
          </p>
        </div>
      </div>

      {/* Card 2: Conexão Segura (right-center) */}
      <div className="absolute z-20 hidden md:flex flex-col gap-2.5" style={{
        right: 0, top: '37%',
        background: 'linear-gradient(135deg, rgba(14,9,36,0.94), rgba(22,15,52,0.90))',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.07), 0 12px 48px rgba(0,0,0,0.65), 0 0 28px rgba(99,102,241,0.12)',
        borderRadius: 22,
        padding: '14px 18px',
        maxWidth: 164,
        animation: 'floatCard 4.5s ease-in-out infinite 1.4s',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 15,
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <Shield style={{ width: 19, height: 19, color: 'white' }} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>Conexão Segura</p>
          <p style={{ marginTop: 2, fontSize: 10, color: 'rgba(169,163,201,0.6)' }}>Seus dados protegidos</p>
        </div>
      </div>

      {/* Card 3: Resposta em minutos (left-bottom) */}
      <div className="absolute z-20 hidden md:flex items-center gap-3" style={{
        left: 0, bottom: 100,
        background: 'linear-gradient(135deg, rgba(14,9,36,0.94), rgba(22,15,52,0.90))',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(16,185,129,0.28)',
        boxShadow: '0 0 0 1px rgba(16,185,129,0.07), 0 12px 48px rgba(0,0,0,0.65), 0 0 28px rgba(16,185,129,0.1)',
        borderRadius: 22,
        padding: '14px 18px',
        maxWidth: 196,
        animation: 'floatCard 4.5s ease-in-out infinite 2.8s',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 15, flexShrink: 0,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16,185,129,0.45), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <Zap style={{ width: 19, height: 19, fill: 'white', color: 'white' }} />
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>Resposta em<br />minutos</p>
          <p style={{ marginTop: 3, fontSize: 10, color: 'rgba(169,163,201,0.6)' }}>Contato imediato</p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PHONE FRAME
      ══════════════════════════════════════ */}
      <div className="relative z-10" style={{ animation: 'phoneFloat 5.5s ease-in-out infinite' }}>

        {/* Drop shadow glow */}
        <div style={{
          position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)',
          width: 220, height: 44,
          background: 'radial-gradient(ellipse, rgba(138,92,255,0.7) 0%, rgba(138,92,255,0.2) 50%, transparent 80%)',
          filter: 'blur(18px)',
          zIndex: -1,
        }} />

        {/* Outer metallic frame */}
        <div style={{
          position: 'relative',
          height: 524, width: 268,
          borderRadius: 52,
          background: 'linear-gradient(155deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 45%, rgba(138,92,255,0.1) 100%)',
          border: '1.5px solid rgba(255,255,255,0.22)',
          padding: 4,
          boxShadow: `
            0 52px 130px rgba(0,0,0,0.9),
            0 0 0 1px rgba(138,92,255,0.22),
            0 0 70px rgba(138,92,255,0.16),
            inset 0 1.5px 0 rgba(255,255,255,0.22),
            inset 0 -1px 0 rgba(138,92,255,0.12)
          `,
        }}>

          {/* Top glass reflection */}
          <div style={{
            position: 'absolute', top: 0, left: '7%', right: '7%', height: '40%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 65%, transparent 100%)',
            borderRadius: '52px 52px 90px 90px',
            pointerEvents: 'none',
            zIndex: 30,
          }} />

          {/* Right edge metallic highlight */}
          <div style={{
            position: 'absolute', top: '12%', right: 1.5, bottom: '12%', width: 1.5,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent)',
            borderRadius: 99,
            pointerEvents: 'none',
            zIndex: 30,
          }} />

          {/* Left edge subtle */}
          <div style={{
            position: 'absolute', top: '20%', left: 1.5, bottom: '20%', width: 1,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.07) 50%, transparent)',
            borderRadius: 99,
            pointerEvents: 'none',
            zIndex: 30,
          }} />

          {/* Inner screen */}
          <div style={{
            height: '100%',
            borderRadius: 48,
            overflow: 'hidden',
            background: '#060412',
            position: 'relative',
          }}>

            {/* Dynamic Island / pill notch */}
            <div style={{
              position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
              height: 22, width: 90,
              borderRadius: 99,
              background: '#000',
              zIndex: 30,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {/* Camera dot */}
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#111', border: '1px solid rgba(255,255,255,0.06)' }} />
              {/* Pill shape inner */}
              <div style={{ width: 22, height: 6, borderRadius: 99, background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.04)' }} />
            </div>

            {/* Screens */}
            {[<ScreenHome key="home" />, <ScreenProfile key="profile" />, <ScreenSuccess key="success" />].map((Screen, i) => (
              <div key={i} style={{
                position: 'absolute', inset: 0,
                opacity: activeScreen === i ? 1 : 0,
                transform: activeScreen === i ? 'scale(1) translateY(0px)' : 'scale(0.97) translateY(5px)',
                transition: 'opacity 0.65s ease, transform 0.65s ease',
                pointerEvents: activeScreen === i ? 'auto' : 'none',
              }}>
                {Screen}
              </div>
            ))}

            {/* Screen indicator dots */}
            <div style={{
              position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: 4, zIndex: 20,
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  height: 3, borderRadius: 99,
                  width: activeScreen === i ? 18 : 4,
                  background: activeScreen === i
                    ? 'linear-gradient(90deg, #8A5CFF, #B18CFF)'
                    : 'rgba(255,255,255,0.18)',
                  transition: 'all 0.38s ease',
                  boxShadow: activeScreen === i ? '0 0 10px rgba(138,92,255,0.9)' : 'none',
                }} />
              ))}
            </div>

            {/* Bottom nav */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'space-around',
              borderTop: '1px solid rgba(255,255,255,0.055)',
              background: 'rgba(6,4,18,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              padding: '7px 4px 12px',
            }}>
              {[
                { label: 'Início', emoji: '🏠', active: activeScreen === 0 },
                { label: 'Buscar', emoji: '🔍', active: false },
                { label: 'Mensagens', emoji: '💬', active: false },
                { label: 'Perfil', emoji: '👤', active: false },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, position: 'relative' }}>
                  <span style={{ fontSize: 14 }}>{item.emoji}</span>
                  <span style={{ fontSize: 6.5, color: item.active ? '#8A5CFF' : 'rgba(169,163,201,0.38)', fontWeight: item.active ? 700 : 400 }}>
                    {item.label}
                  </span>
                  {item.active && (
                    <div style={{ position: 'absolute', bottom: -7, width: 4, height: 4, borderRadius: 99, background: '#8A5CFF', boxShadow: '0 0 8px rgba(138,92,255,0.9)' }} />
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* CSS keyframes */}
      <style>{`
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-13px) rotate(0.45deg); }
          66%       { transform: translateY(-7px) rotate(-0.3deg); }
        }
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
        }
      `}</style>
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SCREEN: HOME
══════════════════════════════════════════════════════ */
function ScreenHome() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#060412', paddingTop: 40 }}>

      {/* Status bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 25,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '6px 18px 0',
      }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff', letterSpacing: 0.3 }}>9:41</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
            {[4, 6, 9].map((h, i) => (
              <div key={i} style={{ width: 2.5, height: h, borderRadius: 1.5, background: 'rgba(255,255,255,0.9)' }} />
            ))}
          </div>
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M5.5 1.5C3.5 1.5 1.7 2.3.5 3.6L1.7 5C2.7 3.9 4 3.3 5.5 3.3s2.8.6 3.8 1.7L10.5 3.6C9.3 2.3 7.5 1.5 5.5 1.5z" fill="rgba(255,255,255,0.85)"/>
            <circle cx="5.5" cy="6.5" r="1.2" fill="rgba(255,255,255,0.9)"/>
          </svg>
          <div style={{ width: 18, height: 9, borderRadius: 2.5, border: '1px solid rgba(255,255,255,0.55)', position: 'relative', padding: 1.5 }}>
            <div style={{ width: '80%', height: '100%', borderRadius: 1.5, background: '#4ade80' }} />
            <div style={{ position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)', width: 2, height: 5, borderRadius: '0 1.5px 1.5px 0', background: 'rgba(255,255,255,0.45)' }} />
          </div>
        </div>
      </div>

      {/* Greeting header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '0 16px 10px' }}>
        <div>
          <p style={{ fontSize: 8, color: 'rgba(169,163,201,0.55)', fontWeight: 500 }}>Olá, Alessandro 👋</p>
          <p style={{ fontSize: 9.5, fontWeight: 700, color: '#fff', marginTop: 1.5, lineHeight: 1.3, maxWidth: 140 }}>Encontre o serviço ideal para você</p>
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: 99, flexShrink: 0,
          background: 'linear-gradient(135deg,#7b2ff7,#c084fc)',
          border: '2px solid rgba(138,92,255,0.5)',
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(138,92,255,0.4)',
          fontSize: 14,
        }}>
          👤
        </div>
      </div>

      {/* Search bar */}
      <div style={{ margin: '0 14px 12px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 15, background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.08)', padding: '9px 11px' }}>
        <span style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>Buscar serviços...</span>
        <div style={{
          width: 24, height: 24, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg,#7b2ff7,#9b5cff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 14px rgba(138,92,255,0.55)',
        }}>
          <Search style={{ width: 12, height: 12, color: '#fff' }} />
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '0 14px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Categorias</span>
          <span style={{ fontSize: 8, color: '#8A5CFF', fontWeight: 600 }}>Ver todas</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
          {[
            { emoji: '✂️', label: 'Beleza',     bg: 'rgba(236,72,153,0.14)', bd: 'rgba(236,72,153,0.22)' },
            { emoji: '🐾', label: 'Pet',        bg: 'rgba(59,130,246,0.14)', bd: 'rgba(59,130,246,0.22)' },
            { emoji: '🔧', label: 'Manutenção', bg: 'rgba(245,158,11,0.14)', bd: 'rgba(245,158,11,0.22)' },
            { emoji: '🚚', label: 'Delivery',   bg: 'rgba(16,185,129,0.14)', bd: 'rgba(16,185,129,0.22)' },
          ].map(c => (
            <div key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, borderRadius: 13, background: c.bg, border: `1px solid ${c.bd}`, padding: '8px 4px' }}>
              <span style={{ fontSize: 16 }}>{c.emoji}</span>
              <span style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.65)', textAlign: 'center', lineHeight: 1.25, fontWeight: 500 }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div style={{ padding: '0 14px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Em Destaque</span>
          <span style={{ fontSize: 12, color: 'rgba(169,163,201,0.4)' }}>›</span>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(138,92,255,0.18)', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ height: 72, background: 'linear-gradient(135deg,rgba(123,47,247,0.5),rgba(217,70,239,0.3))', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: '0 11px 8px' }}>
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              <div style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '2px 5px', fontSize: 7, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Cia</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star style={{ width: 9, height: 9, fill: '#fbbf24', color: '#fbbf24' }} />
              <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>5.0</span>
            </div>
          </div>
          <div style={{ padding: '9px 11px' }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Studio Beleza &amp; Cia</p>
            <p style={{ fontSize: 7.5, color: 'rgba(138,92,255,0.85)', marginTop: 2, fontWeight: 600 }}>Salão de Beleza</p>
            <div style={{
              marginTop: 8, width: '100%', borderRadius: 11,
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              padding: '8px 0',
              fontSize: 8.5, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
            }}>
              <span>📱</span>
              WhatsApp
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div style={{ height: 56 }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SCREEN: PROFILE
══════════════════════════════════════════════════════ */
function ScreenProfile() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#060412', paddingTop: 40 }}>
      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 0' }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>9:41</span>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Back header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 10px' }}>
        <div style={{ width: 22, height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: '#fff' }}>←</span>
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Perfil do Prestador</span>
      </div>

      {/* Banner */}
      <div style={{ margin: '0 14px', height: 76, borderRadius: 16, background: 'linear-gradient(135deg,rgba(123,47,247,0.55),rgba(217,70,239,0.35))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(138,92,255,0.3), rgba(217,70,239,0.2))' }} />
      </div>

      {/* Avatar overlap */}
      <div style={{ padding: '0 16px', position: 'relative', marginTop: -22 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#7b2ff7,#c084fc)', border: '2.5px solid #060412', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(138,92,255,0.4)' }}>
          <span style={{ fontSize: 20 }}>💇</span>
        </div>
      </div>

      <div style={{ padding: '8px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Espaço Bella</p>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="8" viewBox="0 0 20 20" fill="white"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
          </div>
        </div>
        <p style={{ fontSize: 8, color: '#B18CFF', marginTop: 2, fontWeight: 600 }}>Salão de Beleza · Centro</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1.5, marginTop: 5 }}>
          {[1,2,3,4,5].map(s => <Star key={s} style={{ width: 9, height: 9, fill: '#fbbf24', color: '#fbbf24' }} />)}
          <span style={{ marginLeft: 4, fontSize: 8, color: 'rgba(255,255,255,0.45)' }}>5.0 (128)</span>
        </div>
        <p style={{ fontSize: 8, lineHeight: 1.65, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Especialistas em corte, coloração e tratamentos capilares.</p>
      </div>

      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ borderRadius: 13, background: 'linear-gradient(135deg,#7b2ff7,#9b5cff)', padding: '10px 0', fontSize: 9.5, fontWeight: 700, color: '#fff', textAlign: 'center', boxShadow: '0 0 20px rgba(138,92,255,0.5)' }}>
          Ver Portfólio
        </div>
        <div style={{ borderRadius: 13, background: 'linear-gradient(135deg,#16a34a,#15803d)', padding: '10px 0', fontSize: 9.5, fontWeight: 700, color: '#fff', textAlign: 'center', boxShadow: '0 4px 16px rgba(22,163,74,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <span>📱</span> WhatsApp
        </div>
      </div>
      <div style={{ height: 56 }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════
   SCREEN: SUCCESS
══════════════════════════════════════════════════════ */
function ScreenSuccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#060412', paddingTop: 40 }}>
      {/* Status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 18px 0' }}>
        <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>9:41</span>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }} />
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px 8px' }}>
        <div style={{ width: 22, height: 22, borderRadius: 8, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, color: '#fff' }}>←</span>
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Conexão Realizada!</span>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px 60px' }}>
        {/* Success icon */}
        <div style={{ width: 76, height: 76, borderRadius: 99, background: 'linear-gradient(135deg,#22c55e,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(34,197,94,0.5)', marginBottom: 14 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', textAlign: 'center' }}>Prestador Contactado!</p>
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.65, marginTop: 5, maxWidth: 180 }}>
          O prestador recebeu sua mensagem e responderá em breve
        </p>

        <div style={{ marginTop: 18, width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(138,92,255,0.2)', padding: '11px 13px' }}>
            <div style={{ width: 26, height: 26, borderRadius: 99, background: 'linear-gradient(135deg,#7b2ff7,#c084fc)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>💇</div>
            <div>
              <p style={{ fontSize: 9.5, fontWeight: 700, color: '#fff' }}>Espaço Bella</p>
              <p style={{ fontSize: 8, color: '#4ade80', marginTop: 1.5, display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: '#4ade80', display: 'inline-block' }} /> Online agora
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, borderRadius: 14, background: 'rgba(138,92,255,0.1)', border: '1px solid rgba(138,92,255,0.25)', padding: '11px 13px' }}>
            <Star style={{ width: 16, height: 16, fill: '#fbbf24', color: '#fbbf24', flexShrink: 0 }} />
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Avalie após o atendimento</p>
          </div>
        </div>
      </div>
    </div>
  )
}
