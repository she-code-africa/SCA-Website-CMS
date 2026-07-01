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

export type ReportDownloadUser = {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  __v?: number;
  [key: string]: any;
};

export type ReportDownloadStats = {
  total: number;
  uniqueUsers?: number;
};