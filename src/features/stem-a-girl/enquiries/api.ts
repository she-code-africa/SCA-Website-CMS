// src/features/stem-a-girl/enquiries/api.ts

import { stemApi as api } from "@/lib/api/client";
import type { StemEnquiry, StemEnquiryUpsertInput } from "./types";

export async function getStemEnquiries(): Promise<StemEnquiry[]> {
  const res = await api.get("/enquiry");
  return Array.isArray(res) ? res : [];
}

export async function getStemEnquiry(id: string): Promise<StemEnquiry> {
  return await api.get(`/enquiry/${id}`);
}

export async function createStemEnquiry(
  input: StemEnquiryUpsertInput
): Promise<StemEnquiry> {
  return await api.post("/enquiry", input);
}

export async function updateStemEnquiry(
  id: string,
  input: StemEnquiryUpsertInput
): Promise<StemEnquiry> {
  return await api.put(`/enquiry/${id}`, input);
}

export async function deleteStemEnquiry(id: string): Promise<void> {
  await api.delete(`/enquiry/${id}`);
}
