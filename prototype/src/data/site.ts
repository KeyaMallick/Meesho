/** Things the team fills in before submitting. */
export const SITE = {
  team: "Team 505 · IIT Kharagpur",
  members: "Keya Mallick",
  /** Shared folder with interview recordings. Leave empty to hide the QR code. */
  recordingsUrl: "",
};

/** Real field quotes from the deck. Add `photo: "/field/<file>.jpg"` once photos are in public/field. */
export const FIELD_QUOTES: { who: string; where: string; quote: string; en: string; photo?: string }[] = [
  {
    who: "Garment store owner, 38",
    where: "Kharagpur town",
    quote: "“WhatsApp par log puchte hai naya stock aaya kya, par fir aage kuch nahi.”",
    en: "People ask on WhatsApp if new stock came, but nothing comes of it.",
    photo: "/field/garment-visit.jpg",
  },
  {
    who: "Kirana owner, 44",
    where: "Gole Bazaar",
    quote: "“Covid ke baad se saman waise nahi bikta, pehle jaisa.”",
    en: "Since Covid, things don't sell like they used to.",
    photo: "/field/kirana-interview.jpg",
  },
  {
    who: "Puja & gift shop owner",
    where: "Kharagpur · recorded",
    quote: "“Agar log hamaare kaam k baarein mein jante to bohot acha hota.”",
    en: "It would be great if people knew about our work.",
    photo: "/field/puja-shop.jpg",
  },
];

/** Year-5 base case from the deck (₹ Cr). Validated categorical palette. */
export const REVENUE_SPLIT = [
  { key: "AI subscriptions", value: 144, color: "#8f2a7e" },
  { key: "Demand insights", value: 160, color: "#c74bc7" },
  { key: "Supplier access", value: 60, color: "#cf7a00" },
  { key: "Starter Pack", value: 12, color: "#1696a8" },
];
