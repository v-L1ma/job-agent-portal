import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  TrendingUp,
  Clock,
  Filter,
  X,
} from "lucide-react";

export default function ResponsesPage() {
  const responses = [
    {
      category: "Carreira",
      question: "Qual sua pretensão salarial?",
      answer:
        "Minha pretensão salarial é negociável com base no pacote total de benefícios, mas busco algo na faixa de R$ 8.000 a R$ 10.000 CLT, considerando minha experiência de 5 anos em desenvolvimento fullstack.",
    },
    {
      category: "Cultura",
      question: "Por que você quer trabalhar na nossa empresa?",
      answer:
        "Acompanho o crescimento da [Empresa] no setor de tecnologia e admiro a forma como vocês resolvem problemas de escalabilidade. Quero aplicar meus conhecimentos em arquitetura de microsserviços para contribuir com essa evolução.",
    },
    {
      category: "Técnico",
      question: "Fale sobre um desafio técnico que você superou.",
      answer:
        "No meu último projeto, tivemos um gargalo no banco de dados durante picos de acesso. Implementei uma camada de cache com Redis e otimizei as queries mais pesadas, reduzindo o tempo de resposta em 40%.",
    },
  ];

  return (
    <DashboardLayout title="Minhas Respostas">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Minhas Respostas
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Gerencie suas perguntas e respostas frequentes para agilizar
              candidaturas.
            </p>
          </div>
          <Button className="rounded-xl px-5 py-6 font-semibold shadow-lg">
            <Plus className="w-5 h-5 mr-2" />
            Nova Resposta
          </Button>
        </div>

        {/* Action Form */}
        <Card className="border-primary/30 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Adicionar Nova Resposta</CardTitle>
            </div>
            <Button variant="ghost" size="icon">
              <X className="w-5 h-5 text-slate-400" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Pergunta frequente</Label>
              <Input
                placeholder="Ex: Por que você quer trabalhar conosco?"
                className="p-6"
              />
            </div>
            <div className="space-y-2">
              <Label>Sua Resposta</Label>
              <Textarea
                placeholder="Descreva sua resposta detalhadamente..."
                className="p-6 min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="px-6 py-6">
                Cancelar
              </Button>
              <Button className="px-8 py-6">Salvar Resposta</Button>
            </div>
          </CardContent>
        </Card>

        {/* Responses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold text-lg">
              Respostas Salvas ({responses.length})
            </h3>
            <Button variant="ghost" size="sm" className="text-slate-500 gap-2">
              <Filter className="w-4 h-4" />
              Filtrar
            </Button>
          </div>

          <div className="grid gap-4">
            {responses.map((item, i) => (
              <Card
                key={i}
                className="group border border-slate-200 dark:border-primary/20 hover:border-primary/50 transition-all"
              >
                <CardContent className="p-6 flex justify-between items-start gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border-none"
                      >
                        {item.category}
                      </Badge>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {item.question}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Card className="bg-slate-100 dark:bg-slate-800/30 border-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">12</div>
                <div className="text-xs text-slate-500">Total de respostas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800/30 border-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">85%</div>
                <div className="text-xs text-slate-500">Taxa de reutilização</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-100 dark:bg-slate-800/30 border-none">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">2h</div>
                <div className="text-xs text-slate-500">Tempo economizado/mês</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
