// src/features/enquiries/types.ts
export type EnquiryStatus = "open" | "closed";

export type Enquiry = {
  _id: string;
  fullName?: string;
  email?: string;
  description?: string;
  status?: EnquiryStatus;
  comment?: string;    
  createdAt?: string;
  updatedAt?: string;
};

export type EnquiryFilters = {
  search: string;
  status: "" | EnquiryStatus;
  sortBy: "" | "createdAt" | "updatedAt" | "fullName" | "email";
};
