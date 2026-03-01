// src/lib/api/client.ts
import axios from "axios";
import { toast } from "sonner";
import { getToken } from "@/lib/auth/token";
import { logout } from "@/lib/auth/logout";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const devToken = process.env.NEXT_PUBLIC_DEV_TOKEN;

let handlingAuthError = false;

export const api = axios.create({
  baseURL,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken() || devToken || null;

    if (token) {
      // ensure headers exists
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // keep old behavior for logs (full payload for pagination)
    if (response.config.url?.includes("/logs")) return response.data;

    // default behavior
    return response.data?.data ?? response.data;
  },
  (err) => {
    const status = err?.response?.status;

    // ✅ Global auth handling
    if (typeof window !== "undefined" && (status === 401 || status === 403)) {
      if (!handlingAuthError) {
        handlingAuthError = true;

        if (status === 401) {
          toast.error("Session expired. Please log in again.");
          // persist reason/details for the logout handler since logout() expects no args
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "logoutReason",
              JSON.stringify({ reason: "expired", status })
            );
            localStorage.setItem("logoutRedirect", "/login");
          }
          logout();
        } else {
          toast.error("You don’t have permission to access this resource.");
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "logoutReason",
              JSON.stringify({ reason: "forbidden", status })
            );
            localStorage.setItem("logoutRedirect", "/login");
          }
          logout();
        }

        // safety reset (in case user blocks redirect in dev)
        setTimeout(() => {
          handlingAuthError = false;
        }, 1500);
      }
    }

    return Promise.reject(err);
  }
);
