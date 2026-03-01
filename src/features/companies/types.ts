// src/features/companies/types.ts
export type CompanyState = "active" | "archived";

export type Company = {
  _id: string;
  companyName: string;
  email: string;
  companyUrl?: string;
  companyPhone?: string;
  companyDescription?: string;
  companyLocation?: string;
  contactName?: string;
  state?: CompanyState;

  // Related jobs
  jobs?: any[];

  registeredDate?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type CompanyFilters = {
  search?: string;
  state?: "" | CompanyState;
  sortBy?: "" | "createdAt" | "updatedAt" | "companyName";
};

export type CompanyUpdateInput = {
  companyName: string;
  email: string;
  companyUrl: string;
  companyPhone: string;
  companyDescription: string;
  companyLocation: string;
  contactName: string;
};
