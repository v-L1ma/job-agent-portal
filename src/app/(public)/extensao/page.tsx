import Image from "next/image";
import Link from "next/link";
import { Download, Settings, Zap, CheckCircle2 } from "lucide-react";
import { BrowserDetectHero, BrowserDetectAll, BrowserDetectCTA } from "../../../components/extensao/browser-detect";

export default function ExtensaoTutorialPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--color-trampo-primary-100),_transparent_60%)] opacity-60 pointer-events-none -z-10" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute -left-48 top-1/2 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold leading-[1.2] tracking-tight text-trampo-dark md:text-7xl">
            Automatize suas{" "}
            <span className="relative inline-block bg-gradient-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent pb-1">
              Candidaturas
            </span>{" "}
            direto do seu navegador
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-normal text-trampo-muted md:text-xl leading-relaxed">
            Instale a extensão Trampo e deixe a IA preencher formulários, adaptar currículos e enviar candidaturas automaticamente enquanto você foca no que importa.
          </p>

          <BrowserDetectHero />

          <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-100 bg-white p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.06)] md:p-4 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.10)] transition-shadow duration-300">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-trampo-primary-100/30 rounded-full blur-[80px] pointer-events-none -z-10" />
            <Image
              alt="Extensão Trampo em funcionamento"
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

      {/* How it Works Section */}
      <section id="como-funciona" className="bg-neutral-50/40 px-6 py-24 md:py-32 border-y border-trampo-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
              Como Funciona
            </h2>
            <p className="mx-auto max-w-2xl text-trampo-muted text-base md:text-lg">
              Três passos simples para começar a automatizar suas candidaturas.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="group relative rounded-2xl border border-trampo-border bg-white p-8 transition-all duration-300 hover:border-trampo-primary-400">
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                1
              </div>
              <div className="mb-6 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <Download className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-trampo-dark">Instale a Extensão</h3>
              <p className="text-sm leading-relaxed text-trampo-muted">
                Acesse a loja de extensões do seu navegador e instale o Trampo em poucos cliques. Compatível com Chrome, Edge, Firefox e Opera.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-trampo-border bg-white p-8 transition-all duration-300 hover:border-trampo-primary-400">
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                2
              </div>
              <div className="mb-6 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <Settings className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-trampo-dark">Configure seu Perfil</h3>
              <p className="text-sm leading-relaxed text-trampo-muted">
                Faça login com sua conta Trampo e configure seu currículo, preferências de vaga e dados pessoais para preenchimento automático.
              </p>
            </div>

            <div className="group relative rounded-2xl border border-trampo-border bg-white p-8 transition-all duration-300 hover:border-trampo-primary-400">
              <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                3
              </div>
              <div className="mb-6 mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <Zap className="size-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-trampo-dark">Candidate-se Automaticamente</h3>
              <p className="text-sm leading-relaxed text-trampo-muted">
                Ao acessar uma vaga em plataforma compatível, a extensão detecta e preenche automaticamente. Revise e envie com um clique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Tutorial */}
      <section id="tutorial" className="bg-white px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
              Tutorial Passo a Passo
            </h2>
            <p className="mx-auto max-w-xl text-trampo-muted text-base md:text-lg">
              Siga estes passos para instalar e começar a usar a extensão Trampo.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                1
              </div>
              <div className="flex-1 rounded-2xl border border-trampo-border bg-white p-6 transition-colors hover:border-trampo-primary-400">
                <h3 className="mb-2 text-lg font-bold text-trampo-dark">Acesse a Loja de Extensões</h3>
                <p className="mb-4 text-sm leading-relaxed text-trampo-muted">
                  Abra o navegador de sua preferência e acesse a loja oficial de extensões. Use um dos botões acima ou busque por &quot;Trampo&quot; na loja.
                </p>
                <div className="flex flex-wrap gap-3">
                  <BrowserDetectAll />
                </div>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                2
              </div>
              <div className="flex-1 rounded-2xl border border-trampo-border bg-white p-6 transition-colors hover:border-trampo-primary-400">
                <h3 className="mb-2 text-lg font-bold text-trampo-dark">Adicione ao Navegador</h3>
                <p className="text-sm leading-relaxed text-trampo-muted">
                  Clique no botão &quot;Adicionar ao Chrome&quot; (ou equivalente) e confirme a instalação. O ícone do Trampo aparecerá na barra de ferramentas do navegador.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                3
              </div>
              <div className="flex-1 rounded-2xl border border-trampo-border bg-white p-6 transition-colors hover:border-trampo-primary-400">
                <h3 className="mb-2 text-lg font-bold text-trampo-dark">Faça Login</h3>
                <p className="text-sm leading-relaxed text-trampo-muted">
                  Clique no ícone da extensão na barra de ferramentas e faça login com sua conta Trampo. Se ainda não tem uma conta, crie gratuitamente em poucos segundos.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                4
              </div>
              <div className="flex-1 rounded-2xl border border-trampo-border bg-white p-6 transition-colors hover:border-trampo-primary-400">
                <h3 className="mb-2 text-lg font-bold text-trampo-dark">Configure seu Currículo</h3>
                <p className="text-sm leading-relaxed text-trampo-muted">
                  Acesse as configurações da extensão e envie seu currículo. A IA analisará seu perfil para preencher formulários automaticamente com as informações corretas.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-trampo-primary-500 text-sm font-bold text-white shadow-lg shadow-trampo-primary-500/20">
                5
              </div>
              <div className="flex-1 rounded-2xl border border-trampo-border bg-white p-6 transition-colors hover:border-trampo-primary-400">
                <h3 className="mb-2 text-lg font-bold text-trampo-dark">Navegue e Candidate-se</h3>
                <p className="text-sm leading-relaxed text-trampo-muted">
                  Acesse vagas no LinkedIn, Gupy, Workday ou outras plataformas compatíveis. A extensão detectará automaticamente o formulário e preencherá tudo para você. Basta revisar e enviar!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden px-6 py-24 bg-trampo-dark/90 text-white rounded-3xl mx-auto max-w-7xl my-16 shadow-2xl">
        <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-trampo-primary-500/20 blur-[80px]" />
        <div className="absolute -left-24 -top-24 w-80 h-80 rounded-full bg-trampo-primary-500/10 blur-[80px]" />

        <div className="absolute inset-0 opacity-[0.8] pointer-events-none mix-blend-overlay">
          <Image
            src="/assets/tech.jpg"
            alt="Tech Background"
            fill
            className="object-cover"
            priority
          />
        </div>

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
            Pronto para automatizar suas candidaturas?
          </h2>
          <p className="mb-10 text-base md:text-lg text-neutral-400 max-w-xl mx-auto">
            Instale a extensão Trampo agora e comece a economizar horas por semana na sua busca por emprego.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <BrowserDetectCTA />
            <Link
              className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-8 py-5 text-base font-bold text-neutral-300 hover:text-white hover:border-neutral-400 transition-all duration-150"
              href="/extensao/suporte"
            >
              Precisa de ajuda?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
