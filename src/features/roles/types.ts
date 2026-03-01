// src/features/roles/types.ts

export type PermissionKey = string;

export interface RoleDetail {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  permissions: PermissionKey[];
  usersCount: number;
  createdAt: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: PermissionKey[];
}

export interface UpdateRoleInput extends CreateRoleInput {}

export interface RolesFilters {
  search?: string;
  type?: "default" | "custom" | "";
}
