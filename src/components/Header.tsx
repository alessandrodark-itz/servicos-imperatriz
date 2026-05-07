'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, MapPin, User, Moon, LogOut, ChevronDown, Settings, LayoutDashboard, Zap, Search, Star, Bell } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createBrowser } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useAdminMessages } from './AdminMessagesProvider'

function AdminNotificationBell() {
  const { pendingCount } = useAdminMessages()
  if (pendingCount === 0) return null
  return (
    <div className="relative">
      <button
        className="rounded-lg p-2 text-orange-400 transition-all hover:bg-orange-500/10 animate-pulse"
        title={`${pendingCount} mensagem(ns) administrativa(s) pendente(s)`}
        aria-label="Mensagens administrativas pendentes"
      >
        <Bell className="h-4 w-4" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-lg">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      </button>
    </div>
  )
}

export default function Header() {
  const pathname  = usePathname()
  const router    = useRouter()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user,           setUser]           = useState<SupabaseUser | null>(null)
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [avatarUrl,      setAvatarUrl]      = useState<string | null>(null)
  const [profileName,    setProfileName]    = useState<string | null>(null)
  const [isProvider,     setIsProvider]     = useState(false)
  const [scrolled,       setScrolled]       = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchProfile = useCallback(async (uid: string, userMeta?: Record<string, any>) => {
    const supabase = createBrowser()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const [{ data: profile }, { data: provider }] = await Promise.all([
      db.from('profiles')
        .select('full_name, avatar_url, user_type')
        .eq('id', uid)
        .single(),
      db.from('providers')
        .select('id')
        .eq('user_id', uid)
        .single(),
    ])
    if (profile) {
      setProfileName(profile.full_name ?? null)
      setAvatarUrl(profile.avatar_url ?? null)
    }
    // Verifica user_type na tabela profiles E no user_metadata (cadastro recente)
    const resolvedType = profile?.user_type ?? userMeta?.user_type ?? ''
    setIsProvider(
      !!provider ||
      ['prestador', 'provider'].includes(resolvedType)
    )
  }, [])

  /* ── auth state ── */
  useEffect(() => {
    const supabase = createBrowser()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id, session.user.user_metadata)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id, session.user.user_metadata)
      else { setAvatarUrl(null); setProfileName(null); setIsProvider(false) }
    })

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  /* ── atualiza avatar/nome quando perfil é salvo ── */
  useEffect(() => {
    function onProfileUpdated() {
      if (user) fetchProfile(user.id)
    }
    window.addEventListener('profileUpdated', onProfileUpdated)
    return () => window.removeEventListener('profileUpdated', onProfileUpdated)
  }, [user, fetchProfile])

  /* ── scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── fechar dropdown ao clicar fora ── */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function handleSignOut() {
    const supabase = createBrowser()
    await supabase.auth.signOut()
    setDropdownOpen(false)
    setMobileMenuOpen(false)
    setAvatarUrl(null)
    setProfileName(null)
    setIsProvider(false)
    router.push('/')
    router.refresh()
  }

  const displayName = profileName ?? user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? 'Usuário'
  const initials    = displayName.charAt(0).toUpperCase()

  const navLinks = [
    { href: '/',                   label: 'Início' },
    { href: '/categorias',         label: 'Categorias' },
    { href: '/como-funciona',      label: 'Como Funciona' },
    { href: '/prestador/cadastro', label: 'Seja um Prestador' },
  ]

  function Avatar({ size }: { size: 'sm' | 'md' }) {
    const cls = size === 'sm'
      ? 'h-7 w-7 text-xs'
      : 'h-8 w-8 text-sm'

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="Foto de perfil"
          className={`${cls} rounded-full object-cover ring-1 ring-white/20`}
        />
      )
    }
    return (
      <div className={`${cls} flex items-center justify-center rounded-full bg-gradient-to-br from-[#7F77DD] to-fuchsia-500 font-bold text-white`}>
        {initials}
      </div>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'shadow-[0_4px_32px_rgba(0,0,0,0.6)]'
          : ''
      }`}
      style={{
        borderBottom: scrolled
          ? '1px solid rgba(138,92,255,0.15)'
          : '1px solid rgba(255,255,255,0.07)',
        background: scrolled
          ? 'rgba(5,1,10,0.97)'
          : 'rgba(5,1,10,0.75)',
        backdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(16px)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">

          {/* Logo */}
          <Link href="/" className="group flex flex-shrink-0 items-center gap-2.5">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(138,92,255,0.6)]"
              style={{ boxShadow: '0 0 14px rgba(138,92,255,0.35)' }}
            >
              <img
                src="/icons/logo.png"
                alt="Serv-Itz"
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement
                  img.style.display = 'none'
                  img.parentElement!.style.background = 'linear-gradient(135deg, #7b2ff7, #c084fc)'
                }}
              />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">Serv-</span>
              <span style={{ color: '#8A5CFF' }}>Itz</span>
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isCTA = link.href === '/prestador/cadastro'
              if (isCTA) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(138,92,255,0.5)]"
                    style={{
                      background: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
                      boxShadow: '0 0 14px rgba(138,92,255,0.3)',
                    }}
                  >
                    <Zap className="h-3.5 w-3.5 fill-white" />
                    {link.label}
                  </Link>
                )
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-violet-400'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-px rounded-full"
                      style={{ background: 'linear-gradient(90deg, transparent, #8A5CFF, transparent)' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Ações desktop */}
          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-lg p-2 text-white/50 transition-all hover:bg-white/10 hover:text-white">
              <Moon className="h-4 w-4" />
            </button>

            {user && <AdminNotificationBell />}

            {user ? (
              /* ── usuário logado ── */
              <div className="relative" ref={dropdownRef}>
                {/* Trigger button — cor muda por tipo */}
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:opacity-90"
                  style={isProvider
                    ? { background: 'rgba(127,119,221,0.15)', border: '1px solid rgba(127,119,221,0.35)' }
                    : { background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }
                  }
                >
                  <Avatar size="sm" />
                  <div className="flex flex-col items-start">
                    <span className="max-w-[90px] truncate text-xs font-bold text-white leading-tight">
                      {displayName}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-widest leading-tight ${isProvider ? 'text-violet-400' : 'text-sky-400'}`}>
                      {isProvider ? '✦ Prestador' : '● Cliente'}
                    </span>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isProvider ? 'text-violet-400' : 'text-sky-400'} ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl shadow-2xl"
                    style={{
                      background: 'rgba(10,6,24,0.98)',
                      backdropFilter: 'blur(28px)',
                      border: isProvider
                        ? '1px solid rgba(127,119,221,0.25)'
                        : '1px solid rgba(14,165,233,0.22)',
                      boxShadow: isProvider
                        ? '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(127,119,221,0.12)'
                        : '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(14,165,233,0.1)',
                    }}
                  >
                    {/* ── Cabeçalho colorido por tipo ── */}
                    {isProvider ? (
                      <div
                        className="relative overflow-hidden px-4 py-4"
                        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.4) 0%, rgba(127,119,221,0.2) 100%)', borderBottom: '1px solid rgba(127,119,221,0.2)' }}
                      >
                        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-violet-500/20 blur-2xl" />
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar size="md" />
                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 shadow-[0_0_8px_rgba(127,119,221,0.8)]">
                              <Zap className="h-2.5 w-2.5 fill-white text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white"
                                style={{ background: 'linear-gradient(90deg, #7b2ff7, #a855f7)', boxShadow: '0 0 10px rgba(127,119,221,0.5)' }}
                              >
                                ✦ PRESTADOR PRO
                              </span>
                            </div>
                            <p className="truncate text-sm font-bold text-white">{displayName}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="relative overflow-hidden px-4 py-4"
                        style={{ background: 'linear-gradient(135deg, rgba(14,100,163,0.4) 0%, rgba(14,165,233,0.15) 100%)', borderBottom: '1px solid rgba(14,165,233,0.2)' }}
                      >
                        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-500/20 blur-2xl" />
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar size="md" />
                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.8)]">
                              <Star className="h-2.5 w-2.5 fill-white text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span
                                className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white"
                                style={{ background: 'linear-gradient(90deg, #0284c7, #38bdf8)', boxShadow: '0 0 10px rgba(14,165,233,0.5)' }}
                              >
                                ● CLIENTE
                              </span>
                            </div>
                            <p className="truncate text-sm font-bold text-white">{displayName}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ── Itens do menu por tipo ── */}
                    <div className="py-1.5">
                      {isProvider ? (
                        <>
                          <Link
                            href="/prestador/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-violet-500/10"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/15 transition-all group-hover:bg-violet-500/25" style={{ boxShadow: '0 0 12px rgba(127,119,221,0.2)' }}>
                              <LayoutDashboard className="h-4 w-4 text-violet-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-semibold text-violet-300">Meu Painel</p>
                              <p className="text-[10px] text-white/35">Gerenciar serviços</p>
                            </div>
                            <span className="rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-white" style={{ background: 'linear-gradient(90deg,#7b2ff7,#a855f7)' }}>
                              PRO
                            </span>
                          </Link>
                          <Link
                            href="/perfil"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-white/5"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/8 transition-all group-hover:bg-white/12">
                              <Settings className="h-4 w-4 text-white/50" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-white/70 group-hover:text-white">Meu Perfil</p>
                              <p className="text-[10px] text-white/30">Editar dados pessoais</p>
                            </div>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/perfil"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-sky-500/10"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-sky-500/15 transition-all group-hover:bg-sky-500/25">
                              <User className="h-4 w-4 text-sky-400" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-semibold text-sky-300">Meu Perfil</p>
                              <p className="text-[10px] text-white/35">Editar dados pessoais</p>
                            </div>
                          </Link>
                          <Link
                            href="/buscar"
                            onClick={() => setDropdownOpen(false)}
                            className="group flex w-full items-center gap-3 px-4 py-3 transition-all hover:bg-white/5"
                          >
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/8 transition-all group-hover:bg-white/12">
                              <Search className="h-4 w-4 text-white/50" />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="text-sm font-medium text-white/70 group-hover:text-white">Buscar Serviços</p>
                              <p className="text-[10px] text-white/30">Encontrar prestadores</p>
                            </div>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* ── Sair ── */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400/80 transition-all hover:bg-red-500/8 hover:text-red-400"
                      >
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                          <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Sair da conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── não logado ── */
              <>
                <Link
                  href="/login"
                  className="rounded-xl border border-white/20 px-5 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:bg-white/5 hover:text-white"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.55)]"
                >
                  <User className="h-4 w-4" />
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          {/* Botão menu mobile */}
          <button
            className="rounded-lg p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="space-y-1 border-t border-white/10 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <div className="mt-2 overflow-hidden rounded-2xl" style={isProvider
                ? { background: 'linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(127,119,221,0.1) 100%)', border: '1px solid rgba(127,119,221,0.2)' }
                : { background: 'linear-gradient(135deg, rgba(14,100,163,0.25) 0%, rgba(14,165,233,0.1) 100%)', border: '1px solid rgba(14,165,233,0.2)' }
              }>
                {/* Banner de tipo */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="relative">
                    <Avatar size="md" />
                    <div className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full shadow-lg ${isProvider ? 'bg-violet-500' : 'bg-sky-500'}`}>
                      {isProvider ? <Zap className="h-2.5 w-2.5 fill-white text-white" /> : <Star className="h-2.5 w-2.5 fill-white text-white" />}
                    </div>
                  </div>
                  <div>
                    <span
                      className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white mb-0.5"
                      style={isProvider
                        ? { background: 'linear-gradient(90deg,#7b2ff7,#a855f7)' }
                        : { background: 'linear-gradient(90deg,#0284c7,#38bdf8)' }
                      }
                    >
                      {isProvider ? '✦ Prestador PRO' : '● Cliente'}
                    </span>
                    <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  </div>
                </div>
                {/* Links */}
                <div className="border-t border-white/10 px-2 py-1.5 space-y-0.5">
                  {isProvider ? (
                    <>
                      <Link
                        href="/prestador/dashboard"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/15 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Meu Painel PRO
                      </Link>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Meu Perfil
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/perfil"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-sky-300 hover:bg-sky-500/15 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Meu Perfil
                      </Link>
                      <Link
                        href="/buscar"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Search className="h-4 w-4" />
                        Buscar Serviços
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 border-t border-white/10 pt-3">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 py-2.5 text-sm font-medium text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 rounded-xl border border-white/20 py-2.5 text-center text-sm font-medium text-white/70"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/cadastro"
                    className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-2.5 text-center text-sm font-semibold text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
