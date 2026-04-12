// src/features/users/types.ts

export type UserStatus = "active" | "deactivated" | "pending";

export interface UserRole {
  _id: string; // backend uses _id
  id?: string; // alias for convenience
  name: string;
  isDefault: boolean;
}

export interface AdminUser {
  _id: string; // primary identifier
  id?: string; // alias
  firstName: string;
  lastName: string;
  email: string;
  role: string | UserRole; // can be ID string or full object
  status: UserStatus; // "active" | "deactivated" | "pending"
  isActive: boolean; // for existing users
  lastLogin?: string | null;
  createdAt: string;
}

export interface Invitation {
  _id: string;
  email: string;
  roleName: string;
  roleId: string; // ID of the assigned role
  invitedAt: string;
  expiresAt?: string;
  status: "pending" | "accepted" | "expired";
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
