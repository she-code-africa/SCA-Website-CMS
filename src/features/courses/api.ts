// src/features/courses/api.ts
import { api } from "@/lib/api/client";
import type {
  Course,
  CoursesFilters,
  CourseUpsertInput
} from "@/features/courses/types";

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

function buildQuery(filters: CoursesFilters) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set("search", filters.search.trim());
  if (filters.school) params.set("school", filters.school);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/* ============================
   COURSES
============================ */

export async function getCourses(
  filters: CoursesFilters = {}
): Promise<Course[]> {
  const qs = buildQuery(filters);
  const res: ApiListResponse<Course> = await api.get(`/courses${qs}`);
  return normalizeList<Course>(res);
}

export async function getCourse(id: string): Promise<Course> {
  return api.get(`/courses/${id}`);
}

export async function createCourse(input: CourseUpsertInput) {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("shortDescription", input.shortDescription);
  fd.append("school", input.school);
  fd.append("applicationLink", input.applicationLink);
  if (input.image) fd.append("image", input.image);

  return api.post(`/courses`, fd);
}

export async function editCourse(payload: {
  id: string;
  data: Partial<CourseUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.name !== undefined) fd.append("name", d.name);
  if (d.shortDescription !== undefined)
    fd.append("shortDescription", d.shortDescription);
  if (d.school !== undefined) fd.append("school", d.school);
  if (d.applicationLink !== undefined)
    fd.append("applicationLink", d.applicationLink);
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(`/courses/${payload.id}`, fd);
}

export async function deleteCourse(id: string) {
  return api.delete(`/courses/${id}`);
}