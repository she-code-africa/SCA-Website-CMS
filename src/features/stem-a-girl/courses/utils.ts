// src/features/stem-a-girl/courses/utils.ts

import { format } from "date-fns";
import type { Course } from "./types";

// ─── Date formatting ─────────────────────────────────────────────────────
export function fmtDate(v?: string): string {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

// ─── Get initials from a title/string ────────────────────────────────────
export function getInitials(title?: string): string {
  const parts = (title ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

// ─── Activity helpers ────────────────────────────────────────────────────
export function getActivityId(course: Course): string {
  const act = course.activity;
  if (!act) return "";
  if (typeof act === "string") return act;
  return (act as any)._id ?? "";
}

export function getActivityName(
  course: Course,
  activityMap?: Map<string, string>
): string {
  const act = course.activity;
  if (!act) return "—";
  if (typeof act === "string") {
    return activityMap?.get(act) || act;
  }
  if (typeof act === "object" && "name" in act) return act.name;
  return "—";
}

// ─── Image compression (shared across features) ─────────────────────────
export async function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}
