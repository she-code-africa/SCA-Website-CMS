// src/features/volunteer-roles/types.ts
export type VolunteerRole = {
  _id: string;
  name: string;
  description: string;
  skills: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type VolunteerRoleFilters = {
  search: string;
  // keep but don't render until backend supports it
  // state: "all" | "active" | "inactive" | "archived";
};
