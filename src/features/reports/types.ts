// src/features/reports/types.ts
export type Report = {
  _id: string;
  year: string;
  link: string;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type ReportFilters = {
  search?: string;
  year?: "" | string;
  sortBy?: "" | "createdAt" | "updatedAt" | "year";
};

export type ReportUpsertInput = {
  year: string;
  link: string;
};
