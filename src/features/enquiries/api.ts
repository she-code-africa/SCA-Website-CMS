// // src/features/enquiries/api.ts
import { api } from "@/lib/api/client";
import type { Enquiry, EnquiryStatus } from "./types";

export async function getEnquiries(): Promise<Enquiry[]> {
  return await api.get("/enquiry");
}

export async function getEnquiry(id: string): Promise<Enquiry> {
  return await api.get(`/enquiry/${id}`);
}

// Update full enquiry (including status and comment)
export async function updateEnquiry(
  id: string,
  data: { status?: EnquiryStatus; comment?: string }
) {
  return await api.put(`/enquiry/${id}`, data);
}

// Convenience for status + comment
export async function updateEnquiryStatus(args: {
  id: string;
  status: EnquiryStatus;
  comment?: string;
}) {
  const { id, status, comment } = args;
  return await updateEnquiry(id, { status, comment });
}

// Create (if needed) – but not used in current UI
export async function createEnquiry(data: Partial<Enquiry>) {
  return await api.post("/enquiry", data);
}