import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { z } from "zod";
import { ModelListing, type ListingRequest } from "./listing";

const SYSTEM = `You are the listing assistant inside "Meesho Dukaan", a WhatsApp helper for small shop owners in Tier 3-4 towns in India.
The shopkeeper sends a product photo and/or one spoken sentence (speech-to-text, often Hinglish or Bengali, may have small errors).
Turn it into a clean marketplace listing.

Rules:
- Use only what you can see in the photo or what was said. Never invent a price or sizes. If not said, use 0 / [] and add the field to "missing".
- Numbers in Hindi/Bengali words count (e.g. "saadhe chaar sau" = 450, "paanch sau" = 500). Prices are in rupees.
- Sarees, dupattas, bags, puja items, home decor and stationery are one-size: use ["Free size"] and do not list "sizes" as missing.
- Size words: "free size" -> ["Free size"]; letters stay as letters (M, L, XL); kids sizes like "2-3 saal" -> ["2-3Y"].
- title_local is in the shopkeeper's language and native script (Hindi -> Devanagari, Bengali -> Bengali script, English -> English). Keep titles under 6 words, like a Meesho listing ("Blue Cotton Kurti").
- Colour, fabric, pattern, occasion in simple English, or "" if unsure.
- If the photo clearly isn't something a shop would sell (a person's selfie, a screenshot, a blank image), set is_product to false.`;

const LANG_NAME = { hi: "Hindi", bn: "Bengali", en: "English" } as const;

const jsonSchema = z.toJSONSchema(ModelListing, { target: "draft-7" });

let client: GoogleGenAI | null = null;
function ai() {
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

export const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const THINKING = process.env.GEMINI_THINKING === "low" ? ThinkingLevel.LOW : ThinkingLevel.MINIMAL;

export class GeminiError extends Error {
  constructor(
    message: string,
    public retryable: boolean,
  ) {
    super(message);
  }
}

export async function generateListing(req: ListingRequest, timeoutMs = 12_000): Promise<ModelListing> {
  const parts: { inlineData?: { mimeType: string; data: string }; text?: string }[] = [];
  if (req.image) parts.push({ inlineData: { mimeType: req.image.mediaType, data: req.image.base64 } });
  parts.push({
    text: `Shopkeeper's language: ${LANG_NAME[req.lang]}.\nWhat they said: "${req.transcript || "(nothing said)"}"\n${
      req.image ? "The product photo is attached." : "No photo was sent."
    }`,
  });

  const call = async (withThinking: boolean) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await ai().models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts }],
        config: {
          systemInstruction: SYSTEM,
          responseMimeType: "application/json",
          responseJsonSchema: jsonSchema,
          abortSignal: controller.signal,
          ...(withThinking ? { thinkingConfig: { thinkingLevel: THINKING } } : {}),
        },
      });
      const text = res.text ?? "";
      const parsed = ModelListing.safeParse(JSON.parse(text));
      if (!parsed.success) throw new GeminiError("Model returned an unexpected shape", true);
      return parsed.data;
    } finally {
      clearTimeout(timer);
    }
  };

  let thinking = true;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await call(thinking);
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 400 && thinking && /thinking/i.test(e.message)) {
          thinking = false;
          attempt--;
          continue;
        }
        const retryable = e.status === 429 || e.status >= 500;
        if (retryable && attempt === 0) {
          await new Promise((r) => setTimeout(r, 900));
          continue;
        }
        throw new GeminiError(`Gemini ${e.status}: ${e.message.slice(0, 200)}`, retryable);
      }
      if (e instanceof SyntaxError || (e instanceof GeminiError && attempt === 0)) continue;
      if (e instanceof Error && e.name === "AbortError") throw new GeminiError("Timed out", true);
      throw e;
    }
  }
  throw new GeminiError("Gave up after retry", true);
}
