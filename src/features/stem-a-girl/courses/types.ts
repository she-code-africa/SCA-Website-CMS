// src/features/stem-a-girl/courses/types.ts

export type SAGCourseState = "draft" | "published";

export type SAGActivityRef =
  | string
  | {
      _id: string;
      title?: string;
      name?: string;
    };

export type SAGCourse = {
  _id: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;

  activity: SAGActivityRef;
  state?: SAGCourseState;

  createdAt?: string;
  updatedAt?: string;

  [key: string]: any;
};

export type SAGCoursesFilters = {
  search?: string;
  state?: "" | SAGCourseState;
  activity?: "" | string; // activity id
};

export type SAGCourseUpsertInput = {
  title: string;
  description: string;
  link: string;
  activity: string; // activity id
  state?: SAGCourseState;
  image?: File | null;
};
