// src/features/users/types.ts

export type UserStatus = "active" | "inactive" | "pending";

export interface UserRole {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  createdAt: string;
}

export interface InviteUserInput {
  email: string;
  roleId: string;
}

export interface UpdateUserInput {
  roleId?: string;
  status?: UserStatus;
}

export interface UsersFilters {
  search?: string;
  roleId?: string;
  status?: string;
}
