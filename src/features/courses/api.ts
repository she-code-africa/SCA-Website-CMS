import { api } from "@/lib/api/client";
import type {
  Course,
  CoursesFilters,
  // CourseUpsertInput
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

// Now accepts a JSON object – image is an optional base64 string
export async function createCourse(payload: {
  name: string;
  shortDescription: string;
  school: string;
  applicationLink: string;
  image?: string; // base64
}) {
  return api.post(`/courses`, payload);
}

export async function editCourse(payload: {
  id: string;
  data: {
    name?: string;
    shortDescription?: string;
    school?: string;
    applicationLink?: string;
    image?: string;         
  };
}) {
  return api.put(`/courses/${payload.id}`, payload.data);
}

export async function deleteCourse(id: string) {
  return api.delete(`/courses/${id}`);
}
