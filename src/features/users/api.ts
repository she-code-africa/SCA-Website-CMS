// src/features/users/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// All functions currently use mock data.
// When the backend is ready, replace each function body with the real api call.
// ───────────────────────────────────────────────────────────────────────────── 
import type {
  AdminUser,
  InviteUserInput,
  UpdateUserInput,
  UsersFilters
} from "./types";
import { MOCK_USERS, MOCK_ROLES } from "./mock";
// import { api } from "@/lib/api/client";    ← uncomment when backend is ready

// ── Helpers ──────────────────────────────────────────────────────────────────

function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms));
}

let _users = [...MOCK_USERS] as AdminUser[]; // Explicitly type the mutable store

// ── Queries ──────────────────────────────────────────────────────────────────

export async function getUsers(filters?: UsersFilters): Promise<AdminUser[]> {
  await delay();
  // REAL: return api.get("/admin/users", { params: filters });
  let list = [..._users];
  if (filters?.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }
  if (filters?.roleId) {
    list = list.filter((u) => u.role.id === filters.roleId);
  }
  if (filters?.status) {
    list = list.filter((u) => u.status === filters.status);
  }
  return list;
}

export async function getRolesForSelect() {
  await delay(200);
  // REAL: return api.get("/admin/roles/simple");
  return MOCK_ROLES;
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function inviteUser(input: InviteUserInput): Promise<void> {
  await delay(600);
  // REAL: return api.post("/admin/users/invite", input);
  const role = MOCK_ROLES.find((r) => r.id === input.roleId);
  if (!role) throw new Error("Role not found");
  const newUser: AdminUser = {
    id: `usr_${Date.now()}`,
    firstName: input.email.split("@")[0],
    lastName: "",
    email: input.email,
    role,
    status: "pending", // Valid status
    createdAt: new Date().toISOString()
  };
  _users = [..._users, newUser];
}

export async function updateUser(
  id: string,
  input: UpdateUserInput
): Promise<AdminUser> {
  await delay(500);
  // REAL: return api.patch(`/admin/users/${id}`, input);
  _users = _users.map((u) => {
    if (u.id !== id) return u;
    const role = input.roleId
      ? (MOCK_ROLES.find((r) => r.id === input.roleId) ?? u.role)
      : u.role;
    return { 
      ...u, 
      role, 
      status: (input.status as AdminUser["status"]) ?? u.status 
    };
  });
  return _users.find((u) => u.id === id)!;
}

export async function deactivateUser(id: string): Promise<void> {
  await delay(400);
  // REAL: return api.patch(`/admin/users/${id}/deactivate`);
  _users = _users.map((u) =>
    
    u.id === id ? { ...u, status: "deactivated" as const } : u
  );
}

export async function activateUser(id: string): Promise<void> {
  await delay(400);
  // REAL: return api.patch(`/admin/users/${id}/activate`);
  _users = _users.map((u) =>
    // Fixed: Using "active" status
    u.id === id ? { ...u, status: "active" as const } : u
  );
}

export async function deleteUser(id: string): Promise<void> {
  await delay(500);
  // REAL: return api.delete(`/admin/users/${id}`);
  _users = _users.filter((u) => u.id !== id);
}
