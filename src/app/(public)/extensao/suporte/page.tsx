import { MessageCircle, Mail, BookOpen, Bug, Lightbulb, ChevronDown } from "lucide-react";

export default function ExtensaoSuportePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--color-trampo-primary-100),_transparent_60%)] opacity-60 pointer-events-none -z-10" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute -left-48 top-1/2 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-trampo-primary-200 bg-trampo-primary-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-trampo-primary-600">
            <MessageCircle className="size-3.5" />
            Suporte
          </div>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.2] tracking-tight text-trampo-dark md:text-6xl">
            Como Podemos{" "}
            <span className="relative inline-block bg-gradient-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent pb-1">
              Ajudar?
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-normal text-trampo-muted md:text-xl leading-relaxed">
            Encontre respostas rápidas para suas dúvidas sobre a extensão Trampo ou entre em contato com nossa equipe de suporte.
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <a href="#faq" className="group flex items-center gap-4 rounded-2xl border border-trampo-border bg-white p-6 transition-all duration-300 hover:border-trampo-primary-400 hover:shadow-lg hover:shadow-trampo-primary-500/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <BookOpen className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-trampo-dark">Perguntas Frequentes</h3>
                <p className="text-sm text-trampo-muted">Respostas rápidas para dúvidas comuns</p>
              </div>
            </a>

            <a href="#contato" className="group flex items-center gap-4 rounded-2xl border border-trampo-border bg-white p-6 transition-all duration-300 hover:border-trampo-primary-400 hover:shadow-lg hover:shadow-trampo-primary-500/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <Mail className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-trampo-dark">Fale Conosco</h3>
                <p className="text-sm text-trampo-muted">Envie sua dúvida por e-mail</p>
              </div>
            </a>

            <a href="#bugs" className="group flex items-center gap-4 rounded-2xl border border-trampo-border bg-white p-6 transition-all duration-300 hover:border-trampo-primary-400 hover:shadow-lg hover:shadow-trampo-primary-500/5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-trampo-primary-50 text-trampo-primary-600 transition-transform group-hover:scale-110">
                <Bug className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-trampo-dark">Reportar um Bug</h3>
                <p className="text-sm text-trampo-muted">Encontrou um problema? Nos avise</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-neutral-50/40 px-6 py-24 md:py-32 border-y border-trampo-border/30">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
              Perguntas Frequentes
            </h2>
            <p className="mx-auto max-w-xl text-trampo-muted text-base md:text-lg">
              Respostas para as dúvidas mais comuns sobre a extensão Trampo.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">Como instalo a extensão Trampo?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                Acesse a Chrome Web Store, busque por &quot;Trampo&quot; e clique em &quot;Adicionar ao Chrome&quot;. Após a instalação, faça login com sua conta Trampo e a extensão estará pronta para uso. O ícone aparecerá na barra de ferramentas do navegador.
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">Quais plataformas de emprego são compatíveis?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                A extensão é compatível com Gupy, LinkedIn, Workday, Greenhouse, Indeed e Lever. Estamos trabalhando para adicionar mais plataformas em breve. A compatibilidade é verificada automaticamente ao acessar uma página de vaga.
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">A extensão preenche formulários automaticamente?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                Sim! Ao detectar um formulário de candidatura em uma plataforma compatível, a extensão preenche automaticamente os campos com base no seu perfil e currículo. Você pode revisar e ajustar antes de enviar.
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">Como a IA adapta meu currículo?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                Nossa IA analisa a descrição da vaga e identifica palavras-chave e requisitos essenciais. Em seguida, adapta automaticamente seu currículo para incluir termos relevantes, aumentando a compatibilidade com sistemas ATS (Applicant Tracking Systems).
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">Meus dados estão seguros?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                Absolutamente. Utilizamos criptografia de ponta a ponta para todos os dados. Seu currículo e informações pessoais são armazenados de forma segura e nunca são compartilhados com terceiros sem sua autorização explícita.
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">A extensão funciona em outros navegadores?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                Atualmente, a extensão está disponível apenas para Google Chrome e navegadores baseados em Chromium (Edge, Brave, Opera). Estamos avaliando a possibilidade de suporte a Firefox no futuro.
              </p>
            </details>

            <details className="group rounded-2xl border border-trampo-border bg-white p-6 open:border-trampo-primary-400 open:shadow-lg open:shadow-trampo-primary-500/5 transition-all duration-300">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-bold text-trampo-dark group-open:text-trampo-primary-600">
                <span className="text-base">Como atualizo a extensão?</span>
                <ChevronDown className="size-5 shrink-0 text-trampo-muted transition-transform group-open:rotate-180 group-open:text-trampo-primary-500" />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-trampo-muted">
                O Chrome atualiza as extensões automaticamente. Caso queira verificar manualmente, acesse <a href="chrome://extensions" target="_blank" rel="noopener noreferrer" className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-mono">chrome://extensions</a> e clique em &quot;Atualizar&quot;. Novas funcionalidades são adicionadas regularmente.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Report Bug / Suggestions Section */}
      <section id="bugs" className="bg-white px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-trampo-dark md:text-5xl">
              Reportar um Problema
            </h2>
            <p className="mx-auto max-w-xl text-trampo-muted text-base md:text-lg">
              Encontrou um bug ou tem uma sugestão de melhoria? Nos ajude a melhorar o Trampo.
            </p>
          </div>

          <div className="rounded-2xl border border-trampo-border bg-white p-8 md:p-10 shadow-lg shadow-neutral-100/60">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-trampo-dark">Nome</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-trampo-border bg-neutral-50/40 px-4 py-3 text-sm text-trampo-dark placeholder:text-trampo-muted/50 focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-trampo-dark">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full rounded-xl border border-trampo-border bg-neutral-50/40 px-4 py-3 text-sm text-trampo-dark placeholder:text-trampo-muted/50 focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-trampo-dark">Tipo</label>
                <select className="w-full rounded-xl border border-trampo-border bg-neutral-50/40 px-4 py-3 text-sm text-trampo-dark focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all">
                  <option value="bug">Bug / Erro</option>
                  <option value="feature">Sugestão de Funcionalidade</option>
                  <option value="compatibility">Problema de Compatibilidade</option>
                  <option value="account">Problema com Conta</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-trampo-dark">Descrição</label>
                <textarea
                  rows={5}
                  placeholder="Descreva o problema ou sugestão com detalhes..."
                  className="w-full resize-none rounded-xl border border-trampo-border bg-neutral-50/40 px-4 py-3 text-sm text-trampo-dark placeholder:text-trampo-muted/50 focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-trampo-dark">Versão da Extensão (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 1.2.3"
                  className="w-full rounded-xl border border-trampo-border bg-neutral-50/40 px-4 py-3 text-sm text-trampo-dark placeholder:text-trampo-muted/50 focus:border-trampo-primary-500 focus:outline-none focus:ring-2 focus:ring-trampo-primary-500/10 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-trampo-primary-500 px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-trampo-primary-500/25 hover:bg-trampo-primary-400 active:bg-trampo-primary-600 transition-all duration-150 active:scale-95"
              >
                Enviar Relato
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
