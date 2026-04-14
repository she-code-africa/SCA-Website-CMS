// src/features/talent-requests/api.ts
import { api } from "@/lib/api/client";
import type { TalentRequest, TalentRequestStatus } from "./types";

// Create payload type (omit fields that are auto-generated)
export type CreateTalentRequestInput = Omit<
  TalentRequest,
  "_id" | "createdAt" | "updatedAt" | "status"
> & {
  status?: TalentRequestStatus;
};

// Update payload type (partial)
export type UpdateTalentRequestInput = Partial<CreateTalentRequestInput> & {
  status?: TalentRequestStatus;
};

// Get all
export async function getTalentRequests(): Promise<TalentRequest[]> {
  return (await api.get("/talent-request")) as TalentRequest[];
}

// Get single
export async function getTalentRequest(id: string): Promise<TalentRequest> {
  return (await api.get(`/talent-request/${id}`)) as TalentRequest;
}

// Create
export async function createTalentRequest(
  data: CreateTalentRequestInput
): Promise<TalentRequest> {
  return (await api.post("/talent-request", data)) as TalentRequest;
}

// Update (full or partial)
export async function updateTalentRequest(
  id: string,
  data: UpdateTalentRequestInput
): Promise<TalentRequest> {
  return (await api.put(`/talent-request/${id}`, data)) as TalentRequest;
}

export async function updateTalentRequestStatus(args: {
  id: string;
  status: TalentRequestStatus;
}): Promise<TalentRequest> {
  return await api.patch(`/talent-request/${args.id}/status`, {
    status: args.status
  });
}

// Delete
export async function deleteTalentRequest(id: string): Promise<void> {
  await api.delete(`/talent-request/${id}`);
}
