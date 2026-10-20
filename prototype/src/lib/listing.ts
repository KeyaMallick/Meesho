import { z } from "zod";

export const CATEGORIES = [
  "kurti",
  "saree",
  "kids_wear",
  "mens_wear",
  "footwear",
  "bags",
  "stationery",
  "home_decor",
  "puja",
  "accessories",
  "other",
] as const;

/** What Gemini must return. Unknown values are "" / 0 / [] so the schema stays simple. */
export const ModelListing = z.object({
  is_product: z.boolean().describe("false if the photo/sentence is not a product a shop would sell"),
  title_local: z.string().describe("Short listing title in the shopkeeper's language and script"),
  title_en: z.string().describe("Short listing title in English, Meesho style"),
  category: z.enum(CATEGORIES),
  color: z.string().describe('Main colour in English, or ""'),
  fabric: z.string().describe('Fabric or material in English, or ""'),
  pattern: z.string().describe('Pattern in English (e.g. Printed, Solid), or ""'),
  occasion: z.string().describe('Occasion in English (e.g. Daily wear, Festive), or ""'),
  sizes: z.array(z.string()).describe("Sizes exactly as said, e.g. [\"M\",\"L\"]. Empty if not said."),
  price_inr: z.number().int().describe("Price in rupees as said. 0 if no price was said."),
  description_local: z.string().describe("One short line for buyers, in the shopkeeper's language"),
  description_en: z.string().describe("One short line for buyers, in English"),
  missing: z.array(z.enum(["price", "sizes"])).describe("Fields the shopkeeper did not give"),
});
export type ModelListing = z.infer<typeof ModelListing>;

export const ListingRequest = z.object({
  image: z
    .object({
      mediaType: z.enum(["image/jpeg", "image/png", "image/webp"]),
      base64: z.string().max(2_200_000),
    })
    .optional(),
  transcript: z.string().trim().max(300),
  lang: z.enum(["hi", "bn", "en"]),
  sampleId: z.string().max(40).optional(),
});
export type ListingRequest = z.infer<typeof ListingRequest>;

export type ListingResponse =
  | {
      ok: true;
      listing: ModelListing;
      near: [number, number];
      ms: number;
      model: string;
    }
  | { ok: false; error: "bad_request" | "rate_limited" | "not_a_product" | "unavailable"; message?: string };
