"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Search,
  ChevronDown,
  Calendar,
  Building2,
  ExternalLink,
  Clock,
  Globe,
  DollarSign,
  Terminal,
} from "lucide-react";
import { useState } from "react";

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const applications = [
    {
      id: 1,
      role: "Desenvolvedor Frontend Sênior",
      company: "Google Cloud",
      location: "Mountain View, CA (Híbrido)",
      platform: "LinkedIn",
      platformColor: "bg-blue-100 text-blue-700",
      time: "Hoje às 10:30",
      status: "Aplicada",
      statusColor: "bg-green-100 text-green-700",
      dotColor: "bg-green-600",
      salary: "$140k - $180k",
      active: true,
    },
    {
      id: 2,
      role: "UX Designer",
      company: "Adobe Systems",
      location: "San Jose, CA",
      platform: "Greenhouse",
      platformColor: "bg-teal-100 text-teal-700",
      time: "Ontem às 15:45",
      status: "Ignorada",
      statusColor: "bg-yellow-100 text-yellow-700",
      dotColor: "bg-yellow-600",
      active: false,
    },
    {
      id: 3,
      role: "Fullstack Engineer (React/Go)",
      company: "Stripe",
      location: "Remote",
      platform: "LinkedIn",
      platformColor: "bg-blue-100 text-blue-700",
      time: "12 Out às 09:12",
      status: "Falhou",
      statusColor: "bg-red-100 text-red-700",
      dotColor: "bg-red-600",
      active: false,
    },
  ];

  const appToShow = selectedApp || applications[0];

  return (
    <DashboardLayout title="Minhas Candidaturas">
      <div className="flex flex-col h-full -m-4 md:-m-8">
        {/* Filters Bar */}
        <div className="p-3 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1 shrink-0 px-6">
          <div className="relative flex items-center flex-1 max-w-[400px]">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search by job title, company, or keywords" 
              className="pl-10 bg-[#F8FAFC] dark:bg-slate-900 border-none h-11 text-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-200 shadow-none"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-4" />

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold h-10 px-4 rounded-md gap-2 border-none">
              Date Posted <ChevronDown className="w-4 h-4 text-slate-400" />
            </Button>
            
            <Button variant="ghost" className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold h-10 px-4 rounded-md gap-2 border border-blue-100 dark:border-blue-900/50">
              Match Score <ChevronDown className="w-4 h-4" />
            </Button>

            <Button variant="ghost" className="bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold h-10 px-4 rounded-md gap-2 border-none">
              Job Type <ChevronDown className="w-4 h-4 text-slate-400" />
            </Button>

            <Button variant="ghost" className="bg-[#F8FAFC] hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold h-10 px-4 rounded-md gap-2 border-none">
              Company <ChevronDown className="w-4 h-4 text-slate-400" />
            </Button>
          </div>

          <div className="ml-auto text-sm text-[#7f8fa4] font-medium">
            Showing {applications.length} results
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-900/10 h-full">
          <ScrollArea className="h-full">
            <div className="p-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all group flex flex-col min-h-[180px]"
                  >
                    <div className="space-y-1 mb-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {app.role}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        {app.company}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.time}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/50">
                      <div className="flex gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary text-[10px] uppercase font-bold border-none"
                        >
                          {app.platform}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`${app.statusColor} text-[10px] font-bold flex items-center gap-1.5 border-none`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${app.dotColor}`}
                          />
                          {app.status}
                        </Badge>
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs font-bold gap-2 hover:bg-primary hover:text-white dark:hover:bg-primary/20 dark:hover:text-primary transition-all"
                        onClick={() => setSelectedApp(app)}
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>

        <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
          <SheetContent side="right" className="max-w-[500px] md:max-w-[50%] w-full p-0 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 backdrop-blur-md">
            <ScrollArea className="h-full">
              {selectedApp && (
                <div className="p-8">
                  <div className="flex justify-between items-start mb-8 gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedApp.role}</h2>
                        <p className="text-slate-500">{selectedApp.company} • {selectedApp.location}</p>
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            Aplicada há 2 horas
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Globe className="w-3.5 h-3.5" />
                            {selectedApp.platform}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <DollarSign className="w-3.5 h-3.5" />
                            {selectedApp.salary}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="gap-2">
                      Ir para a vaga <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Respostas do Formulário
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            q: "Anos de experiência com React.js",
                            a: "8 anos",
                          },
                          {
                            q: "Qual o seu nível de proficiência em TypeScript?",
                            a: "Especialista. Utilizo em todos os projetos complexos nos últimos 5 anos.",
                          },
                          {
                            q: "Por que você quer trabalhar no Google Cloud?",
                            a: "Sempre admirei a infraestrutura do Google...",
                            italic: true,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                          >
                            <p className="text-xs font-semibold text-primary mb-1">
                              {item.q}
                            </p>
                            <p
                              className={`text-sm font-medium ${
                                item.italic
                                  ? "italic text-slate-600 dark:text-slate-400"
                                  : ""
                              }`}
                            >
                              {item.italic ? `"${item.a}"` : item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Logs do Bot
                      </h3>
                      <div className="font-mono text-[11px] bg-slate-900 text-slate-300 p-4 rounded-md space-y-1">
                        <p>
                          <span className="text-green-400">[10:28:01]</span>{" "}
                          Iniciando navegação para URL da vaga...
                        </p>
                        <p>
                          <span className="text-green-400">[10:28:15]</span> Login
                          no LinkedIn detectado.
                        </p>
                        <p>
                          <span className="text-green-400">[10:28:40]</span>{" "}
                          Mapeando campos do formulário...
                        </p>
                        <p>
                          <span className="text-primary">[10:29:12]</span>{" "}
                          Preenchendo campos de experiência...
                        </p>
                        <p>
                          <span className="text-green-400">[10:30:11]</span>{" "}
                          Candidatura enviada com sucesso!
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              )}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </DashboardLayout>
  );
}
