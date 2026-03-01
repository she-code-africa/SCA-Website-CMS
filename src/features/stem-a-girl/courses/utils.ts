// src/features/stem-a-girl/courses/utils.ts
import type { SAGCourse } from "./types";

export function activityLabel(course: SAGCourse) {
  const a = course.activity as any;
  if (!a) return "—";
  if (typeof a === "string") return a;
  return a.title ?? a.name ?? "—";
}

export function activityId(course: SAGCourse) {
  const a = course.activity as any;
  if (!a) return "";
  return typeof a === "string" ? a : (a._id ?? "");
}
