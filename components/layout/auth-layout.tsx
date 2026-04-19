import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  form: ReactNode;
  banner: ReactNode;
}

export function AuthLayout({ form, banner }: AuthLayoutProps) {
  return (
    <main className="max-h-screen h-screen bg-slate-100 dark:bg-background">
      <div className="flex flex-col md:flex-row h-full">
        <section className="w-full md:w-[40%] flex flex-col justify-center items-center px-8 py-12 bg-slate-100 dark:bg-surface z-10">
          {form}
        </section>
        <section className="hidden md:flex w-[60%] relative overflow-hidden bg-slate-100 dark:bg-surface-dim">
          <div className="absolute inset-0 z-0">
            <Image
              alt="Ambiente de trabalho moderno com equipe de tecnologia"
              className="object-cover opacity-60 mix-blend-luminosity"
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              src="/assets/img-4.webp"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-100 via-white/50 to-transparent dark:from-surface dark:via-surface/40 dark:to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-80"></div>
          </div>
          <div className="relative z-10 w-full h-full flex flex-col justify-end p-16 lg:p-24 space-y-8">
            {/* <div className="glass-panel p-6 rounded-2xl max-w-sm self-start transform -rotate-1 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-primary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Taxa de Sucesso
                  </p>
                  <p className="text-xl font-bold text-white">+84% de Respostas</p>
                </div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary w-[84%] h-full rounded-full"></div>
              </div>
            </div> */}
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                Proximo Nivel
              </span>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tighter">
                Automatize sua{" "}
                <span className="bg-linear-to-r from-primary to-secondary-fixed-dim bg-clip-text text-transparent">
                  Carreira Tecnologica
                </span>
                .
              </h2>
              <p className="text-on-surface-variant text-lg lg:text-xl leading-relaxed">
                Deixe que nossos algoritmos encontrem e apliquem para as
                melhores vagas enquanto voce se foca no que realmente importa:
                suas habilidades.
              </p>
            </div>
            {/* <div className="flex items-center gap-8 pt-4">
              <div className="flex -space-x-3">
                <img
                  alt="Retrato de profissional"
                  className="w-10 h-10 rounded-full border-2 border-surface-container object-cover"
                  data-alt="Professional woman portrait"
                  src="/stitch/img-5.jpg"
                />
                <img
                  alt="Retrato de profissional"
                  className="w-10 h-10 rounded-full border-2 border-surface-container object-cover"
                  data-alt="Professional man portrait"
                  src="/stitch/img-6.jpg"
                />
                <img
                  alt="Retrato de profissional"
                  className="w-10 h-10 rounded-full border-2 border-surface-container object-cover"
                  data-alt="Professional woman portrait"
                  src="/stitch/img-7.jpg"
                />
                <div className="w-10 h-10 rounded-full border-2 border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                  +2k
                </div>
              </div>
              <p className="text-sm text-on-surface-variant font-medium">
                Junte-se a milhares de desenvolvedores contratados.
              </p>
            </div> */}
          </div>
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#474fe6 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>
        </section>
      </div>
    </main>
  );
}
