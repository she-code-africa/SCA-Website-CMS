// // src/lib/api/client.ts

// import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
// import { toast } from "sonner";
// import { getToken } from "@/lib/auth/token";
// import { logout as authLogout } from "@/lib/auth/logout";

// // ─── Type augmentation for unwrapped responses ─────────────────────────────
// interface UnwrappedInstance extends AxiosInstance {
//   get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
//   post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
//   delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
// }

// // ─── Main API instance (RBAC backend) ─────────────────────────────────────
// // Uses proxy path – actual backend URL is defined in next.config.ts rewrites
// export const api = axios.create({
//   baseURL: "/api/external",
//   withCredentials: false,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// }) as UnwrappedInstance;

// // ─── Stem‑a‑Girl API instance ────────────────────────────────────────────
// // Uses proxy path – actual URL defined in next.config.ts
// export const stemApi = axios.create({
//   baseURL: "/api/stem",
//   headers: {
//     "Content-Type": "application/json",
//   },
// }) as UnwrappedInstance;

// // ─── Routes that do not require authentication ───────────────────────────
// const publicRoutes = ["/auth/login", "/users/accept", "/users/decline"];

// // ─── Main API request interceptor (add Bearer token) ─────────────────────
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = getToken();
//     const isPublic = publicRoutes.some((route) => config.url?.includes(route));
//     if (token && !isPublic) {
//       config.headers = config.headers ?? {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//   }
//   return config;
// });

// // ─── Main API response interceptor (unwrap `data`, handle errors) ────────
// let handlingAuthError = false;

// api.interceptors.response.use(
//   (response) => {
//     // Special handling for logs endpoint – return raw response
//     if (response.config.url?.includes("/logs")) return response.data;
//     // Special handling for users list endpoint (already returns array)
//     if (/\/users(\?.*)?$/.test(response.config.url ?? "")) return response.data;

//     const responseBody = response.data;
//     // Unwrap standard { data: ... } response
//     if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
//       return responseBody.data;
//     }
//     return responseBody;
//   },
//   (error) => {
//     const status = error?.response?.status;
//     const requestUrl = error.config?.url ?? "";
//     const backendMessage = error?.response?.data?.message;
//     const message = backendMessage || "You do not have permission to perform this action.";

//     const isPublicUrl = publicRoutes.some((route) => requestUrl.includes(route));

//     if (typeof window !== "undefined" && !isPublicUrl) {
//       if (status === 401) {
//         if (!handlingAuthError) {
//           handlingAuthError = true;
//           toast.error("Session expired", {
//             description: "Please log in again to continue.",
//           });
//           authLogout();
//           setTimeout(() => (handlingAuthError = false), 2000);
//         }
//       } else if (status === 403) {
//         toast.error("Permission Denied", { description: message });
//         console.error(`[403 Forbidden] Path: ${requestUrl}`, error.response?.data);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// // ─── Stem‑a‑Girl API response interceptor (unwrap `data`, handle errors) ──
// stemApi.interceptors.response.use(
//   (response) => {
//     // Unwrap standard { data: ... } response
//     const responseBody = response.data;
//     if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
//       return responseBody.data;
//     }
//     return responseBody;
//   },
//   (error) => {
//     console.error("Stem‑a‑Girl API error:", error);
//     const message = error.response?.data?.message || "Stem‑a‑Girl request failed";
//     toast.error(message);
//     return Promise.reject(error);
//   }
// );




// src/lib/api/client.ts

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { toast } from "sonner";
import { getToken } from "@/lib/auth/token";
import { logout as authLogout } from "@/lib/auth/logout";

// ─── Type augmentation for unwrapped responses ─────────────────────────────
interface UnwrappedInstance extends AxiosInstance {
  get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = unknown, R = T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
}

// ─── Main API instance (RBAC backend) ─────────────────────────────────────
// Uses proxy path – actual backend URL is defined in next.config.ts rewrites
export const api = axios.create({
  baseURL: "/api/external",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
}) as UnwrappedInstance;

// ─── Stem‑a‑Girl API instance ────────────────────────────────────────────
// Uses proxy path – actual URL defined in next.config.ts
export const stemApi = axios.create({
  baseURL: "/api/stem",
  headers: {
    "Content-Type": "application/json",
  },
}) as UnwrappedInstance;

// ─── Routes that do not require authentication ───────────────────────────
const publicRoutes = ["/auth/login", "/users/accept", "/users/decline"];

// ─── Main API request interceptor (add Bearer token) ─────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getToken();
    const isPublic = publicRoutes.some((route) => config.url?.includes(route));
    if (token && !isPublic) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── Main API response interceptor (unwrap `data`, handle errors, preserve pagination) ───
let handlingAuthError = false;

api.interceptors.response.use(
  (response) => {
    // Special handling for logs endpoint – return raw response
    if (response.config.url?.includes("/logs")) return response.data;
    // Special handling for users list endpoint (already returns array)
    if (/\/users(\?.*)?$/.test(response.config.url ?? "")) return response.data;

    const responseBody = response.data;

    // Detect paginated response (has both 'data' and 'pagination')
    if (
      responseBody &&
      typeof responseBody === "object" &&
      "data" in responseBody &&
      "pagination" in responseBody
    ) {
      // Return a wrapped object containing both data and pagination
      return {
        data: responseBody.data,
        pagination: responseBody.pagination,
      };
    }

    // Standard unwrapping of { data: ... } response (without pagination)
    if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
      return responseBody.data;
    }
    return responseBody;
  },
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error.config?.url ?? "";
    const backendMessage = error?.response?.data?.message;
    const message = backendMessage || "You do not have permission to perform this action.";

    const isPublicUrl = publicRoutes.some((route) => requestUrl.includes(route));

    if (typeof window !== "undefined" && !isPublicUrl) {
      if (status === 401) {
        if (!handlingAuthError) {
          handlingAuthError = true;
          toast.error("Session expired", {
            description: "Please log in again to continue.",
          });
          authLogout();
          setTimeout(() => (handlingAuthError = false), 2000);
        }
      } else if (status === 403) {
        toast.error("Permission Denied", { description: message });
        console.error(`[403 Forbidden] Path: ${requestUrl}`, error.response?.data);
      }
    }

    return Promise.reject(error);
  }
);

// ─── Stem‑a‑Girl API response interceptor (unwrap `data`, handle errors) ──
stemApi.interceptors.response.use(
  (response) => {
    // Unwrap standard { data: ... } response
    const responseBody = response.data;
    if (responseBody && typeof responseBody === "object" && "data" in responseBody) {
      return responseBody.data;
    }
    return responseBody;
  },
  (error) => {
    console.error("Stem‑a‑Girl API error:", error);
    const message = error.response?.data?.message || "Stem‑a‑Girl request failed";
    toast.error(message);
    return Promise.reject(error);
  }
);