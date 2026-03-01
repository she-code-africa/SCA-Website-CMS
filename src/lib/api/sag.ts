// src/lib/api/sag.ts
const sagBaseUrl = process.env.NEXT_PUBLIC_STEM_A_GIRL_BASE_URL;

/**
 * Builds an absolute URL to the SAG service.
 * If env is missing, falls back to the incoming path (uses api baseURL).
 */
export function sagUrl(path: string) {
  if (!sagBaseUrl) return path;

  const base = sagBaseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
