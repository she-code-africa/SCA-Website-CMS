import { api } from "@/lib/api/client";
import { sagUrl } from "@/lib/api/sag";
import type {
  SAGSchool,
  SAGSchoolUpsertInput,
  SAGSchoolsFilters
} from "./types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

function buildQuery(filters: SAGSchoolsFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getSAGSchools(
  filters: SAGSchoolsFilters = {}
): Promise<SAGSchool[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<SAGSchool> = await api.get(sagUrl(`/school${qs}`));
  return normalizeList<SAGSchool>(res);
}

export async function getSAGSchool(id: string): Promise<SAGSchool> {
  return api.get(sagUrl(`/school/${id}`));
}

export async function createSAGSchool(input: SAGSchoolUpsertInput) {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("description", input.description);
  if (input.image) fd.append("image", input.image);

  return api.post(sagUrl(`/school`), fd);
}

export async function editSAGSchool(payload: {
  id: string;
  data: Partial<SAGSchoolUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.name !== undefined) fd.append("name", d.name);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(sagUrl(`/school/${payload.id}`), fd);
}

export async function deleteSAGSchool(id: string) {
  return api.delete(sagUrl(`/school/${id}`));
}
