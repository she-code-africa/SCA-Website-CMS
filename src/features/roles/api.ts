import { api } from "@/lib/api/client";
import type {
  RoleDetail,
  CreateRoleInput,
  UpdateRoleInput,
  PermissionKey
} from "./types";

function normalizeRole(role: Record<string, unknown>): RoleDetail {
  // Extract permissions: they could be an array of objects with 'name' or plain strings
  let permissions: string[] = [];
  const perms = role.permissions;
  if (Array.isArray(perms)) {
    permissions = perms
      .map((p) => {
        if (typeof p === "string") return p;
        if (p && typeof p === "object" && "name" in p)
          return (p as { name: string }).name;
        return "";
      })
      .filter(Boolean);
  }
  return {
    ...role,
    id: (role._id as string) || (role.id as string),
    permissions
  } as unknown as RoleDetail;
}

export async function getRoles(params?: {
  search?: string;
  type?: string;
}): Promise<RoleDetail[]> {
  const cleanParams = Object.fromEntries(
    Object.entries(params || {}).filter(([_, v]) => v !== "" && v != null)
  );
  try {
    const response = await api.get<{ data: Record<string, unknown>[] }>(
      "/roles",
      { params: cleanParams }
    );
    const rolesArray = Array.isArray(response)
      ? response
      : response?.data || [];
    return rolesArray.map(normalizeRole);
  } catch (error) {
    console.error("Roles API Error:", error);
    return [];
  }
}

export async function getRoleById(roleId: string): Promise<RoleDetail> {
  const response = await api.get<Record<string, unknown>>(`/roles/${roleId}`);
  return normalizeRole(response);
}

export async function getRoleByName(roleName: string): Promise<RoleDetail> {
  const response = await api.get<Record<string, unknown>>(
    `/roles/name/${roleName}`
  );
  return normalizeRole(response);
}

export async function getPermissions(): Promise<PermissionKey[]> {
  const response = await api.get<PermissionKey[]>("/permissions");
  return response || [];
}

export async function createRole(input: CreateRoleInput): Promise<RoleDetail> {
  const response = await api.post<Record<string, unknown>>("/roles", {
    name: input.name.trim(),
    description: input.description?.trim(),
    permissions: input.permissions
  });
  return normalizeRole(response);
}

export async function updateRole(
  id: string,
  input: UpdateRoleInput
): Promise<RoleDetail> {
  const response = await api.put<Record<string, unknown>>(
    `/roles/${id}`,
    input
  );
  return normalizeRole(response);
}

export async function deleteRole(id: string): Promise<void> {
  await api.delete(`/roles/${id}`);
}

export async function attachPermissions(
  id: string,
  permissions: string[]
): Promise<RoleDetail> {
  const response = await api.patch<Record<string, unknown>>(
    `/roles/${id}/permissions/attach`,
    { permissions }
  );
  return normalizeRole(response);
}

export async function detachPermissions(
  id: string,
  permissions: string[]
): Promise<RoleDetail> {
  const response = await api.patch<Record<string, unknown>>(
    `/roles/${id}/permissions/de-attach`,
    { permissions }
  );
  return normalizeRole(response);
}