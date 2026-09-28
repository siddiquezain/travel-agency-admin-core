// Brute-force defense for admin login: tracks recent FAILED attempts and locks
// out after too many within a window. Keyed by both account (email) and source
// IP, so it stops password-guessing against one account and spraying from one
// host. In-memory (per instance) — mirrors the limiter in /api/inquiries; for a
// multi-instance deployment back this with Redis.

const WINDOW_MS = 15 * 60_000; // 15 minutes
const MAX_FAILURES = 5; // allowed failures per key per window

const failures = new Map<string, number[]>();

function recent(key: string, now: number): number[] {
  const hits = (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  failures.set(key, hits);
  return hits;
}

/** True if this key has hit the failure limit within the window. */
export function isLockedOut(key: string): boolean {
  return recent(key, Date.now()).length >= MAX_FAILURES;
}

/** Record one failed attempt for this key. */
export function recordFailure(key: string): void {
  const now = Date.now();
  const hits = recent(key, now);
  hits.push(now);
  failures.set(key, hits);

  // Cheap GC so the map can't grow unbounded.
  if (failures.size > 500) {
    for (const [k, v] of failures) {
      if (v.length === 0 || now - v[v.length - 1] > WINDOW_MS) failures.delete(k);
    }
  }
}

/** Clear a key's failures (call on successful login). */
export function clearFailures(key: string): void {
  failures.delete(key);
}
