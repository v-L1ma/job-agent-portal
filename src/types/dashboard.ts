export interface UserStatisticsResponse {
    message: string;
    data: {
        total: {
            count: number;
            variation: number;
            variationLabel: string;
        };
        applied: {
            count: number;
            successRate: number;
        };
        skipped: {
            count: number;
            label: string;
        };
        failures: {
            count: number;
            thisWeek: number;
        };
        applicationsPerDay: {
            date: string;
            count: number;
        }[];
        platformDistribution: {
            platform: string;
            count: number;
        }[];
        statusDistribution: {
            status: string;
            count: number;
            percentage?: number;
        }[];
        recentApplications: never[];
    };
}