export interface DashboardOverview {
  total: { count: number; variation: number; variationLabel: string };
  applied: { count: number; successRate: number };
  skipped: { count: number; label: string };
  failures: { count: number; thisWeek: number };
}

export interface DayStat {
  date: string;
  count: number;
}

export interface PlatformStat {
  platform: string;
  count: number;
}

export interface StatusDistItem {
  status: string;
  count: number;
  percentage?: number;
}

export interface UserStatisticsResponse {
  message: string;
  data: DashboardOverview & {
    applicationsPerDay: DayStat[];
    platformDistribution: PlatformStat[];
    statusDistribution: StatusDistItem[];
    recentApplications: never[];
  };
}
