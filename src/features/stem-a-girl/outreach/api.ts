// src/features/stem-a-girl/outreach/api.ts

import { stemApi as api } from "@/lib/api/client";
import type { Outreach, OutreachUpsertInput } from "./types";

export async function getOutreaches(): Promise<Outreach[]> {
  const res = await api.get("/outreach");
  return Array.isArray(res) ? res : [];
}

export async function getOutreach(id: string): Promise<Outreach> {
  return await api.get(`/outreach/${id}`);
}

export async function createOutreach(
  input: OutreachUpsertInput
): Promise<Outreach> {
  return await api.post("/outreach", input);
}

export async function updateOutreach(
  id: string,
  input: OutreachUpsertInput
): Promise<Outreach> {
  return await api.put(`/outreach/${id}`, input);
}

export async function deleteOutreach(id: string): Promise<void> {
  await api.delete(`/outreach/${id}`);
}

// Fetch paginated images for an outreach (if needed separately)
export async function getOutreachImages(
  outreachId: string,
  page = 1,
  limit = 12
): Promise<{
  outreachId: string;
  state: string;
  outreachDate: string;
  galleryLink: string;
  totalImages: number;
  pagination: { page: number; limit: number; totalPages: number };
  images: string[];
}> {
  return await api.get(
    `/outreach/${outreachId}/images?page=${page}&limit=${limit}`
  );
}
