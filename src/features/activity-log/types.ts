// // src/features/activity-log/types.ts
// export interface AuditLogUser {
//   _id: string;
//   email: string;
// }

// export interface AuditLogEntry {
//   _id: string;
//   user: AuditLogUser;
//   module: string;
//   action: string;
//   affectedResource: string;
//   method: string;
//   path: string;
//   timestamp: string;
//   __v?: number;
// }

// export interface AuditLogPayload {
//   success: boolean;
//   data: AuditLogEntry[];
//   pagination: {
//     total: number;
//     page: number;
//     totalPages: number;
//   };
// }

// // Re-export for backward compatibility (if needed)
// export type ActivityLogRow = AuditLogEntry;
// export type ActivityLogPayload = AuditLogPayload;



// src/features/activity-log/types.ts

export interface AuditLogUser {
  _id: string;
  email: string;
}

/** Raw shape from the API */
export interface RawAuditLogEntry {
  _id: string;
  user?: AuditLogUser;          // absent for system-generated entries
  action: "CREATE" | "UPDATE" | "DELETE" | string;
  affectedResource: string;     // e.g. "IDENTITY" or "IDENTITY:69d8f785..."
  timestamp: string;
  __v?: number;
}

/** Normalised shape consumed by the UI */
export interface AuditLogEntry {
  id: string;
  user: AuditLogUser | null;    // null = system / unauthenticated
  action: string;
  resourceType: string;         // e.g. "IDENTITY"
  resourceId: string | null;    // e.g. "69d8f785..." or null
  timestamp: string;
}

export interface AuditLogPayload {
  success: boolean;
  data: RawAuditLogEntry[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}