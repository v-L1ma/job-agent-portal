# Job Agent Portal

O **Job Agent Portal** é uma plataforma centralizada para gestão de carreira e busca de emprego automatizada ou assistida. O projeto visa facilitar a interação entre candidatos e diversas plataformas de vagas, permitindo que o usuário gerencie seu currículo, configure preferências de busca, acompanhe aplicações e visualize um dashboard com métricas de desempenho.

## 🚀 Funcionalidades

- **Dashboard de Controle:** Painel central para visualização de estatísticas e status das candidaturas.
- **Gestão de Currículo:** Área dedicada para upload e edição de informações profissionais.
- **Central de Vagas:** Interface para busca, filtragem e visualização de oportunidades.
- **Integração com Plataformas:** Configuração de contas e vinculação com diferentes sites de emprego (LinkedIn, Indeed, etc.).
- **Preferências Personalizadas:** Ajustes de filtros, localidades e cargos de interesse.
- **Acompanhamento de Respostas:** Histórico e status de retorno das empresas.
- **Autenticação Completa:** Fluxos de Login, Cadastro e Recuperação de Senha.
- **Onboarding:** Fluxo inicial para novos usuários configurarem o perfil e o agente.

## 🛠️ Tecnologias & Arquitetura

O projeto utiliza as tecnologias mais modernas do ecossistema React/Next.js:

- **Framework:** Next.js 15+
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes de UI:** Shadcn
- **Gerenciamento de Formulários:** React Hook Form com validação via Zod
- **Cliente HTTP:** Axios
- **Ícones:** Lucide React
- **Temas:** Suporte a modo claro/escuro via `next-themes`

## 📁 Estrutura do Projeto

A organização segue os padrões recomendados para escalabilidade:

- `app/`: Contém todas as páginas, layouts e a lógica de roteamento (App Router).
- `components/`:
  - `ui/`: Componentes básicos e reutilizáveis (botões, inputs, cards).
  - `layout/`: Estruturas globais como [sidebar](components/layout/sidebar.tsx), [header](components/layout/header.tsx) e [footer](components/layout/footer.tsx).
  - `providers/`: Provedores de contexto (Auth, Theme).
- `hooks/`: Hooks customizados para lógica compartilhada (ex: [use-job-search](hooks/use-job-search.ts)).
- `lib/`: Configurações de bibliotecas externas, instâncias de [API](lib/api.ts) e utilitários.
- `types/`: Definições de interfaces e tipos TypeScript.
- `public/`: Ativos estáticos como imagens e ícones.

## 🏁 Como Começar

Primeiro, instale as dependências:

```bash
npm install
```

Depois, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

