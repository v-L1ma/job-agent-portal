import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Activity,
  CheckCircle,
  SkipForward,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total",
      value: "1,284",
      change: "+12% vs mês passado",
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Aplicadas",
      value: "850",
      change: "+8.2% de sucesso",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Puladas",
      value: "320",
      change: "Filtros aplicados",
      icon: SkipForward,
      color: "text-yellow-500",
    },
    {
      title: "Falhas",
      value: "114",
      change: "-2% essa semana",
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  const recentApps = [
    {
      role: "Senior Product Designer",
      company: "Stripe",
      platform: "LinkedIn",
      date: "Hoje, 14:20",
      status: "Aplicada",
    },
    {
      role: "Fullstack Developer",
      company: "Vercel",
      platform: "Greenhouse",
      date: "Hoje, 11:05",
      status: "Aplicada",
    },
    {
      role: "Marketing Lead",
      company: "Notion",
      platform: "LinkedIn",
      date: "Ontem, 18:45",
      status: "Pulada",
    },
    {
      role: "Backend Engineer",
      company: "Nubank",
      platform: "LinkedIn",
      date: "Ontem, 09:12",
      status: "Falha",
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Visão Geral
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Acompanhe o desempenho das suas candidaturas automáticas em tempo
          real.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 dark:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs font-semibold mt-1 ${stat.title === "Falhas" ? "text-red-500" : stat.title === "Total" ? "text-green-500" : "text-slate-500"}`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 border-slate-200 dark:border-primary/20">
          <CardHeader>
            <CardTitle className="font-bold">Candidaturas por dia</CardTitle>
          </CardHeader>
          <CardContent className="h-[240px] flex items-end justify-between">
            {/* Simple representation of the chart from the HTML */}
            {[40, 65, 50, 85, 70, 60, 95].map((height, i) => (
              <div
                key={i}
                className="w-12 bg-primary/20 hover:bg-primary transition-colors rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              {/* Simple CSS-based Donut using SVG */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className="text-primary"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset="60"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">1.2k</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Total
                </span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Aplicadas</span>
                </div>
                <span className="font-bold">65%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Puladas</span>
                </div>
                <span className="font-bold">25%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Falhas</span>
                </div>
                <span className="font-bold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Candidaturas por Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">LinkedIn</span>
                <span className="text-slate-500">942</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Greenhouse</span>
                <span className="text-slate-500">342</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-primary/60 h-2 rounded-full" style={{ width: "35%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Últimas Candidaturas</CardTitle>
            <button className="text-sm font-semibold text-primary hover:underline">
              Ver todas
            </button>
          </CardHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vaga</TableHead>
                <TableHead>Plataforma</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApps.map((app, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{app.role}</div>
                    <div className="text-xs text-slate-500">{app.company}</div>
                  </TableCell>
                  <TableCell>{app.platform}</TableCell>
                  <TableCell className="text-slate-500">{app.date}</TableCell>
                  <TableCell>
                    <Badge variant={app.status === "Aplicada" ? "default" : app.status === "Pulada" ? "secondary" : "destructive"}>
                      {app.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
