// src/features/our-reach/api.ts
import { api } from "@/lib/api/client";
import type { Reach, ReachUpsertInput } from "@/features/our-reach/types";

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
   OUR REACH
============================ */

export async function getOurReach(): Promise<Reach[]> {
  const res: ApiListResponse<Reach> = await api.get(`/reach`);
  return normalizeList<Reach>(res);
}

export async function getReach(id: string): Promise<Reach> {
  return api.get(`/reach/${id}`);
}

export async function addReach(input: ReachUpsertInput) {
  return api.post(`/reach`, input);
}

export async function editReach(payload: {
  id: string;
  data: Partial<ReachUpsertInput>;
}) {
  return api.put(`/reach/${payload.id}`, payload.data);
}

export async function deleteReach(id: string) {
  return api.delete(`/reach/${id}`);
}