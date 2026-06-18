// // src/features/volunteer-roles/api.ts
// import { api } from "@/lib/api/client";
// import type { VolunteerRole } from "./types";

// function toFormData(input: {
//   name: string;
//   description: string;
//   skills: string[];
//   image?: File | null;
// }) {
//   const fd = new FormData();
//   fd.append("name", input.name);
//   fd.append("description", input.description);
//   fd.append("skills", JSON.stringify(input.skills ?? []));
//   if (input.image) fd.append("image", input.image);
//   return fd;
// }

// export async function getVolunteerRoles(): Promise<VolunteerRole[]> {
//   // interceptor returns response.data.data -> [] (array)
//   return (await api.get("/volunteer-role")) as VolunteerRole[];
// }

// export async function getVolunteerRole(id: string): Promise<VolunteerRole> {
//   return (await api.get(`/volunteer-role/${id}`)) as VolunteerRole;
// }

// export async function createVolunteerRole(payload: {
//   name: string;
//   description: string;
//   skills: string[];
//   image?: File | null;
// }): Promise<VolunteerRole> {
//   return (await api.post(
//     "/volunteer-role",
//     toFormData(payload)
//   )) as VolunteerRole;
// }

// export async function updateVolunteerRole(args: {
//   id: string;
//   data: {
//     name: string;
//     description: string;
//     skills: string[];
//     image?: File | null;
//   };
// }): Promise<VolunteerRole> {
//   return (await api.put(
//     `/volunteer-role/${args.id}`,
//     toFormData(args.data)
//   )) as VolunteerRole;
// }

// export async function deleteVolunteerRole(id: string) {
//   return api.delete(`/volunteer-role/${id}`);
// }



import { api } from "@/lib/api/client";
import type { VolunteerRole } from "./types";

export async function getVolunteerRoles(): Promise<VolunteerRole[]> {
  return (await api.get("/volunteer-role")) as VolunteerRole[];
}

export async function getVolunteerRole(id: string): Promise<VolunteerRole> {
  return (await api.get(`/volunteer-role/${id}`)) as VolunteerRole;
}

export async function createVolunteerRole(payload: {
  name: string;
  description: string;
  skills: string[];
  image?: string; // only string, never null or empty object
}): Promise<VolunteerRole> {
  const body: any = {
    name: payload.name,
    description: payload.description,
    skills: JSON.stringify(payload.skills),
  };
  if (payload.image) {
    body.image = payload.image;
  }
  return (await api.post("/volunteer-role", body)) as VolunteerRole;
}

export async function updateVolunteerRole(args: {
  id: string;
  data: {
    name: string;
    description: string;
    skills: string[];
    image?: string;
  };
}): Promise<VolunteerRole> {
  const body: any = {
    name: args.data.name,
    description: args.data.description,
    skills: JSON.stringify(args.data.skills)
  };
  if (args.data.image !== undefined) {
    body.image = args.data.image;
  }
  return (await api.put(`/volunteer-role/${args.id}`, body)) as VolunteerRole;
}
export async function deleteVolunteerRole(id: string) {
  return api.delete(`/volunteer-role/${id}`);
}