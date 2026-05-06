export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-black text-white/10">404</div>
      <h1 className="text-2xl font-bold text-white">Página não encontrada</h1>
      <p className="mt-3 text-white/50">O endereço que você acessou não existe.</p>
      <a
        href="/"
        className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 inline-block"
      >
        Voltar ao início
      </a>
    </div>
  )
}
