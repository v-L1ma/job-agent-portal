export interface DashboardOverview {
  total: number;
  totalPercentageChange: number;
  applied: number;
  appliedSuccessRate: number;
  skipped: number;
  failed: number;
  failedWeeklyChange: number;
}

export interface DayStat {
  date: string;
  count: number;
}

export interface StatusDistribution {
  total: number;
  applied: number;
  appliedPercentage: number;
  skipped: number;
  skippedPercentage: number;
  failed: number;
  failedPercentage: number;
}

export interface PlatformStat {
  platform: string;
  count: number;
}

export interface UserStatisticsResponse {
  overview: DashboardOverview;
  applicationsByDay: {
    data: DayStat[];
  };
  statusDistribution: StatusDistribution;
  platformDistribution: {
    data: PlatformStat[];
  };
}

export interface RecentApplication {
  id: string;
  role: string;
  company: string;
  platform: string;
  date: string;
  status: "Aplicada" | "Pulada" | "Falha";
}
