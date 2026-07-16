import "server-only";
import { headers } from "next/headers";

type Entry = { count: number; resetAt: number };

// In-memory store — acceptable for SQLite/dev; swap for Redis in prod
const store = new Map<string, Entry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_ATTEMPTS = 10;

export async function checkRateLimit(action: string): Promise<{ ok: boolean; retryAfterMs: number }> {
  const hdrStore = await headers();
  const ip =
    (hdrStore.get("x-forwarded-for") ?? "").split(",")[0].trim() ||
    hdrStore.get("x-real-ip") ||
    "unknown";

  const key = `${action}:${ip}`;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterMs: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_ATTEMPTS) {
    return { ok: false, retryAfterMs: entry.resetAt - now };
  }

  return { ok: true, retryAfterMs: 0 };
}
