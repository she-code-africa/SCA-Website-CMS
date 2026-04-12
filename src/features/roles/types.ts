// src/features/roles/types.ts

export type PermissionKey = string;

export interface RoleDetail {
  id: string;
  _id?: string;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: PermissionKey[];
  usersCount: number;
  createdAt: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: PermissionKey[];
}

// export interface UpdateRoleInput extends CreateRoleInput {}
export type UpdateRoleInput = CreateRoleInput;

export interface RolesFilters {
  search?: string;
  type?: "default" | "custom" | "";
}
