// src/features/courses/types.ts

export type Course = {
  _id: string;
  name: string;
  shortDescription: string;
  school?: {
    _id: string;
    name: string;
  } | string;
  applicationLink: string;
  image?: string | null;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type CoursesFilters = {
  search?: string;
  school?: "" | string;
};

export type CourseUpsertInput = {
  name: string;
  shortDescription: string;
  school: string; // school id
  applicationLink: string;
  image?: File | null;
};