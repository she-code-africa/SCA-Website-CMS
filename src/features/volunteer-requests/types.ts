// src/features/volunteers/types.ts
export type VolunteerStatus = "Approved" | "Rejected" | "Pending";

export type VolunteerRequest = {
  _id: string;
  fullname: string;
  email: string;
  currentRole?: string;
  purpose?: string;
  volunteerRole?: string;
  status?: VolunteerStatus;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type VolunteerFilters = {
  search?: string;
  status?: "" | VolunteerStatus;
  volunteerRole?: "" | string;
  sortBy?: "" | "createdAt" | "updatedAt" | "fullname" | "email";
};
