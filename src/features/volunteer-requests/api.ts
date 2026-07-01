// src/features/volunteer-requests/api.ts
import { api } from "@/lib/api/client";
import type {
  VolunteerRequest,
  VolunteerStatus
} from "./types";

export async function getVolunteerRequests(): Promise<VolunteerRequest[]> {
  return api.get("/volunteer-request");
}

export async function getVolunteerRequest(id: string): Promise<VolunteerRequest> {
  return api.get(`/volunteer-request/${id}`);
}

export async function updateVolunteerRequest(
  id: string,
  data: Partial<VolunteerRequest>
): Promise<VolunteerRequest> {
  return api.put(`/volunteer-request/${id}`, data);
}

// Convenience function to update only status
export async function updateVolunteerStatus(args: {
  id: string;
  status: VolunteerStatus;
}): Promise<VolunteerRequest> {
  return updateVolunteerRequest(args.id, { status: args.status });
}


export async function updateVolunteerStatusWithReason(args: {
  id: string;
  status: VolunteerStatus;
  reason?: string; 
}): Promise<VolunteerRequest> {
  return api.patch(`/volunteer-request/${args.id}/status`, {
    status: args.status,
    reason: args.reason, 
  });
}


// THIS ENDPOINT DOES NOT EXIST YET, BUT WE CAN IMPLEMENT IT IN THE FUTURE IF NEEDED
// export async function deleteVolunteerRequest(id: string): Promise<void> {
//   return api.delete(`/volunteer-request/${id}`);
// }