import { UserStatisticsResponse } from "@/types/dashboard";
import { api, toApiError } from "./api";

export async function getUserStatistics(): Promise<UserStatisticsResponse> {
    try {
        const response = await api.get<UserStatisticsResponse>("/statistics");
        return response.data;
    } catch (error) {
        throw toApiError(error, "Não foi possível carregar as estatísticas.");
    }
}
