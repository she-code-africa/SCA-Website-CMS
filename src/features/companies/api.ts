// src/features/companies/api.ts
import { api } from "@/lib/api/client";
import type { Company, CompanyUpdateInput } from "@/features/companies/types";

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
   COMPANIES
============================ */

export async function getCompanies(): Promise<Company[]> {
  const res: ApiListResponse<Company> = await api.get(`/company`);
  return normalizeList<Company>(res);
}

export async function getCompany(id: string): Promise<Company[]> {
  // Note: API returns array with single company
  return api.get(`/company/${id}`);
}

export async function editCompany(payload: {
  id: string;
  data: Partial<CompanyUpdateInput>;
}) {
  return api.put(`/company/${payload.id}`, payload.data);
}

export async function archiveCompany(id: string) {
  return api.patch(`/company/${id}/archive`);
}

export async function unarchiveCompany(id: string) {
  return api.patch(`/company/${id}/unarchive`);
}
