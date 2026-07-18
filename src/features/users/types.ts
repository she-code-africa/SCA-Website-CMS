// src/features/users/types.ts

export type UserStatus = "active" | "deactivated" | "pending";

export interface UserRole {
  _id: string;
  id?: string;
  name: string;
  isDefault: boolean;
}

export interface AdminUser {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string | UserRole;
  status: UserStatus;
  isActive: boolean;
  lastLogin?: string | null;
  createdAt: string;
  expiresAt?: string | null;
}

// 👇 Update to match backend response
export interface Invitation {
  _id: string;
  email: string;
  role: string; // role ID (string)
  status: string; // "PENDING" or "ACCEPTED"
  invitedAt?: string; // from backend: createdAt
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  invitedBy: string;
  tokenHash?: string;
}

export interface PaginatedUsers {
  users: AdminUser[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

export interface InviteUserInput {
  email: string;
  roleName: string;
  roleId?: string;
}

export interface UpdateUserInput {
  roleId?: string;
  status?: UserStatus;
}

export interface UsersFilters {
  search?: string;
  roleId?: string;
  status?: string;
  page?: number;
  limit?: number;
}
