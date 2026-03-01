// src/features/initiatives/api.ts
import { api } from "@/lib/api/client";
import type {
  Initiative,
  InitiativeUpsertInput
} from "@/features/initiatives/types";

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

/* ============================
   INITIATIVES
============================ */

export async function getInitiatives(): Promise<Initiative[]> {
  const res: ApiListResponse<Initiative> = await api.get(`/initiatives`);
  return normalizeList<Initiative>(res);
}

export async function getInitiative(id: string): Promise<Initiative> {
  return api.get(`/initiatives/${id}`);
}

export async function addInitiative(input: InitiativeUpsertInput) {
  const fd = new FormData();
  fd.append("title", input.title);
  fd.append("description", input.description);
  fd.append("initiative_url", input.initiative_url);
  fd.append("donation_url", input.donation_url);
  fd.append("isAvailable", String(input.isAvailable));
  if (input.image) fd.append("image", input.image);

  return api.post(`/initiatives`, fd);
}

export async function editInitiative(payload: {
  id: string;
  data: Partial<InitiativeUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.title !== undefined) fd.append("title", d.title);
  if (d.description !== undefined) fd.append("description", d.description);
  if (d.initiative_url !== undefined)
    fd.append("initiative_url", d.initiative_url);
  if (d.donation_url !== undefined) fd.append("donation_url", d.donation_url);
  if (d.isAvailable !== undefined)
    fd.append("isAvailable", String(d.isAvailable));
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(`/initiatives/${payload.id}`, fd);
}

export async function deleteInitiative(id: string) {
  return api.delete(`/initiatives/${id}`);
}
