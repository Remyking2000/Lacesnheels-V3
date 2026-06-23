/**
 * Thin fetch wrapper that calls the Express backend API.
 * Base URL comes from VITE_API_URL (default: http://localhost:4000).
 */

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new Error((json as { success: false; message: string }).message ?? "API error");
  }

  return (json as { success: true; data: T }).data;
}

export const api = {
  get:    <T>(path: string, headers?: HeadersInit)              => request<T>(path, { method: "GET", headers }),
  post:   <T>(path: string, body: unknown, headers?: HeadersInit) => request<T>(path, { method: "POST",   body: JSON.stringify(body), headers }),
  put:    <T>(path: string, body: unknown, headers?: HeadersInit) => request<T>(path, { method: "PUT",    body: JSON.stringify(body), headers }),
  patch:  <T>(path: string, body: unknown, headers?: HeadersInit) => request<T>(path, { method: "PATCH",  body: JSON.stringify(body), headers }),
  delete: <T>(path: string, headers?: HeadersInit)              => request<T>(path, { method: "DELETE", headers }),
};
