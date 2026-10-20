# Meesho Dukaan: Demo Website Design

Status: **Built (M1–M6)** · Team 505, IIT Kharagpur · Oct 2026

> **Build notes (20 Oct 2026).** What changed from the draft while building:
> - The story has **28 beats** (not ~34); the beat script in §7.2 is unchanged in substance, with a few beats merged.
> - Gemini runs at **thinking level `minimal`** (switchable with `GEMINI_THINKING=low`): text-only listings came back in 1.7–2.7s vs ~4s at `low`, with the same output. A photo + sentence took ~7.7s at `low`.
> - One-size categories (sarees, bags, puja items, home decor, stationery) default to "Free size" instead of asking for sizes.
> - Product photos are flat SVG illustrations until real shop photos are added (see README → Editing content).
> - The field strip on the last screen uses the three interview photos already in the deck (`public/field/`).
> - The left slot shows the counter QR in chapter 3, the demand chart in chapter 6, and is empty in chapters 4, 5 and 7.
Deliverable: one public URL for the DICE Challenge 3.0 semi-final demo call.

---

## 1. What this site must do

The judges will see it two ways: **screen-shared by us on the demo call**, and **opened by them later from the link**. It has to work for both.

It must prove four things, in this order:

1. **The shop owner never leaves WhatsApp.** No app, no forms, no English, no typing.
2. **It works today.** The voice/photo → listing step runs on real AI, not a mockup.
3. **One flow joins shop, buyer, Mitra and brand.** What happens in one place shows up in the others.
4. **Meesho earns from three payers, never the buyer, at 0% commission.** You can see it happening the whole time.

What it is **not**: a sign-up site for shop owners. No shop owner ever visits this URL. The site is a stage where we show the product from every side.

### Success criteria

- A judge who has never seen our deck understands the solution from the guided story alone, in under 5 minutes.
- On the live call, nothing depends on network or AI except the sandbox, which has an offline fallback.
- A judge can say a sentence in Hindi into the mic and get a real listing back in under ~8 seconds.
- It looks right at any screen-share resolution and is usable on a phone.

---

## 2. Decisions

| # | Decision | Default in this doc | Status |
|---|---|---|---|
| D1 | Demo / submission deadline | Unknown; build plan in §16 is ordered so any cut-off still leaves a working demo | **Open** |
| D2 | Real WhatsApp bot vs WhatsApp look-alike in the browser | Look-alike in the browser. A real bot is out of scope (§18) | **Decided**: look-alike |
| D3 | Languages | Bot messages in **Hindi** (Devanagari), captions in English. Code is built for `hi` / `bn` / `en` so Bengali can be added as content only | **Open**, default proposed |
| D4 | AI model | **Gemini 3.5 Flash** (`gemini-3.5-flash`) via Google AI Studio (see §10.3) | **Decided** |
| D5 | API key and hosting | Team's Google AI Studio key in `.env.local` (never committed); team deploys to Vercel later (§19) | **Decided** |

---

## 3. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (latest stable, App Router) + React + TypeScript** | Static pages plus one serverless API route (keeps the API key off the client) in one repo. Deploys to Vercel with zero config. |
| Styling | **Tailwind CSS v4** with brand tokens as CSS variables | Fast to build realistic WhatsApp and app UIs; tokens shared with the print kit. |
| Animation | **Motion** (`motion/react`, formerly Framer Motion) | Hand-off animations between phones, message entrances, layout transitions. |
| State | **Zustand** (tiny store) | One store drives all four screens; the story position is the single source of truth. |
| Icons | **lucide-react** | Light, consistent. WhatsApp-specific glyphs (ticks, mic, attach) drawn as small inline SVGs. |
| Fonts | `next/font/google`: **Poppins** (UI/headings), **Hind** (Devanagari), **Hind Siliguri** (Bengali) | Same families as `print/assets/print.css`, so demo, deck and printed kit match. |
| Charts / map | **Hand-built SVG** (hex map + simple bars) | The dashboard needs 4 small visuals; a chart library would be most of the bundle. |
| AI | **Gemini 3.5 Flash** through Google's **`@google/genai`** SDK, JSON mode (`responseMimeType: "application/json"` + `responseSchema`), validated again with **Zod** | Fast, cheap, good at images and Indian languages. One call turns photo + transcript into a typed listing. Tested with our key: ~5s for a structured listing. |
| Speech-to-text | **Browser Web Speech API** (`hi-IN`, `bn-IN`, `en-IN`) | Free, no extra key, live transcript as you speak. Works in Chrome/Edge (what we'll present from). Other browsers fall back to typing or sample voice notes (§9.3). |
| Image handling | Client-side resize to ≤1024px JPEG via `<canvas>` before upload | Keeps requests small (Vercel body limit 4.5 MB) and fast on slow networks. |
| Rate limiting | In-memory per-IP limiter + global daily cap from an env var | Enough for a demo; stops a shared link from burning the key. |
| Tests | **Vitest** (story-script integrity) + **Playwright** (one click-through of every beat) | Catches a broken beat before the call. |
| Package manager | **pnpm** | Already installed. |
| Hosting | **Vercel** (Hobby plan) | Single URL, preview deploys per push, edge CDN for India. |

Not using: a database (all story data is fixtures), auth (public link), a UI kit (look-alikes need custom markup anyway).

---

## 4. Site map

```
/                 Cover: one-line pitch, two buttons
/story            Guided 90-day story (the main demo)
/story?b=14       Deep link to a specific beat (for rehearsal and for answering judge questions)
/try              "Try it yourself" sandbox (live AI)
/api/listing      POST: photo + transcript → structured listing (server only)
```

Every page has a small footer: *"Concept prototype by Team 505, IIT Kharagpur, for Meesho DICE Challenge 3.0. Not an official Meesho product. Chats and data are illustrative."*

---

## 5. Visual design

### 5.1 Tokens (taken from `print/assets/print.css`)

```css
--plum:        #570d48;  /* primary brand: headers, cover background */
--plum-soft:   #f6e9f3;
--magenta:     #d94bd9;  /* accents, active states */
--orange:      #ff9f00;  /* "DUKAAN" wordmark, primary CTAs, revenue chips when earned */
--orange-soft: #fff1d6;
--coral:       #f2475b;  /* alerts, "new order", drop-off highlights */
--cyan:        #3fd3e6;  /* data / insights accents */
--cream:       #fff3d7;
--ink:         #2a1426;  /* body text */
--line:        #d9c9d4;
--desk:        #e9e4e8;  /* stage background behind phones */
```

WhatsApp screens use **WhatsApp's own palette**, not ours, so they feel familiar at once: header `#008069`, chat wallpaper `#efeae2` with the doodle pattern, outgoing bubble `#d9fdd3`, incoming `#ffffff`, blue ticks `#53bdeb`. This contrast is intentional: everything Dukaan-branded is plum/orange; WhatsApp looks like WhatsApp.

### 5.2 Type

- Headings and UI: Poppins 600/700.
- Hindi: Hind 500/600. Hindi text sits **next to** English, never replacing it, so the judges can read along.
- Phone UI text sizes follow real phone sizes (14–15px body in a 360px-wide phone) so screens look authentic and not like slides.

### 5.3 Look and feel

- Phones: realistic frames (rounded 44px corners, notch, status bar with the story time e.g. `Mon 9:14`), soft shadow on the `--desk` background.
- Focus: the active screen is full brightness and slightly scaled up (1.0); inactive screens are scale 0.92, 55% opacity, desaturated.
- Motion: quick and purposeful (150–300ms). Incoming messages show a 600–900ms typing indicator first. No decorative motion.
- Light theme only. It's a stage for screen-sharing, and WhatsApp light mode is the most recognisable.

---

## 6. Layout

### 6.1 Fixed stage that scales to fit

The story is laid out on a **1440 × 900 design canvas** and scaled with a CSS transform to fit the window (letterboxed on `--desk`). It looks the same on a 1280px laptop, a 4K monitor or a Google Meet screen-share. No reflow surprises mid-call.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ meesho DUKAAN         Ramesh Garments · Gole Bazaar          [?] [⟲] [⛶] │  top bar
│ Day 0 ●━━━━━○━━━━━○━━━━━○━━━━━○━━━━━○━━━━━○━━━━━○ Day 90                   │  chapter timeline
│  Visit  Listing  Found  Order  Stock  Tips  Review  Brands  Impact       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────┐          ┌──────────────┐          ┌──────────┐           │
│   │  LEFT    │          │   CENTRE     │          │  RIGHT   │           │
│   │  screen  │   ───▶   │   WhatsApp   │   ───▶   │  screen  │           │
│   │ (varies) │          │  (always)    │          │ (varies) │           │
│   └──────────┘          └──────────────┘          └──────────┘           │
│     label                    label                   label               │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ WHAT'S HAPPENING                                        Solves: ▸ Register drop-off │
│ One sentence of narration.                                               │
│ हिन्दी में एक लाइन (optional)                                [◀ Back] [Next ▶] │
├──────────────────────────────────────────────────────────────────────────┤
│ MEESHO EARNS  [Starter ₹299] [Pro ₹199/mo] [Insights] [Supplier access]  │
│               0% commission · ₹0 extra for buyers                         │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Centre** is always the shop owner's WhatsApp (360 × 740 phone).
- **Left / right** slots hold whichever other screen the chapter needs (300 × 620 phones): Mitra app, counter QR, buyer storefront, demand chart.
- **Wide mode** (chapters 8–9): the three phones slide out and a laptop frame (1100 × 640) slides in.
- **Caption strip:** one plain sentence per beat, plus a "Solves:" chip that ties the beat to a problem from our research (e.g. *Register drop-off, score 25*). The research connection stays visible without a slide.
- **Revenue bar:** grey chips turn orange when that stream earns. "0% commission · ₹0 extra for buyers" stays visible the whole time.

### 6.2 Phones and small screens (< 900px wide)

No scaled stage. Instead:

```
┌─────────────────────────┐
│ DUKAAN   Day 5 · Order  │
│ [Shop] [Buyer] [Mitra]  │  ← tabs; auto-switch to the active screen each beat
│ ┌─────────────────────┐ │
│ │                     │ │
│ │   active screen     │ │
│ │   (full width)      │ │
│ │                     │ │
│ └─────────────────────┘ │
│ Caption sentence…       │
│ [Starter✓][Pro][Insights]│
│      [◀]  4/9  [▶]      │
└─────────────────────────┘
```

The dashboard (chapter 8) becomes stacked cards that scroll.

---

## 7. The guided story (`/story`)

### 7.1 Structure

- 9 chapters, 28 **beats**. "Next" moves one beat. A beat is one thing happening (a message arrives, a button is tapped, a screen changes).
- **The persona:** *Ramesh Garments, Gole Bazaar, Kharagpur.* Owner Ramesh, 38, sells kurtis, sarees and kids' wear. Fictional, but built from our interviews (labelled "Persona based on 70 interviews"). The Mitra is *Sourav*, a Meesho reseller from Kharagpur. The buyer is *Priya* in Hijli.
- Money and numbers match the deck exactly (₹299, ₹199, ₹7,800 / 14 orders, ₹7,300 value, ~37×, ₹376 Cr).

### 7.2 Beat script

Notation: **L** = left screen, **C** = centre WhatsApp, **R** = right screen, **W** = wide (laptop). The 💰 column shows which revenue chip lights.

#### Chapter 1: Day 0 · The Mitra visit
*Solves: Register drop-off (25) · List items drop-off*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 1.1 | L | Mitra app opens on "New shop visit": shop name, category, Gole Bazaar pin on a mini map. | Sourav, a local Meesho Mitra, walks into Ramesh's shop. One visit, about 30 minutes. | |
| 1.2 | L | Checklist ticks off with short animations: KYC (PAN + Aadhaar photo) ✓ → GST enrolment ID applied ✓ → Bank linked ✓. | The paperwork that stops most shops is done for him, including the GST enrolment ID shops without GST registration need. | |
| 1.3 | L→R | "Listings" counter runs 0 → 20 as product photos fill a grid. Right: storefront "Ramesh Garments · New local shop" appears with those 20 items. | 20 items listed with proper photos. His shop is now live on Meesho for buyers nearby. | |
| 1.4 | L | Counter QR standee printed; "₹299 Starter Pack" UPI request → Paid ✓. | Ramesh pays ₹299 once for the Starter Pack. Refund if he gets fewer than 10 orders in 90 days. | Starter ₹299 |
| 1.5 | C | WhatsApp: new chat "Meesho Dukaan ✓" (verified). Incoming voice note (0:12) with Hindi transcript: "नमस्ते रमेश जी! आपकी दुकान अब ऑनलाइन है।" + menu buttons: `स्टॉक अपडेट` · `नया सामान` · `आज का हिसाब`. | From now on, everything happens here. On WhatsApp, which he already uses every day. | |

#### Chapter 2: Day 2 · His first listing, by himself
*Solves: "No catalog, enquiries die" · List items drop-off*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 2.1 | C | Outgoing: photo of a blue cotton kurti. | New stock arrives. Ramesh takes one photo… | |
| 2.2 | C | Outgoing voice note (0:06) with waveform; transcript fades in below it: *"Neeli kurti, M aur L, 450 rupaye."* | …and says one sentence in Hindi. No typing, no English. | |
| 2.3 | C | Typing indicator → **listing card**: photo, "Blue Cotton Kurti", Sizes M, L, ₹450, chip "Similar near you: ₹420–480". Buttons `Publish` · `Edit price` · `Retake`. | Dukaan AI turns it into a proper listing, with a price check against shops nearby. | |
| 2.4 | C→R | `Publish` tapped → a card-shaped pulse flies from C to R → the kurti appears at the top of the storefront with a "New" tag. Small link: "▸ Try this yourself" (opens `/try` in a new tab). | Live in seconds. This step is real: try it on the Try page. | |

#### Chapter 3: Day 5 · Found by a buyer nearby
*Solves: Falling footfall, invisible online (20)*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 3.1 | L | Counter QR standee: "Scan karein, ghar baithe mangaayein". | The counter QR turns walk-ins into repeat online buyers. | |
| 3.2 | R | Buyer phone (Priya, Hijli, 3 km): Meesho app "Shops near you" → Ramesh Garments → blue kurti. | Priya, 3 km away, finds Ramesh's shop under "Shops near you" in the Meesho app. | |
| 3.3 | R | Product page: ₹450, "Delivered by Valmo in 2 days", `Buy now` → order placed. | She pays the same as any Meesho listing. No extra fee for buyers. | |

#### Chapter 4: Day 5 · The first order
*Solves: Packing & pickup confusion · Payout unclear*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 4.1 | C | Incoming: "🎉 पहला ऑनलाइन ऑर्डर! Blue Cotton Kurti (M) · ₹450 · Hijli". | His first online order comes in on WhatsApp. | |
| 4.2 | C | Packing guide card: 3 illustrated steps (fold → Dukaan bag → stick label) + "Valmo pickup: कल सुबह 11 बजे". Button `पैक हो गया ✓` tapped. | Three simple steps. Valmo picks it up from his counter. | |
| 4.3 | C+R | R: tracking "Picked up → Delivered". C: "₹450 का पेमेंट 7 दिन में आपके बैंक में". | He knows exactly when the money lands. 0% commission taken. | |

#### Chapter 5: Day 9 · Shop and online stock stay in sync
*Solves: Stock confusion between shop and online*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 5.1 | C | Outgoing voice note: *"2 neeli kurti biki dukaan pe."* | Two kurtis sell at the counter. He just says so. | |
| 5.2 | C+R | Incoming: "✓ नीली कुर्ती: 6 → 4 बचीं" with `Undo`. R: storefront shows "Only 4 left". | Online stock updates at once. No double-selling, no cancellations. | |

#### Chapter 6: Day 14 · "Kya rakhein?" (What should I stock?)
*Solves: Stocking by guesswork, dead stock (16)*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 6.1 | C | Monday card "इस हफ़्ते खड़गपुर में": ▲ Cotton kurtis under ₹500 +40% · ▲ School bags: 400 searches, few sellers · ▲ Puja decor: stock 3 weeks early. Buttons `Reorder kurtis` · `Find wholesaler`. | Every Monday: what's selling on his street, from real local demand. | |
| 6.2 | C+R | `Find wholesaler` tapped → "3 wholesalers near you. Group order with 6 shops nearby saves ₹18/piece." R: simple bar chart of local kurti demand over 6 weeks. | Small shops buy together and get wholesale prices. Wholesalers pay to reach them. | Supplier access |

#### Chapter 7: Day 75 · The Sunday review and the upgrade
*Solves: "I don't know my own numbers" · Willingness to pay*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 7.1 | C | Incoming voice note (1:00, playable as a short clip if audio is ready) + transcript: "रमेश जी, इस हफ़्ते: 14 ऑनलाइन ऑर्डर से ₹7,800 · ₹2,100 का पुराना स्टॉक निकला · Best seller: नीली कुर्ती · Tip: L साइज़ बढ़ाएँ". | A 60-second voice review every Sunday. He finally sees his own numbers. | |
| 7.2 | C | "आपके 3 फ्री महीने 15 दिन में खत्म हो रहे हैं" + **value card**: margin on new orders ₹2,800 · dead stock cleared ₹3,100 · group-buy savings ₹900 · photographer saved ₹500 → **₹7,300 this month**. | Free first, pay after proof. Here's what Dukaan did for him this month. | |
| 7.3 | C | Buttons `₹149/महीना (loyalty)` · `₹49/हफ़्ता` · `बाद में`. He taps ₹149 → UPI sheet (illustrative) → "✓ Dukaan Pro चालू". Small note: "Free storefront stays free forever." | ₹199 a month (₹149 loyalty price), roughly a 37× return. And he can cancel in chat. | Pro ₹199/mo |

#### Chapter 8: The brand view
*Stream 3: Demand Insights*

| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 8.1 | W | Phones slide out; laptop slides in: **Dukaan Insights** dashboard for an illustrative D2C ethnic-wear brand. Hex map of Kharagpur localities shaded by demand index. | Thousands of shops like Ramesh's create a live map of offline demand that never existed before. | |
| 8.2 | W | Hover/auto-highlight Gole Bazaar cell: "Cotton kurtis <₹500 · demand +40% · stock-outs in 7 of 23 stores · sells at ₹420–480". Side panels: rising searches, stock-outs, price bands. | Brands see what sells, what runs out and at what price, pincode by pincode. | Insights |
| 8.3 | W | Badges pulse: "Opt-in only · ≥10 stores per cell · Data dividend to shops · DPDP-ready". | Opt-in, aggregated, and shops get a share. No single shop's data is ever shown. | |

#### Chapter 9: What it adds up to
| # | Focus | What happens | Caption | 💰 |
|---|---|---|---|---|
| 9.1 | W | Ramesh's 90 days in 4 numbers: 1 visit · 0 forms filled · 14 orders/week · ₹7,300 value/month. Next to it, what Meesho earned from this one shop: ₹299 + ₹149/mo + his share of insights revenue. **₹0 commission.** | One shop: online in one visit, earning more, paying for proof. | all lit |
| 9.2 | W | Scale ladder: 200 pilot → 5,000 (5 cities) → 50,000 (West Bengal) → 20L shops → **₹376 Cr by Year 5 (0.9% of NMV)**. | That's how Dukaan reaches ₹376 Cr a year by Year 5, 0.9% of NMV. | |
| 9.3 | W | **From the field** strip: 3–4 real interview photos with quotes, a QR to the recordings folder, "70 interviews · 150 surveys · 25 store types". Buttons: `▶ Replay` · `🎙 Try it yourself`. Closing line: *"Ask: approve the 200-shop pilot."* | We don't tax a single sale. We earn by bringing Tier 3-4 shops online and helping them win. | |

### 7.3 Chapter 8 dashboard wireframe

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ◧ Dukaan Insights     Saanjh Ethnic (illustrative)    Kharagpur ▾  Women's ethnic ▾  Last 4 wks ▾ │
├───────────────────────────────────────┬──────────────────────────────────┤
│   Demand index by locality            │  Rising this week                │
│        ⬡ ⬡ ⬡                           │  ▲ Cotton kurtis <₹500   +40%    │
│      ⬡ ⬢ ⬢ ⬡   ← Gole Bazaar (hot)    │  ▲ Printed dupattas      +22%    │
│        ⬡ ⬢ ⬡                           │  ▼ Synthetic sarees      −15%    │
│      ⬡ ⬡ ⬡ ⬡                           ├──────────────────────────────────┤
│   ░ low ▒ ▓ █ high                     │  Stock-outs                      │
│                                       │  7 of 23 stores out of L sizes   │
├───────────────────────────────────────┼──────────────────────────────────┤
│  Price band that sells (₹)            │  Opt-in · ≥10 stores per cell ·  │
│  ▁▃▇█▅▂  peak ₹420–480                │  data dividend · DPDP-ready      │
└───────────────────────────────────────┴──────────────────────────────────┘
```

The map is a stylised hex grid of ~14 named localities (Gole Bazaar, Prem Bazar, Hijli, Malancha, Inda, Kharida, Tangasole, Saradapally, Puri Gate, Nimpura, Gate Bazar, Subhaspally, Talbagicha, Chowringhee), not a real GIS map. It's clearer, lighter, and doesn't need boundary data.

---

## 8. Presenter controls

| Key | Action |
|---|---|
| `→` / `Space` / click Next | Next beat |
| `←` | Previous beat (state rebuilt instantly, no animation) |
| `Shift + →` / `Shift + ←` | Next / previous chapter |
| `1`–`9` | Jump to chapter |
| `R` | Restart story |
| `F` | Fullscreen |
| `C` | Hide/show caption strip (if we'd rather narrate ourselves) |
| `?` | Show this list |

- The URL updates to `?b=<beat>` as you go, so a refresh never loses your place and we can jump to a beat when a judge asks something.
- The guided story **makes no network or AI calls**. It can't fail mid-call because of Wi-Fi or an API outage.
- Optional autoplay (`?auto=1`): advances every ~4s, so the link works as a self-running walkthrough for judges who open it without us.

---

## 9. "Try it yourself" sandbox (`/try`)

### 9.1 Layout

```
┌──────────────────────────────────────────────────────────────────────────┐
│ meesho DUKAAN · Try it yourself                       ◀ Back to story    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐     You're the shop owner. Sell something.            │
│   │ Meesho Dukaan│                                                       │
│   │ ✓ verified   │     ① Pick a sample photo, or upload / snap your own  │
│   │              │        [kurti] [saree] [school bag] [puja thali] [chappal] │
│   │  (chat)      │                                                       │
│   │              │     ② Hold 🎤 and describe it, in Hindi, Bengali or   │
│   │              │        English. Or tap a sample voice note.           │
│   │ [📷] [ 🎤 ]   │        Try: "Laal saree, cotton, 800 rupaye"          │
│   └──────────────┘                                                       │
│                        ③ Get a real Meesho-ready listing                 │
│                                                                          │
│   ⓘ Live AI: the listing is generated for real. Orders and payments in  │
│     the story are simulated.                                             │
└──────────────────────────────────────────────────────────────────────────┘
```

On phones the instructions collapse above the chat, and the chat goes full width.

### 9.2 Flow

1. User picks a sample photo or uploads/snaps one (`<input type="file" accept="image/*" capture="environment">`). It's resized in the browser and appears as an outgoing image bubble.
2. User **holds the mic** (press-and-hold, like WhatsApp). The live transcript appears under a recording bar; on release it becomes a voice-note bubble with the transcript under it.
3. A typing indicator with staged status lines while the API works: *"सुन रहे हैं…" → "फ़ोटो देख रहे हैं…" → "लिस्टिंग बना रहे हैं…"*.
4. The **listing card** arrives: local-language title + English title, category, attributes (colour, fabric, pattern, occasion), sizes, price, short description in both languages, and "Similar near you" range.
5. If something's missing (e.g. no size given), the bot asks one follow-up in the chat with quick-reply buttons ("Free size" / "S M L XL") instead of guessing.
6. `Publish` shows a mock storefront preview tile. `Edit price` opens a number pad. `Start over` resets.

### 9.3 When speech recognition isn't available

- Safari/Firefox (no Web Speech) or mic permission denied: the mic button opens a text box with a Hinglish placeholder (*"Neeli kurti, M aur L, 450 rupaye"*).
- Always available: 4–5 **sample voice notes** as chips. Each plays a short recorded clip (team member's voice, if we record them; else just the waveform) and fills in its transcript. A judge can try the full flow without speaking.

---

## 10. AI integration

### 10.1 Endpoint

`POST /api/listing`, Node runtime on Vercel.

Request (JSON):
```ts
{
  image?: { mediaType: "image/jpeg" | "image/png" | "image/webp"; base64: string }; // ≤ 1.5 MB after client resize
  transcript: string;   // ≤ 300 chars
  lang: "hi" | "bn" | "en";
  sampleId?: string;    // set when a built-in sample photo is used
}
```

Response: `{ listing: Listing, followUp?: FollowUp }` or `{ error: "rate_limited" | "not_a_product" | "unavailable" }`.

### 10.2 Output schema (Zod)

```ts
const Listing = z.object({
  title_local: z.string(),          // "नीली कॉटन कुर्ती"
  title_en: z.string(),             // "Blue Cotton Kurti"
  category: z.enum(["kurti","saree","kids_wear","mens_wear","footwear","bags","stationery","home_decor","puja","accessories","other"]),
  attributes: z.object({
    color: z.string().nullable(),
    fabric: z.string().nullable(),
    pattern: z.string().nullable(),
    occasion: z.string().nullable(),
  }),
  sizes: z.array(z.string()),       // ["M","L"] or ["Free size"]
  price_inr: z.number().int().nullable(),
  description_local: z.string(),    // 1–2 short lines
  description_en: z.string(),
  missing: z.array(z.enum(["price","sizes","not_a_product"])), // drives the follow-up question
});
```

**"Similar near you: ₹420–480" is not from the model.** It comes from a fixed price table per category in our fixtures, so the AI never invents market data. The model fills in only what it can see in the photo or hear in the transcript.

### 10.3 Model and request

- Model: **`gemini-3.5-flash`** at thinking level `minimal` on the Google AI Studio endpoint (`generativelanguage.googleapis.com`), called through `@google/genai` (`ai.models.generateContent`). The model name lives in one env var (`GEMINI_MODEL`) so it can be changed without a code change.
- Tested 20 Oct 2026 with our key: a structured listing from a Hinglish sentence came back in **~4.9s**. Google currently serves this alias as `gemini-3.6-flash`. Other notes from testing: `gemini-flash-latest` returned "high demand" (503), `gemini-3.8-flash` timed out, and `gemini-2.5-flash` is no longer available to new keys. So we pin `gemini-3.5-flash`, and don't use `-latest` aliases.
- JSON mode: `config: { responseMimeType: "application/json", responseSchema: <Listing schema>, systemInstruction }`. The response is parsed and checked against the Zod schema before it reaches the browser; if it fails, we use the offline fallback (§10.5).
- System instruction (short, fixed): you are Meesho Dukaan's listing assistant for small shops in Tier 3-4 India; extract only what's visible or said; Hinglish/Bengali transcripts are normal; prices are in rupees; never invent sizes or prices, mark them `missing`; write titles the way a Meesho listing would.
- Parts order: image (`inlineData`, base64 JPEG) first, then the transcript text.
- Retry once on 503/429 after ~1s, then fall back. Timeout 12s on the server; the client shows staged progress during the wait.

### 10.4 Guardrails

- API key only in server env vars (`GEMINI_API_KEY`: `.env.local` locally, Vercel project settings when deployed); never sent to the browser, never committed (`.env*.local` is gitignored).
- Validate content type and size; reject anything else before calling the API.
- Rate limit: 10 requests / IP / 10 min; global daily cap `AI_DAILY_CAP` (default 500). Over the limit → friendly message + canned sample result.
- Quota / budget alert set on the Google Cloud project behind the key as a second safety net.
- Nothing stored: no images or transcripts are logged or saved.

### 10.5 Offline fallback

Every sample photo has a **pre-generated listing** saved in fixtures. If the API errors, times out or is rate-limited, the sandbox shows the pre-generated listing with a small "sample result" tag. On the call, the sandbox demo still works if the venue Wi-Fi blocks the API.

---

## 11. How the code works

### 11.1 Story engine: state is a function of the beat index

```ts
type Beat = {
  id: string;                 // "2.3"
  chapter: number;
  focus: "left" | "center" | "right" | "wide";
  clock: string;              // phone status bar, "Day 2 · Wed 10:42"
  caption: { en: string; hi?: string };
  solves?: string;            // "Register drop-off · score 25"
  chat?: ChatEvent[];         // messages appended to the WhatsApp thread
  left?: PanelState;          // e.g. { kind: "mitra", step: "kyc" }
  right?: PanelState;         // e.g. { kind: "storefront", highlight: "kurti-blue" }
  wide?: WideState;           // dashboard / impact screens
  earn?: RevenueStream[];     // chips that light on this beat
  handoff?: { from: Slot; to: Slot; payload: string }; // animated pulse
};
```

`deriveState(beats, i)` folds beats `0..i` into the full screen state (chat history, panel states, lit revenue chips). That gives us:
- **Back** and **deep links** for free: rebuild from scratch, no animation.
- **Forward**: only the new beat's items animate in.
- One `script.ts` file holds the whole story. Changing wording or order needs no component changes, and a Vitest check makes sure every beat is valid (known product IDs, panel kinds, chips).

### 11.2 Chat message types

`text` · `voice` (duration, waveform seed, transcript, optional audio src) · `image` · `listingCard` · `orderAlert` · `packingGuide` · `stockUpdate` · `trendCard` · `reviewCard` · `valueCard` · `buttons` (≤3, per our design rules) · `upiSheet` · `system` (date separators, "Messages are illustrative").

The **same `WhatsAppScreen` component** renders both the story and the sandbox, so the live AI result looks exactly like the scripted one.

### 11.3 Screens (components)

`Stage` · `PhoneFrame` · `LaptopFrame` · `WhatsAppScreen` · `MitraApp` · `CounterQR` · `BuyerStorefront` · `ProductPage` · `TrendChart` · `InsightsDashboard` · `HexMap` · `ImpactScreen` · `CaptionStrip` · `RevenueBar` · `ChapterTimeline` · `PresenterKeys` · `MobileTabs`.

The buyer storefront is styled to *suggest* the Meesho app (layout, pink accents) without copying its logo or exact UI. Dukaan's own plum/orange brand is used for Dukaan screens.

### 11.4 Directory structure

```
prototype/
├─ design.md                  ← this file
├─ README.md                  run, deploy, rehearse
├─ package.json
├─ next.config.ts
├─ .env.example               GEMINI_API_KEY, GEMINI_MODEL, AI_DAILY_CAP (placeholders, committed)
├─ .env.local                 real key (gitignored, never committed)
├─ public/
│  ├─ products/               product photos (20 for the storefront + sandbox samples)
│  ├─ field/                  real interview photos (from team)
│  ├─ audio/                  optional voice-note clips
│  └─ og.png                  link-preview image
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           fonts, metadata, OG tags
│  │  ├─ page.tsx             cover
│  │  ├─ story/page.tsx
│  │  ├─ try/page.tsx
│  │  └─ api/listing/route.ts
│  ├─ components/
│  │  ├─ stage/               Stage, PhoneFrame, LaptopFrame, CaptionStrip, RevenueBar, ChapterTimeline
│  │  ├─ whatsapp/            WhatsAppScreen + one file per message type
│  │  ├─ screens/             MitraApp, BuyerStorefront, ProductPage, CounterQR, TrendChart
│  │  ├─ dashboard/           InsightsDashboard, HexMap, panels
│  │  └─ try/                 MicButton, PhotoPicker, SampleChips
│  ├─ story/
│  │  ├─ script.ts            all 34 beats
│  │  ├─ derive.ts            deriveState()
│  │  └─ store.ts             Zustand store (beat index, mode, autoplay)
│  ├─ data/                   shop, products, localities, insights, price bands, sample listings
│  ├─ lib/                    speech.ts, resizeImage.ts, rateLimit.ts, gemini.ts
│  └─ styles/globals.css      tokens + Tailwind
└─ tests/
   ├─ script.test.ts          every beat valid
   └─ story.spec.ts           Playwright: step through all beats, no console errors
```

---

## 12. Content and assets we need from the team

| Asset | Used in | Needed? |
|---|---|---|
| ~20 product photos from a real Kharagpur shop (phone photos are fine) | Storefront, Mitra listing grid, sandbox samples | **Strongly preferred.** Fallback: licensed stock photos |
| 3–4 field/interview photos + one-line quotes (with consent) | Chapter 9 "From the field" | **Yes** |
| Link to the recordings folder | QR in chapter 9 | Yes |
| A team member recording 4–5 short Hindi voice notes (5–10s each) | Sandbox samples, chapter 2/7 playback | Nice to have |
| Team names as they should appear | Cover, footer | Yes |
| Bengali translations of the bot messages (if D3 = Hindi + Bengali) | WhatsApp strings | Only if Bengali |

---

## 13. Cover page (`/`)

Plum background (as on the print poster), orange "DUKAAN" wordmark, Hindi line "अपनी दुकान, अब ऑनलाइन".

- One line: *"Online in one visit. Run entirely from WhatsApp."*
- Sub: *"A shop owner who can only use WhatsApp, selling on Meesho."*
- Proof strip: 70 interviews · 150 surveys · 25 store types · ₹376 Cr by Year 5.
- Buttons: `▶ Watch the 90-day story` (primary, orange) · `🎙 Try it yourself`.
- Small "How to present" hint: arrow keys, `?` for shortcuts.

Link preview (`og.png`, title, description) is designed so the URL looks good when pasted into email or WhatsApp.

---

## 14. Accessibility and performance

- Every scripted voice note shows its transcript; audio is never the only channel.
- Colour is never the only signal (revenue chips also get a ✓; heatmap has a legend and numbers on hover).
- Keyboard-operable everywhere; visible focus rings; `prefers-reduced-motion` turns hand-offs into fades.
- Target: story page < 300 KB JS gzipped, product images as optimised WebP via `next/image`, first load < 2s on 4G.
- `<meta name="robots" content="noindex">`: it's a competition demo, not a public product.

---

## 15. Testing and rehearsal

- `pnpm test`: script integrity (Vitest).
- `pnpm e2e`: Playwright steps through all 34 beats at 1440×900 and 390×844 and fails on any console error.
- Manual checklist before the call: Chrome, presenting from the deployed URL (not localhost), mic permission granted in advance, sandbox tested once on the venue network, fallback tested by temporarily unsetting the key on a preview deploy.

---

## 16. Build plan

Ordered so that stopping after any milestone still leaves something demo-able.

| Milestone | Delivers | Demo-able after this? |
|---|---|---|
| **M1 Skeleton** | Next.js app, tokens, fonts, cover page, scaled stage, phone/laptop frames, deployed to Vercel | Cover only |
| **M2 Story engine + Ch 1–2** | `script.ts`, `deriveState`, WhatsApp screen + core message types, Mitra app, storefront, hand-off animation, presenter keys | **Yes**: the core pitch |
| **M3 Ch 3–7** | Buyer flow, order/packing, stock sync, trend card, review + value card + upgrade, revenue bar complete | Yes: full shop story |
| **M4 Ch 8–9** | Insights dashboard + hex map, impact/scale screen, field evidence strip | Yes: full story |
| **M5 Sandbox + AI** | `/try`, photo picker, mic + Web Speech, `/api/listing`, follow-up questions, fallbacks, rate limit | Yes: full site |
| **M6 Polish** | Mobile layout, autoplay mode, OG image, a11y pass, Playwright run, rehearsal checklist | Submission-ready |

---

## 17. Risks

| Risk | Mitigation |
|---|---|
| Wi-Fi or API fails during the call | Story is fully offline; sandbox has pre-generated fallbacks |
| Web Speech mishears Hindi on a noisy call | Transcript shown live and editable before sending; sample voice notes as backup |
| AI returns a wrong price/size | Prompt forbids guessing; missing fields trigger a follow-up question; user can edit price |
| Judges open it on a phone | Dedicated mobile layout (§6.2) |
| Shared link burns API credit | Per-IP limit, daily cap, Google Cloud budget alert |
| Gemini "high demand" (503) during the call | Pinned model (not `-latest`), one retry, then pre-generated fallback |
| Looks like a fake Meesho product | Clear "concept prototype" footer; Meesho logo/UI not copied; Dukaan uses its own brand |

---

## 18. Out of scope (for now)

- A real WhatsApp number/bot (Meta Cloud API or Twilio). Possible later; would reuse `/api/listing` unchanged.
- Real payments, real orders, real Meesho APIs.
- User accounts, saving data, analytics dashboards beyond optional Vercel Analytics.
- Text-to-speech for bot voice notes (scripted voice notes use recorded clips or show the waveform + transcript only).
- Languages beyond Hindi/Bengali/English.

---

## 19. Deployment

**There is no separate backend.** It's one Next.js project, deployed as one Vercel project:

- The pages (`/`, `/story`, `/try`) are built as static files and served from Vercel's CDN.
- `/api/listing` is a file in the same repo (`src/app/api/listing/route.ts`). Vercel automatically turns it into a serverless function on the same domain. Nothing to host or keep running.

```
Browser ──▶ dukaan-demo.vercel.app/story      static page (CDN)
        ──▶ dukaan-demo.vercel.app/api/listing serverless function ──▶ Gemini API
                                                (holds GEMINI_API_KEY)
```

**Locally:** `pnpm dev` runs pages and the API route together on `localhost:3000`, reading the key from `prototype/.env.local`.

**When you deploy (later):**
1. Push the repo to GitHub, then "Import Project" on vercel.com. Set **Root Directory = `prototype`**.
2. In Project Settings → Environment Variables, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, `AI_DAILY_CAP`).
3. Deploy. Every later push redeploys automatically; you get one URL like `dukaan-demo.vercel.app`, which is the single hyperlink we submit.

Alternative without GitHub: `pnpm dlx vercel` from `prototype/`, then add the env var with `vercel env add GEMINI_API_KEY`.
