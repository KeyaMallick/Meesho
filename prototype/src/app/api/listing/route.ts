import { NEAR_PRICE } from "@/data/insights";
import { GeminiError, MODEL, generateListing } from "@/lib/gemini";
import { ListingRequest, type ListingResponse } from "@/lib/listing";
import { checkLimit } from "@/lib/rateLimit";

export const maxDuration = 30;

function reply(body: ListingResponse, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY) return reply({ ok: false, error: "unavailable", message: "AI key not configured" }, 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ ok: false, error: "bad_request" }, 400);
  }
  const parsed = ListingRequest.safeParse(body);
  if (!parsed.success || (!parsed.data.image && !parsed.data.transcript)) {
    return reply({ ok: false, error: "bad_request" }, 400);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limit = checkLimit(ip, Number(process.env.AI_DAILY_CAP) || 500);
  if (!limit.ok) return reply({ ok: false, error: "rate_limited" }, 429);

  const started = Date.now();
  try {
    const listing = await generateListing(parsed.data);
    if (!listing.is_product) return reply({ ok: false, error: "not_a_product" });
    const near = NEAR_PRICE[listing.category] ?? NEAR_PRICE.other;
    return reply({ ok: true, listing, near, ms: Date.now() - started, model: MODEL });
  } catch (e) {
    const message = e instanceof GeminiError ? e.message : "Unexpected error";
    console.error("[listing]", message);
    return reply({ ok: false, error: "unavailable", message }, 502);
  }
}
