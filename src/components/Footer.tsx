import Link from 'next/link'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

const stats = [
  { value: '500+', label: 'Prestadores Ativos' },
  { value: '2.5K+', label: 'Clientes Conectados' },
  { value: '4.9★', label: 'Avaliação Média' },
]

const quickLinks = [
  { href: '/categorias', label: 'Categorias' },
  { href: '/prestadores', label: 'Prestadores' },
  { href: '/como-funciona', label: 'Como Funciona' },
  { href: '/buscar', label: 'Buscar Serviços' },
]

const proLinks = [
  { href: '/prestador/cadastro', label: 'Cadastre-se Grátis' },
  { href: '/login', label: 'Área do Prestador' },
  { href: '/como-funciona', label: 'Por que usar?' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#07010f', borderTop: '1px solid rgba(138,92,255,0.1)' }}>

      {/* ── Top gradient accent ── */}
      <div
        className="h-px w-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(138,92,255,0.5) 30%, rgba(217,70,239,0.4) 60%, transparent 100%)' }}
      />

      {/* ── Stats band ── */}
      <div
        className="border-b"
        style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(138,92,255,0.04)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                {i > 0 && (
                  <div
                    className="pointer-events-none absolute left-0 top-1/2 hidden h-8 w-px -translate-y-1/2 sm:block"
                    style={{ background: 'rgba(138,92,255,0.2)' }}
                  />
                )}
                <p
                  className="text-2xl font-black sm:text-3xl"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8A5CFF, #B18CFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-white/45 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #7b2ff7, #c084fc)',
                  boxShadow: '0 0 20px rgba(138,92,255,0.4)',
                }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Serviços</span>
                <span style={{ color: '#8A5CFF' }}>Imperatriz</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-white/50">
              A plataforma que conecta você aos melhores profissionais de Imperatriz. Rápido, seguro e confiável.
            </p>

            {/* Social links */}
            <div className="flex gap-2.5">
              {[
                {
                  label: 'Instagram',
                  href: '#',
                  svg: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Facebook',
                  href: '#',
                  svg: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  ),
                },
                {
                  label: 'WhatsApp',
                  href: 'https://wa.me/5599982149784',
                  svg: (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  ),
                },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href !== '#' ? '_blank' : undefined}
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white/45 transition-all duration-300 hover:scale-110 hover:text-violet-400 hover:shadow-[0_0_16px_rgba(138,92,255,0.35)]"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  {social.svg}
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <p className="mb-2 text-xs font-medium text-white/40">Receba novidades:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/22 focus:outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
                <button
                  className="flex items-center justify-center rounded-xl px-3 py-2 text-white transition-all hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
                    boxShadow: '0 0 14px rgba(138,92,255,0.3)',
                  }}
                  aria-label="Assinar newsletter"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="space-y-4">
            <h3
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: '#8A5CFF' }}
            >
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/50 transition-all hover:text-violet-300"
                  >
                    <span className="h-px w-3 flex-shrink-0 rounded-full bg-violet-500/0 transition-all group-hover:w-5 group-hover:bg-violet-500/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Para Profissionais */}
          <div className="space-y-4">
            <h3
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: '#8A5CFF' }}
            >
              Para Profissionais
            </h3>
            <ul className="space-y-3">
              {proLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/50 transition-all hover:text-violet-300"
                  >
                    <span className="h-px w-3 flex-shrink-0 rounded-full bg-violet-500/0 transition-all group-hover:w-5 group-hover:bg-violet-500/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/prestador/cadastro"
              className="mt-2 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(138,92,255,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #7b2ff7, #8A5CFF)',
                boxShadow: '0 0 14px rgba(138,92,255,0.25)',
              }}
            >
              🚀 Cadastrar Grátis
            </Link>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: '#8A5CFF' }}
            >
              Contato
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:alessandro.r.business@gmail.com"
                  className="group flex items-start gap-3 text-sm text-white/50 transition-colors hover:text-violet-300"
                >
                  <div
                    className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all group-hover:shadow-[0_0_10px_rgba(138,92,255,0.4)]"
                    style={{ background: 'rgba(138,92,255,0.15)', border: '1px solid rgba(138,92,255,0.2)' }}
                  >
                    <Mail className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  <span className="break-all leading-relaxed">
                    alessandro.r.business@gmail.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5599982149784"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 text-sm text-white/50 transition-colors hover:text-violet-300"
                >
                  <div
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-all group-hover:shadow-[0_0_10px_rgba(138,92,255,0.4)]"
                    style={{ background: 'rgba(138,92,255,0.15)', border: '1px solid rgba(138,92,255,0.2)' }}
                  >
                    <Phone className="h-3.5 w-3.5 text-violet-400" />
                  </div>
                  (99) 98214-9784
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/50">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(138,92,255,0.15)', border: '1px solid rgba(138,92,255,0.2)' }}
                >
                  <MapPin className="h-3.5 w-3.5 text-violet-400" />
                </div>
                Imperatriz, Maranhão – MA
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="border-t"
        style={{ borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} ServiçosImperatriz. Todos os direitos reservados.
            </p>
            <p className="text-xs" style={{ color: 'rgba(169,163,201,0.35)' }}>
              Feito com{' '}
              <span style={{ color: '#f43f5e' }}>❤️</span>
              {' '}em Imperatriz, MA
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
