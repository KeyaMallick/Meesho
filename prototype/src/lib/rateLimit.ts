/**
 * In-memory limits. Per serverless instance, which is enough for a demo link:
 * it stops one visitor from hammering the key, and the daily cap bounds spend.
 */
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 10;

const hits = new Map<string, number[]>();
let day = new Date().toDateString();
let dayCount = 0;

export function checkLimit(ip: string, dailyCap: number): { ok: true } | { ok: false; reason: "ip" | "daily" } {
  const now = Date.now();
  const today = new Date().toDateString();
  if (today !== day) {
    day = today;
    dayCount = 0;
  }
  if (dayCount >= dailyCap) return { ok: false, reason: "daily" };

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) {
    hits.set(ip, recent);
    return { ok: false, reason: "ip" };
  }
  recent.push(now);
  hits.set(ip, recent);
  dayCount++;
  if (hits.size > 5000) hits.clear();
  return { ok: true };
}
