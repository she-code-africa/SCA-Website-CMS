// src/features/volunteer-roles/api.ts
import { api } from "@/lib/api/client";
import type { VolunteerRole } from "./types";

function toFormData(input: {
  name: string;
  description: string;
  skills: string[];
  image?: File | null;
}) {
  const fd = new FormData();
  fd.append("name", input.name);
  fd.append("description", input.description);
  fd.append("skills", JSON.stringify(input.skills ?? []));
  if (input.image) fd.append("image", input.image);
  return fd;
}

export async function getVolunteerRoles(): Promise<VolunteerRole[]> {
  // interceptor returns response.data.data -> [] (array)
  return (await api.get("/volunteer-role")) as VolunteerRole[];
}

export async function getVolunteerRole(id: string): Promise<VolunteerRole> {
  return (await api.get(`/volunteer-role/${id}`)) as VolunteerRole;
}

export async function createVolunteerRole(payload: {
  name: string;
  description: string;
  skills: string[];
  image?: File | null;
}): Promise<VolunteerRole> {
  return (await api.post(
    "/volunteer-role",
    toFormData(payload)
  )) as VolunteerRole;
}

export async function updateVolunteerRole(args: {
  id: string;
  data: {
    name: string;
    description: string;
    skills: string[];
    image?: File | null;
  };
}): Promise<VolunteerRole> {
  return (await api.put(
    `/volunteer-role/${args.id}`,
    toFormData(args.data)
  )) as VolunteerRole;
}

export async function deleteVolunteerRole(id: string) {
  return api.delete(`/volunteer-role/${id}`);
}
