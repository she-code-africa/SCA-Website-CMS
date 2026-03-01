// src/features/volunteers/api.ts
import { api } from "@/lib/api/client";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "@/features/volunteer-requests/types";

export async function getVolunteerRequests(): Promise<VolunteerRequest[]> {
  // interceptor returns response.data?.data ?? response.data
  return api.get(`/volunteer-request/`);
}

export async function getVolunteerRequest(
  id: string
): Promise<VolunteerRequest> {
  return api.get(`/volunteer-request/${id}`);
}

export async function updateVolunteerStatus(payload: {
  id: string;
  status: VolunteerStatus;
}) {
  return api.patch(`/volunteer-request/${payload.id}/status`, {
    status: payload.status
  });
}
