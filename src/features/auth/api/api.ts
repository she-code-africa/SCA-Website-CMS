// src/features/auth/api/api.ts
import { api } from "@/lib/api/client";
import { LoginPayload, LoginResponse } from "@/features/auth";




export async function login(payload: LoginPayload): Promise<string> {
  // because interceptor returns `response.data?.data ?? response.data`,
  // /auth/login may return token string OR full object depending on backend + config
  const res = (await api.post<LoginResponse>("/auth/login", payload)) as unknown;

  // if interceptor returned token directly
  if (typeof res === "string") return res;

  // if interceptor returned full object { success, data }
  const token = (res as LoginResponse).data;
  if (typeof token === "string" && token.length > 10) return token;

  throw new Error("Login failed: token not returned from backend");
}
