// src/features/users/mock.ts
// ─────────────────────────────────────────────────────────────────────────────
// Mock data used until the backend RBAC API is ready.
// Swap api.ts functions to real endpoints when the backend ships.
// ─────────────────────────────────────────────────────────────────────────────
import type { AdminUser } from "./types";

export const MOCK_ROLES = [
  { id: "role_administrator", name: "Administrator", isDefault: true },
  { id: "role_program_manager", name: "Program Manager", isDefault: true },
  { id: "role_viewer", name: "Viewer", isDefault: true },
  { id: "role_auditor", name: "Auditor", isDefault: true }
];

export const MOCK_USERS: AdminUser[] = [
  {
    id: "usr_001",
    firstName: "Glory",
    lastName: "Okafor",
    email: "glory.okafor@shecodeafrica.org",
    role: { id: "role_administrator", name: "Administrator", isDefault: true },
    status: "active",
    lastLogin: "2026-02-28T09:14:00Z",
    createdAt: "2024-01-10T08:00:00Z"
  },
  {
    id: "usr_002",
    firstName: "Chidinma",
    lastName: "Eze",
    email: "chidinma.eze@shecodeafrica.org",
    role: {
      id: "role_program_manager",
      name: "Program Manager",
      isDefault: true
    },
    status: "active",
    lastLogin: "2026-02-27T14:30:00Z",
    createdAt: "2024-03-05T10:00:00Z"
  },
  {
    id: "usr_003",
    firstName: "Ngozi",
    lastName: "Adeyemi",
    email: "ngozi.adeyemi@shecodeafrica.org",
    role: { id: "role_viewer", name: "Viewer", isDefault: true },
    status: "active",
    lastLogin: "2026-02-25T11:00:00Z",
    createdAt: "2024-05-12T09:00:00Z"
  },
  {
    id: "usr_004",
    firstName: "Blessing",
    lastName: "Nwachukwu",
    email: "blessing.nwachukwu@shecodeafrica.org",
    role: { id: "role_auditor", name: "Auditor", isDefault: true },
    status: "active",
    lastLogin: "2026-02-20T16:45:00Z",
    createdAt: "2024-07-01T08:30:00Z"
  },
  {
    id: "usr_005",
    firstName: "Fatima",
    lastName: "Bello",
    email: "fatima.bello@shecodeafrica.org",
    role: {
      id: "role_program_manager",
      name: "Program Manager",
      isDefault: true
    },
    status: "inactive",
    lastLogin: "2025-11-10T10:00:00Z",
    createdAt: "2023-11-20T08:00:00Z"
  },
  {
    id: "usr_006",
    firstName: "Ifeoma",
    lastName: "Okonkwo",
    email: "ifeoma.okonkwo@shecodeafrica.org",
    role: { id: "role_viewer", name: "Viewer", isDefault: true },
    status: "pending",
    createdAt: "2026-02-26T12:00:00Z"
  },
  {
    id: "usr_007",
    firstName: "Kemi",
    lastName: "Afolabi",
    email: "kemi.afolabi@shecodeafrica.org",
    role: {
      id: "role_program_manager",
      name: "Program Manager",
      isDefault: true
    },
    status: "active",
    lastLogin: "2026-02-28T08:00:00Z",
    createdAt: "2025-01-15T09:00:00Z"
  },
  {
    id: "usr_008",
    firstName: "Temi",
    lastName: "Adewale",
    email: "temi.adewale@shecodeafrica.org",
    role: { id: "role_auditor", name: "Auditor", isDefault: true },
    status: "pending",
    createdAt: "2026-02-28T15:00:00Z"
  }
];
