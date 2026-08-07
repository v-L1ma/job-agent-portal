
import { SearchQueryResponse } from "@/types/search-query";
import { api, toApiError } from "./api";

export async function getSearchQuery(): Promise<SearchQueryResponse> {
  try {
    const response = await api.get<SearchQueryResponse>("/admin/search-queries");
    return response.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível buscar os logs do scrapper.");
  }
}