// src/features/school-programs/api.ts
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

  // { data: [...] }
  if (Array.isArray(r?.data)) return r.data as T[];

  // { data: { data: [...] } }
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

export async function createSchoolProgram(input: SchoolProgramUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("cohort", String(input.cohort));
  fd.append("briefContent", input.briefContent);
  fd.append("extendedContent", input.extendedContent);
  fd.append("school", input.school);
  fd.append("link", input.link);
  if (input.image) fd.append("image", input.image);

  return api.post(`/school-programs`, fd);
}

export async function editSchoolProgram(payload: {
  id: string;
  data: Partial<SchoolProgramUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.cohort !== undefined) fd.append("cohort", String(d.cohort));
  if (d.briefContent !== undefined) fd.append("briefContent", d.briefContent);
  if (d.extendedContent !== undefined)
    fd.append("extendedContent", d.extendedContent);
  if (d.school !== undefined) fd.append("school", d.school);
  if (d.link !== undefined) fd.append("link", d.link);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(`/school-programs/${payload.id}`, fd);
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