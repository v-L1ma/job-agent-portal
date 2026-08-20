export interface Role {
  id: string;
  name: string;
  active: boolean;
  createdBy: string;
  createdAt: string;
  lastModifiedBy: string;
  lastModifiedAt: string;
}

export interface RolesResponse {
  message: string;
  data: Role[];
}

export interface RoleResponse {
  message: string;
  data: Role;
}

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name: string;
  active: boolean;
}