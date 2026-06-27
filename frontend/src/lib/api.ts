/**
 * Typed fetch wrapper for the Express backend API.
 *
 * Token strategy:
 *   - Admin routes: Authorization: Bearer <token>  (stored in sessionStorage)
 *   - Customer routes: X-User-Token: <jwt>          (stored in localStorage)
 */

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.DEV ? "http://localhost:4000" : "");

const ADMIN_TOKEN_KEY = "laces-heels-admin-token";
const USER_TOKEN_KEY  = "lnh-user-token";

type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getAdminToken() { return sessionStorage.getItem(ADMIN_TOKEN_KEY); }
export function setAdminToken(t: string) { sessionStorage.setItem(ADMIN_TOKEN_KEY, t); }
export function clearAdminToken() { sessionStorage.removeItem(ADMIN_TOKEN_KEY); }

// Alias for backward compat
export const setToken   = setAdminToken;
export const clearToken = clearAdminToken;

export function getUserToken() { return localStorage.getItem(USER_TOKEN_KEY); }
export function setUserToken(t: string) { localStorage.setItem(USER_TOKEN_KEY, t); }
export function clearUserToken() { localStorage.removeItem(USER_TOKEN_KEY); }

// ── Request ───────────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const adminToken = getAdminToken();
  const userToken  = getUserToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (adminToken) headers["Authorization"] = `Bearer ${adminToken}`;
  if (userToken)  headers["X-User-Token"]  = userToken;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new Error((json as { success: false; message: string }).message ?? "API error");
  }

  return (json as { success: true; data: T }).data;
}

export const api = {
  get:    <T>(path: string)                => request<T>(path, { method: "GET" }),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: "POST",   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: "PUT",    body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: "PATCH",  body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: "DELETE" }),
};
