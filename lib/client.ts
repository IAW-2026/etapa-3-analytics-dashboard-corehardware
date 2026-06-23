// Cliente HTTP unificado para llamar a cualquier app del ecosistema.
// Mismo helper que en el Control Plane.

import { AppService } from "./apps";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  timeoutMs?: number;
}

export interface AppResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: string | null;
  latencyMs: number;
}

export async function callApp<T = unknown>(
  app: AppService,
  path: string,
  options: RequestOptions = {}
): Promise<AppResponse<T>> {
  const { method = "GET", body, query, timeoutMs = 8000 } = options;

  if (!app.url) {
    return {
      ok: false, status: 0, data: null,
      error: `${app.name}: URL no configurada`, latencyMs: 0,
    };
  }

  const url = new URL(path.startsWith("/") ? path : `/${path}`, app.url);
  if (query) {
    for (const [key, val] of Object.entries(query)) {
      if (val !== undefined) url.searchParams.set(key, String(val));
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const res = await fetch(url.toString(), {
      method,
      headers: {
        "X-API-Key": app.apiKey,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: controller.signal,
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      let errorBody: string | null = null;
      try { errorBody = await res.text(); } catch {}
      return {
        ok: false, status: res.status, data: null,
        error: errorBody || `${app.name} respondió ${res.status}`,
        latencyMs,
      };
    }

    const data = (await res.json()) as T;
    return { ok: true, status: res.status, data, error: null, latencyMs };
  } catch (err) {
    return {
      ok: false, status: 0, data: null,
      error: err instanceof Error ? err.message : "Error desconocido",
      latencyMs: Date.now() - start,
    };
  } finally {
    clearTimeout(timeout);
  }
}
