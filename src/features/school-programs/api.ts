import { api } from "@/lib/api/client";
import type {
  SchoolProgram,
  SchoolProgramsFilters,
  SchoolProgramUpsertInput
} from "@/features/school-programs/types";

/* ============================
  Helpers
============================ */

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

function buildQuery(filters: SchoolProgramsFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.state) params.set("state", filters.state);
  if (filters.school) params.set("school", filters.school);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ============================
  SCHOOL PROGRAMS
============================ */

export async function getSchoolPrograms(
  filters: SchoolProgramsFilters = {}
): Promise<SchoolProgram[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<SchoolProgram> = await api.get(
    `/school-programs${qs}`
  );
  return normalizeList<SchoolProgram>(res);
}

export async function getSchoolProgram(id: string): Promise<SchoolProgram> {
  return api.get(`/school-programs/${id}`);
}

// CREATE – now sends JSON, image is a base64 string
export async function createSchoolProgram(input: SchoolProgramUpsertInput) {
  return api.post(`/school-programs`, input); // plain JSON object
}

// EDIT – now sends JSON, image is a base64 string
export async function editSchoolProgram(payload: {
  id: string;
  data: Partial<SchoolProgramUpsertInput>;
}) {
  return api.put(`/school-programs/${payload.id}`, payload.data);
}

export async function publishSchoolProgram(id: string) {
  return api.put(`/school-programs/${id}/publish`);
}

export async function archiveSchoolProgram(id: string) {
  return api.put(`/school-programs/${id}/unpublish`);
}

export async function deleteSchoolProgram(id: string) {
  return api.delete(`/school-programs/${id}`);
}
