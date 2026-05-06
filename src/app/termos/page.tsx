


import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ScrollText, Shield, CheckCircle2, AlertTriangle } from 'lucide-react'

export const metadata = { title: 'Termos de Uso — Serviços Imperatriz' }

export default function TermosPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#06001a' }}>
      <Header />

      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-3xl">

          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-[0_0_40px_rgba(139,92,246,0.35)]">
              <ScrollText className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl">Termos de Uso e Responsabilidade</h1>
            <p className="mt-3 text-sm text-white/45">Versão 1.0 · Última atualização: 01 de maio de 2026</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
              <Shield className="h-3.5 w-3.5" />
              Documento com validade legal
            </div>
          </div>

          <div className="space-y-6">

            {/* Cláusula Geral */}
            <Section title="1. Natureza da Plataforma" accent="violet">
              <p>
                A plataforma <strong className="text-white/90">Serviços Imperatriz</strong> atua exclusivamente como
                ponte digital entre clientes e prestadores de serviços independentes, não sendo responsável por
                serviços executados, negociações, valores, promessas, condutas, danos materiais, morais,
                financeiros ou resultados decorrentes das relações entre usuários.
              </p>
              <p className="mt-3">
                Não há vínculo empregatício, societário ou de representação entre a plataforma e os prestadores
                cadastrados. Cada prestador opera de forma autônoma e independente.
              </p>
            </Section>

            {/* Prestadores */}
            <Section title="2. Termos para Prestadores de Serviço" accent="violet">
              <ul className="space-y-3">
                {[
                  'Você é inteiramente responsável pela qualidade, segurança e execução dos serviços prestados aos clientes.',
                  'Todas as informações fornecidas no perfil devem ser verdadeiras, precisas e atualizadas.',
                  'Você deve possuir as licenças, registros, habilitações e seguros legais exigidos para sua área de atuação.',
                  'Atendimento, qualidade e segurança dos serviços são de sua exclusiva responsabilidade. A plataforma atua apenas como intermediadora digital.',
                  'Você responde integralmente por danos, fraudes, promessas falsas, cobranças indevidas ou prejuízos causados a clientes.',
                  'Denúncias fundamentadas, evidências de fraude ou violações a estes termos podem resultar em suspensão imediata ou exclusão definitiva do perfil.',
                  'A plataforma reserva-se o direito de remover perfis que violem estes termos sem aviso prévio e sem direito a indenização.',
                  'É proibido usar a plataforma para práticas ilegais, enganosas ou que violem direitos de terceiros.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400/70" />
                    <span className="text-white/65 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Clientes */}
            <Section title="3. Termos para Clientes" accent="fuchsia">
              <ul className="space-y-3">
                {[
                  'A contratação de serviços é realizada por sua conta e risco.',
                  'Cabe exclusivamente a você avaliar a reputação, avaliações e qualificações do prestador antes de contratar.',
                  'Negociações realizadas fora da plataforma são de responsabilidade exclusiva das partes envolvidas.',
                  'A plataforma não garante a execução, qualidade, prazo ou resultado dos serviços contratados.',
                  'Você deve agir de forma legal, ética e com respeito em relação aos prestadores.',
                  'Fraudes, calúnias, assédio ou qualquer forma de abuso podem resultar em suspensão ou banimento da conta.',
                  'Avaliações publicadas devem ser verídicas e baseadas em experiências reais.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fuchsia-400/70" />
                    <span className="text-white/65 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Isenção */}
            <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-amber-400">Cláusula de Isenção de Responsabilidade</h3>
              </div>
              <p className="leading-relaxed text-white/65">
                Ao aceitar estes termos, o usuário reconhece que utiliza a plataforma por livre escolha,
                compreendendo que a responsabilidade por qualquer contratação, prestação, pagamento ou
                disputa pertence <strong className="text-white/85">exclusivamente às partes envolvidas</strong>,
                salvo obrigações legais inegociáveis previstas na legislação brasileira.
              </p>
              <p className="mt-3 leading-relaxed text-white/65">
                A plataforma não se responsabiliza por perdas financeiras, danos morais ou materiais resultantes
                do uso inadequado da plataforma ou de relações estabelecidas entre usuários.
              </p>
            </div>

            {/* Conformidade */}
            <Section title="4. Conformidade e Verificação" accent="emerald">
              <p className="text-white/65 leading-relaxed">
                O Selo "Verificado" indica que o usuário aceitou formalmente estes Termos de Uso e Responsabilidade.
                Não representa verificação de documentos, qualidade dos serviços ou qualquer outra garantia sobre
                o prestador além da conformidade legal com a plataforma.
              </p>
              <p className="mt-3 text-white/65 leading-relaxed">
                Contas que não aceitarem os termos permanecerão inativas e sem acesso às funcionalidades principais
                da plataforma até a efetivação da aceitação.
              </p>
            </Section>

            {/* Suspensão */}
            <Section title="5. Suspensão e Exclusão" accent="red">
              <p className="text-white/65 leading-relaxed">
                A plataforma pode suspender ou excluir contas a qualquer momento por violação destes termos,
                comportamento abusivo, fraude, conteúdo ilegal ou qualquer atividade que prejudique outros
                usuários ou a integridade da plataforma.
              </p>
            </Section>

            {/* Alterações */}
            <Section title="6. Alterações nos Termos" accent="violet">
              <p className="text-white/65 leading-relaxed">
                Estes termos podem ser atualizados periodicamente. Em caso de alterações significativas,
                os usuários serão notificados e deverão aceitar a nova versão para continuar utilizando a plataforma.
                O uso continuado após notificação implica aceitação tácita das mudanças.
              </p>
            </Section>

            {/* Footer da página */}
            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-6 text-center">
              <p className="text-sm text-white/45">
                Dúvidas sobre estes termos?{' '}
                <a href="mailto:suporte@servicosimperatriz.com.br" className="text-violet-400 hover:underline">
                  Entre em contato
                </a>
              </p>
              <p className="mt-2 text-xs text-white/25">
                Serviços Imperatriz · Todos os direitos reservados · Versão 1.0
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Section({
  title, accent, children,
}: {
  title: string
  accent: 'violet' | 'fuchsia' | 'emerald' | 'red'
  children: React.ReactNode
}) {
  const colors = {
    violet:  'from-violet-400 to-violet-600',
    fuchsia: 'from-fuchsia-400 to-fuchsia-600',
    emerald: 'from-emerald-400 to-emerald-600',
    red:     'from-red-400 to-red-600',
  }
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/8 p-6"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mb-4 flex items-center gap-3">
        <div className={`h-5 w-1 rounded-full bg-gradient-to-b ${colors[accent]}`} />
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}
