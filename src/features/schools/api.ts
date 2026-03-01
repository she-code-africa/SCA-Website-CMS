// src/features/schools/api.ts
import { api } from "@/lib/api/client";
import type {
  School,
  SchoolsFilters,
  SchoolUpsertInput
} from "@/features/schools/types";

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

function buildQuery(filters: SchoolsFilters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ============================
   SCHOOLS
============================ */

export async function getSchools(
  filters: SchoolsFilters = {}
): Promise<School[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<School> = await api.get(`/schools${qs}`);
  return normalizeList<School>(res);
}

export async function getSchool(id: string): Promise<School> {
  return api.get(`/schools/${id}`);
}

export async function createSchool(data: SchoolUpsertInput) {
  return api.post(`/schools`, data);
}

export async function editSchool(payload: {
  schoolId: string;
  data: Partial<SchoolUpsertInput>;
}) {
  return api.put(`/schools/${payload.schoolId}`, payload.data);
}

export async function deleteSchool(id: string) {
  return api.delete(`/schools/${id}`);
}
