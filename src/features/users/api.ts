// src/features/users/api.ts
import { api } from "@/lib/api/client";
import type {
  AdminUser,
  UserRole,
  UsersFilters,
  PaginatedUsers,
  Invitation,
  InviteUserInput
} from "./types";

function normalizeUser(raw: any): AdminUser {
  let roleValue = raw.role;
  if (!roleValue && Array.isArray(raw.roles) && raw.roles.length > 0) {
    roleValue = raw.roles[0];
  }
  return {
    _id: raw._id,
    id: raw._id,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    email: raw.email,
    role: roleValue,
    status: raw.status || (raw.isActive ? "active" : "deactivated"),
    isActive: raw.isActive ?? true,
    lastLogin: raw.lastLogin,
    createdAt: raw.createdAt
  };
}

export async function getUsers(
  filters?: UsersFilters
): Promise<PaginatedUsers> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.roleId) params.set("roleId", filters.roleId);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const response = await api.get(`/users?${params.toString()}`);
  const payload = response as any; // cast to any to handle unknown response shape

  const usersArray = Array.isArray(payload) ? payload : payload.data || [];
  const normalizedUsers = usersArray.map(normalizeUser);

  let totalPages = 1,
    totalCount = normalizedUsers.length,
    currentPage = filters?.page || 1;
  if (!Array.isArray(payload)) {
    totalPages = payload.totalPages || 1;
    totalCount = payload.totalUsers ?? normalizedUsers.length;
    currentPage = payload.currentPage || 1;
  }
  return { users: normalizedUsers, totalPages, totalCount, currentPage };
}

export async function getCurrentUser(userId: string): Promise<AdminUser> {
  const response = await api.get(`/users/${userId}`);
  return normalizeUser(response as any);
}

export async function getInvitations(): Promise<Invitation[]> {
  const response = await api.get("/users/invitations");
  const payload = response as any;
  const invites = payload.data || payload || [];
  return (Array.isArray(invites) ? invites : []).map((inv: any) => ({
    ...inv,
    status: (inv.status || "").toLowerCase()
  }));
}

export async function getRoles(): Promise<UserRole[]> {
  const response = await api.get("/roles");
  const roles = response as any;
  return Array.isArray(roles) ? roles : [];
}

export async function inviteUser(input: InviteUserInput): Promise<void> {
  await api.post("/users/invite", {
    ...input,
    email: input.email.trim().toLowerCase()
  });
}

export async function updateUserRole(
  userId: string,
  roleId: string
): Promise<AdminUser> {
  const response = await api.patch(`/users/${userId}/role`, { roleId });
  return normalizeUser(response as any);
}

export async function activateUser(userId: string): Promise<void> {
  await api.patch(`/users/${userId}/activate`);
}

export async function deactivateUser(userId: string): Promise<void> {
  await api.patch(`/users/${userId}/deactivate`);
}

export async function deleteUser(userId: string): Promise<void> {
  await api.delete(`/users/${userId}`);
}

export async function deleteExpiredInvite(email: string): Promise<void> {
  await api.delete(`/users/invitation/del?email=${encodeURIComponent(email)}`);
}
