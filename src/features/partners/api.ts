// src/features/partners/api.ts
import { api } from "@/lib/api/client";
import type { Partner, PartnerUpsertInput } from "@/features/partners/types";

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
   PARTNERS
============================ */

export async function getPartners(): Promise<Partner[]> {
  const res: ApiListResponse<Partner> = await api.get(`/partners`);
  return normalizeList<Partner>(res);
}

export async function getPartner(id: string): Promise<Partner> {
  return api.get(`/partners/${id}`);
}

export async function addPartner(input: PartnerUpsertInput) {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("featured", String(input.featured));
  if (input.image) fd.append("image", input.image);

  return api.post(`/partners`, fd);
}

export async function editPartner(payload: {
  id: string;
  data: Partial<PartnerUpsertInput>;
}) {
  const fd = new FormData();
  const d = payload.data;

  if (d.name !== undefined) fd.append("name", d.name);
  if (d.featured !== undefined) fd.append("featured", String(d.featured));
  if (d.image !== undefined && d.image !== null) fd.append("image", d.image);

  return api.put(`/partners/${payload.id}`, fd);
}

export async function deletePartner(id: string) {
  return api.delete(`/partners/${id}`);
}
