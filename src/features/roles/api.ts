// src/features/roles/api.ts
import type {
  RoleDetail,
  CreateRoleInput,
  UpdateRoleInput,
  RolesFilters
} from "./types";
import { getMockRoles, setMockRoles } from "./mock";
// import { api } from "@/lib/api/client";  ← uncomment when backend is ready

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getRoles(filters?: RolesFilters): Promise<RoleDetail[]> {
  await delay();
  // REAL: return api.get("/admin/roles", { params: filters });
  let list = getMockRoles();
  if (filters?.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }
  if (filters?.type === "default") list = list.filter((r) => r.isDefault);
  if (filters?.type === "custom") list = list.filter((r) => !r.isDefault);
  return list;
}

export async function createRole(input: CreateRoleInput): Promise<RoleDetail> {
  await delay(600);
  // REAL: return api.post("/admin/roles", input);
  const newRole: RoleDetail = {
    id: `role_custom_${Date.now()}`,
    name: input.name.trim(),
    description: input.description.trim(),
    isDefault: false,
    permissions: input.permissions,
    usersCount: 0,
    createdAt: new Date().toISOString()
  };
  setMockRoles([...getMockRoles(), newRole]);
  return newRole;
}

export async function updateRole(
  id: string,
  input: UpdateRoleInput
): Promise<RoleDetail> {
  await delay(500);
  // REAL: return api.patch(`/admin/roles/${id}`, input);
  const updated = getMockRoles().map((r) =>
    r.id !== id
      ? r
      : {
          ...r,
          name: input.name.trim(),
          description: input.description.trim(),
          permissions: input.permissions
        }
  );
  setMockRoles(updated);
  return updated.find((r) => r.id === id)!;
}

export async function deleteRole(id: string): Promise<void> {
  await delay(400);
  // REAL: return api.delete(`/admin/roles/${id}`);
  const role = getMockRoles().find((r) => r.id === id);
  if (role?.isDefault) throw new Error("Cannot delete a default system role.");
  if ((role?.usersCount ?? 0) > 0)
    throw new Error("Cannot delete a role that has users assigned to it.");
  setMockRoles(getMockRoles().filter((r) => r.id !== id));
}
