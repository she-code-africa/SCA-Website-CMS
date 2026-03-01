// src/features/team/api.ts
import { api } from "@/lib/api/client";
import type {
  TeamCategory,
  TeamMember,
  TeamMembersFilters,
  TeamMemberUpsertInput,
  UpdateTeamPositionsPayload,
  User
} from "@/features/team/types";

/* ============================
   Helpers
============================ */

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];

  const r = res as any;

  // { data: [...] }
  if (Array.isArray(r?.data)) return r.data as T[];

  // { data: { data: [...] } }
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];

  return [];
}

function buildQuery(filters: TeamMembersFilters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.isLeader) params.set("isLeader", filters.isLeader);
  if (filters.state) params.set("state", filters.state);
  if (filters.team) params.set("team", filters.team);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ============================
   TEAM MEMBERS
============================ */

// MAIN LIST FUNCTION (old: getMembers / getTeams)
export async function getMembers(
  filters: TeamMembersFilters = {}
): Promise<TeamMember[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<TeamMember> = await api.get(`/teams/members${qs}`);
  return normalizeList<TeamMember>(res);
}

// Backward-compatibility aliases
export const getTeams = getMembers;
export const getTeamMembers = getMembers;

export async function getTeamMember(
  catId: string,
  id: string
): Promise<TeamMember> {
  return api.get(`/teams/categories/${catId}/members/${id}`);
}


export async function addTeamMember(input: TeamMemberUpsertInput) {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("teamCategory", input.teamCategory);
  fd.append("role", input.role);
  // fd.append("bio", input.bio); // REMOVED - Backend doesn't accept bio anymore
  fd.append("position", String(Number(input.position ?? 0)));
  // fd.append("isLeader", String(!!input.isLeader));
  if (input.image) fd.append("image", input.image);

  return api.post(`/teams/members`, fd);
}

export async function editTeamMember(payload: {
  id: string;
  catId: string;
  data: Partial<TeamMemberUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.name !== undefined) fd.append("name", d.name);
  if (d.teamCategory !== undefined) fd.append("teamCategory", d.teamCategory);
  if (d.role !== undefined) fd.append("role", d.role);
  if (d.bio !== undefined) fd.append("bio", d.bio);
  if (d.position !== undefined)
    fd.append("position", String(Number(d.position)));
  if (d.isLeader !== undefined) fd.append("isLeader", String(!!d.isLeader));
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(
    `/teams/categories/${payload.catId}/members/${payload.id}`,
    fd
  );
}

export async function publishTeamMember(payload: {
  catId: string;
  id: string;
}) {
  return api.patch(
    `/teams/categories/${payload.catId}/members/${payload.id}/publish`
  );
}

export async function archiveTeamMember(payload: {
  catId: string;
  id: string;
}) {
  return api.patch(
    `/teams/categories/${payload.catId}/members/${payload.id}/archive`
  );
}

export async function deleteTeamMember(payload: { catId: string; id: string }) {
  return api.delete(`/teams/categories/${payload.catId}/members/${payload.id}`);
}

export async function updateTeamPositions(payload: UpdateTeamPositionsPayload) {
  return api.patch(`/teams/members/positions`, payload);
}

/* ============================
    TEAM CATEGORIES
============================ */

export async function getTeamCategories(): Promise<TeamCategory[]> {
  const res: ApiListResponse<TeamCategory> = await api.get(`/teams/categories`);
  return normalizeList<TeamCategory>(res);
}

export async function addTeamCategory(payload: { name: string }) {
  return api.post(`/teams/categories`, payload);
}

// matches your legacy service exactly
export async function editTeamCategories(payload: {
  catId: string;
  name: string | { name: string };
}) {
  return api.put(`/teams/categories/${payload.catId}`, payload.name);
}

export async function deleteTeamCategory(id: string) {
  return api.delete(`/teams/categories/${id}`);
}

/* ============================
    USERS (RESTORED)
============================ */

export async function getUsers(): Promise<User[]> {
  const res: ApiListResponse<User> = await api.get(`/users`);
  return normalizeList<User>(res);
}
