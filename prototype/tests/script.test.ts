import { describe, expect, it } from "vitest";
import { productById } from "../src/data/products";
import { deriveState } from "../src/story/derive";
import { BEATS, CHAPTERS } from "../src/story/script";

describe("story script", () => {
  it("has unique beat ids and unique message ids", () => {
    const beatIds = BEATS.map((b) => b.id);
    expect(new Set(beatIds).size).toBe(beatIds.length);
    const msgIds = BEATS.flatMap((b) => b.chat ?? []).map((m) => m.id);
    expect(new Set(msgIds).size).toBe(msgIds.length);
  });

  it("only patches messages that already exist", () => {
    BEATS.forEach((b, i) => {
      if (!b.patch) return;
      const before = deriveState(i - 1).chat.map((m) => m.id);
      b.patch.forEach((p) => expect(before, `beat ${b.id} patches ${p.id}`).toContain(p.id));
    });
  });

  it("references real products", () => {
    BEATS.flatMap((b) => b.chat ?? []).forEach((m) => {
      if ("productId" in m && m.productId) expect(() => productById(m.productId!)).not.toThrow();
      if (m.t === "listing") expect(() => productById(m.listing.productId)).not.toThrow();
    });
  });

  it("derives every beat, and wide beats have a wide screen", () => {
    BEATS.forEach((b, i) => {
      const s = deriveState(i);
      expect(s.beat.id).toBe(b.id);
      if (b.focus === "wide") expect(s.wide).not.toBeNull();
    });
  });

  it("ends with every revenue stream earned and keeps numbers in line with the deck", () => {
    const last = deriveState(BEATS.length - 1);
    expect(new Set(last.earned)).toEqual(new Set(["starter", "pro", "supplier", "insights"]));
    const captions = BEATS.map((b) => b.caption).join(" ");
    expect(captions).toContain("₹299");
    expect(captions).toContain("₹376 Cr");
    expect(CHAPTERS).toHaveLength(9);
  });
});
