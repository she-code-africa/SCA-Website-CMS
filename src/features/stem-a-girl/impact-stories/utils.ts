// src/features/stem-a-girl/impact-stories/utils.ts

import { format } from "date-fns";
import type { ImpactStory } from "./types";

export function fmtDate(v?: string): string {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "—";
  return format(d, "dd MMM, yyyy");
}

export function getInitials(name?: string): string {
  const parts = (name ?? "").trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase() || "?";
}

export function getSchoolId(story: ImpactStory): string {
  const s = story.school;
  if (!s) return "";
  if (typeof s === "string") return s;
  return s._id ?? "";
}

export function getSchoolName(
  story: ImpactStory,
  schoolMap: Map<string, string>
): string {
  const s = story.school;
  if (!s) return "—";
  if (typeof s === "string") return schoolMap.get(s) || s;
  return s.name ?? "—";
}

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
        let width = img.width,
          height = img.height;
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
