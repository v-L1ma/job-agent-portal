import { CreateRolePayload, Role, RoleResponse, RolesResponse, UpdateRolePayload } from "@/types/role";
import { api, toApiError } from "./api";

export async function getRoles(): Promise<Role[]> {
  try {
    const response = await api.get<RolesResponse>("/admin/roles");
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível listar os cargos.");
  }
}

export async function getRole(id: string): Promise<Role> {
  try {
    const response = await api.get<RoleResponse>(`/admin/roles/${id}`);
    return response.data.data;
  } catch (error) {
    throw toApiError(error, "Não foi possível carregar o cargo.");
  }
}

export async function createRole(payload: CreateRolePayload): Promise<void> {
  try {
    await api.post("/admin/roles", payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível criar o cargo.");
  }
}

export async function updateRole(id: string, payload: UpdateRolePayload): Promise<void> {
  try {
    await api.put(`/admin/roles/${id}`, payload);
  } catch (error) {
    throw toApiError(error, "Não foi possível atualizar o cargo.");
  }
}

export async function deactivateRole(id: string): Promise<void> {
  try {
    await api.delete(`/admin/roles/${id}`);
  } catch (error) {
    throw toApiError(error, "Não foi possível desativar o cargo.");
  }
}