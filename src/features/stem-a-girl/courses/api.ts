// src/features/stem-a-girl/courses/api.ts

import { stemApi as api } from "@/lib/api/client";
import type { Course, CourseUpsertInput } from "./types";

// function toFormData(input: CourseUpsertInput): FormData {
//   const fd = new FormData();
//   fd.append("title", input.title);
//   if (input.slug) fd.append("slug", input.slug);
//   fd.append("description", input.description);
//   if (input.image) fd.append("image", input.image);
//   if (input.icon) fd.append("icon", input.icon);
//   if (input.difficulty) fd.append("difficulty", input.difficulty);
//   if (input.estimatedHours) fd.append("estimatedHours", input.estimatedHours);
//   if (input.link) fd.append("link", input.link);
//   if (input.featured !== undefined)
//     fd.append("featured", String(input.featured));
//   if (input.state) fd.append("state", input.state);
//   if (input.activity) fd.append("activity", input.activity);
//   if (input.modules) fd.append("modules", JSON.stringify(input.modules));
//   return fd;
// }

export async function getCourses(): Promise<Course[]> {
  const res = await api.get("/course");
  return Array.isArray(res) ? res : [];
}

export async function getCourse(id: string): Promise<Course> {
  return await api.get(`/course/${id}`);
}

export async function createCourse(input: CourseUpsertInput): Promise<Course> {
  // Send JSON, not FormData
  return await api.post("/course", input);
}

export async function updateCourse(id: string, input: CourseUpsertInput): Promise<Course> {
  return await api.put(`/course/${id}`, input);
}

export async function deleteCourse(id: string): Promise<void> {
  await api.delete(`/course/${id}`);
}