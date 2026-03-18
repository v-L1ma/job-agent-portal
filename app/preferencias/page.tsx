import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle, XCircle, MapPin, Search } from "lucide-react";

export default function PreferencesPage() {
  const desiredKeywords = ["React", "Senior", "TypeScript", "Remoto"];
  const excludedKeywords = ["PHP", "Presencial"];
  const locations = ["São Paulo", "Rio de Janeiro", "Portugal", "Estados Unidos"];

  return (
    <DashboardLayout title="Preferências de Busca">
      <div className="max-w-3xl mx-auto pb-12">
        <header className="mb-10">
          <h2 className="text-3xl font-black tracking-tight mb-2">
            Preferências de Busca
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Configure seus critérios para que o AutoApply encontre e filtre as
            melhores oportunidades automaticamente para você.
          </p>
        </header>

        <div className="space-y-10">
          {/* Keywords Desejadas */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold">Keywords desejadas</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Adicione termos que devem estar presentes na descrição da vaga
              (ex: tecnologias, cargos específicos).
            </p>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                {desiredKeywords.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 py-1.5 px-3 rounded-lg flex gap-1 items-center border-none"
                  >
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
              <Input
                className="w-full bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-slate-400 p-3 h-auto"
                placeholder="Digite e pressione enter para adicionar..."
              />
            </div>
          </section>

          {/* Keywords Excluídas */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-bold">Keywords excluídas</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              O AutoApply irá ignorar vagas que contenham estes termos (ex:
              tecnologias que você não quer usar).
            </p>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
              <div className="flex flex-wrap gap-2 mb-3">
                {excludedKeywords.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 hover:bg-rose-200 py-1.5 px-3 rounded-lg flex gap-1 items-center border-none"
                  >
                    {tag}
                    <X className="w-3 h-3 cursor-pointer" />
                  </Badge>
                ))}
              </div>
              <Input
                className="w-full bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-slate-400 p-3 h-auto"
                placeholder="Ex: Júnior, Java, SAP..."
              />
            </div>
          </section>

          {/* Localização */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Localização</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Defina onde você deseja buscar oportunidades (cidades, países ou
              'Global').
            </p>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                className="w-full px-4 py-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                placeholder="São Paulo, Brasil..."
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Button
                  key={loc}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4"
                >
                  {loc}
                </Button>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4">
            <Button variant="ghost" className="px-6 py-6 font-semibold">
              Descartar alterações
            </Button>
            <Button
              variant="default"
              className="px-8 py-6 font-semibold shadow-lg"
            >
              Salvar Preferências
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
