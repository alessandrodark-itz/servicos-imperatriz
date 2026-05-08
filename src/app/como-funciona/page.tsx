import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, UserPlus, Star, MessageCircle, Shield, Zap, Award, ArrowRight } from 'lucide-react'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 py-16 sm:py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-fuchsia-600/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-400">
              Entenda o processo
            </p>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Como{' '}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
                Funciona
              </span>
            </h1>
            <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
              Encontre o profissional ideal em poucos passos simples
            </p>
          </div>
        </section>

        {/* Para Clientes */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Para <span className="text-violet-400">Clientes</span>
              </h2>
              <p className="mt-2 text-white/60">Encontre profissionais em 3 passos simples</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-violet-500/30 hover:bg-white/10">
                <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-lg font-bold text-white shadow-lg">
                  1
                </div>
                <div className="mt-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-500/20">
                    <Search className="h-7 w-7 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Descubra Profissionais</h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Use a busca ou navegue por categorias para encontrar o profissional independente ideal para você.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-violet-500/30 hover:bg-white/10">
                <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-lg font-bold text-white shadow-lg">
                  2
                </div>
                <div className="mt-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-fuchsia-500/20">
                    <Star className="h-7 w-7 text-fuchsia-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Compare Perfis</h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Veja avaliações, localização, descrição dos serviços e escolha o profissional ideal para você.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 transition-all hover:border-violet-500/30 hover:bg-white/10">
                <div className="absolute -top-5 left-8 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-lg font-bold text-white shadow-lg">
                  3
                </div>
                <div className="mt-4">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20">
                    <MessageCircle className="h-7 w-7 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Entre em Contato</h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Ligue ou envie mensagem pelo WhatsApp direto pelo perfil do profissional. Rápido e prático!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/buscar"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-8 py-4 font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5"
              >
                Encontrar Profissional
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Para Profissionais */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#171126] to-[#0b0712] p-8 sm:p-12">
              <div className="mb-12 text-center">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Para <span className="text-fuchsia-400">Profissionais</span>
                </h2>
                <p className="mt-2 text-white/60">Cadastre-se e alcance mais clientes</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="mb-4 rounded-xl bg-violet-500/20 p-3">
                    <UserPlus className="h-6 w-6 text-violet-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">1. Cadastre-se</h3>
                  <p className="mt-2 text-sm text-white/60">Crie sua conta gratuitamente em poucos minutos</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="mb-4 rounded-xl bg-fuchsia-500/20 p-3">
                    <Shield className="h-6 w-6 text-fuchsia-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">2. Seja Verificado</h3>
                  <p className="mt-2 text-sm text-white/60">Receba o selo de verificação e ganhe confiança</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="mb-4 rounded-xl bg-blue-500/20 p-3">
                    <Zap className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">3. Receba Clientes</h3>
                  <p className="mt-2 text-sm text-white/60">Clientes encontram você pela plataforma</p>
                </div>

                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="mb-4 rounded-xl bg-green-500/20 p-3">
                    <Award className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-white">4. Cresça</h3>
                  <p className="mt-2 text-sm text-white/60">Construa sua reputação e aumente seus ganhos</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/prestador/cadastro"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-violet-600 shadow-xl transition-all hover:bg-white/90 hover:shadow-2xl hover:-translate-y-0.5"
                >
                  Cadastrar como Profissional
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-12 pb-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-2xl font-bold text-white">
              Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              <details className="group rounded-2xl border border-white/10 bg-white/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">O cadastro é gratuito?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Sim! O cadastro na plataforma é totalmente gratuito tanto para clientes quanto para profissionais.
                </div>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">Posso avaliar um profissional?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Sim! Após entrar em contato com o profissional, você pode deixar uma avaliação com nota e comentário para ajudar outros usuários na escolha.
                </div>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">A plataforma cobra comissão?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Não! A plataforma não cobra comissão sobre nenhuma negociação. Todo valor combinado entre profissional e cliente pertence exclusivamente a eles.
                </div>
              </details>

              <details className="group rounded-2xl border border-white/10 bg-white/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">Em quais cidades a plataforma atua?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Atualmente atuamos em Imperatriz e região. Estamos expandindo para outras cidades em breve!
                </div>
              </details>

              <details className="group rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">Por que preciso aceitar os termos para usar a plataforma?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Porque nossa plataforma opera legalmente como intermediadora entre clientes e prestadores independentes.
                  A aceitação dos termos garante transparência, segurança jurídica e define claramente direitos,
                  deveres e responsabilidades de cada parte. Sem essa aceitação, não é possível ativar sua conta
                  ou usar as funcionalidades principais.
                </div>
              </details>

              <details className="group rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">O que acontece se eu não aceitar os termos?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Sua conta permanecerá inativa até a aceitação. Você não poderá publicar perfil, anunciar serviços
                  ou interagir com outros usuários enquanto os termos não forem aceitos.
                </div>
              </details>

              <details className="group rounded-2xl border border-violet-500/20 bg-violet-500/5">
                <summary className="flex cursor-pointer items-center justify-between p-6 text-white">
                  <span className="font-medium">Posso reativar minha conta após não aceitar os termos?</span>
                  <span className="text-violet-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-white/60">
                  Sim! Basta acessar seu painel, clicar em "Ler Termos e Ativar Conta" e aceitar os termos
                  quando desejar. Sua conta será reativada imediatamente após a aceitação.
                </div>
              </details>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
