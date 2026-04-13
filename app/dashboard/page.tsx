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
import { getJobs, JobListItem } from "@/lib/api";
import { useEffect, useState } from "react";

interface RecentJob extends JobListItem {
  company?: string;
  platform?: string;
  date?: string;
  status: "Aplicada" | "Pulada" | "Falha";
}

export default function DashboardPage() {
  const { statistics, isLoading, error, refetch } = useDashboard();
  const [recentApps, setRecentApps] = useState<RecentJob[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // useEffect(() => {
  //   const fetchRecentJobs = async () => {
  //     setLoadingJobs(true);
  //     try {
  //       const response = await getJobs({ page: 1, pageSize: 5 });
  //       const fallbackJobs = (response as { data?: JobListItem[] }).data;
  //       const recentJobs = Array.isArray(response?.items)
  //         ? response.items
  //         : Array.isArray(fallbackJobs)
  //         ? fallbackJobs
  //         : [];
  //       const mappedJobs: RecentJob[] = recentJobs.map((job) => ({
  //         ...job,
  //         company: "Empresa",
  //         platform: "LinkedIn",
  //         date: "Recente",
  //         status: job.isApplied ? "Aplicada" : "Pulada",
  //       }));
  //       setRecentApps(mappedJobs);
  //     } catch (err) {
  //       console.error("Erro ao buscar vagas recentes:", err);
  //     } finally {
  //       setLoadingJobs(false);
  //     }
  //   };

  //   fetchRecentJobs();
  // }, []);

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
      value: statistics?.overview.total.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.overview.totalPercentageChange ?? 0}% vs mês passado`,
      icon: Activity,
      color: "text-primary",
    },
    {
      title: "Aplicadas",
      value: statistics?.overview.applied.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.overview.appliedSuccessRate ?? 0}% de sucesso`,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Puladas",
      value: statistics?.overview.skipped.toLocaleString("pt-BR") ?? "0",
      change: "Filtros aplicados",
      icon: SkipForward,
      color: "text-yellow-500",
    },
    {
      title: "Falhas",
      value: statistics?.overview.failed.toLocaleString("pt-BR") ?? "0",
      change: `${statistics?.overview.failedWeeklyChange ?? 0}% essa semana`,
      icon: AlertCircle,
      color: "text-red-500",
    },
  ];

  const maxDayCount = Math.max(
    ...(statistics?.applicationsByDay.data.map((d) => d.count) ?? [1])
  );

  const platformMaxCount = Math.max(
    ...(statistics?.platformDistribution.data.map((p) => p.count) ?? [1])
  );

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
          <CardContent className="h-[240px] flex items-end justify-between gap-1">
            {statistics?.applicationsByDay.data.slice(-7).map((day, i) => (
              <div
                key={i}
                className="flex-1 bg-primary/20 hover:bg-primary transition-colors rounded-t"
                style={{
                  height: `${(day.count / maxDayCount) * 100}%`,
                  minHeight: "4%",
                }}
                title={`${day.count} candidaturas`}
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
                    (251.2 * (statistics?.statusDistribution.appliedPercentage ?? 0)) /
                      100
                  }
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">
                  {statistics?.statusDistribution.total.toLocaleString("pt-BR") ??
                    "0"}
                </span>
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
                <span className="font-bold">
                  {statistics?.statusDistribution.appliedPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Puladas</span>
                </div>
                <span className="font-bold">
                  {statistics?.statusDistribution.skippedPercentage.toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span>Falhas</span>
                </div>
                <span className="font-bold">
                  {statistics?.statusDistribution.failedPercentage.toFixed(0)}%
                </span>
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
            {statistics?.platformDistribution.data.map((platform, index) => (
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
            {(!statistics?.platformDistribution.data ||
              statistics.platformDistribution.data.length === 0) && (
              <p className="text-sm text-slate-500 text-center py-4">
                Nenhuma plataforma registrada
              </p>
            )}
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
              {loadingJobs ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : recentApps.length > 0 ? (
                recentApps.map((app, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{app.title}</div>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                    Nenhuma candidatura recente
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  );
}
