// src/features/enquiries/api.ts
import { api } from "@/lib/api/client";
import type { Enquiry, EnquiryStatus } from "./types";

export async function getEnquiries(): Promise<Enquiry[]> {
  return (await api.get("/enquiry")) as Enquiry[];
}

export async function getEnquiry(id: string): Promise<Enquiry> {
  return (await api.get(`/enquiry/${id}`)) as Enquiry;
}

export async function updateEnquiryStatus(args: {
  id: string;
  status: EnquiryStatus;
}) {
  const { id, status } = args;
  return api.put(`/enquiry/${id}`, { status });
}
