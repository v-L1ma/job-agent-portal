import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade — Trampo",
  description:
    "Conheça como o Trampo trata e utiliza suas informações pessoais durante a utilização da extensão de busca de emprego.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-16 pt-28">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--color-trampo-primary-100),_transparent_60%)] opacity-60 pointer-events-none -z-10" />
        <div className="absolute -right-48 top-1/4 h-96 w-96 rounded-full bg-trampo-primary-50/50 blur-[100px] pointer-events-none -z-10" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-extrabold leading-[1.2] tracking-tight text-trampo-dark md:text-5xl">
            Política de{" "}
            <span className="bg-gradient-to-r from-trampo-primary-600 to-trampo-primary-400 bg-clip-text text-transparent">
              Privacidade
            </span>
          </h1>
          <p className="text-sm font-medium text-trampo-muted">
            Última atualização: 25 de agosto de 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white px-6 pb-24 md:pb-32">
        <div className="mx-auto max-w-3xl space-y-12">
          <p className="text-base leading-relaxed text-trampo-muted">
            O Trampo disponibiliza uma extensão de navegador destinada a auxiliar
            usuários na busca e candidatura a oportunidades de emprego. Esta
            Política de Privacidade descreve como as informações são tratadas
            durante a utilização da extensão.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              1. Informações utilizadas
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O Trampo pode utilizar informações fornecidas pelo usuário,
              incluindo:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-trampo-muted marker:text-trampo-primary-500">
              <li>currículo;</li>
              <li>preferências de busca por vagas;</li>
              <li>informações profissionais;</li>
              <li>
                informações necessárias para responder perguntas de processos
                seletivos; e
              </li>
              <li>
                informações necessárias para o preenchimento de candidaturas.
              </li>
            </ul>
            <p className="mt-4 text-base leading-relaxed text-trampo-muted">
              Essas informações são utilizadas para identificar oportunidades
              compatíveis com as preferências do usuário e auxiliar no processo
              de candidatura.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              2. Funcionamento da extensão
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              A extensão auxilia o usuário durante processos de candidatura a
              vagas de emprego.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              De acordo com as preferências definidas pelo usuário, a extensão
              acessa as oportunidades encontradas e auxilia no preenchimento dos
              formulários de candidatura.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              Durante uma candidatura, determinadas vagas podem apresentar
              perguntas que precisam ser respondidas. Nesses casos, a extensão
              envia as informações necessárias para nossa API, que processa a
              solicitação e utiliza a Google Gemini API para auxiliar na geração
              das respostas.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              3. Comunicação com a API do Trampo
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              A extensão se comunica com os servidores do Trampo para realizar
              determinadas funcionalidades, incluindo a geração de respostas
              para perguntas encontradas durante processos de candidatura.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações enviadas à API são utilizadas para executar a
              funcionalidade solicitada pelo usuário.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              A API do Trampo realiza a comunicação com os serviços de
              inteligência artificial necessários para gerar as respostas.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              4. Uso da Google Gemini API
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O Trampo utiliza a <strong className="text-trampo-dark">Google Gemini API</strong>,
              fornecida pelo Google, para auxiliar na geração de respostas às
              perguntas encontradas durante processos de candidatura.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações necessárias para contextualizar uma pergunta podem
              ser processadas pela API do Trampo e enviadas à Google Gemini API.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O Trampo não envia ao Google Gemini as informações sensíveis
              armazenadas no Cofre da extensão.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              A utilização da Google Gemini API ocorre exclusivamente por meio
              da infraestrutura do Trampo. A extensão não se comunica diretamente
              com a API do Gemini.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              5. Cofre
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              A extensão possui uma funcionalidade denominada{" "}
              <strong className="text-trampo-dark">&quot;Cofre&quot;</strong>,
              destinada ao armazenamento local de informações que podem ser
              necessárias durante processos de candidatura.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações armazenadas no Cofre permanecem no armazenamento
              local da extensão e não são enviadas à API do Trampo nem à Google
              Gemini API.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              Quando uma candidatura exige determinadas informações armazenadas
              no Cofre, a extensão pode utilizar essas informações diretamente no
              preenchimento do formulário da respectiva candidatura.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              Dessa forma, informações armazenadas no Cofre podem ser
              transmitidas diretamente ao site ou plataforma em que a
              candidatura está sendo realizada, quando isso for necessário para o
              preenchimento do formulário.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              6. Sites e plataformas de candidatura
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              A extensão pode interagir com sites e plataformas de recrutamento
              para auxiliar o usuário no preenchimento e envio de candidaturas.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações fornecidas pelo usuário podem ser transmitidas
              diretamente a esses sites quando necessário para realizar a
              candidatura.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O tratamento dessas informações pelos respectivos sites ou
              plataformas está sujeito às suas próprias políticas de privacidade
              e termos de uso.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              O Trampo não controla as práticas de privacidade de terceiros.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              7. Compartilhamento de informações
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações podem ser transmitidas aos serviços necessários
              para o funcionamento das funcionalidades do Trampo, incluindo:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-trampo-muted marker:text-trampo-primary-500">
              <li>
                a infraestrutura do Trampo, para processamento das solicitações
                realizadas pela extensão;
              </li>
              <li>
                a Google Gemini API, quando necessária para geração de respostas;
              </li>
              <li>
                sites e plataformas de recrutamento, quando necessário para
                realizar uma candidatura.
              </li>
            </ul>
            <p className="text-base leading-relaxed text-trampo-muted">
              O Trampo não vende informações pessoais dos usuários.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              8. Armazenamento
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações utilizadas pela extensão podem ser armazenadas de
              acordo com a finalidade para a qual foram fornecidas.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              As informações armazenadas no Cofre permanecem localmente no
              navegador e não são enviadas ao Trampo ou ao Google Gemini.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              O usuário é responsável por manter seu dispositivo e navegador
              protegidos contra acesso não autorizado.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              9. Segurança
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O Trampo adota medidas técnicas e organizacionais destinadas a
              proteger as informações tratadas pelo serviço contra acesso,
              alteração, divulgação ou destruição não autorizados.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              Apesar dessas medidas, nenhum sistema de armazenamento ou
              transmissão de informações pode ser considerado completamente
              seguro.
            </p>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              10. Controle do usuário
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O usuário pode interromper a utilização da extensão e remover as
              informações armazenadas localmente por meio das funcionalidades
              disponibilizadas pela extensão ou pelo navegador.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              O usuário também pode solicitar informações sobre o tratamento de
              seus dados por meio do canal de contato disponibilizado pelo
              Trampo.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              11. Serviços de terceiros
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              O Trampo utiliza serviços de terceiros para disponibilizar
              determinadas funcionalidades, incluindo a Google Gemini API.
            </p>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              Esses serviços possuem suas próprias políticas de privacidade e
              termos de uso.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              As plataformas de recrutamento acessadas durante os processos de
              candidatura também possuem suas próprias políticas de privacidade.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              12. Alterações nesta Política
            </h2>
            <p className="mb-4 text-base leading-relaxed text-trampo-muted">
              Esta Política de Privacidade poderá ser atualizada periodicamente
              para refletir alterações nas funcionalidades do Trampo, nos
              serviços utilizados ou na legislação aplicável.
            </p>
            <p className="text-base leading-relaxed text-trampo-muted">
              A versão mais recente estará disponível na página oficial de
              Política de Privacidade do Trampo.
            </p>
          </div>

          {/* Section 13 */}
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-trampo-dark">
              13. Contato
            </h2>
            <p className="text-base leading-relaxed text-trampo-muted">
              Para dúvidas, solicitações ou questões relacionadas ao tratamento
              de dados pessoais, o usuário poderá entrar em contato por meio do
              canal de contato disponibilizado pelo Trampo.
            </p>
          </div>

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
