"use client";

import { getUserStatistics } from "@/services/dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  PieChart,
  Briefcase,
  CheckCircle2,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface StatusConfig {
  label: string;
  colorClass: string;
  colorHex: string;
  bgClass: string;
}

const statusMap: Record<string, StatusConfig> = {
  applied: {
    label: "Aplicadas",
    colorClass: "text-trampo-primary-500",
    colorHex: "#2EAF92",
    bgClass: "bg-trampo-primary-500",
  },
  skipped: {
    label: "Puladas",
    colorClass: "text-[#eab308]",
    colorHex: "#eab308",
    bgClass: "bg-[#eab308]",
  },
  failures: {
    label: "Falhas",
    colorClass: "text-red-500",
    colorHex: "#ef4444",
    bgClass: "bg-red-500",
  },
};

const getStatusConfig = (status: string): StatusConfig => {
  const key = status.toLowerCase();
  if (key.includes("applied") || key.includes("aplicada")) return statusMap.applied;
  if (key.includes("skipped") || key.includes("pulada") || key.includes("ignorada")) return statusMap.skipped;
  if (key.includes("fail") || key.includes("falha") || key.includes("erro")) return statusMap.failures;
  return {
    label: status,
    colorClass: "text-trampo-muted",
    colorHex: "#52525B",
    bgClass: "bg-trampo-muted",
  };
};

export default function DashboardPage() {
  const { status: sessionStatus } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-statistics"],
    queryFn: getUserStatistics,
    enabled: sessionStatus === "authenticated",
  });

  const loading = sessionStatus === "loading" || isLoading;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse select-none">
        {/* Overview Intro Skeleton */}
        <div>
          <div className="h-7 w-48 bg-neutral-200 rounded-lg mb-2" />
          <div className="h-4 w-96 bg-neutral-100 rounded-lg" />
        </div>

        {/* Metrics Row Skeleton */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-trampo-border rounded-2xl p-5 h-32 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
              <div className="flex justify-between items-center">
                <div className="h-3 w-16 bg-neutral-200 rounded" />
                <div className="h-8 w-8 bg-neutral-100 rounded-lg" />
              </div>
              <div>
                <div className="h-6 w-24 bg-neutral-200 rounded mb-2" />
                <div className="h-3 w-32 bg-neutral-100 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-trampo-border rounded-2xl p-6 h-72 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="h-4 w-36 bg-neutral-200 rounded mb-6" />
            <div className="flex-1 flex items-end justify-between gap-4 pt-4 border-b border-l border-trampo-border">
              <div className="h-16 w-full bg-neutral-100 rounded-t" />
              <div className="h-24 w-full bg-neutral-100 rounded-t" />
              <div className="h-12 w-full bg-neutral-100 rounded-t" />
              <div className="h-32 w-full bg-neutral-100 rounded-t" />
            </div>
          </div>
          <div className="bg-white border border-trampo-border rounded-2xl p-6 h-72 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="h-4 w-36 bg-neutral-200 rounded mb-4" />
            <div className="flex-1 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-8 border-neutral-100" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full bg-neutral-100 rounded" />
              <div className="h-3 w-full bg-neutral-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertTriangle className="size-12 text-red-500 animate-bounce" />
        <h2 className="text-lg font-bold text-trampo-dark">Ops! Não foi possível carregar as estatísticas.</h2>
        <p className="text-sm text-trampo-muted">Por favor, verifique sua conexão ou tente novamente mais tarde.</p>
      </div>
    );
  }

  const statistics = data.data;

  const metrics = [
    {
      title: "Total",
      value: statistics.total.count.toLocaleString(),
      change: statistics.total.variationLabel || `${statistics.total.variation >= 0 ? "+" : ""}${statistics.total.variation}% em relação à última semana`,
      icon: Briefcase,
      bgColor: "bg-trampo-primary-50",
      borderColor: "border-trampo-primary-100/50",
      iconColor: "text-trampo-primary-500",
    },
    {
      title: "Aplicadas",
      value: statistics.applied.count.toLocaleString(),
      change: `Taxa de sucesso: ${statistics.applied.successRate}%`,
      icon: CheckCircle2,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      title: "Puladas",
      value: statistics.skipped.count.toLocaleString(),
      change: statistics.skipped.label || "Ignoradas por filtros",
      icon: EyeOff,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      iconColor: "text-amber-500",
    },
    {
      title: "Falhas",
      value: statistics.failures.count.toLocaleString(),
      change: `${statistics.failures.thisWeek} esta semana`,
      icon: AlertTriangle,
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      iconColor: "text-red-500",
    },
  ];

  // Bar Chart calculations
  const maxBarCount = statistics.applicationsPerDay?.length
    ? Math.max(...statistics.applicationsPerDay.map((d) => d.count), 1)
    : 1;

  // Donut Chart calculations
  const statusDistribution = statistics.statusDistribution || [];
  const totalStatusCount = statusDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;
  const statusDistributionWithPct = statusDistribution.map((item) => {
    const pct = item.percentage ?? (totalStatusCount > 0 ? (item.count / totalStatusCount) * 100 : 0);
    return { ...item, percentage: pct };
  });

  // SVG Donut paths
  let cumulativePercentage = 0;

  // Platform progress bars
  const platforms = statistics.platformDistribution || [];
  const totalPlatformCount = platforms.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-8 select-none">
      {/* Overview Intro */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-trampo-dark mb-1">
          Visão Geral
        </h1>
        <p className="text-xs md:text-sm text-trampo-muted font-semibold">
          Acompanhe o desempenho das suas candidaturas automáticas em tempo real.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-trampo-border rounded-2xl p-5 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-extrabold text-trampo-muted uppercase tracking-widest">
                  {metric.title}
                </span>
                <div className={`p-2 rounded-lg ${metric.bgColor} border ${metric.borderColor}`}>
                  <Icon className={`size-4 ${metric.iconColor}`} />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-trampo-dark tracking-tight mb-1">
                  {metric.value}
                </h3>
                <p
                  className={`text-[9px] font-bold ${
                    metric.title === "Total"
                      ? "text-trampo-primary-600"
                      : metric.title === "Falhas"
                      ? "text-red-500"
                      : "text-trampo-muted"
                  }`}
                >
                  {metric.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-trampo-border rounded-2xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="size-4 text-trampo-primary-500" />
            <h3 className="font-extrabold text-trampo-dark text-xs uppercase tracking-wider">
              Candidaturas por dia
            </h3>
          </div>

          {/* SVG/Tailwind Chart */}
          <div className="flex-1 flex items-end justify-between h-48 pt-4 pb-2 px-2 relative border-b border-trampo-border border-l border-trampo-border">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="w-full border-t border-trampo-border/40" />
              <div className="w-full border-t border-trampo-border/40" />
              <div className="w-full border-t border-trampo-border/40" />
              <div className="w-full border-t border-trampo-border/40" />
            </div>

            {/* Dynamic Bars */}
            {statistics.applicationsPerDay?.map((item, idx) => {
              const heightPct = maxBarCount > 0 ? (item.count / maxBarCount) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 z-10 group cursor-pointer max-w-[60px] mx-1">
                  <div className="w-full bg-trampo-primary-500/10 hover:bg-trampo-primary-500/20 border border-trampo-primary-100/50 rounded-t h-32 transition-all flex items-end justify-center relative group">
                    <div
                      className="w-full bg-trampo-primary-500/35 group-hover:bg-trampo-primary-500/60 rounded-t transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-trampo-dark text-white text-[9px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-20">
                      {item.count} candidaturas
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-trampo-muted truncate w-full text-center">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-trampo-border rounded-2xl p-6 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="size-4 text-trampo-primary-500" />
            <h3 className="font-extrabold text-trampo-dark text-xs uppercase tracking-wider">
              Distribuição por Status
            </h3>
          </div>

          {/* Donut graphic */}
          <div className="relative flex items-center justify-center py-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle
                cx="18"
                cy="18"
                r="15.9155"
                fill="none"
                stroke="#F4F4F5"
                strokeWidth="3.5"
              />
              
              {/* Dynamic segments */}
              {statusDistributionWithPct.map((item, idx) => {
                const pct = item.percentage;
                if (pct <= 0) return null;
                const strokeDasharray = `${pct} 100`;
                const strokeDashoffset = 100 - cumulativePercentage;
                cumulativePercentage += pct;
                const config = getStatusConfig(item.status);

                return (
                  <circle
                    key={idx}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={config.colorHex}
                    strokeWidth="3.5"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                  />
                );
              })}
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-extrabold text-trampo-dark leading-none">
                {statistics.total.count.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-trampo-muted uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>

          {/* Indicators */}
          <div className="space-y-2 border-t border-trampo-border pt-4">
            {statusDistributionWithPct.map((item, idx) => {
              const config = getStatusConfig(item.status);
              return (
                <div key={idx} className="flex items-center justify-between text-[10px] font-bold">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.bgClass}`} />
                    <span className="text-trampo-muted">{config.label}</span>
                  </div>
                  <span className="text-trampo-dark">{Math.round(item.percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress bars Card */}
        <div className="lg:col-span-2 bg-white border border-trampo-border rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <h3 className="font-extrabold text-trampo-dark text-xs uppercase tracking-wider mb-6">
            Candidaturas por Plataforma
          </h3>
          <div className="space-y-5">
            {platforms.map((platform, idx) => {
              const percentage = totalPlatformCount > 0 ? (platform.count / totalPlatformCount) * 100 : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-trampo-muted font-bold">{platform.platform}</span>
                    <span className="text-trampo-dark font-extrabold">{platform.count}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-trampo-primary-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
