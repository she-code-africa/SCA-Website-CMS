// src/features/talent-requests/api.ts
import { api } from "@/lib/api/client";
import type { TalentRequest, TalentRequestStatus } from "./types";

export async function getTalentRequests(): Promise<TalentRequest[]> {
  // api.get returns response.data?.data ?? response.data
  // If backend returns { success, data: [...] }, interceptor returns the `data` array.
  return (await api.get("/talent-request")) as TalentRequest[];
}

export async function getTalentRequest(id: string): Promise<TalentRequest> {
  return (await api.get(`/talent-request/${id}`)) as TalentRequest;
}

// optional (keep for later)
export async function updateTalentRequestStatus(args: {
  id: string;
  status: TalentRequestStatus;
}) {
  const { id, status } = args;
  return api.put(`/talent-request/${id}`, { status });
}
