// src/features/stem-a-girl/shared/types.ts

export type LearnerStatus = "Active" | "Completed" | "Inactive";
export type AgeRange = "10-13" | "14-17" | "18-21";

// One learner. The Participants page shows all of them,
// the Consent page only uses the ones under 18.
export type Learner = {
  _id: string;
  name: string;
  username: string;
  email: string;
  course: string;
  completedCourse: string | null;
  completedCourseDate: string | null;
  ageRange: AgeRange;
  age: number;
  country: string;
  status: LearnerStatus;
  enrolledDate: string; // YYYY-MM-DD
  completionDate: string | null; // YYYY-MM-DD
  completion: number; // 0 - 100
};
