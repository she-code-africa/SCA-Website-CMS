export type CourseState = "draft" | "published" | "archived";

export interface Lesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnail?: string;
  durationMinutes?: number;
  order: number;
  practiceTask?: string;
  resources?: Array<{ title: string; url: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Module {
  _id?: string;
  title: string;
  description: string;
  weekLabel?: string;
  order: number;
  estimatedMinutes?: number;
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  image?: string;
  icon?: string;
  difficulty?: string;
  estimatedHours?: string;
  link?: string;
  featured?: boolean;
  state?: CourseState;
  // activity?: string; // Activity ID (if linked)
  activity?: string | { _id: string; name: string; [key: string]: any };
  totalWeeks?: number;
  totalLessons?: number;
  totalDurationMinutes?: number;
  modules?: Module[];
  createdAt?: string;
  updatedAt?: string;
}

export type CourseUpsertInput = {
  title: string;
  slug?: string;
  description: string;
  image?: string;
  icon?: string;
  difficulty?: string;
  estimatedHours?: string;
  link: string;
  featured?: boolean;
  state?: CourseState;
  activity: string;
  modules?: Module[];
};

export interface CourseFilters {
  search?: string;
  state?: string;
  sortBy?: string;
  activity?: string; 
}
