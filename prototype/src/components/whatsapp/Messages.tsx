"use client";

import { Check, CheckCheck, Mic, Package, Play, Reply, Shirt, Sticker, TrendingDown, TrendingUp, Undo2, Users } from "lucide-react";
import type { ReactNode } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { productById } from "@/data/products";
import type { Listing, Msg } from "@/story/types";

export type MsgActions = {
  onButton?: (msgId: string, index: number, label: string) => void;
};

type Ctx = { showTranslation: boolean; actions?: MsgActions };

export function MessageView({ m, ctx }: { m: Msg; ctx: Ctx }) {
  switch (m.t) {
    case "date":
      return (
        <div className="my-2 flex justify-center">
          <span className="rounded-md bg-white/90 px-2.5 py-0.5 text-[11px] font-medium text-wa-meta shadow-sm">{m.text}</span>
        </div>
      );
    case "text":
      return (
        <Bubble from={m.from} time={m.time}>
          <p className="whitespace-pre-line">{m.text}</p>
          <Translation en={m.en} show={ctx.showTranslation} />
          {m.buttons && <QuickReplies id={m.id} buttons={m.buttons} picked={m.picked} ctx={ctx} />}
        </Bubble>
      );
    case "voice":
      return (
        <Bubble from={m.from} time={m.time} wide>
          <VoiceNote from={m.from} dur={m.dur} />
          <Transcript text={m.transcript} />
          <Translation en={m.en} show={ctx.showTranslation} />
        </Bubble>
      );
    case "image":
      return (
        <Bubble from={m.from} time={m.time} tight>
          <div className="h-44 w-44 overflow-hidden rounded-md">
            {m.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.src} alt="" className="h-full w-full object-cover" />
            ) : m.productId ? (
              <ProductArt art={productById(m.productId).art} photo={productById(m.productId).photo} rounded="rounded-md" />
            ) : null}
          </div>
        </Bubble>
      );
    case "listing":
      return (
        <Bubble from="bot" time={m.time} wide tight>
          <ListingCard listing={m.listing} status={m.status} />
          <QuickReplies
            id={m.id}
            buttons={["Publish", "दाम बदलें", "फिर से फ़ोटो"]}
            picked={m.picked}
            ctx={ctx}
          />
        </Bubble>
      );
    case "order":
      return <OrderCard m={m} />;
    case "packing":
      return <PackingCard time={m.time} />;
    case "stock":
      return <StockCard m={m} />;
    case "trend":
      return <TrendCard m={m} ctx={ctx} />;
    case "wholesale":
      return <WholesaleCard time={m.time} />;
    case "review":
      return <ReviewCard time={m.time} ctx={ctx} />;
    case "value":
      return <ValueCard time={m.time} />;
    case "upi":
      return <UpiCard m={m} />;
  }
}

/* ---------- building blocks ---------- */

export function Bubble({
  from,
  time,
  children,
  wide,
  tight,
}: {
  from: "shop" | "bot";
  time: string;
  children: ReactNode;
  wide?: boolean;
  tight?: boolean;
}) {
  const out = from === "shop";
  return (
    <div className={`flex ${out ? "justify-end" : "justify-start"} px-2.5`}>
      <div
        className={`relative ${wide ? "w-[86%]" : "max-w-[84%]"} rounded-lg ${tight ? "p-1" : "px-2 pt-1.5 pb-1"} text-[13px] leading-[1.38] text-wa-text shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${
          out ? "rounded-tr-none bg-wa-out" : "rounded-tl-none bg-wa-in"
        }`}
      >
        <Tail out={out} />
        {children}
        <div className={`flex items-center justify-end gap-1 ${tight ? "px-1 pb-0.5" : ""} text-[10.5px] text-wa-meta`}>
          {time}
          {out && <CheckCheck size={14} className="text-wa-tick" />}
        </div>
      </div>
    </div>
  );
}

function Tail({ out }: { out: boolean }) {
  return (
    <svg
      viewBox="0 0 8 13"
      className={`absolute top-0 h-[13px] w-2 ${out ? "-right-2 text-wa-out" : "-left-2 text-wa-in"}`}
      aria-hidden
    >
      <path fill="currentColor" d={out ? "M0 0h8L0 13z" : "M8 0H0l8 13z"} />
    </svg>
  );
}

function Translation({ en, show }: { en?: string; show: boolean }) {
  if (!en || !show) return null;
  return <p className="mt-1 border-t border-black/5 pt-1 text-[11px] italic leading-snug text-wa-meta">{en}</p>;
}

function QuickReplies({ id, buttons, picked, ctx }: { id: string; buttons: string[]; picked?: number; ctx: Ctx }) {
  return (
    <div className="-mx-2 mt-1.5 -mb-1 border-t border-black/5">
      {buttons.map((b, i) => {
        const active = picked === i;
        const dim = picked !== undefined && !active;
        return (
          <button
            key={b}
            type="button"
            disabled={picked !== undefined || !ctx.actions?.onButton}
            onClick={() => ctx.actions?.onButton?.(id, i, b)}
            className={`flex w-full items-center justify-center gap-1.5 border-b border-black/5 py-1.5 text-[13px] font-medium last:border-b-0 ${
              active ? "bg-emerald-50 text-wa-header" : dim ? "text-wa-meta/60" : "text-[#027eb5]"
            } ${ctx.actions?.onButton && picked === undefined ? "cursor-pointer hover:bg-black/[.03]" : "cursor-default"}`}
          >
            {active ? <Check size={14} /> : <Reply size={13} className="-scale-x-100" />}
            {b}
          </button>
        );
      })}
    </div>
  );
}

function seeded(n: number, seed: number) {
  let s = seed;
  return Array.from({ length: n }, () => {
    s = (s * 9301 + 49297) % 233280;
    return 0.25 + (s / 233280) * 0.75;
  });
}

export function VoiceNote({ from, dur, playing = false }: { from: "shop" | "bot"; dur: string; playing?: boolean }) {
  const bars = seeded(28, dur.length * 7 + (from === "shop" ? 3 : 11) + dur.charCodeAt(dur.length - 1));
  return (
    <div className="flex items-center gap-2 py-1 pr-1">
      <div className="relative shrink-0">
        {from === "bot" ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-[10px] font-bold text-orange">MD</div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfe5e7] text-[13px] font-semibold text-[#54656f]">R</div>
        )}
        <Mic size={12} className={`absolute -right-0.5 -bottom-0.5 rounded-full ${from === "shop" ? "text-wa-tick" : "text-wa-green"}`} />
      </div>
      <Play size={20} className="shrink-0 fill-[#54656f] text-[#54656f]" />
      <div className="flex h-7 flex-1 items-center gap-[2px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className={`w-[2.5px] rounded-full ${playing ? "animate-pulse" : ""} ${i < 4 ? "bg-wa-tick" : "bg-[#a6b4bb]"}`}
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>
      <span className="shrink-0 text-[11px] text-wa-meta">{dur}</span>
    </div>
  );
}

function Transcript({ text }: { text: string }) {
  return (
    <div className="mt-0.5 rounded-md bg-black/[.04] px-2 py-1 text-[12.5px] leading-snug">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-wa-meta">Transcript</span>
      {text}
    </div>
  );
}

function CardHeader({ children, tone = "plum" }: { children: ReactNode; tone?: "plum" | "coral" | "green" | "cyan" }) {
  const cls = {
    plum: "bg-plum text-white",
    coral: "bg-coral text-white",
    green: "bg-wa-header text-white",
    cyan: "bg-[#0e7c8a] text-white",
  }[tone];
  return <div className={`rounded-t-md px-2.5 py-1.5 text-[12px] font-semibold ${cls}`}>{children}</div>;
}

export function ListingCard({ listing, status }: { listing: Listing; status?: string }) {
  let p: ReturnType<typeof productById> | null = null;
  try {
    p = productById(listing.productId);
  } catch {
    p = null;
  }
  return (
    <div className="overflow-hidden rounded-md border border-black/5 bg-white">
      <CardHeader>
        <span className="text-orange">Meesho Dukaan</span> · लिस्टिंग तैयार ✓
      </CardHeader>
      <div className="flex gap-2 p-2">
        <div className="h-[84px] w-[72px] shrink-0 overflow-hidden rounded">
          {listing.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.imageSrc} alt="" className="h-full w-full object-cover" />
          ) : p ? (
            <ProductArt art={p.art} photo={p.photo} rounded="rounded" />
          ) : (
            <div className="h-full w-full bg-plum-soft" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold leading-tight">{listing.titleLocal}</p>
          <p className="truncate text-[11.5px] text-wa-meta">{listing.title}</p>
          <p className="mt-0.5 text-[17px] font-bold leading-tight">
            {listing.price > 0 ? `₹${listing.price}` : <span className="text-[13px] font-semibold text-coral">दाम? · price?</span>}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-1">
            {listing.sizes.map((s) => (
              <span key={s} className="rounded border border-black/15 px-1.5 text-[10.5px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      {listing.description && <p className="px-2 pb-1 text-[11.5px] leading-snug text-wa-text">{listing.description}</p>}
      {listing.attributes && listing.attributes.length > 0 && (
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 px-2 pb-1.5 text-[11px] text-wa-meta">
          {listing.attributes.map((a) => (
            <span key={a.label}>
              {a.label}: <b className="font-medium text-wa-text">{a.value}</b>
            </span>
          ))}
        </div>
      )}
      {listing.near && (
        <div className="mx-2 mb-2 rounded bg-orange-soft px-2 py-1 text-[11px]">
          📍 पास की दुकानों में: <b>₹{listing.near[0]}–{listing.near[1]}</b>
          <span className="text-wa-meta"> · Similar near you</span>
        </div>
      )}
      {status && (
        <div className="border-t border-black/5 bg-emerald-50 px-2 py-1 text-[11.5px] font-semibold text-wa-header">✓ {status}</div>
      )}
    </div>
  );
}

function OrderCard({ m }: { m: Extract<Msg, { t: "order" }> }) {
  const p = productById(m.productId);
  return (
    <Bubble from="bot" time={m.time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader tone="coral">🎉 पहला ऑनलाइन ऑर्डर! · First online order</CardHeader>
        <div className="flex gap-2 p-2">
          <div className="h-14 w-12 shrink-0">
            <ProductArt art={p.art} photo={p.photo} rounded="rounded" />
          </div>
          <div className="text-[12px] leading-snug">
            <p className="font-semibold">{p.titleHi}</p>
            <p>
              साइज़ {m.size} · <b>₹{m.price}</b>
            </p>
            <p className="text-wa-meta">📍 {m.place}</p>
          </div>
        </div>
        <div className="mx-2 mb-2 rounded bg-[#e7f6ee] px-2 py-1 text-[11.5px]">
          🚚 Valmo पिकअप: <b>कल सुबह 11 बजे</b>, आपकी दुकान से
        </div>
      </div>
    </Bubble>
  );
}

function PackingCard({ time }: { time: string }) {
  const steps = [
    { icon: Shirt, hi: "कपड़ा तह करें", en: "Fold" },
    { icon: Package, hi: "दुकान बैग में", en: "Bag it" },
    { icon: Sticker, hi: "लेबल चिपकाएँ", en: "Label" },
  ];
  return (
    <Bubble from="bot" time={time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader tone="green">📦 पैकिंग: 3 आसान स्टेप</CardHeader>
        <div className="grid grid-cols-3 gap-1 p-2">
          {steps.map((s, i) => (
            <div key={s.en} className="flex flex-col items-center rounded bg-[#f0f2f5] p-1.5 text-center">
              <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-wa-header">
                <s.icon size={17} />
              </div>
              <span className="text-[11px] font-semibold leading-tight">
                {i + 1}. {s.hi}
              </span>
              <span className="text-[9.5px] text-wa-meta">{s.en}</span>
            </div>
          ))}
        </div>
        <p className="px-2 pb-1.5 text-[11px] text-wa-meta">लेबल Dukaan किट में है · Label is in your Dukaan kit</p>
      </div>
    </Bubble>
  );
}

function StockCard({ m }: { m: Extract<Msg, { t: "stock" }> }) {
  const p = productById(m.productId);
  return (
    <Bubble from="bot" time={m.time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader tone="green">✅ स्टॉक अपडेट · Stock updated</CardHeader>
        <div className="flex items-center gap-2 p-2">
          <div className="h-12 w-10 shrink-0">
            <ProductArt art={p.art} photo={p.photo} rounded="rounded" />
          </div>
          <div className="flex-1 text-[12px]">
            <p className="font-semibold">{p.titleHi}</p>
            <p className="text-[15px] font-bold">
              {m.before} <span className="text-wa-meta">→</span> {m.after} <span className="text-[12px] font-medium">बचीं</span>
            </p>
            <p className="text-[10.5px] text-wa-meta">दुकान और ऑनलाइन, दोनों में · Shop + online</p>
          </div>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-center gap-1.5 border-t border-black/5 py-1.5 text-[13px] font-medium text-[#027eb5]">
        <Undo2 size={14} /> Undo
      </div>
    </Bubble>
  );
}

function TrendCard({ m, ctx }: { m: Extract<Msg, { t: "trend" }>; ctx: Ctx }) {
  const rows = [
    { up: true, hi: "कॉटन कुर्ती ₹500 से कम", en: "Cotton kurtis under ₹500", v: "+40%" },
    { up: true, hi: "स्कूल बैग: 400 सर्च, कम दुकानें", en: "School bags: 400 searches, few sellers", v: "400" },
    { up: true, hi: "पूजा सजावट: 3 हफ़्ते पहले रखें", en: "Puja decor: stock 3 weeks early", v: "Durga Puja" },
    { up: false, hi: "सिंथेटिक साड़ी", en: "Synthetic sarees", v: "−15%" },
  ];
  return (
    <Bubble from="bot" time={m.time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader tone="cyan">📈 क्या रखें? इस हफ़्ते खड़गपुर में</CardHeader>
        <ul className="divide-y divide-black/5 px-2">
          {rows.map((r) => (
            <li key={r.en} className="flex items-center gap-2 py-1.5">
              {r.up ? (
                <TrendingUp size={15} className="shrink-0 text-emerald-600" />
              ) : (
                <TrendingDown size={15} className="shrink-0 text-coral" />
              )}
              <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[12px] font-medium">{r.hi}</p>
                {ctx.showTranslation && <p className="text-[10px] text-wa-meta">{r.en}</p>}
              </div>
              <span className={`shrink-0 text-[11px] font-bold ${r.up ? "text-emerald-700" : "text-coral"}`}>{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
      <QuickReplies id={m.id} buttons={["कुर्ती दोबारा मँगाएँ", "होलसेलर ढूँढें"]} picked={m.picked} ctx={ctx} />
    </Bubble>
  );
}

function WholesaleCard({ time }: { time: string }) {
  const rows = [
    { n: "Burrabazar Textiles, Kolkata", p: 236, min: 20 },
    { n: "Maa Tara Garments, Kharagpur", p: 244, min: 10 },
    { n: "Howrah Hosiery Hub", p: 229, min: 50 },
  ];
  return (
    <Bubble from="bot" time={time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader>🏬 कॉटन कुर्ती: 3 होलसेलर आपके पास</CardHeader>
        <ul className="divide-y divide-black/5 px-2 text-[11.5px]">
          {rows.map((r) => (
            <li key={r.n} className="flex justify-between py-1.5">
              <span className="truncate pr-2">{r.n}</span>
              <span className="shrink-0">
                <b>₹{r.p}</b>/पीस · min {r.min}
              </span>
            </li>
          ))}
        </ul>
        <div className="m-2 rounded bg-plum-soft p-2">
          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-plum">
            <Users size={14} /> ग्रुप ऑर्डर: 6 दुकानें जुड़ीं
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full w-[60%] rounded-full bg-orange" />
          </div>
          <p className="mt-1 text-[11px]">
            साथ में खरीदें, <b>₹18/पीस बचत</b> · Buy together, save ₹18/piece
          </p>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-center gap-1.5 border-t border-black/5 py-1.5 text-[13px] font-medium text-[#027eb5]">
        <Reply size={13} className="-scale-x-100" /> ग्रुप ऑर्डर में जुड़ें
      </div>
    </Bubble>
  );
}

function ReviewCard({ time, ctx }: { time: string; ctx: Ctx }) {
  const rows = [
    { k: "14 ऑनलाइन ऑर्डर", en: "14 online orders", v: "₹7,800" },
    { k: "पुराना स्टॉक निकला", en: "Old stock cleared", v: "₹2,100" },
    { k: "बेस्ट सेलर", en: "Best seller", v: "नीली कुर्ती" },
  ];
  return (
    <Bubble from="bot" time={time} wide>
      <VoiceNote from="bot" dur="1:00" />
      <div className="mt-1 overflow-hidden rounded-md border border-black/5">
        <div className="bg-plum px-2 py-1 text-[11.5px] font-semibold text-white">🗓 रमेश जी, इस हफ़्ते का हिसाब</div>
        <ul className="divide-y divide-black/5 bg-white px-2">
          {rows.map((r) => (
            <li key={r.en} className="flex items-center justify-between py-1 text-[12px]">
              <span>
                {r.k}
                {ctx.showTranslation && <span className="block text-[10px] text-wa-meta">{r.en}</span>}
              </span>
              <b>{r.v}</b>
            </li>
          ))}
        </ul>
        <div className="bg-orange-soft px-2 py-1 text-[11.5px]">
          💡 सलाह: <b>L साइज़ ज़्यादा रखें</b>, 9 लोगों ने माँगा
          {ctx.showTranslation && <span className="block text-[10px] text-wa-meta">Tip: stock more L sizes, 9 people asked</span>}
        </div>
      </div>
    </Bubble>
  );
}

function ValueCard({ time }: { time: string }) {
  const rows = [
    { k: "14 नए ऑर्डर का मुनाफ़ा", en: "Margin on 14 new orders", v: 2800 },
    { k: "पुराना स्टॉक बिका", en: "Dead stock cleared", v: 3100 },
    { k: "ग्रुप ख़रीद बचत", en: "Group-buy savings", v: 900 },
    { k: "फ़ोटोग्राफ़र का ख़र्च बचा", en: "Photographer saved", v: 500 },
  ];
  return (
    <Bubble from="bot" time={time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <CardHeader>💰 इस महीने आपका फ़ायदा · Value this month</CardHeader>
        <ul className="divide-y divide-black/5 px-2">
          {rows.map((r) => (
            <li key={r.en} className="flex items-center justify-between py-1 text-[12px]">
              <span className="leading-tight">
                {r.k}
                <span className="block text-[10px] text-wa-meta">{r.en}</span>
              </span>
              <b>₹{r.v.toLocaleString("en-IN")}</b>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between bg-emerald-50 px-2 py-1.5">
          <span className="text-[12px] font-semibold">कुल फ़ायदा · Total</span>
          <span className="text-[17px] font-bold text-wa-header">₹7,300</span>
        </div>
        <p className="px-2 py-1 text-center text-[11px] text-wa-meta">
          Dukaan Pro: ₹199/महीना · <b className="text-plum">~37× return</b>
        </p>
      </div>
    </Bubble>
  );
}

function UpiCard({ m }: { m: Extract<Msg, { t: "upi" }> }) {
  return (
    <Bubble from="bot" time={m.time} wide tight>
      <div className="overflow-hidden rounded-md bg-white">
        <div className="flex items-center gap-2 bg-[#f0f2f5] px-2.5 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-wa-header text-[11px] font-bold text-white">₹</div>
          <div className="leading-tight">
            <p className="text-[11px] text-wa-meta">UPI payment · illustrative</p>
            <p className="text-[12.5px] font-semibold">{m.label}</p>
          </div>
        </div>
        <div className="flex items-end justify-between px-2.5 py-2">
          <p className="text-[22px] font-bold leading-none">₹{m.amount}</p>
          <p className="flex items-center gap-1 text-[12px] font-semibold text-wa-header">
            <CheckCheck size={15} /> Paid
          </p>
        </div>
        <p className="border-t border-black/5 px-2.5 py-1 text-[10.5px] text-wa-meta">
          Autopay on · cancel anytime by typing “cancel”
        </p>
      </div>
    </Bubble>
  );
}
