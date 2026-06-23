/**
 * Typed fetch wrapper for the Express backend API.
 * Automatically attaches the admin auth token (stored in sessionStorage)
 * to every request as an Authorization: Bearer header.
 */

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";
const TOKEN_KEY = "laces-heels-admin-token";

type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };

function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.warn(`[API Request] No token found in sessionStorage for path: ${path}`);
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  
  if (!res.ok) {
    console.error(`[API Request] HTTP error status: ${res.status} ${res.statusText} on path: ${path}`);
  }

  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    const errorMsg = (json as { success: false; message: string }).message ?? "API error";
    console.error(`[API Request] API Error message: ${errorMsg} on path: ${path}`);
    throw new Error(errorMsg);
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
