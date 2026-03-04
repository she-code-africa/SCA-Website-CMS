"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AuthContext.tsx
//
// CURRENT STATE (no RBAC backend yet):
//   - Reads the real JWT token to know if the user is logged in
//   - Uses MOCK_ACTIVE_ROLE to simulate permissions for UI testing
//   - Change MOCK_ACTIVE_ROLE to test different permission levels
//
// WHEN BACKEND SHIPS RBAC:
//   1. Set IS_MOCK_MODE = false
//   2. Make sure your backend's /auth/me returns:
//       { user: { id, firstName, lastName, email, role: { id, name, permissions: string[] } } }
//   3. Done. Everything else requires zero changes.
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react";

import { getToken } from "@/lib/auth/token";
// import { api } from "@/lib/api/client";
import type { Permission } from "@/lib/rbac/permissions";
import { DEFAULT_ROLES } from "@/lib/rbac/permissions";

// ─── TOGGLE THIS to test different roles ─────────────────────────────────────
// Options: "Administrator" | "Program Manager" | "Viewer" | "Auditor"
const MOCK_ACTIVE_ROLE = "Administrator";

// ─── FLIP THIS to false when backend ships RBAC ──────────────────────────────
const IS_MOCK_MODE = true;
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: string;
    name: string;
    isDefault: boolean;
    permissions: Permission[];
  };
  permissionSet: Set<Permission>;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Mock user builder ────────────────────────────────────────────────────────

function buildMockUser(roleName: string): AuthUser {
  const role = DEFAULT_ROLES.find((r) => r.name === roleName);
  if (!role)
    throw new Error(`Mock role "${roleName}" not found in DEFAULT_ROLES`);

  return {
    id: "mock_user_001",
    firstName: "Admin",
    lastName: "User",
    email: "admin@shecodeafrica.org",
    role: {
      id: role.id,
      name: role.name,
      isDefault: role.isDefault,
      permissions: [...role.permissions] as Permission[]
    },
    permissionSet: new Set(role.permissions as Permission[])
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // getToken() usually accesses localStorage/Cookies, which only exist in the browser
      const token = getToken();

      // Not logged in at all — no token means no user
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        if (IS_MOCK_MODE) {
          // ── MOCK MODE ──────────────────────────────────────────────────────
          // Real token exists (user is genuinely logged in),
          // but we attach mock permissions since backend has no RBAC yet.
          setUser(buildMockUser(MOCK_ACTIVE_ROLE));
        } else {
          // ── REAL MODE ──────────────────────────────────────────────────────
          // Uncomment when backend ships /auth/me returning role + permissions.
          /*
          const data = await api.get<{
            user: {
              id: string;
              firstName: string;
              lastName: string;
              email: string;
              role: { id: string; name: string; isDefault: boolean; permissions: string[] };
            };
          }>("/auth/me");

          setUser({
            ...data.user,
            role: {
              ...data.user.role,
              permissions: data.user.role.permissions as Permission[]
            },
            permissionSet: new Set(data.user.role.permissions as Permission[])
          });
          */
        }
      } catch {
        // Token is invalid or /me failed — treat as unauthenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook (Heroku Build Safe) ─────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  /**
   * SAFETY CHECK FOR HEROKU BUILD:
   * During the 'next build' prerendering phase, this context might be null.
   * Instead of throwing a hard error and crashing the build, we return
   * a safe loading state. This allows the compiler to finish.
   */
  if (!context) {
    return {
      user: null,
      isLoading: true,
      isAuthenticated: false
    };
  }
  return context;
}
