// src/features/partners/api.ts

import { api } from "@/lib/api/client";
import type { Partner, PartnerUpsertInput } from "@/features/partners/types";

type ApiListResponse<T> = T[] | { data?: T[] } | { data?: { data?: T[] } };

function normalizeList<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  const r = res as any;
  if (Array.isArray(r?.data)) return r.data as T[];
  if (Array.isArray(r?.data?.data)) return r.data.data as T[];
  return [];
}

/* ============================
   PARTNERS
============================ */

export async function getPartners(): Promise<Partner[]> {
  const res: ApiListResponse<Partner> = await api.get(`/partners`);
  return normalizeList<Partner>(res);
}

export async function getPartner(id: string): Promise<Partner> {
  return api.get(`/partners/${id}`);
}

// export async function addPartner(input: PartnerUpsertInput) {
//   // Send JSON, not FormData
//   return api.post(`/partners`, input);
// }

// export async function editPartner(payload: {
//   id: string;
//   data: Partial<PartnerUpsertInput>;
// }) {
//   return api.put(`/partners/${payload.id}`, payload.data);
// }

export async function addPartner(input: FormData) {
  return api.post(`/partners`, input, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function editPartner(payload: { id: string; data: FormData }) {
  return api.put(`/partners/${payload.id}`, payload.data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
}

export async function deletePartner(id: string) {
  return api.delete(`/partners/${id}`);
}
