// src/features/talent-requests/types.ts
export type TalentRequestStatus = "Pending" | "Open" | "Closed" | "Archived";

export type TalentRequest = {
  _id: string;
  fullname?: string;
  email?: string;
  company?: string;
  companyLink?: string;
  role?: string;
  github?: string;
  linkedin?: string;
  jobRole?: string;
  portfolio?: string;
  skills?: string[];
  experienceLevel?: string;
  jobDescription?: string;
  status?: TalentRequestStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type TalentRequestFilters = {
  search?: string;
  status?: "" | TalentRequestStatus;
  experienceLevel?: "" | string; // backend currently uses "speaker" etc (free text)
  sortBy?: "" | "createdAt" | "updatedAt" | "fullname" | "email";
};
