import { api } from "@/lib/api/client";
import type {
  Initiative,
  // InitiativeUpsertInput
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

// Now accepts a JSON object – image is an optional base64 string
export async function addInitiative(payload: {
  title: string;
  description: string;
  initiative_url: string;
  donation_url: string;
  isAvailable: boolean;
  image?: string; // base64
}) {
  return api.post(`/initiatives`, payload);
}

export async function editInitiative(payload: {
  id: string;
  data: {
    title?: string;
    description?: string;
    initiative_url?: string;
    donation_url?: string;
    isAvailable?: boolean;
    image?: string; // base64, optional
  };
}) {
  return api.put(`/initiatives/${payload.id}`, payload.data);
}

export async function deleteInitiative(id: string) {
  return api.delete(`/initiatives/${id}`);
}
