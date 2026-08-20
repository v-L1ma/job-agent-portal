import Image from "next/image";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { Sparkles, Clock, Brain, FileText, Check, X, Star } from "lucide-react";

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Trampo",
  url: absoluteUrl("/"),
  logo: absoluteUrl("/assets/logo-dark.png"),
};

const webSiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Trampo",
  url: absoluteUrl("/"),
  inLanguage: "pt-BR",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-trampo-dark antialiased">
      
      {/* Sticky Header */}
      <header className="fixed top-0 z-50 w-full border-b border-trampo-border/50 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo-dark.png"
                alt="Trampo Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <nav className="hidden gap-8 text-sm font-medium tracking-tight md:flex">
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#funcionalidades">
              Funcionalidades
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#sobre">
              Sobre
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#depoimentos">
              Depoimentos
            </a>
            <a className="text-trampo-muted transition-colors hover:text-trampo-dark" href="#precos">
              Preços
            </a>
          </nav>
          <div className="flex items-center gap-5">
            <Link className="text-sm font-medium tracking-tight text-trampo-muted transition-colors hover:text-trampo-dark" href="/login">
              Entrar
            </Link>
            <Link
              className="rounded-full bg-trampo-primary-500 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-lg shadow-trampo-primary-500/10 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95"
              href="/register"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          {/* Soft background glows from Trampo Design System */}
          <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--color-trampo-primary-100),_transparent_60%)] opacity-60 pointer-events-none -z-10" />
          <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />
          <div className="absolute -left-48 top-1/2 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />

          <div className="relative z-10 mx-auto max-w-7xl text-center">
            <h1 className="mx-auto mb-6 mt-8 max-w-4xl text-5xl font-extrabold leading-[1.2] tracking-tight text-trampo-dark md:text-7xl">
              Sua Carreira Tecnológica no{" "}
              <span className="relative inline-block bg-gradient-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent pb-3 pr-2">
                Piloto Automático
                {/* <span className="absolute -top-3.5 -right-4 md:-top-5 md:-right-6 inline-flex -rotate-6 items-center gap-1.5 rounded-full border border-trampo-primary-200 bg-trampo-primary-50 px-3 py-1 text-[9px] md:text-[10px] font-extrabold uppercase tracking-wider text-trampo-primary-600 shadow-md whitespace-nowrap">
                  <Sparkles className="size-3 fill-trampo-primary-200/50 text-trampo-primary-500" />
                  RECRUTAMENTO TECH
                </span> */}
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg font-normal text-trampo-muted md:text-xl leading-relaxed">
              Automatize suas candidaturas em massa, personalize currículos com IA e ganhe tempo para focar no que importa: passar nas entrevistas.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-16">
              <Link
                className="rounded-full bg-trampo-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-trampo-primary-500/25 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95"
                href="/register"
              >
                Começar Grátis
              </Link>
              <a
                className="rounded-full border border-trampo-border bg-white px-8 py-3.5 text-base font-bold text-trampo-muted hover:text-trampo-dark hover:border-trampo-dark transition-all duration-150 active:scale-95"
                href="#funcionalidades"
              >
                Ver Funcionalidades
              </a>
            </div>
            
            {/* Floating High-fidelity Mockup with diffuse shadow */}
            <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-100 bg-white p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] md:p-4 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.10)] transition-shadow duration-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-trampo-primary-100/30 rounded-full blur-[80px] pointer-events-none -z-10" />
              <Image
                alt="Preview do dashboard de candidaturas"
                className="rounded-xl h-auto w-full border border-neutral-100"
                height={633}
                priority
                fetchPriority="high"
                sizes="(min-width: 1280px) 1120px, (min-width: 768px) 80vw, 95vw"
                src="/assets/preview.png"
                width={1278}
              />
            </div>
          </div>
        </section>

        {/* Social Proof (Logo Farm) */}
        <section className="border-y border-trampo-border/30 bg-neutral-50/40 py-10">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-trampo-muted/60 mb-6">
              Integrado com as maiores plataformas do mercado
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6 opacity-40 font-extrabold text-sm tracking-widest text-trampo-muted uppercase">
              <span>Gupy</span>
              <span>LinkedIn</span>
              <span>Workday</span>
              <span>Greenhouse</span>
              <span>Indeed</span>
              <span>Lever</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="funcionalidades" className="bg-neutral-50/20 px-6 py-24 md:py-32 border-b border-trampo-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
                Tudo o que Você Precisa para Acelerar
              </h2>
              <p className="mx-auto max-w-2xl text-trampo-muted text-base md:text-lg">
                Combinamos inteligência artificial avançada com automação fluida para eliminar a fricção da busca de emprego.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="group flex flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 transition-colors duration-300 hover:border-trampo-primary-400">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                    <Clock className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-trampo-dark">Economia de Tempo</h3>
                  <p className="text-sm leading-relaxed text-trampo-muted">
                    Poupe mais de 15 horas semanais. Nossa IA preenche formulários complexos automaticamente enquanto você foca no que realmente importa.
                  </p>
                </div>
                
                {/* Micro UI representation */}
                <div className="mt-8 rounded-xl border border-trampo-border bg-neutral-50/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-trampo-dark">Tempo Economizado</span>
                    <span className="text-[10px] font-bold text-trampo-primary-600 bg-trampo-primary-50 px-2 py-0.5 rounded-full">+15h/semana</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-trampo-primary-500 h-full rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-[9px] text-trampo-muted">
                    <span>Sem Trampo: 18h</span>
                    <span className="font-semibold text-trampo-dark">Com Trampo: 3h</span>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group flex flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 transition-colors duration-300 hover:border-trampo-primary-400">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                    <Brain className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-trampo-dark">Candidaturas Inteligentes</h3>
                  <p className="text-sm leading-relaxed text-trampo-muted">
                    Algoritmos inteligentes que priorizam vagas que dão match com seu perfil, aumentando a taxa de conversão em entrevistas em até 3x.
                  </p>
                </div>

                {/* Micro UI representation */}
                <div className="mt-8 rounded-xl border border-trampo-border bg-neutral-50/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-white border border-trampo-border flex items-center justify-center font-bold text-[10px]">G</div>
                      <div>
                        <div className="text-[10px] font-bold text-trampo-dark leading-none">Frontend Engineer</div>
                        <span className="text-[8px] text-trampo-muted">Google • Remoto</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-trampo-primary-600 bg-trampo-primary-50 px-2 py-0.5 rounded-full">98% Match</span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="text-[8px] bg-white border border-trampo-border text-trampo-muted px-2 py-0.5 rounded">React</span>
                    <span className="text-[8px] bg-white border border-trampo-border text-trampo-muted px-2 py-0.5 rounded">TypeScript</span>
                    <span className="text-[8px] bg-white border border-trampo-border text-trampo-muted px-2 py-0.5 rounded">Next.js</span>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group flex flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 transition-colors duration-300 hover:border-trampo-primary-400">
                <div>
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                    <FileText className="size-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-trampo-dark">IA de Currículos</h3>
                  <p className="text-sm leading-relaxed text-trampo-muted">
                    Adaptação automática e precisa de palavras-chave para cada descrição de vaga, superando os sistemas de triagem ATS com facilidade.
                  </p>
                </div>

                {/* Micro UI representation */}
                <div className="mt-8 rounded-xl border border-trampo-border bg-neutral-50/40 p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-trampo-dark">
                    <span>Otimização ATS</span>
                    <span className="text-emerald-600">Aderência Perfeita</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-trampo-muted">
                      <span className="flex items-center gap-1"><Check className="size-3 text-emerald-500" /> Palavras-chave inseridas</span>
                      <span className="font-semibold text-trampo-dark">12/12</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-trampo-muted">
                      <span className="flex items-center gap-1"><Check className="size-3 text-emerald-500" /> Formatação legível</span>
                      <span className="font-semibold text-trampo-dark">100%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-trampo-primary-600 bg-trampo-primary-50/80 p-1.5 rounded">
                    <span>Score Geral ATS</span>
                    <span>96/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Mockup Section (About) */}
        <section id="sobre" className="relative overflow-hidden px-6 py-24 md:py-32 bg-white">
          <div className="absolute -right-48 top-1/2 h-96 w-96 rounded-full bg-trampo-primary-50/40 blur-[100px] pointer-events-none -z-10" />
          
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
                Controle Total em Suas Mãos
              </h2>
              <p className="mx-auto max-w-xl text-trampo-muted text-base md:text-lg">
                Visualize o progresso de centenas de candidaturas em um único painel intuitivo, moderno e totalmente centralizado.
              </p>
            </div>

            {/* Kanban Pipeline Mockup from Design System */}
            <div className="mx-auto max-w-4xl rounded-2xl border border-trampo-border bg-white p-5 md:p-6 shadow-2xl shadow-neutral-100/60">
              {/* Window Bar */}
              <div className="flex items-center justify-between border-b border-trampo-border/60 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-[11px] font-semibold text-trampo-muted ml-2">Painel de Candidaturas • Trampo</span>
                </div>
                <div className="flex gap-2">
                  <span className="h-5 w-16 bg-neutral-100 rounded-md"></span>
                  <span className="h-5 w-8 bg-trampo-primary-50 rounded-md"></span>
                </div>
              </div>
              
              {/* Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-trampo-dark uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Enviadas
                    </span>
                    <span className="text-[9px] font-bold text-trampo-muted bg-neutral-100 px-2 py-0.5 rounded-full">14</span>
                  </div>
                  
                  <div className="bg-neutral-50/50 border border-trampo-border/50 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-trampo-dark">Dev React Sênior</div>
                      <span className="text-[9px] text-trampo-muted">Nubank • Remoto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-trampo-primary-600 bg-trampo-primary-200/50 px-2 py-0.5 rounded font-bold">Match 95%</span>
                      <span className="text-[9px] text-trampo-muted">Há 2 dias</span>
                    </div>
                  </div>

                  <div className="bg-neutral-50/50 border border-trampo-border/50 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-trampo-dark">Engenheiro de Software</div>
                      <span className="text-[9px] text-trampo-muted">Mercado Livre • Híbrido</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-trampo-primary-600 bg-trampo-primary-200/50 px-2 py-0.5 rounded font-bold">Match 92%</span>
                      <span className="text-[9px] text-trampo-muted">Há 4 dias</span>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-trampo-dark uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Em Revisão
                    </span>
                    <span className="text-[9px] font-bold text-trampo-muted bg-neutral-100 px-2 py-0.5 rounded-full">5</span>
                  </div>

                  <div className="bg-neutral-50/50 border border-trampo-border/50 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-trampo-dark">Frontend Engineer</div>
                      <span className="text-[9px] text-trampo-muted">Stripe • Remoto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">Pendente</span>
                      <span className="text-[9px] text-trampo-muted">Há 1 dia</span>
                    </div>
                  </div>

                  <div className="bg-neutral-50/50 border border-trampo-border/50 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-trampo-dark">React Developer</div>
                      <span className="text-[9px] text-trampo-muted">QuintoAndar • Remoto</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-trampo-primary-600 bg-trampo-primary-200/50 px-2 py-0.5 rounded font-bold">Match 97%</span>
                      <span className="text-[9px] text-trampo-muted">Há 3 dias</span>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-trampo-dark uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-trampo-primary-500"></span> Entrevistas
                    </span>
                    <span className="text-[9px] font-bold text-trampo-muted bg-neutral-100 px-2 py-0.5 rounded-full">3</span>
                  </div>

                  <div className="bg-white border-2 border-trampo-primary-500 rounded-xl p-4 space-y-3 shadow-md shadow-trampo-primary-500/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-bold text-trampo-dark">SRE Engineer</div>
                        <span className="text-[9px] text-trampo-muted">Hotmart • Remoto</span>
                      </div>
                      <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Urgente</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-trampo-primary-700 bg-trampo-primary-200 px-2 py-0.5 rounded font-bold">Entrevista Agendada</span>
                      <span className="text-[9px] text-trampo-muted">Amanhã 14h</span>
                    </div>
                  </div>

                  <div className="bg-neutral-50/50 border border-trampo-border/50 rounded-xl p-4 space-y-3">
                    <div>
                      <div className="text-xs font-bold text-trampo-dark">Product Designer</div>
                      <span className="text-[9px] text-trampo-muted">iFood • São Paulo</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-trampo-primary-600 bg-trampo-primary-200/50 px-2 py-0.5 rounded font-bold">Match 90%</span>
                      <span className="text-[9px] text-trampo-muted">Próxima Sem.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="depoimentos" className="bg-neutral-50/40 px-6 py-24 md:py-32 border-y border-trampo-border/30">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-16 text-center text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
              O que dizem os talentos
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Testimonial 1 */}
              <div className="flex h-full flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-all duration-300">
                <div>
                  <div className="mb-6 flex gap-1 text-amber-500">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="mb-8 text-sm italic leading-relaxed text-trampo-muted">
                    "Em 2 semanas consegui 5 entrevistas reais. O Trampo limpou o processo de busca e me permitiu focar apenas em estudar para os algoritmos."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-trampo-primary-50 text-trampo-primary-600 font-extrabold text-xs flex items-center justify-center border border-trampo-primary-200">
                    RS
                  </div>
                  <div>
                    <div className="text-sm font-bold text-trampo-dark">Ricardo Silva</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-trampo-muted/80">Dev Sênior @ BigTech</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex h-full flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-all duration-300">
                <div>
                  <div className="mb-6 flex gap-1 text-amber-500">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="mb-8 text-sm italic leading-relaxed text-trampo-muted">
                    "A integração com a Gupy e LinkedIn é impecável. O preenchimento automático salvou minha sanidade mental na hora de enviar centenas de currículos."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-trampo-primary-50 text-trampo-primary-600 font-extrabold text-xs flex items-center justify-center border border-trampo-primary-200">
                    JM
                  </div>
                  <div>
                    <div className="text-sm font-bold text-trampo-dark">Juliana Mendes</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-trampo-muted/80">Product Designer</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex h-full flex-col justify-between rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-all duration-300">
                <div>
                  <div className="mb-6 flex gap-1 text-amber-500">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="mb-8 text-sm italic leading-relaxed text-trampo-muted">
                    "Eu estava cético, mas os resultados vieram rápido. Recomendo para qualquer um que esteja em busca ativa no mercado de desenvolvimento hoje."
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-trampo-primary-50 text-trampo-primary-600 font-extrabold text-xs flex items-center justify-center border border-trampo-primary-200">
                    MA
                  </div>
                  <div>
                    <div className="text-sm font-bold text-trampo-dark">Marcos Antunes</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-trampo-muted/80">SRE Engineer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precos" className="bg-white px-6 py-24 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
                Escolha seu Acelerador
              </h2>
              <p className="text-trampo-muted text-base md:text-lg">
                Planos flexíveis para cada estágio da sua busca e carreira.
              </p>
            </div>
            
            <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
              {/* Free Plan */}
              <div className="rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-colors flex flex-col justify-between h-full">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-trampo-muted">Free</div>
                  <div className="mb-6 text-4xl font-extrabold text-trampo-dark">R$0<span className="text-sm font-medium text-trampo-muted">/mês</span></div>
                  <ul className="mb-8 space-y-4 text-sm text-trampo-muted">
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> 5 candidaturas/semana</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Integração LinkedIn Básica</li>
                    <li className="flex items-center gap-2.5 text-neutral-300"><X className="size-4.5 text-neutral-400" /> IA de Adaptar Currículo</li>
                  </ul>
                </div>
                <Link href="/register" className="w-full rounded-full border border-trampo-border py-3 text-center text-sm font-bold text-trampo-muted hover:text-trampo-dark hover:border-trampo-dark transition-colors block">
                  Selecionar
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border-2 border-trampo-primary-500 bg-white p-8 flex flex-col justify-between h-full shadow-xl shadow-trampo-primary-500/5">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-trampo-primary-500 px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Mais Popular
                </div>
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-trampo-primary-600">Pro</div>
                  <div className="mb-6 text-4xl font-extrabold text-trampo-dark">R$49<span className="text-sm font-medium text-trampo-muted">/mês</span></div>
                  <ul className="mb-8 space-y-4 text-sm text-trampo-dark">
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Candidaturas Ilimitadas</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> IA de Adaptação de Currículo</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Multi-Plataforma (Gupy, Workday)</li>
                  </ul>
                </div>
                <Link href="/register" className="w-full rounded-full bg-trampo-primary-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20 hover:bg-trampo-primary-400 transition-colors block">
                  Começar Agora
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="rounded-2xl border border-trampo-border bg-white p-8 hover:border-trampo-primary-400 transition-colors flex flex-col justify-between h-full">
                <div>
                  <div className="mb-2 text-xs font-bold uppercase tracking-widest text-trampo-muted">Enterprise</div>
                  <div className="mb-6 text-4xl font-extrabold text-trampo-dark">Contate-nos</div>
                  <ul className="mb-8 space-y-4 text-sm text-trampo-muted">
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Mentoria Individual</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Suporte Prioritário 24/7</li>
                    <li className="flex items-center gap-2.5"><Check className="size-4.5 text-trampo-primary-500" /> Customização de IA</li>
                  </ul>
                </div>
                <button className="w-full rounded-full border border-trampo-border py-3 text-sm font-bold text-trampo-muted hover:text-trampo-dark hover:border-trampo-dark transition-colors">
                  Falar com Consultor
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="relative overflow-hidden px-6 py-24 bg-trampo-dark/90 text-white rounded-3xl mx-auto max-w-7xl my-16 shadow-2xl">
          {/* Subtle glowing elements */}
          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-trampo-primary-500/20 blur-[80px]" />
          <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-trampo-primary-500/10 blur-[80px]" />
          
          {/* Tech Background Image */}
          <div className="absolute inset-0 opacity-[0.8] pointer-events-none mix-blend-overlay">
            <Image
              src="/assets/tech.jpg"
              alt="Tech Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Subtle tech grid background pattern */}
          <div className="absolute inset-0 opacity-1 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="tech-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                  <rect width="4" height="4" fill="currentColor" opacity="0.3" x="18" y="18" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#tech-grid)" className="text-white" />
            </svg>
          </div>
          
          {/* Subtle tech circuit paths */}
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none">
            <svg className="absolute right-0 top-0 h-full w-1/2 text-trampo-primary-500" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 0 L200 100 H300 L350 150 V250 L300 300 H200 L100 400" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="200" cy="100" r="3" fill="currentColor" />
              <circle cx="300" cy="150" r="3" fill="currentColor" />
              <circle cx="300" cy="300" r="3" fill="currentColor" />
            </svg>
            <svg className="absolute left-0 bottom-0 h-full w-1/2 text-trampo-primary-500" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M300 400 L200 300 H100 L50 250 V150 L100 100 H200 L300 0" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="200" cy="300" r="3" fill="currentColor" />
              <circle cx="100" cy="250" r="3" fill="currentColor" />
              <circle cx="100" cy="100" r="3" fill="currentColor" />
            </svg>
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-extrabold tracking-tight md:text-5xl leading-tight">
              Pronto para dar o próximo passo na sua carreira?
            </h2>
            <p className="mb-10 text-base md:text-lg text-neutral-400 max-w-xl mx-auto">
              Junte-se a mais de 10.000 profissionais que já automatizaram sua busca de emprego com sucesso.
            </p>
            <Link
              className="inline-block rounded-full bg-trampo-primary-500 px-10 py-5 text-base font-bold text-white shadow-2xl shadow-trampo-primary-500/30 hover:bg-trampo-primary-400 transition-transform hover:scale-105 active:scale-95 duration-150"
              href="/register"
            >
              Criar minha conta grátis
            </Link>
          </div>
        </section>
      </main>

      {/* Dark Footer */}
      <footer className="bg-trampo-dark text-white border-t border-neutral-900 py-16 px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo-light.png"
                alt="Trampo Logo"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.1em]">
            <a className="text-neutral-400 transition-colors hover:text-white" href="#funcionalidades">Funcionalidades</a>
            <a className="text-neutral-400 transition-colors hover:text-white" href="#sobre">Sobre</a>
            <a className="text-neutral-400 transition-colors hover:text-white" href="#depoimentos">Depoimentos</a>
            <a className="text-neutral-400 transition-colors hover:text-white" href="#precos">Preços</a>
            <Link className="text-neutral-400 transition-colors hover:text-white" href="/login">Entrar</Link>
            <Link className="text-neutral-400 transition-colors hover:text-white" href="/register">Cadastro</Link>
          </div>
          <div className="text-[11px] font-medium tracking-wider text-neutral-500">
            © 2024 Trampo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Structured Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteStructuredData) }}
      />
    </div>
  );
}
