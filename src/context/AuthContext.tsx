// "use client";

// // src/context/AuthContext.tsx
// // ─────────────────────────────────────────────────────────────────────────────
// // Global auth state provider.
// //
// // HOW IT WORKS:
// //   1. On mount, reads the JWT from storage (lib/auth/token.ts)
// //   2. If token exists, calls GET /permissions to get the current user's
// //      permission set (the backend filters by the token's role)
// //   3. Decodes the JWT payload to extract user profile info (id, email, name)
// //      NOTE: JWT decode is safe — we're only reading the payload, not verifying.
// //            Replace with a GET /users/profile call when that endpoint exists.
// //   4. Builds AuthUser and makes it available via useAuth()
// //   5. Syncs the user's role ID with the global Zustand store.
// //
// // WHEN BACKEND ADDS /users/profile:
// //   Replace the `tryDecodeJwt` block in `hydrate()` with:
// //     const profile = await api.get("/users/profile");
// //     and map profile fields to AuthUser.
// // ─────────────────────────────────────────────────────────────────────────────

// "use client";

// import * as React from "react";
// import { AxiosError } from "axios";
// import { getToken } from "@/lib/auth/token";
// import { logout } from "@/lib/auth/logout";
// import { getCurrentUser } from "@/features/users/api";
// import { getRoleById } from "@/features/roles/api";
// import type { AuthUser } from "@/features/auth/types";
// import { useRoleStore } from "@/lib/store/useRoleStore";

// interface JwtPayload {
//   sub?: string;
//   id?: string;
//   _id?: string;
//   email?: string;
//   firstName?: string;
//   name?: string;
//   lastName?: string;
//   roleId?: string;
//   role?: string;
// }

// function tryDecodeJwt(token: string): JwtPayload | null {
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) return null;
//     const payload = parts[1];
//     const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
//     const json = atob(padded);
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// interface AuthContextValue {
//   user: AuthUser | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   refreshPermissions: () => Promise<void>;
// }

// const AuthContext = React.createContext<AuthContextValue | undefined>(
//   undefined
// );

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = React.useState<AuthUser | null>(null);
//   const [isLoading, setLoading] = React.useState(true);
//   const setRole = useRoleStore((state) => state.setRole);

//   // const hydrate = React.useCallback(async () => {
//   //   const token = getToken();
//   //   if (!token) {
//   //     setUser(null);
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const claims = tryDecodeJwt(token);
//   //     const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
//   //     const email = String(claims?.email ?? "");
//   //     const firstName = String(
//   //       claims?.firstName ?? claims?.name?.toString().split(" ")[0] ?? ""
//   //     );
//   //     const lastName = String(
//   //       claims?.lastName ??
//   //         claims?.name?.toString().split(" ").slice(1).join(" ") ??
//   //         ""
//   //     );

//   //     // Fetch user profile to get role ID
//   //     const userProfile = await getCurrentUser(userId);
//   //     let roleId = "";
//   //     if (typeof userProfile.role === "string") {
//   //       roleId = userProfile.role;
//   //     } else if (userProfile.role && typeof userProfile.role === "object") {
//   //       roleId = (userProfile.role as any)._id || "";
//   //     }
//   //     setRole(roleId || null);

//   //     // Fetch role permissions
//   //     let permissions: string[] = [];
//   //     if (roleId) {
//   //       try {
//   //         const role = await getRoleById(roleId);
//   //         permissions = role.permissions || [];
//   //       } catch (err) {
//   //         console.error("[AuthContext] Failed to fetch role permissions:", err);
//   //       }
//   //     }

//   //     setUser({
//   //       id: userId,
//   //       email,
//   //       firstName,
//   //       lastName,
//   //       permissions,
//   //       permissionSet: new Set(permissions)
//   //     });
//   //   } catch (error) {
//   //     const axiosError = error as AxiosError;
//   //     const status = axiosError.response?.status;
//   //     if (status === 401 || status === 403) {
//   //       logout();
//   //       return;
//   //     }
//   //     console.error("[AuthContext] Failed to hydrate session:", error);
//   //     setUser(null);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // }, [setRole]);

//   const hydrate = React.useCallback(async () => {
//   const token = getToken();
//   if (!token) {
//     setUser(null);
//     setLoading(false);
//     return;
//   }

//   try {
//     const claims = tryDecodeJwt(token);
//     const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
//     const email = String(claims?.email ?? "");
//     const firstName = String(
//       claims?.firstName ?? claims?.name?.toString().split(" ")[0] ?? ""
//     );
//     const lastName = String(
//       claims?.lastName ??
//         claims?.name?.toString().split(" ").slice(1).join(" ") ??
//         ""
//     );

//     const userProfile = await getCurrentUser(userId);
//     let roleId = "";
//     if (typeof userProfile.role === "string") {
//       roleId = userProfile.role;
//     } else if (userProfile.role && typeof userProfile.role === "object") {
//       roleId = (userProfile.role as Record<string, unknown>)._id as string || "";
//     }
//     setRole(roleId || null);

//     let permissions: string[] = [];
//     if (roleId) {
//       try {
//         const role = await getRoleById(roleId);

//         // ── DEBUG: remove this block once the PM issue is confirmed fixed ──
//         if (process.env.NODE_ENV === "development") {
//           console.group("[AuthContext] Role hydration debug");
//           console.log("roleId:", roleId);
//           console.log("raw role from API:", role);
//           console.log("extracted permissions:", role.permissions);
//           console.groupEnd();
//         }
//         // ────────────────────────────────────────────────────────────────────

//         permissions = role.permissions ?? [];
//       } catch (err) {
//         console.error("[AuthContext] Failed to fetch role permissions:", err);
//       }
//     }

//     setUser({
//       id: userId,
//       email,
//       firstName,
//       lastName,
//       permissions,
//       permissionSet: new Set(permissions),
//     });
//   } catch (error) {
//     const axiosError = error as { response?: { status?: number } };
//     const status = axiosError.response?.status;
//     if (status === 401 || status === 403) {
//       logout();
//       return;
//     }
//     console.error("[AuthContext] Failed to hydrate session:", error);
//     setUser(null);
//   } finally {
//     setLoading(false);
//   }
// }, [setRole]);

//   React.useEffect(() => {
//     hydrate();
//   }, [hydrate]);

//   const refreshPermissions = React.useCallback(async () => {
//     const token = getToken();
//     if (!token) return;
//     const claims = tryDecodeJwt(token);
//     const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
//     if (!userId) return;
//     try {
//       const userProfile = await getCurrentUser(userId);
//       let roleId = "";
//       if (typeof userProfile.role === "string") {
//         roleId = userProfile.role;
//       } else if (userProfile.role && typeof userProfile.role === "object") {
//         roleId = (userProfile.role as any)._id || "";
//       }
//       if (roleId) {
//         const role = await getRoleById(roleId);
//         const permissions = role.permissions || [];
//         setUser((prev) =>
//           prev
//             ? { ...prev, permissions, permissionSet: new Set(permissions) }
//             : null
//         );
//       }
//     } catch (error) {
//       console.warn("[AuthContext] Failed to refresh permissions:", error);
//     }
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{ user, isLoading, isAuthenticated: !!user, refreshPermissions }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth(): AuthContextValue {
//   const ctx = React.useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
//   return ctx;
// }



"use client";

import * as React from "react";
import { AxiosError } from "axios";
import { getToken } from "@/lib/auth/token";
import { logout } from "@/lib/auth/logout";
import { getCurrentUser } from "@/features/users/api";
import { getRoleById, getRoles } from "@/features/roles/api";
import type { AuthUser } from "@/features/auth/types";
import { useRoleStore } from "@/lib/store/useRoleStore";

interface JwtPayload {
  sub?: string;
  id?: string;
  _id?: string;
  email?: string;
  firstName?: string;
  name?: string;
  lastName?: string;
}

function tryDecodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * Fetches permissions for the current user's role.
 *
 * Strategy A: GET /roles/:id  — works for admin, auditor, viewer (have VIEW_ROLE)
 * Strategy B: GET /roles      — fallback for PM and others who 403 on Strategy A.
 *             We fetch the full list and find the matching role by ID.
 *             This works as long as GET /roles is accessible to the role.
 */
async function fetchPermissionsForRole(roleId: string): Promise<string[]> {
  if (!roleId) return [];

  // Strategy A
  try {
    const role = await getRoleById(roleId);
    return role.permissions ?? [];
  } catch (err) {
    const status = (err as AxiosError)?.response?.status;
    if (status !== 403) {
      // Unexpected error — don't try further
      console.error("[AuthContext] GET /roles/:id failed unexpectedly:", err);
      return [];
    }
    // 403 → fall through to Strategy B
    console.warn(
      `[AuthContext] GET /roles/${roleId} → 403. ` +
        "Falling back to GET /roles list to find this role."
    );
  }

  // Strategy B — GET /roles (list) and find by id
  try {
    const allRoles = await getRoles();
    const matched = allRoles.find(
      (r) =>
        r.id === roleId ||
        (r as unknown as Record<string, unknown>)._id === roleId
    );
    if (matched) {
      console.debug("[AuthContext] Found role via list fallback:", matched);
      return matched.permissions ?? [];
    }
    console.warn(
      `[AuthContext] Role ${roleId} not found in GET /roles list. ` +
        "The role may not have access to list roles either. " +
        "Backend must expose role permissions for this role."
    );
  } catch (err) {
    console.error("[AuthContext] GET /roles list fallback also failed:", err);
  }

  return [];
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshPermissions: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setLoading] = React.useState(true);
  const setRole = useRoleStore((state) => state.setRole);

  const hydrate = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const claims = tryDecodeJwt(token);
      const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
      const email = String(claims?.email ?? "");
      const firstName = String(
        claims?.firstName ?? claims?.name?.toString().split(" ")[0] ?? ""
      );
      const lastName = String(
        claims?.lastName ??
          claims?.name?.toString().split(" ").slice(1).join(" ") ??
          ""
      );

      const userProfile = await getCurrentUser(userId);

      // role is always a plain ID string from this backend
      let roleId = "";
      if (typeof userProfile.role === "string") {
        roleId = userProfile.role;
      } else if (userProfile.role && typeof userProfile.role === "object") {
        roleId =
          ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
      }
      setRole(roleId || null);

      const permissions = await fetchPermissionsForRole(roleId);

      if (process.env.NODE_ENV === "development") {
        console.debug("[AuthContext] roleId:", roleId);
        console.debug("[AuthContext] permissions:", permissions);
      }

      setUser({
        id: userId,
        email,
        firstName,
        lastName,
        permissions,
        permissionSet: new Set(permissions)
      });
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401 || status === 403) {
        logout();
        return;
      }
      console.error("[AuthContext] Failed to hydrate session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setRole]);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  const refreshPermissions = React.useCallback(async () => {
    const token = getToken();
    if (!token) return;
    const claims = tryDecodeJwt(token);
    const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
    if (!userId) return;

    try {
      const userProfile = await getCurrentUser(userId);
      let roleId = "";
      if (typeof userProfile.role === "string") {
        roleId = userProfile.role;
      } else if (userProfile.role && typeof userProfile.role === "object") {
        roleId =
          ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
      }
      const permissions = await fetchPermissionsForRole(roleId);
      setUser((prev) =>
        prev
          ? { ...prev, permissions, permissionSet: new Set(permissions) }
          : null
      );
    } catch (error) {
      console.warn("[AuthContext] Failed to refresh permissions:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, refreshPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}