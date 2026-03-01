// src/features/volunteer-roles/dummy.ts
import type { VolunteerRole } from "./types";

export const VOLUNTEER_ROLES_DUMMY: VolunteerRole[] = [
  {
    _id: "vr_1",
    title: "Event Organizer",
    shortDescription:
      "Plan and coordinate community events, meetups, hackathons, and conferences across Africa.",
    skills: ["Organization", "Logistics", "Communication", "Creativity"],
    state: "published",
    position: 1,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "vr_2",
    title: "Mentor",
    shortDescription:
      "Support learners through structured mentorship, guidance, and accountability.",
    skills: ["Mentorship", "Empathy", "Feedback", "Time management"],
    state: "published",
    position: 2,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "vr_3",
    title: "Content Creator",
    shortDescription:
      "Create educational content, social posts, and community storytelling.",
    skills: ["Writing", "Design", "Consistency"],
    state: "draft",
    position: 3,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: "vr_4",
    title: "Community Moderator",
    shortDescription:
      "Help keep the community safe, inclusive, and well-managed across channels.",
    skills: ["Communication", "Conflict resolution", "Empathy"],
    state: "archived",
    position: 4,
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
