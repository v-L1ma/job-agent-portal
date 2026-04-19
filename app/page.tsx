import Image from "next/image";
import Link from "next/link";
import { HealthCheckPing } from "@/components/health/health-check-ping";
import { absoluteUrl } from "@/lib/seo";
import { Sparkles, Clock, Brain, FileText, Check, X } from "lucide-react";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BuscaVagas",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/assets/img-4.jpg"),
};

const webSiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BuscaVagas",
  url: absoluteUrl("/"),
  inLanguage: "pt-BR",
};

export default function LandingPage() {
  return (
    <>
      <HealthCheckPing />
      <header className="fixed top-0 z-50 w-full border-b border-indigo-500/20 bg-[#121121]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tighter text-surface-tint">BuscaVagas</div>
          <nav className="hidden gap-8 text-sm font-medium tracking-tight md:flex">
            <a className="text-slate-400 transition-colors hover:text-white" href="#funcionalidades">
              Funcionalidades
            </a>
            <a className="text-slate-400 transition-colors hover:text-white" href="#precos">
              Precos
            </a>
            <a className="text-slate-400 transition-colors hover:text-white" href="#sobre">
              Sobre
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium tracking-tight text-slate-400 transition-colors hover:text-white" href="/auth/login">
              Entrar
            </Link>
            <Link
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium tracking-tight text-white shadow-lg shadow-primary/20 duration-150 active:scale-95"
              href="/auth/register"
            >
              Comecar Agora
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        <section className="relative overflow-hidden px-6 pb-20 pt-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#474fe6 0.5px, transparent 0.5px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -left-24 top-1/2 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />

          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-primary-container px-3 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-primary">
              <Sparkles className="size-3.5" />
              Nova era de recrutamento tech
            </div>
            <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
              Sua Carreira Tecnologica no <span className="text-primary">Piloto Automatico</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-normal text-on-surface-variant md:text-xl">
              Automatize suas candidaturas em massa, personalize curriculos com IA e ganhe tempo para focar no que importa: passar nas entrevistas.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              
            <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-2xl">
              <Image
                alt="Preview do dashboard de candidaturas"
                className="h-auto w-full opacity-80"
                height={900}
                priority
                fetchPriority="high"
                sizes="(min-width: 1280px) 1120px, 100vw"
                src="/assets/preview (1) (2).webp"
                width={1600}
              />
              <div className="absolute left-0 top-0 h-full w-full bg-linear-to-t from-background via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                
              </div>
            </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="bg-surface-container-low px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="group rounded-xl border border-outline-variant bg-surface-container p-8 transition-colors hover:border-primary/50">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Clock className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Economia de Tempo</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Poupe mais de 15 horas semanais. Nossa IA preenche formularios complexos enquanto voce descansa ou estuda.
                </p>
              </div>
              <div className="group rounded-xl border border-outline-variant bg-surface-container p-8 transition-colors hover:border-primary/50">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <Brain className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">Candidaturas Inteligentes</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Algoritmos que priorizam vagas que dao match com seu perfil, aumentando as chances de resposta em 3x.
                </p>
              </div>
              <div className="group rounded-xl border border-outline-variant bg-surface-container p-8 transition-colors hover:border-primary/50">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <FileText className="size-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">IA de Curriculos</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  Adaptacao automatica de palavras-chave para cada descricao de vaga, vencendo os sistemas ATS com facilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="relative overflow-hidden px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">Controle Total em Suas Maos</h2>
              <p className="mx-auto max-w-xl text-on-surface-variant">
                Visualize o progresso de centenas de candidaturas em um unico painel intuitivo e moderno.
              </p>
            </div>
          </div>
        </section>

        {/* <section id="depoimentos" className="px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-16 text-center text-3xl font-bold">O que dizem os talentos</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-high p-8">
                <div className="mb-6 flex gap-1 text-yellow-500">
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                </div>
                <p className="mb-8 grow text-sm italic text-on-surface-variant">
                  Em 2 semanas consegui 5 entrevistas reais. O BuscaVagas limpou o processo de busca e me permitiu focar apenas em estudar para os algoritmos.
                </p>
                <div className="flex items-center gap-4">
                  <img alt="Foto de Ricardo Silva" className="h-10 w-10 rounded-full border-2 border-primary/30" src="/stitch/img-10.jpg" />
                  <div>
                    <div className="text-sm font-bold">Ricardo Silva</div>
                    <div className="text-[10px] uppercase text-on-surface-variant">Senior Dev @ BigTech</div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-high p-8">
                <div className="mb-6 flex gap-1 text-yellow-500">
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                </div>
                <p className="mb-8 grow text-sm italic text-on-surface-variant">
                  A integracao com a Gupy e impecavel. O preenchimento automatico salvou minha sanidade mental.
                </p>
                <div className="flex items-center gap-4">
                  <img alt="Foto de Juliana Mendes" className="h-10 w-10 rounded-full border-2 border-primary/30" src="/stitch/img-11.jpg" />
                  <div>
                    <div className="text-sm font-bold">Juliana Mendes</div>
                    <div className="text-[10px] uppercase text-on-surface-variant">Product Designer</div>
                  </div>
                </div>
              </div>

              <div className="flex h-full flex-col rounded-xl border border-outline-variant bg-surface-container-high p-8">
                <div className="mb-6 flex gap-1 text-yellow-500">
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                  <Star className="size-3.5 fill-current" />
                </div>
                <p className="mb-8 grow text-sm italic text-on-surface-variant">
                  Eu estava cetico, mas os resultados vieram rapido. Recomendo para qualquer um que esteja em busca ativa no mercado tech.
                </p>
                <div className="flex items-center gap-4">
                  <img alt="Foto de Marcos Antunes" className="h-10 w-10 rounded-full border-2 border-primary/30" src="/stitch/img-12.jpg" />
                  <div>
                    <div className="text-sm font-bold">Marcos Antunes</div>
                    <div className="text-[10px] uppercase text-on-surface-variant">SRE Engineer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        <section id="precos" className="bg-surface-container-low px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold">Escolha seu Acelerador</h2>
              <p className="text-on-surface-variant">Planos flexiveis para cada estagio da sua carreira.</p>
            </div>
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
              <div className="rounded-xl border border-outline-variant bg-surface-container p-8">
                <div className="mb-2 text-sm font-bold uppercase text-on-surface-variant">Free</div>
                <div className="mb-6 text-4xl font-black">R$0<span className="text-sm font-medium text-on-surface-variant">/mes</span></div>
                <ul className="mb-8 space-y-4 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> 5 candidaturas/semana</li>
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Integracao LinkedIn Basica</li>
                  <li className="flex items-center gap-2 text-outline"><X className="size-4.5" /> IA de Curriculo</li>
                </ul>
                <button className="w-full rounded-md border border-outline-variant py-3 text-sm font-bold transition-colors hover:bg-white/5">Selecionar</button>
              </div>

              <div className="relative scale-105 rounded-xl border-2 border-primary bg-surface-container-high p-8 shadow-2xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Mais Popular
                </div>
                <div className="mb-2 text-sm font-bold uppercase text-primary">Pro</div>
                <div className="mb-6 text-4xl font-black">R$49<span className="text-sm font-medium text-on-surface-variant">/mes</span></div>
                <ul className="mb-8 space-y-4 text-sm">
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Candidaturas Ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> IA de Adaptacao de Curriculo</li>
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Multi-Plataforma (Gupy, Workday)</li>
                </ul>
                <button className="w-full rounded-md bg-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:brightness-110">
                  Comecar Agora
                </button>
              </div>

              <div className="rounded-xl border border-outline-variant bg-surface-container p-8">
                <div className="mb-2 text-sm font-bold uppercase text-on-surface-variant">Enterprise</div>
                <div className="mb-6 text-4xl font-black">Contate</div>
                <ul className="mb-8 space-y-4 text-sm text-on-surface-variant">
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Mentoria Individual</li>
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Suporte Prioritario 24/7</li>
                  <li className="flex items-center gap-2"><Check className="size-4.5 text-primary" /> Customizacao de IA</li>
                </ul>
                <button className="w-full rounded-md border border-outline-variant py-3 text-sm font-bold transition-colors hover:bg-white/5">
                  Falar com Consultor
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-6 py-24">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Pronto para dar o proximo passo na sua carreira?</h2>
            <p className="mb-10 text-lg text-on-surface-variant">Junte-se a mais de 10.000 profissionais que ja automatizaram seu sucesso.</p>
            <Link
              className="inline-block rounded-md bg-primary px-10 py-5 text-lg font-bold text-white shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
              href="/auth/register"
            >
              Criar minha conta gratis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-indigo-500/20 bg-[#121121]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 py-12 md:flex-row">
          <div className="text-lg font-black text-indigo-500">BuscaVagas</div>
          <div className="flex flex-wrap justify-center gap-6 text-[12px] font-medium uppercase tracking-[0.05em]">
            <a className="text-slate-500 transition-colors hover:text-indigo-400" href="#funcionalidades">Funcionalidades</a>
            <a className="text-slate-500 transition-colors hover:text-indigo-400" href="#precos">Precos</a>
            <a className="text-slate-500 transition-colors hover:text-indigo-400" href="#sobre">Sobre</a>
            <Link className="text-slate-500 transition-colors hover:text-indigo-400" href="/auth/login">Entrar</Link>
            <Link className="text-slate-500 transition-colors hover:text-indigo-400" href="/auth/register">Cadastro</Link>
          </div>
          <div className="text-[12px] font-medium uppercase tracking-[0.05em] text-slate-500">© 2024 BuscaVagas. Todos os direitos reservados.</div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteStructuredData) }}
      />
    </>
  );
}
