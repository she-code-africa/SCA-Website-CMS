import { api } from "@/lib/api/client";
import { sagUrl } from "@/lib/api/sag";
import type {
  SAGActivity,
  SAGActivitiesFilters,
  SAGActivityUpsertInput
} from "./types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

function buildQuery(filters: SAGActivitiesFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getSAGActivities(
  filters: SAGActivitiesFilters = {}
): Promise<SAGActivity[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<SAGActivity> = await api.get(
    sagUrl(`/activity${qs}`)
  );
  return normalizeList<SAGActivity>(res);
}

export async function getSAGActivity(id: string): Promise<SAGActivity> {
  return api.get(sagUrl(`/activity/${id}`));
}

export async function createSAGActivity(input: SAGActivityUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  if (input.image) fd.append("image", input.image);

  return api.post(sagUrl(`/activity`), fd);
}

export async function editSAGActivity(payload: {
  id: string;
  data: Partial<SAGActivityUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(sagUrl(`/activity/${payload.id}`), fd);
}

export async function deleteSAGActivity(id: string) {
  return api.delete(sagUrl(`/activity/${id}`));
}
