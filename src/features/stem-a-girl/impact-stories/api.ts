// src/features/stem-a-girl/impact-stories/api.ts

import { stemApi as api } from "@/lib/api/client";
import type { ImpactStory, ImpactStoryUpsertInput } from "./types";

export async function getImpactStories(): Promise<ImpactStory[]> {
  const res = await api.get("/impactStory");
  // The interceptor unwraps { data: [...] } so res is the array
  return Array.isArray(res) ? res : [];
}

export async function getImpactStory(id: string): Promise<ImpactStory> {
  return await api.get(`/impactStory/${id}`);
}

export async function createImpactStory(
  input: ImpactStoryUpsertInput
): Promise<ImpactStory> {
  return await api.post("/impactStory", input);
}

export async function updateImpactStory(
  id: string,
  input: ImpactStoryUpsertInput
): Promise<ImpactStory> {
  return await api.put(`/impactStory/${id}`, input);
}

export async function deleteImpactStory(id: string): Promise<void> {
  await api.delete(`/impactStory/${id}`);
}

export async function publishImpactStory(id: string): Promise<ImpactStory> {
  return await api.patch(`/impactStory/${id}/publish`);
}

export async function archiveImpactStory(id: string): Promise<ImpactStory> {
  return await api.patch(`/impactStory/${id}/archive`);
}
