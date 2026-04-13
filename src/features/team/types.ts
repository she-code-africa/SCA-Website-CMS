// src/features/team/types.ts

export type TeamMemberState = "draft" | "archived" | "published";

export type TeamCategory = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  bio?: string; // Keep in response type as old data may have it
  image?: string | null;

  // list endpoint may return object or string; details endpoint returns object
  teamCategory: TeamCategory | string;

  state?: TeamMemberState;
  isLeader?: boolean;
  position?: number;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};

export type TeamMembersFilters = {
  search?: string;
  isLeader?: "" | "true" | "false";
  state?: "" | TeamMemberState;
  team?: "" | string;
};

export type UpdateTeamPositionsPayload = Array<{
  id: string;
  position: number;
}>;

export type TeamMemberUpsertInput = {
  name: string;
  role: string;
  // bio: string; // REMOVED - Backend doesn't accept this anymore
  teamCategory: string; // category id
  isLeader?: boolean;
  position: number;
  // image?: File | null;
  image?: string | null;   // base64 string, not File
};

export type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  roles?: any[];
  isActive?: boolean;

  createdAt?: string; // ISO string
  updatedAt?: string; // ISO string

  [key: string]: any;
};
