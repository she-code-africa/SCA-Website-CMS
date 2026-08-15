// src/lib/auth/jwt.ts
import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub?: string;
  id?: string;
  _id?: string;
  email?: string;
  firstName?: string;
  name?: string;
  lastName?: string;
  exp?: number; 
}

export function decodeJwt<T = JwtPayload>(token: string): T | null {
  if (!token) return null;
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error("[JWT] Failed to decode token:", error);
    return null;
  }
}

// Helper specifically for AuthContext to extract user data safely
export function extractUserFromJwt(token: string) {
  const claims = decodeJwt(token);
  if (!claims) return null;

  return {
    userId: String(claims.sub ?? claims.id ?? claims._id ?? ""),
    email: String(claims.email ?? ""),
    firstName: String(
      claims.firstName ?? claims.name?.toString().split(" ")[0] ?? ""
    ),
    lastName: String(
      claims.lastName ??
        claims.name?.toString().split(" ").slice(1).join(" ") ??
        ""
    )
  };
}
