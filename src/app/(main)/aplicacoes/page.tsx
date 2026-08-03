"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Aplicacao {
  id: string;
  titulo: string;
  empresa: string;
  plataforma: string;
  perguntas: number;
  data: string;
  status: "Sucesso" | "Pendente" | "Falha";
  detalhes: string;
  respostas?: {
    pergunta: string;
    resposta: string;
  }[];
}

const aplicacoes: Aplicacao[] = [
  {
    id: "1",
    titulo: "Assistente de Recursos Humanos",
    empresa: "Confidencial",
    plataforma: "vagascombr",
    perguntas: 3,
    data: "02/08/2026",
    status: "Sucesso",
    detalhes:
      "Candidatura enviada com sucesso. A vaga exigia 3 perguntas de triagem, todas preenchidas com base na experiência do candidato. Aguardando retorno do recrutador.",
    respostas: [{
        pergunta: "Qual é a sua experiência com desenvolvimento de software em larga escala?",
        resposta: "Sim, tenho experiência com desenvolvimento de software em larga escala.",
    },{
        pergunta: "Você já trabalhou com metodologias ágeis? Se sim, quais?",
        resposta: "Sim, já trabalhei com metodologias ágeis, incluindo Scrum e Kanban.",
    },{
        pergunta: "Como você lida com prazos apertados e pressão no trabalho?",
        resposta: "Eu priorizo tarefas, mantenho uma comunicação clara com a equipe e foco em soluções eficientes.",
    }]
  },
  {
    id: "2",
    titulo: "Engenheiro de Software",
    empresa: "Google",
    plataforma: "LinkedIn",
    perguntas: 5,
    data: "01/08/2026",
    status: "Pendente",
    detalhes:
      "Candidatura em análise. As 5 perguntas foram respondidas e o currículo foi anexado. Vaga segue ativa na plataforma.",
    respostas: [{
        pergunta: "Qual é a sua experiência com desenvolvimento de software em larga escala?",
        resposta: "Sim, tenho experiência com desenvolvimento de software em larga escala.",
    },{
        pergunta: "Você já trabalhou com metodologias ágeis? Se sim, quais?",
        resposta: "Sim, já trabalhei com metodologias ágeis, incluindo Scrum e Kanban.",
    },{
        pergunta: "Como você lida com prazos apertados e pressão no trabalho?",
        resposta: "Eu priorizo tarefas, mantenho uma comunicação clara com a equipe e foco em soluções eficientes.",
    }]
  },
  {
    id: "3",
    titulo: "Designer de Produto",
    empresa: "Netflix",
    plataforma: "Vagas.com",
    perguntas: 2,
    data: "30/07/2026",
    status: "Sucesso",
    detalhes:
      "Candidatura concluída e redirecionada para o teste técnico. Perguntas de pré-seleção respondidas corretamente.",
    respostas: [{
        pergunta: "Qual é a sua experiência com desenvolvimento de software em larga escala?",
        resposta: "Sim, tenho experiência com desenvolvimento de software em larga escala.",
    },{
        pergunta: "Você já trabalhou com metodologias ágeis? Se sim, quais?",
        resposta: "Sim, já trabalhei com metodologias ágeis, incluindo Scrum e Kanban.",
    },{
        pergunta: "Como você lida com prazos apertados e pressão no trabalho?",
        resposta: "Eu priorizo tarefas, mantenho uma comunicação clara com a equipe e foco em soluções eficientes.",
    }]
  },
  {
    id: "4",
    titulo: "Desenvolvedor Frontend",
    empresa: "Stripe",
    plataforma: "Indeed",
    perguntas: 4,
    data: "28/07/2026",
    status: "Falha",
    detalhes:
      "Falha ao enviar a candidatura: a vaga foi preenchida ou removida antes da conclusão do processo de inscrição.",
    respostas: [{
        pergunta: "Qual é a sua experiência com desenvolvimento de software em larga escala?",
        resposta: "Sim, tenho experiência com desenvolvimento de software em larga escala.",
    },{
        pergunta: "Você já trabalhou com metodologias ágeis? Se sim, quais?",
        resposta: "Sim, já trabalhei com metodologias ágeis, incluindo Scrum e Kanban.",
    },{
        pergunta: "Como você lida com prazos apertados e pressão no trabalho?",
        resposta: "Eu priorizo tarefas, mantenho uma comunicação clara com a equipe e foco em soluções eficientes.",
    }]
  },
];

const statusStyles: Record<Aplicacao["status"], string> = {
  Sucesso: "bg-trampo-primary-600 text-white",
  Pendente: "bg-amber-500 text-white",
  Falha: "bg-red-700 text-white",
};

const headers = ["Título", "Empresa", "Plataforma", "Perguntas", "Data", "Status"];

export default function AplicacoesPage() {
  return (
    <div className="w-full">
      <header className="mb-6">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">Candidaturas</h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Gerencie suas candidaturas e acompanhe o status e respostas de cada uma delas.
        </p>
      </header>

      <div className="w-full rounded-2xl border border-trampo-border bg-white overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.9fr_0.8fr] gap-2 items-center px-5 py-3 border-b border-trampo-border bg-neutral-50">
          {headers.map((header) => (
            <span key={header} className="text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
              {header}
            </span>
          ))}
        </div>

        <Accordion multiple>
          {aplicacoes.map((aplicacao) => (
            <AccordionItem key={aplicacao.id} value={aplicacao.id} className="border-b border-trampo-border last:border-b-0">
              <AccordionTrigger className="hover:no-underline hover:bg-neutral-50/70 transition-colors px-5">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full pr-2">
                  <span className="font-bold text-sm text-trampo-dark truncate">{aplicacao.titulo}</span>
                  <span className="text-sm text-trampo-muted truncate">{aplicacao.empresa}</span>
                  <span className="text-sm text-trampo-muted truncate capitalize">{aplicacao.plataforma}</span>
                  <span className="text-sm text-trampo-muted">{aplicacao.perguntas}</span>
                  <span className="text-sm text-trampo-muted">{aplicacao.data}</span>
                  <Badge className={`justify-self-start rounded-sm font-bold w-20 ${statusStyles[aplicacao.status]}`}>{aplicacao.status}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-center w-full border-t border-trampo-border px-5 py-2">
                  <span className="col-span-3 text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                    Perguntas
                  </span>
                  <span className="col-span-3 text-[11px] font-extrabold uppercase tracking-wider text-trampo-muted">
                    Respostas
                  </span>
                </div>
                {aplicacao.respostas?.map((resposta, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1.5fr_1fr_1fr_0.7fr_0.8fr_0.8fr] gap-2 items-start w-full border-t border-trampo-border px-5 py-2"
                  >
                    <span className="col-span-3 text-sm text-trampo-muted">{resposta.pergunta}</span>
                    <span className="col-span-3 text-sm text-trampo-muted">{resposta.resposta}</span>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}