import Link from "next/link";

export const metadata = {
  title: "Licença — Trampo",
  description:
    "Termos de licença de uso do software Trampo.",
};

export default function LicencaPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28 ">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--color-trampo-primary-100),_transparent_60%)] opacity-60 pointer-events-none -z-10" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.2] tracking-tight text-trampo-dark md:text-5xl">
           {" "}
            <span className="bg-gradient-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent">
              Licença
            </span>{" "}
            de Uso
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-base leading-relaxed text-trampo-muted">
            Copyright © 2026 Trampo. Todos os direitos reservados.
          </p>

          <p className="text-base leading-relaxed text-trampo-muted">
            Esta extensão e seus componentes, incluindo código-fonte, interface, marca, recursos e funcionalidades, são propriedade de seus respectivos detentores de direitos.
          </p>

          <p className="text-base leading-relaxed text-trampo-muted">
            É concedida ao usuário uma licença limitada, não exclusiva, intransferível e revogável para utilizar a extensão de acordo com sua finalidade disponibilizada pelo Trampo.
          </p>

          <p className="text-base leading-relaxed text-trampo-muted">
            É proibida a cópia, modificação, distribuição, sublicenciamento, venda, engenharia reversa ou exploração comercial da extensão ou de seus componentes sem autorização prévia dos detentores dos direitos, salvo quando permitido pela legislação aplicável.
          </p>

          {/* Back link */}
          <div className="pt-8 border-t border-trampo-border">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-trampo-primary-600 hover:text-trampo-primary-500 transition-colors"
            >
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
