import { api } from "@/lib/api/client";
import { sagUrl } from "@/lib/api/sag";
import type {
  SAGCourse,
  SAGCoursesFilters,
  SAGCourseUpsertInput
} from "./types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

function buildQuery(filters: SAGCoursesFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.state) params.set("state", filters.state);
  if (filters.activity) params.set("activity", filters.activity);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getSAGCourses(
  filters: SAGCoursesFilters = {}
): Promise<SAGCourse[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<SAGCourse> = await api.get(sagUrl(`/course${qs}`));
  return normalizeList<SAGCourse>(res);
}

export async function getSAGCourse(id: string): Promise<SAGCourse> {
  return api.get(sagUrl(`/course/${id}`));
}

export async function createSAGCourse(input: SAGCourseUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("link", input.link);
  fd.append("activity", input.activity);
  fd.append("state", input.state ?? "draft");
  if (input.image) fd.append("image", input.image);

  return api.post(sagUrl(`/course`), fd);
}

export async function editSAGCourse(payload: {
  id: string;
  data: Partial<SAGCourseUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.link !== undefined) fd.append("link", d.link);
  if (d.activity !== undefined) fd.append("activity", d.activity);
  if (d.state !== undefined) fd.append("state", d.state);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(sagUrl(`/course/${payload.id}`), fd);
}

export async function deleteSAGCourse(id: string) {
  return api.delete(sagUrl(`/course/${id}`));
}
