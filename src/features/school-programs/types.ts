// src/features/school-programs/types.ts

export type SchoolProgramState = "draft" | "archived" | "published";

export type SchoolProgram = {
  _id: string;
  title: string;
  cohort: string | number;
  briefContent: string;
  extendedContent: string;
  school?: {
    _id: string;
    name: string;
  } | string;
  state?: SchoolProgramState;
  link: string;
  image?: string | null;
  publishDate?: string; // ISO string
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type SchoolProgramsFilters = {
  search?: string;
  state?: "" | SchoolProgramState;
  school?: "" | string;
};

export type SchoolProgramUpsertInput = {
  title: string;
  cohort: string | number;
  briefContent: string;
  extendedContent: string;
  school: string; // school id
  link: string;
  image: string | null;
};