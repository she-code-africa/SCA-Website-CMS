// src/features/talent-requests/types.ts
export type TalentRequestStatus = "Pending" | "Approved" | "Rejected";

export type TalentRequest = {
  _id: string;
  fullname?: string;
  email?: string;
  company?: string;
  companyLink?: string;
  jobRole?: string;
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
