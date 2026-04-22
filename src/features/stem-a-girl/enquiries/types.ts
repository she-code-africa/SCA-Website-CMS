// src/features/stem-a-girl/enquiries/types.ts

export type EnquiryStatus = "open" | "closed";

export interface StemEnquiry {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  description: string;
  message?: string;
  date?: string; // ISO string
  status: EnquiryStatus;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type StemEnquiryUpsertInput = {
  fullName: string;
  email: string;
  subject: string;
  description: string;
  message?: string;
  status?: EnquiryStatus;
  comment?: string;
};

export interface StemEnquiryFilters {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}
