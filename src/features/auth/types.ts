
// src/features/auth/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Canonical types for the auth feature.
// All API responses in features/auth/api/api.ts are typed against these.
// ─────────────────────────────────────────────────────────────────────────────

// ── Login ─────────────────────────────────────────────────────────────────────
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: string;
  data: string; // Bearer token
};

// ── Permissions ───────────────────────────────────────────────────────────────
// Shape of a single permission object returned by GET /permissions
export type PermissionObject = {
  _id: string;
  name: string;          // e.g. "VIEW_DASHBOARD"
  action?: string;       // e.g. "manage" (newer format — present on CASL-style permissions)
  resource?: string;     // e.g. "users"
  description?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PermissionsResponse = {
  success: string;
  data: PermissionObject[];
};

// ── Invite ────────────────────────────────────────────────────────────────────
// GET /users/accept?token=xxx
export type InviteTokenStatus =
  | { valid: true;  email: string; name?: string }
  | { valid: false; expired: boolean; reason: string };

export type InviteVerifyResponse = {
  success: boolean | string;
  data?: {
    email?: string;
    name?: string;
    expiresAt?: string;
    isExpired?: boolean;
    // backend may use different field names — we normalise in api.ts
    [key: string]: unknown;
  };
  message?: string;
};

// POST /users/accept
export type AcceptInvitePayload = {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
};

// POST /users/decline
export type DeclineInvitePayload = {
  token: string;
};

// ── Authenticated User ────────────────────────────────────────────────────────
// The shape AuthContext exposes after hydration.
// Built from GET /permissions + JWT decode (until a /users/profile endpoint exists).
export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];          // raw array from GET /permissions
  permissionSet: Set<string>;     // O(1) lookup set — built from permissions
};