import { CourseModule, Lesson } from "../../types";

export type CourseFormValues = {
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  estimatedHours: string;
  state: string;
  image: File | null;
};


export const defaultLesson = (): Lesson => ({
  title: "",
  description: "",
  videoUrl: "",
  thumbnail: "",
  durationMinutes: "",
  order: "",
  // isPreview: false,
  practiceTask: "",
  resources: [],
});

export const defaultModule = (): CourseModule => ({
  title: "",
  description: "",
  weekLabel: "",
  order: "",
  estimatedMinutes: "",
  lessons: [defaultLesson()],
});

export const initialValues: CourseFormValues = {
  title: "",
  slug: "",
  description: "",
  difficulty: "",
  estimatedHours: "",
  state: "",
  image: null as File | null,
};
