import type { Chapter } from "./types";

/**
 * The whole guided story. Each beat is one "Next" press.
 * Screens are derived by folding beats in order (see derive.ts), so beats only
 * describe what changes.
 */
export const CHAPTERS: Chapter[] = [
  {
    n: 1,
    short: "Visit",
    title: "The Mitra visit",
    day: "Day 0",
    solves: "Register + List items drop-off · priority 25/25",
    beats: [
      {
        id: "1.1",
        focus: "left",
        clock: "Mon 11:05",
        caption: "Sourav, a local Meesho Mitra, walks into Ramesh's shop in Gole Bazaar. One visit, about 30 minutes.",
        left: { kind: "mitra", step: 1 },
        right: { kind: "buyer", view: "store" },
        world: { waView: "list" },
      },
      {
        id: "1.2",
        focus: "left",
        clock: "Mon 11:12",
        caption:
          "The paperwork that stops most shops is done for him: KYC, bank account, and the GST enrolment ID that lets a shop without GST sell online.",
        left: { kind: "mitra", step: 4 },
      },
      {
        id: "1.3",
        focus: "right",
        clock: "Mon 11:28",
        caption: "20 items listed with proper photos. Ramesh Garments is now live on Meesho for buyers nearby.",
        left: { kind: "mitra", step: 5 },
        world: { listed: 20 },
        handoff: { from: "left", to: "right", label: "20 items live" },
      },
      {
        id: "1.4",
        focus: "left",
        clock: "Mon 11:34",
        caption:
          "Ramesh pays ₹299 once for the Starter Pack: setup, photos, packing kit, counter QR and 3 months of Pro free. Refund if fewer than 10 orders in 90 days.",
        left: { kind: "mitra", step: 7 },
        earn: ["starter"],
      },
      {
        id: "1.5",
        focus: "center",
        clock: "Mon 11:36",
        caption: "From now on, everything happens on WhatsApp, the app he already uses every day. No new app to learn.",
        world: { waView: "chat" },
        chat: [
          { id: "d0", t: "date", text: "आज", time: "" },
          {
            id: "m-welcome",
            t: "voice",
            from: "bot",
            dur: "0:12",
            time: "11:36",
            transcript: "नमस्ते रमेश जी! मैं मीशो दुकान हूँ। आपकी दुकान अब ऑनलाइन है, 20 सामान लाइव हैं।",
            en: "Namaste Ramesh ji! Your shop is now online, with 20 items live.",
          },
          {
            id: "m-menu",
            t: "text",
            from: "bot",
            time: "11:36",
            text: "कुछ भी करना हो, बस बोलिए या फ़ोटो भेजिए 👇",
            en: "Whatever you need, just speak or send a photo.",
            buttons: ["स्टॉक अपडेट", "नया सामान", "आज का हिसाब"],
          },
        ],
      },
    ],
  },
  {
    n: 2,
    short: "Listing",
    title: "His first listing, by himself",
    day: "Day 2",
    solves: "“No catalog, enquiries die” · List items drop-off",
    beats: [
      {
        id: "2.1",
        focus: "center",
        clock: "Wed 10:40",
        caption: "New stock arrives. Ramesh takes one photo…",
        chat: [
          { id: "d2", t: "date", text: "बुधवार", time: "" },
          { id: "m-photo", t: "image", from: "shop", productId: "kurti-blue", time: "10:40" },
        ],
      },
      {
        id: "2.2",
        focus: "center",
        clock: "Wed 10:40",
        caption: "…and says one sentence in Hindi. No typing, no English, no forms.",
        chat: [
          {
            id: "m-voice1",
            t: "voice",
            from: "shop",
            dur: "0:06",
            time: "10:40",
            transcript: "Neeli kurti, M aur L, 450 rupaye.",
          },
        ],
      },
      {
        id: "2.3",
        focus: "center",
        clock: "Wed 10:41",
        caption: "Dukaan AI turns it into a proper listing, with a price check against similar shops nearby.",
        chat: [
          {
            id: "m-listing",
            t: "listing",
            from: "bot",
            time: "10:41",
            listing: {
              productId: "kurti-blue",
              title: "Blue Cotton Kurti",
              titleLocal: "नीली कॉटन कुर्ती",
              sizes: ["M", "L"],
              price: 450,
              near: [420, 480],
              attributes: [
                { label: "Fabric", value: "Cotton" },
                { label: "Pattern", value: "Printed" },
              ],
            },
          },
        ],
      },
      {
        id: "2.4",
        focus: "right",
        clock: "Wed 10:41",
        caption: "One tap and it's live. This step is real: try it yourself on the Try page.",
        patch: [{ id: "m-listing", set: { picked: 0, status: "Published" } }],
        chat: [
          {
            id: "m-live",
            t: "text",
            from: "bot",
            time: "10:41",
            text: "✅ लाइव हो गई! खरीदार अब इसे Meesho पर देख सकते हैं।",
            en: "It's live! Buyers can now see it on Meesho.",
          },
        ],
        world: { heroLive: true },
        right: { kind: "buyer", view: "store", highlight: "kurti-blue" },
        handoff: { from: "center", to: "right", label: "Blue Cotton Kurti" },
      },
    ],
  },
  {
    n: 3,
    short: "Found",
    title: "Found by a buyer nearby",
    day: "Day 5",
    solves: "Falling footfall, invisible online · priority 20/25",
    beats: [
      {
        id: "3.1",
        focus: "left",
        clock: "Fri 12:20",
        caption: "The counter QR from the Starter Pack turns walk-in customers into repeat online buyers.",
        left: { kind: "qr" },
      },
      {
        id: "3.2",
        focus: "right",
        clock: "Fri 3:55",
        caption: "Priya, 3 km away in Hijli, finds Ramesh's shop under “Shops near you” in the Meesho app.",
        right: { kind: "buyer", view: "nearby" },
      },
      {
        id: "3.3",
        focus: "right",
        clock: "Fri 3:58",
        caption: "She pays the same price as any Meesho listing. Buyers pay nothing extra for Dukaan.",
        right: { kind: "buyer", view: "ordered", highlight: "kurti-blue" },
        world: { order: "placed" },
      },
    ],
  },
  {
    n: 4,
    short: "Order",
    title: "The first order",
    day: "Day 5",
    solves: "Packing & pickup confusion · Payout unclear",
    beats: [
      {
        id: "4.1",
        focus: "center",
        clock: "Fri 3:58",
        caption: "His first online order arrives on WhatsApp.",
        left: { kind: "none" },
        handoff: { from: "right", to: "center", label: "New order · ₹450" },
        chat: [
          { id: "d5", t: "date", text: "शुक्रवार", time: "" },
          { id: "m-order", t: "order", from: "bot", time: "3:58", productId: "kurti-blue", size: "M", price: 450, place: "Hijli, Kharagpur" },
        ],
      },
      {
        id: "4.2",
        focus: "center",
        clock: "Fri 4:20",
        caption: "Three simple packing steps. Valmo picks the parcel up from his counter.",
        chat: [
          { id: "m-pack", t: "packing", from: "bot", time: "3:59" },
          { id: "m-packed", t: "text", from: "shop", time: "4:20", text: "पैक हो गया ✅" },
        ],
      },
      {
        id: "4.3",
        focus: "center",
        clock: "Sun 11:10",
        caption: "He knows exactly when the money lands. Meesho takes 0% commission.",
        world: { order: "delivered", heroStock: 6 },
        right: { kind: "buyer", view: "tracking", highlight: "kurti-blue" },
        chat: [
          {
            id: "m-paid",
            t: "text",
            from: "bot",
            time: "11:10",
            text: "📦 डिलीवर हो गया! ₹450 अगले शुक्रवार तक आपके बैंक खाते में आ जाएँगे। कमीशन: ₹0",
            en: "Delivered! ₹450 reaches your bank account by next Friday. Commission: ₹0.",
          },
        ],
      },
    ],
  },
  {
    n: 5,
    short: "Stock",
    title: "Shop and online stock stay in sync",
    day: "Day 9",
    solves: "Counter and online stock drift apart",
    beats: [
      {
        id: "5.1",
        focus: "center",
        clock: "Tue 6:30",
        caption: "Two kurtis sell at the counter. He just says so.",
        right: { kind: "buyer", view: "store", highlight: "kurti-blue" },
        chat: [
          { id: "d9", t: "date", text: "मंगलवार", time: "" },
          { id: "m-voice2", t: "voice", from: "shop", dur: "0:04", time: "6:30", transcript: "2 neeli kurti biki dukaan pe." },
        ],
      },
      {
        id: "5.2",
        focus: "right",
        clock: "Tue 6:30",
        caption: "Online stock updates at once. No double-selling, no cancelled orders, no penalties.",
        world: { heroStock: 4 },
        handoff: { from: "center", to: "right", label: "Stock 6 → 4" },
        chat: [{ id: "m-stock", t: "stock", from: "bot", time: "6:30", productId: "kurti-blue", before: 6, after: 4 }],
      },
    ],
  },
  {
    n: 6,
    short: "Tips",
    title: "Kya rakhein? What should I stock?",
    day: "Day 14",
    solves: "Stocking by guesswork, dead stock · priority 16/25",
    beats: [
      {
        id: "6.1",
        focus: "center",
        clock: "Mon 9:00",
        caption: "Every Monday: what is selling around Kharagpur this week, from real local demand.",
        left: { kind: "trend" },
        chat: [
          { id: "d14", t: "date", text: "सोमवार", time: "" },
          { id: "m-trend", t: "trend", from: "bot", time: "9:00" },
        ],
      },
      {
        id: "6.2",
        focus: "center",
        clock: "Mon 9:02",
        caption: "Small shops buy together and get wholesale prices. Wholesalers pay Meesho to reach these shops.",
        patch: [{ id: "m-trend", set: { picked: 1 } }],
        earn: ["supplier"],
        chat: [
          { id: "m-find", t: "text", from: "shop", time: "9:02", text: "होलसेलर ढूँढें" },
          { id: "m-whole", t: "wholesale", from: "bot", time: "9:02" },
        ],
      },
    ],
  },
  {
    n: 7,
    short: "Review",
    title: "The Sunday review and the upgrade",
    day: "Day 75",
    solves: "“I don't know my own numbers” · Free first, pay after proof",
    beats: [
      {
        id: "7.1",
        focus: "center",
        clock: "Sun 8:00",
        caption: "A 60-second voice review every Sunday. For the first time, he knows his own numbers.",
        left: { kind: "none" },
        right: { kind: "buyer", view: "store", highlight: "kurti-blue" },
        chat: [
          { id: "d75", t: "date", text: "रविवार · 75वाँ दिन", time: "" },
          { id: "m-review", t: "review", from: "bot", time: "8:00" },
        ],
      },
      {
        id: "7.2",
        focus: "center",
        clock: "Sun 8:01",
        caption: "His free Pro months are ending. Before asking for money, Dukaan shows what it earned him this month.",
        chat: [
          {
            id: "m-ending",
            t: "text",
            from: "bot",
            time: "8:01",
            text: "आपके 3 फ्री महीने 15 दिन में खत्म हो रहे हैं। इस महीने Dukaan से आपको यह फ़ायदा हुआ:",
            en: "Your 3 free months end in 15 days. Here's what Dukaan did for you this month:",
          },
          { id: "m-value", t: "value", from: "bot", time: "8:01" },
        ],
      },
      {
        id: "7.3",
        focus: "center",
        clock: "Sun 8:03",
        caption: "₹199 a month (₹149 loyalty price for 6 months): roughly a 37× return. Pay by UPI in the chat, cancel in the chat.",
        earn: ["pro"],
        world: { pro: true },
        chat: [
          {
            id: "m-plans",
            t: "text",
            from: "bot",
            time: "8:01",
            text: "Dukaan Pro जारी रखें?",
            en: "Continue with Dukaan Pro?",
            buttons: ["₹149/महीना (लॉयल्टी)", "₹49/हफ़्ता", "बाद में"],
            picked: 0,
          },
          { id: "m-pick", t: "text", from: "shop", time: "8:02", text: "₹149/महीना (लॉयल्टी)" },
          { id: "m-upi", t: "upi", from: "bot", time: "8:03", amount: 149, label: "Dukaan Pro · 1 month" },
          {
            id: "m-pro",
            t: "text",
            from: "bot",
            time: "8:03",
            text: "✅ Dukaan Pro चालू! आपकी दुकान का पेज हमेशा फ्री रहेगा।",
            en: "Dukaan Pro is on! Your shop page stays free forever.",
          },
        ],
      },
    ],
  },
  {
    n: 8,
    short: "Brands",
    title: "The brand view",
    day: "Stream 3",
    solves: "Brands have no view of Tier 3-4 offline demand",
    beats: [
      {
        id: "8.1",
        focus: "wide",
        clock: "",
        caption: "Thousands of shops like Ramesh's create a live map of offline demand that never existed before.",
        wide: { kind: "dashboard", step: 1 },
      },
      {
        id: "8.2",
        focus: "wide",
        clock: "",
        caption: "Brands see what sells, what runs out and at what price, locality by locality. They pay ₹15 lakh to ₹2 Cr a year.",
        wide: { kind: "dashboard", step: 2 },
        earn: ["insights"],
      },
      {
        id: "8.3",
        focus: "wide",
        clock: "",
        caption: "Opt-in, at least 10 stores per cell, and shops get a share. No single shop's data is ever shown.",
        wide: { kind: "dashboard", step: 3 },
      },
    ],
  },
  {
    n: 9,
    short: "Impact",
    title: "What it adds up to",
    day: "Year 5",
    beats: [
      {
        id: "9.1",
        focus: "wide",
        clock: "",
        caption: "One shop: online in one visit, earning more, paying only after proof. Meesho earns, with no commission on any sale.",
        wide: { kind: "impact", step: 1 },
      },
      {
        id: "9.2",
        focus: "wide",
        clock: "",
        caption: "From a 200-shop pilot to 20 lakh shops: ₹376 Cr a year by Year 5, 0.9% of NMV.",
        wide: { kind: "impact", step: 2 },
      },
      {
        id: "9.3",
        focus: "wide",
        clock: "",
        caption: "We don't tax a single sale. We earn by bringing Tier 3-4 shops online and helping them win.",
        wide: { kind: "impact", step: 3 },
      },
    ],
  },
];

export const BEATS = CHAPTERS.flatMap((c) => c.beats.map((b) => ({ ...b, chapter: c.n })));
export type FlatBeat = (typeof BEATS)[number];

export function chapterOf(beatIndex: number) {
  const n = BEATS[beatIndex]?.chapter ?? 1;
  return CHAPTERS[n - 1];
}

export function firstBeatOfChapter(n: number) {
  return BEATS.findIndex((b) => b.chapter === n);
}
