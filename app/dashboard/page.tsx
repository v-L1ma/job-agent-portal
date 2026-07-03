"use client";

import { useDashboard } from "@/hooks/use-dashboard";
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
  Activity,
  CheckCircle,
  SkipForward,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const { statistics, isLoading, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              Carregando estatísticas...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      title: "Total",
      value: statistics?.total.count.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.total.variation ?? 0} ${statistics?.total.variationLabel ?? ""}`,
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Aplicadas",
      value: statistics?.applied.count.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.applied.successRate ?? 0}% de sucesso`,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Puladas",
      value: statistics?.skipped.count.toLocaleString("pt-BR") ?? "0",
      change: statistics?.skipped.label ?? "Filtros aplicados",
      icon: SkipForward,
      color: "text-yellow-500",
    },
    {
      title: "Falhas",
      value: statistics?.failures.count.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.failures.thisWeek ?? 0} essa semana`,
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  const maxDayCount = Math.max(
    ...(statistics?.applicationsPerDay.map((d) => d.count) ?? [1])
  );

  const platformMaxCount = Math.max(
    ...(statistics?.platformDistribution.map((p) => p.count) ?? [1])
  );

  const recentApplications = statistics?.recentApplications ?? [];

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
          <Card
            key={stat.title}
            className="border-slate-200 dark:border-primary/20"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs font-semibold mt-1 ${
                  stat.title === "Falhas"
                    ? "text-red-500"
                    : stat.title === "Total"
                    ? "text-green-500"
                    : "text-slate-500"
                }`}
              >
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
          <CardContent className="h-[240px] flex items-end justify-between gap-3 pt-6 pb-2">
            {statistics?.applicationsPerDay.slice(-7).map((day, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div className="relative flex flex-col items-center w-full h-full justify-end">
                  <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                    {day.count}
                  </div>
                  <div
                    className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t"
                    style={{
                      height: `${(day.count / maxDayCount) * 100}%`,
                      minHeight: "4%",
                    }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {day.date}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
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
                  strokeDashoffset={
                    251.2 -
                    (251.2 *
                      (statistics?.statusDistribution.find((s) => s.status === "Aplicadas")?.percentage ?? 0)) /
                      100
                  }
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  {statistics?.statusDistribution.find((s) => s.status === "Total")?.count.toLocaleString("pt-BR") ??
                    "0"}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">
                  Total
                </span>
              </div>
            </div>
            <div className="w-full space-y-2">
              {statistics?.statusDistribution.filter((s) => s.status !== "Total").map((item) => (
                <div key={item.status} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === "Aplicadas" ? "bg-primary" :
                      item.status === "Puladas" ? "bg-yellow-500" :
                      item.status === "Falhas" ? "bg-red-500" : "bg-slate-500"
                    }`} />
                    <span>{item.status}</span>
                  </div>
                  <span className="font-bold">
                    {item.percentage?.toFixed(0) ?? 0}%
                  </span>
                </div>
              ))}
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
            {statistics?.platformDistribution.map((platform, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{platform.platform}</span>
                  <span className="text-slate-500">{platform.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(platform.count / platformMaxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
            {(!statistics?.platformDistribution ||
              statistics.platformDistribution.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">
                Nenhuma plataforma registrada
              </p>
            )}
          </CardContent>
        </Card>

        {recentApplications.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Últimas Candidaturas</CardTitle>
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
                {recentApplications.map((app: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{app.title || app.role}</div>
                      <div className="text-xs text-slate-500">
                        {app.company}
                      </div>
                    </TableCell>
                    <TableCell>{app.platform}</TableCell>
                    <TableCell className="text-slate-500">{app.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === "Aplicada"
                            ? "default"
                            : app.status === "Pulada"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
