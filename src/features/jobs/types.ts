// src/features/jobs/types.ts
export type JobState = "draft" | "published" | "archived";

export type JobCategory = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobType = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Job = {
  _id: string;
  title: string;
  description: string;
  deadline: string; // ISO string
  minimumExperience?: string;
  applicationLink: string;
  salaryCurrency?: string;
  salaryRange?: string;
  location: string;
  state?: JobState;

  // References
  jobType?: JobType | string;
  jobCategory?: JobCategory | string;

  // Company info (either regular or guest post)
  guestPost?: boolean;
  guestPostMetaData?: {
    companyName?: string;
    companyEmail?: string;
    companyUrl?: string;
  };
  company?: {
    companyName?: string;
    email?: string;
    companyUrl?: string;
  };

  publishedDate?: string;
  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type JobFilters = {
  search?: string;
  state?: "" | JobState;
  jobType?: "" | string;
  jobCategory?: "" | string;
  sortBy?: "" | "createdAt" | "updatedAt" | "deadline" | "title";
};

export type JobUpsertInput = {
  title: string;
  description: string;
  deadline: string;
  minimumExperience: string;
  applicationLink: string;
  salaryCurrency: string;
  salaryRange: string;
  location: string;
  jobType: string;
  jobCategory: string;
  guestPost: boolean;
  companyProfileId?: string; 
  guestPostMetaData?: {
    companyName: string;
    companyEmail: string;
    companyUrl: string;
  };
  company?: {
    companyName: string;
    email: string;
    companyUrl: string;
  };
};
