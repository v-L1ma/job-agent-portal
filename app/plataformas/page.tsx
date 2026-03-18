import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Leaf,
  Shield,
  Zap,
  RefreshCw,
  HelpCircle,
  Search,
} from "lucide-react";

export default function PlatformsPage() {
  const platforms = [
    {
      name: "LinkedIn",
      icon: Globe,
      iconColor: "text-[#0077b5]",
      bgColor: "bg-[#0077b5]/10",
      description: "Configuração de automação para busca e envio.",
      status: "ATIVO",
      statusVariant: "default" as const,
      cookieLabel: "Cookie li_at",
      cookiePlaceholder: "Insira seu cookie de sessão li_at",
      helpText: "O cookie li_at é necessário para autenticar sua sessão sem senha.",
      onlySearch: true,
    },
    {
      name: "Greenhouse",
      icon: Leaf,
      iconColor: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      description: "Integração via API para submissão direta de currículos.",
      status: "DESCONECTADO",
      statusVariant: "secondary" as const,
      cookieLabel: "Token de Acesso",
      cookiePlaceholder: "Insira seu Personal Access Token",
      helpText: "Gere um token nas configurações de desenvolvedor do Greenhouse.",
      onlySearch: false,
    },
  ];

  return (
    <DashboardLayout title="Plataformas">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-slate-500 dark:text-slate-400">
            Configure o acesso e permissões às suas plataformas de recrutamento
            externas.
          </p>
        </div>

        <div className="space-y-6">
          {platforms.map((platform) => (
            <Card key={platform.name} className="overflow-hidden">
              <CardHeader className="p-6 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`size-12 rounded-md ${platform.bgColor} flex items-center justify-center ${platform.iconColor}`}
                  >
                    <platform.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{platform.name}</h3>
                    <p className="text-sm text-slate-500">
                      {platform.description}
                    </p>
                  </div>
                </div>
                <Badge variant={platform.statusVariant}>{platform.status}</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold">
                        {platform.cookieLabel}
                      </label>
                      <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                    </div>
                    <Input
                      type="password"
                      placeholder={platform.cookiePlaceholder}
                      className="p-6"
                    />
                    <p className="text-[11px] text-slate-500">
                      {platform.helpText}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/30 rounded-md border border-slate-100 dark:border-slate-800">
                    <div className="pr-4">
                      <p className="text-sm font-semibold">Apenas busca</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Não aplicar automaticamente, apenas sugerir vagas
                        encontradas.
                      </p>
                    </div>
                    <Switch checked={platform.onlySearch} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button variant="ghost">Testar Conexão</Button>
                  <Button className="px-6">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips / Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: Shield,
              title: "Segurança de Dados",
              text: "Seus tokens e cookies são criptografados com AES-256 antes de serem armazenados.",
            },
            {
              icon: Zap,
              title: "Auto-Atualização",
              text: "Tentamos renovar sessões automaticamente quando possível para evitar interrupções.",
            },
            {
              icon: RefreshCw,
              title: "Sincronização",
              text: "As vagas são sincronizadas a cada 15 minutos em suas plataformas ativas.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-md border border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-transparent flex flex-col gap-3"
            >
              <item.icon className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-bold">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
