// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Global auth state provider.
//
// HOW IT WORKS:
//   1. On mount, reads the JWT from storage (lib/auth/token.ts)
//   2. If token exists, calls GET /permissions to get the current user's
//      permission set (the backend filters by the token's role)
//   3. Decodes the JWT payload to extract user profile info (id, email, name)
//      NOTE: JWT decode is safe — we're only reading the payload, not verifying.
//            Replace with a GET /users/profile call when that endpoint exists.
//   4. Builds AuthUser and makes it available via useAuth()
//   5. Syncs the user's role ID with the global Zustand store.
//
// WHEN BACKEND ADDS /users/profile:
//   Replace the `tryDecodeJwt` block in `hydrate()` with:
//     const profile = await api.get("/users/profile");
//     and map profile fields to AuthUser.
// ─────────────────────────────────────────────────────────────────────────────

// src/context/AuthContext.tsx
// "use client";

// import * as React from "react";
// import { AxiosError } from "axios";
// import { getToken } from "@/lib/auth/token";
// import { getCurrentUser } from "@/features/users/api";
// import { getRoleById, getRoles } from "@/features/roles/api";
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
// }

// function tryDecodeJwt(token: string): JwtPayload | null {
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) return null;
//     const padded = parts[1].replace(/-/g, "+").replace(/_/g, "/");
//     return JSON.parse(atob(padded));
//   } catch {
//     return null;
//   }
// }

// async function fetchPermissionsForRole(roleId: string): Promise<string[]> {
//   if (!roleId) return [];

//   try {
//     const role = await getRoleById(roleId);
//     return role.permissions ?? [];
//   } catch (err) {
//     const status = (err as AxiosError)?.response?.status;
//     if (status !== 403) {
//       console.error("[AuthContext] GET /roles/:id failed unexpectedly:", err);
//       return [];
//     }
//     console.warn(
//       `[AuthContext] GET /roles/${roleId} → 403. ` +
//       "Falling back to GET /roles list to find this role."
//     );
//   }

//   try {
//     const allRoles = await getRoles();
//     const matched = allRoles.find(
//       (r) =>
//         r.id === roleId ||
//         (r as unknown as Record<string, unknown>)._id === roleId
//     );
//     if (matched) {
//       console.debug("[AuthContext] Found role via list fallback:", matched);
//       return matched.permissions ?? [];
//     }
//     console.warn(
//       `[AuthContext] Role ${roleId} not found in GET /roles list. ` +
//       "The role may not have access to list roles either. " +
//       "Backend must expose role permissions for this role."
//     );
//   } catch (err) {
//     console.error("[AuthContext] GET /roles list fallback also failed:", err);
//   }

//   return [];
// }

// interface AuthContextValue {
//   user: AuthUser | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   refreshPermissions: () => Promise<void>;
// }

// const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = React.useState<AuthUser | null>(null);
//   const [isLoading, setLoading] = React.useState(true);
//   const setRole = useRoleStore((state) => state.setRole);

//   const hydrate = React.useCallback(async () => {
//     const token = getToken();
//     if (!token) {
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     try {
//       const claims = tryDecodeJwt(token);
//       const userId = String(claims?.sub ?? claims?.id ?? claims?._id ?? "");
//       const email = String(claims?.email ?? "");
//       const firstName = String(
//         claims?.firstName ?? claims?.name?.toString().split(" ")[0] ?? ""
//       );
//       const lastName = String(
//         claims?.lastName ??
//           claims?.name?.toString().split(" ").slice(1).join(" ") ??
//           ""
//       );

//       const userProfile = await getCurrentUser(userId);

//       let roleId = "";
//       if (typeof userProfile.role === "string") {
//         roleId = userProfile.role;
//       } else if (userProfile.role && typeof userProfile.role === "object") {
//         roleId =
//           ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
//       }
//       setRole(roleId || null);

//       const permissions = await fetchPermissionsForRole(roleId);

//       if (process.env.NODE_ENV === "development") {
//         console.debug("[AuthContext] roleId:", roleId);
//         console.debug("[AuthContext] permissions:", permissions);
//       }

//       setUser({
//         id: userId,
//         email,
//         firstName,
//         lastName,
//         permissions,
//         permissionSet: new Set(permissions),
//       });
//     } catch (error) {
//       const status = (error as AxiosError)?.response?.status;
//       if (status === 401) {
//         // Interceptor already redirects – just clean up local state
//         setUser(null);
//       } else {
//         console.error("[AuthContext] Failed to hydrate session:", error);
//         setUser(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [setRole]);

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
//         roleId =
//           ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
//       }
//       const permissions = await fetchPermissionsForRole(roleId);
//       setUser((prev) =>
//         prev
//           ? { ...prev, permissions, permissionSet: new Set(permissions) }
//           : null
//       );
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



// src/context/AuthContext.tsx
"use client";

import * as React from "react";
import { AxiosError } from "axios";
import { getToken } from "@/lib/auth/token";
import { logout } from "@/lib/auth/logout"; 
import { getCurrentUser } from "@/features/users/api";
import { getRoleById, getRoles } from "@/features/roles/api";
import type { AuthUser } from "@/features/auth/types";
import { useRoleStore } from "@/lib/store/useRoleStore";
import { extractUserFromJwt } from "@/lib/auth/jwt"; 

async function fetchPermissionsForRole(roleId: string): Promise<string[]> {
  if (!roleId) return [];
  try {
    const role = await getRoleById(roleId);
    return role.permissions ?? [];
  } catch (err) {
    const status = (err as AxiosError)?.response?.status;
    if (status !== 403) {
      console.error("[AuthContext] GET /roles/:id failed unexpectedly:", err);
      return [];
    }
    console.warn(`[AuthContext] GET /roles/${roleId} → 403. Falling back to GET /roles list.`);
  }
  try {
    const allRoles = await getRoles();
    const matched = allRoles.find(
      (r) => r.id === roleId || (r as unknown as Record<string, unknown>)._id === roleId
    );
    if (matched) return matched.permissions ?? [];
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

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

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
      const userData = extractUserFromJwt(token);
      if (!userData) {
        throw new Error("Failed to decode JWT payload");
      }
      const { userId, email, firstName, lastName } = userData;

      const userProfile = await getCurrentUser(userId);

      let roleId = "";
      if (typeof userProfile.role === "string") {
        roleId = userProfile.role;
      } else if (userProfile.role && typeof userProfile.role === "object") {
        roleId = ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
      }
      setRole(roleId || null);

      const permissions = await fetchPermissionsForRole(roleId);

      setUser({
        id: userId,
        email,
        firstName,
        lastName,
        permissions,
        permissionSet: new Set(permissions),
      });
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;
      if (status === 401 || status === 403) {
        logout(); 
        return;
      } else if (status === 500) {
        console.error("[AuthContext] Backend profile endpoint returned 500. Falling back to JWT data.");
        // Decode again just to grab ID/Email if backend profile fails
        const userData = extractUserFromJwt(token);
        if (userData) {
          setUser({
            id: userData.userId,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            permissions: [],
            permissionSet: new Set()
          });
        }
      } else {
        console.error("[AuthContext] Failed to hydrate session:", error);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [setRole]);

  React.useEffect(() => {
    let isMounted = true;
    const runHydrate = async () => {
      if (isMounted) await hydrate();
    };
    queueMicrotask(runHydrate);
    return () => { isMounted = false; };
  }, [hydrate]);

  const refreshPermissions = React.useCallback(async () => {
    const token = getToken();
    if (!token) return;
    const userData = extractUserFromJwt(token);
    if (!userData) return;

    try {
      const userProfile = await getCurrentUser(userData.userId);
      let roleId = "";
      if (typeof userProfile.role === "string") {
        roleId = userProfile.role;
      } else if (userProfile.role && typeof userProfile.role === "object") {
        roleId = ((userProfile.role as unknown as Record<string, unknown>)._id as string) ?? "";
      }
      const permissions = await fetchPermissionsForRole(roleId);
      setUser((prev) =>
        prev ? { ...prev, permissions, permissionSet: new Set(permissions) } : null
      );
    } catch (error) {
      console.warn("[AuthContext] Failed to refresh permissions:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, refreshPermissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
