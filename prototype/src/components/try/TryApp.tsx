"use client";

import { ArrowLeft, Camera, ImagePlus, Info, Keyboard, Mic, Paperclip, SendHorizontal, Smile, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { PhoneFrame } from "@/components/stage/Frames";
import { Wordmark } from "@/components/stage/parts";
import { WhatsAppScreen } from "@/components/whatsapp/WhatsAppScreen";
import { SAMPLE_PRODUCTS } from "@/data/products";
import { FALLBACK_LISTINGS, SAMPLE_PHRASES } from "@/data/samples";
import type { ListingResponse, ModelListing } from "@/lib/listing";
import { resizeImage, svgToPhoto, useSpeech, type Photo } from "@/lib/media";
import type { Listing, Msg } from "@/story/types";

type Lang = "hi" | "bn" | "en";
const LANGS: { key: Lang; label: string; speech: string }[] = [
  { key: "hi", label: "हिन्दी", speech: "hi-IN" },
  { key: "bn", label: "বাংলা", speech: "bn-IN" },
  { key: "en", label: "English", speech: "en-IN" },
];

const ONE_SIZE = new Set(["saree", "bags", "puja", "home_decor", "stationery"]);

const STATUS = ["सुन रहे हैं…", "फ़ोटो देख रहे हैं…", "लिस्टिंग बना रहे हैं…"];

type Pending = Photo & { sampleId?: string };
type FollowUp = { msgId: string; kind: "sizes" | "price"; listingMsgId: string };
type Meta = { ms: number; model: string; fallback?: boolean } | null;

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false });

const GREETING: Msg[] = [
  { id: "g0", t: "date", text: "आज", time: "" },
  {
    id: "g1",
    t: "text",
    from: "bot",
    time: "",
    text: "नमस्ते! 👋 सामान की फ़ोटो भेजिए, फिर 🎤 दबाकर बोलिए: क्या है, साइज़, दाम।",
    en: "Hi! Send a product photo, then hold 🎤 and say what it is, sizes and price.",
  },
];

export function TryApp() {
  const [msgs, setMsgs] = useState<Msg[]>(GREETING);
  const [animateFrom, setAnimateFrom] = useState(GREETING.length);
  const [typing, setTyping] = useState<string | false>(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [followUp, setFollowUp] = useState<FollowUp | null>(null);
  const [awaitPrice, setAwaitPrice] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>("hi");
  const [text, setText] = useState("");
  const [meta, setMeta] = useState<Meta>(null);
  const [selectedSample, setSelectedSample] = useState<string>("sample-kurti");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const msgsRef = useRef(msgs);
  const idRef = useRef(0);
  const lastReq = useRef<{ transcript: string; photo: Pending | null } | null>(null);
  const speech = useSpeech();
  const recStart = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sampleRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [voiceTip, setVoiceTip] = useState(false);

  useEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const nid = () => `u${++idRef.current}`;

  const push = useCallback((...add: Msg[]) => {
    setAnimateFrom(msgsRef.current.length);
    const next = [...msgsRef.current, ...add];
    msgsRef.current = next;
    setMsgs(next);
  }, []);

  const patch = useCallback((id: string, fn: (m: Msg) => Msg) => {
    const next = msgsRef.current.map((m) => (m.id === id ? fn(m) : m));
    msgsRef.current = next;
    setAnimateFrom(next.length);
    setMsgs(next);
  }, []);

  const bot = (text: string, en?: string, buttons?: string[]): Msg => ({ id: nid(), t: "text", from: "bot", time: now(), text, en, buttons });

  /* ---------- talking to the API ---------- */

  const toListing = (l: ModelListing, near: [number, number], photo: Pending | null): Listing => ({
    productId: photo?.sampleId ?? "",
    imageSrc: photo && !photo.sampleId ? photo.src : undefined,
    title: l.title_en,
    titleLocal: l.title_local,
    sizes: l.sizes,
    price: l.price_inr,
    near,
    description: l.description_local,
    attributes: [
      { label: "Colour", value: l.color },
      { label: "Fabric", value: l.fabric },
      { label: "Pattern", value: l.pattern },
      { label: "Occasion", value: l.occasion },
    ].filter((a) => a.value),
  });

  const askNext = useCallback((listingMsgId: string, missing: ("sizes" | "price")[]) => {
    if (missing.includes("sizes")) {
      const m = bot("कौन-कौन से साइज़ हैं?", "Which sizes do you have?", ["Free size", "S M L", "M L XL"]);
      setFollowUp({ msgId: m.id, kind: "sizes", listingMsgId });
      push(m);
      return true;
    }
    if (missing.includes("price")) {
      const m = bot("दाम कितना रखें? बोलिए या लिखिए।", "What price? Say it or type it.", ["₹199", "₹299", "₹499"]);
      setFollowUp({ msgId: m.id, kind: "price", listingMsgId });
      push(m);
      return true;
    }
    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [push]);

  const run = useCallback(
    async (transcript: string, photo: Pending | null) => {
      lastReq.current = { transcript, photo };
      let s = 0;
      setTyping(STATUS[0]);
      const tick = setInterval(() => {
        s = Math.min(s + 1, STATUS.length - 1);
        setTyping(STATUS[s]);
      }, 1500);
      const started = performance.now();
      let res: ListingResponse;
      try {
        const r = await fetch("/api/listing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: photo ? { mediaType: photo.mediaType, base64: photo.base64 } : undefined,
            transcript,
            lang,
            sampleId: photo?.sampleId,
          }),
        });
        res = (await r.json()) as ListingResponse;
      } catch {
        res = { ok: false, error: "unavailable" };
      } finally {
        clearInterval(tick);
        setTyping(false);
      }

      if (!res.ok && res.error !== "not_a_product" && photo?.sampleId && FALLBACK_LISTINGS[photo.sampleId]) {
        const l = FALLBACK_LISTINGS[photo.sampleId];
        res = { ok: true, listing: l, near: [l.price_inr - 30, l.price_inr + 30], ms: Math.round(performance.now() - started), model: "sample" };
      }

      if (res.ok) {
        let l = res.listing;
        if (ONE_SIZE.has(l.category) && l.sizes.length === 0) {
          l = { ...l, sizes: ["Free size"], missing: l.missing.filter((m) => m !== "sizes") };
        }
        const missing = l.missing.filter((m) => (m === "price" ? l.price_inr <= 0 : l.sizes.length === 0));
        const id = nid();
        push({ id, t: "listing", from: "bot", time: now(), listing: toListing(l, res.near, photo) });
        setMeta({ ms: res.ms, model: res.model, fallback: res.model === "sample" });
        if (res.model === "sample") push(bot("(AI अभी व्यस्त है, यह सैंपल लिस्टिंग है)", "AI is busy right now: this is a pre-made sample listing."));
        askNext(id, missing);
      } else if (res.error === "not_a_product") {
        push(bot("यह दुकान का सामान नहीं लग रहा 🤔 सामान की साफ़ फ़ोटो भेजिए।", "That doesn't look like a product. Send a clear photo of the item."));
        setPending(null);
      } else if (res.error === "rate_limited") {
        push(bot("थोड़ा रुकिए, बहुत सारे मैसेज आ गए। एक मिनट बाद फिर भेजिए 🙏", "Too many tries. Please wait a minute and try again."));
      } else {
        push(bot("नेटवर्क धीमा है। फिर से भेजें?", "The network is slow. Try again?", ["फिर से भेजें"]));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, push, askNext],
  );

  /* ---------- user actions ---------- */

  const sendPhoto = (photo: Pending) => {
    setPending(photo);
    setFollowUp(null);
    setAwaitPrice(null);
    push({ id: nid(), t: "image", from: "shop", time: now(), src: photo.sampleId ? undefined : photo.src, productId: photo.sampleId });
    push(bot("बढ़िया फ़ोटो! अब 🎤 दबाकर बताइए: क्या है, साइज़, दाम।", "Nice photo! Now hold 🎤 and say what it is, the sizes and the price."));
  };

  const applyPrice = (listingMsgId: string, value: number) => {
    patch(listingMsgId, (m) => (m.t === "listing" ? { ...m, listing: { ...m.listing, price: value } } : m));
  };

  const handleDescription = (said: string, viaVoice: boolean, dur?: string) => {
    const clean = said.trim();
    if (!clean) return;
    push(
      viaVoice
        ? { id: nid(), t: "voice", from: "shop", time: now(), dur: dur ?? "0:05", transcript: clean }
        : { id: nid(), t: "text", from: "shop", time: now(), text: clean },
    );

    // Answering a follow-up question in free form.
    const target = awaitPrice ?? (followUp?.kind === "price" ? followUp.listingMsgId : null);
    if (target) {
      const n = Number(clean.replace(/[^\d]/g, ""));
      if (n > 0) {
        applyPrice(target, n);
        setAwaitPrice(null);
        setFollowUp(null);
        push(bot(`✓ दाम ₹${n} कर दिया।`, `Price set to ₹${n}.`));
      } else {
        push(bot("सिर्फ़ दाम बताइए, जैसे 450", "Just the price, e.g. 450"));
      }
      return;
    }
    if (followUp?.kind === "sizes") {
      const sizes = clean.toUpperCase().split(/[\s,/]+/).filter(Boolean);
      const lm = followUp.listingMsgId;
      patch(lm, (m) => (m.t === "listing" ? { ...m, listing: { ...m.listing, sizes } } : m));
      setFollowUp(null);
      const l = msgsRef.current.find((m) => m.id === lm);
      if (!(l && l.t === "listing" && l.listing.price <= 0 && askNext(lm, ["price"]))) push(bot("✓ साइज़ जोड़ दिए।", "Sizes added."));
      return;
    }

    run(clean, pending);
  };

  const onButton = (msgId: string, index: number, label: string) => {
    const m = msgsRef.current.find((x) => x.id === msgId);
    if (!m) return;
    if (m.t === "listing") {
      if (index === 0) {
        patch(msgId, (x) => ({ ...x, picked: 0, status: "Published · live on Meesho" }) as Msg);
        push(
          bot("✅ लाइव हो गई! पास के खरीदार अब इसे Meesho पर देख सकते हैं।", "It's live! Buyers nearby can now see it on Meesho."),
          bot("और सामान? अगली फ़ोटो भेजिए 📷", "More items? Send the next photo."),
        );
        setPending(null);
      } else if (index === 1) {
        setAwaitPrice(msgId);
        push(bot("नया दाम बोलिए या लिखिए।", "Say or type the new price.", ["₹199", "₹299", "₹499"]));
        setFollowUp({ msgId: msgsRef.current[msgsRef.current.length - 1].id, kind: "price", listingMsgId: msgId });
      } else {
        patch(msgId, (x) => ({ ...x, picked: 2 }) as Msg);
        setPending(null);
        push(bot("ठीक है, नई फ़ोटो भेजिए 📷", "OK, send a new photo."));
      }
      return;
    }
    if (m.t === "text") {
      patch(msgId, (x) => ({ ...x, picked: index }) as Msg);
      if (label === "फिर से भेजें" && lastReq.current) {
        run(lastReq.current.transcript, lastReq.current.photo);
        return;
      }
      if (followUp && followUp.msgId === msgId) {
        push({ id: nid(), t: "text", from: "shop", time: now(), text: label });
        if (followUp.kind === "sizes") {
          const sizes = label === "Free size" ? ["Free size"] : label.split(" ");
          const lm = followUp.listingMsgId;
          patch(lm, (x) => (x.t === "listing" ? { ...x, listing: { ...x.listing, sizes } } : x));
          setFollowUp(null);
          const l = msgsRef.current.find((x) => x.id === lm);
          if (!(l && l.t === "listing" && l.listing.price <= 0 && askNext(lm, ["price"]))) push(bot("✓ साइज़ जोड़ दिए।", "Sizes added."));
        } else {
          const n = Number(label.replace(/[^\d]/g, ""));
          applyPrice(followUp.listingMsgId, n);
          setFollowUp(null);
          setAwaitPrice(null);
          push(bot(`✓ दाम ₹${n} कर दिया।`, `Price set to ₹${n}.`));
        }
      }
    }
  };

  const pickSample = async (id: string) => {
    setSelectedSample(id);
    const box = sampleRefs.current[id];
    const svg = box?.querySelector("svg");
    const bgEl = svg?.parentElement;
    if (!svg || !bgEl) return;
    const photo = await svgToPhoto(svg as SVGSVGElement, getComputedStyle(bgEl).backgroundColor || "#ffffff");
    sendPhoto({ ...photo, sampleId: id });
  };

  const onFile = async (file?: File | null) => {
    if (!file) return;
    try {
      const photo = await resizeImage(file);
      sendPhoto(photo);
    } catch {
      push(bot("यह फ़ोटो खुल नहीं पाई। दूसरी फ़ोटो भेजिए।", "Couldn't open that photo. Try another one."));
    }
  };

  /* ---------- mic: hold to talk ---------- */

  const micDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!speech.supported) {
      setVoiceTip(true);
      inputRef.current?.focus();
      return;
    }
    recStart.current = Date.now();
    const ok = speech.start(LANGS.find((l) => l.key === lang)!.speech);
    if (!ok) setVoiceTip(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const micUp = () => {
    if (!speech.listening) return;
    const secs = Math.max(1, Math.round((Date.now() - recStart.current) / 1000));
    speech.stop((said) => {
      if (said) handleDescription(said, true, `0:${String(secs).padStart(2, "0")}`);
    });
  };

  const sendTyped = () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    handleDescription(t, false);
  };

  const sendPhrase = (phrase: string) => handleDescription(phrase, true, `0:0${Math.min(9, 3 + Math.round(phrase.length / 12))}`);

  /* ---------- render ---------- */

  const footer = (
    <div className="shrink-0 bg-wa-bg px-1.5 py-1.5">
      {speech.listening ? (
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-coral" />
          <RecTimer />
          <span className="min-w-0 flex-1 truncate text-[12.5px] text-wa-text">{speech.interim || "बोलिए… · Speak…"}</span>
          <button type="button" aria-label="Cancel" onClick={speech.cancel} className="text-wa-meta">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[#8696a0]">
            <Smile size={18} className="shrink-0" />
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendTyped()}
              placeholder="Message"
              className="min-w-0 flex-1 bg-transparent py-0.5 text-[13.5px] text-wa-text outline-none placeholder:text-[#8696a0]"
              aria-label="Type a message"
            />
            <button type="button" aria-label="Attach photo" onClick={() => fileRef.current?.click()} className="shrink-0 hover:text-wa-header">
              <Paperclip size={17} />
            </button>
            <button type="button" aria-label="Take photo" onClick={() => camRef.current?.click()} className="shrink-0 hover:text-wa-header">
              <Camera size={17} />
            </button>
          </div>
          {text.trim() ? (
            <button
              type="button"
              aria-label="Send"
              onClick={sendTyped}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wa-header text-white"
            >
              <SendHorizontal size={18} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Hold to record a voice note"
              onPointerDown={micDown}
              onPointerUp={micUp}
              onPointerCancel={micUp}
              onContextMenu={(e) => e.preventDefault()}
              className="flex h-10 w-10 shrink-0 touch-none items-center justify-center rounded-full bg-wa-header text-white select-none active:scale-110"
            >
              <Mic size={18} />
            </button>
          )}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => (onFile(e.target.files?.[0]), (e.target.value = ""))} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => (onFile(e.target.files?.[0]), (e.target.value = ""))} />
    </div>
  );

  const phone = (
    <PhoneFrame width={isMobile ? Math.min(380, typeof window !== "undefined" ? window.innerWidth - 24 : 360) : 380} height={isMobile ? 620 : 720} time={now()} dark>
      <WhatsAppScreen messages={msgs} animateFrom={animateFrom} typing={typing} footer={footer} actions={{ onButton }} />
    </PhoneFrame>
  );

  const phrase = SAMPLE_PHRASES[selectedSample]?.[lang];

  if (isMobile === null) return <div className="min-h-dvh bg-desk" />;

  return (
    <div className="min-h-dvh bg-desk">
      <header className="flex items-center justify-between px-4 py-3 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Wordmark size="sm" />
          <span className="hidden text-[14px] font-semibold text-ink sm:inline">Try it yourself</span>
        </Link>
        <Link href="/story" className="flex items-center gap-1 text-[13px] font-medium text-plum hover:underline">
          <ArrowLeft size={15} /> Back to the story
        </Link>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-3 pb-10 md:grid-cols-[auto_1fr] md:gap-10 md:px-8">
        <div className="order-2 flex justify-center md:order-1">{phone}</div>

        <section className="order-1 md:order-2 md:pt-4">
          <h1 className="text-[24px] leading-tight font-semibold text-ink md:text-[32px]">
            You&apos;re the shop owner. <span className="text-plum">Sell something.</span>
          </h1>
          <p className="mt-1 text-[14px] text-muted">No typing, no forms, no English needed. This part runs on real AI.</p>

          <Step n={1} title="Send a photo">
            <p className="mb-2 text-[12.5px] text-muted">Tap a sample, or upload / snap your own product photo.</p>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickSample(p.id)}
                  disabled={!!typing}
                  className={`group w-[76px] rounded-xl bg-white p-1.5 text-left shadow-sm transition hover:-translate-y-0.5 disabled:opacity-50 ${
                    selectedSample === p.id ? "ring-2 ring-plum" : ""
                  }`}
                >
                  <div ref={(el) => void (sampleRefs.current[p.id] = el)} className="h-16 w-full">
                    <ProductArt art={p.art} rounded="rounded-lg" />
                  </div>
                  <span className="mt-1 block truncate text-[10.5px] text-ink">{p.title.replace("Ladies ", "").replace("Kids ", "")}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-[76px] flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-plum/30 bg-white/60 p-1.5 text-[10.5px] font-medium text-plum hover:bg-white"
              >
                <ImagePlus size={20} /> Your photo
              </button>
            </div>
          </Step>

          <Step n={2} title="Describe it by voice">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="flex rounded-full bg-white p-0.5 shadow-sm">
                {LANGS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setLang(l.key)}
                    className={`rounded-full px-3 py-1 text-[12.5px] font-medium ${lang === l.key ? "bg-plum text-white" : "text-muted"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <span className="text-[12px] text-muted">
                Hold <Mic size={12} className="inline" /> in the chat and speak
              </span>
            </div>
            {phrase && (
              <button
                type="button"
                disabled={!!typing}
                onClick={() => sendPhrase(phrase)}
                className="flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 text-left text-[12.5px] text-ink shadow-sm hover:bg-plum-soft disabled:opacity-50"
              >
                <Sparkles size={14} className="shrink-0 text-orange" />
                <span className="truncate">
                  No mic? Send: <b className="font-medium">“{phrase}”</b>
                </span>
              </button>
            )}
            {(voiceTip || speech.error) && (
              <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-orange-soft px-2.5 py-1.5 text-[12px] text-ink">
                <Keyboard size={14} className="mt-0.5 shrink-0" />
                {speech.error === "not-allowed"
                  ? "Mic permission was blocked. Allow the microphone, or type / use the sample sentence."
                  : "Voice input needs Chrome or Edge. You can type in the chat, or use the sample sentence."}
              </p>
            )}
          </Step>

          <Step n={3} title="Get a Meesho-ready listing">
            <p className="text-[12.5px] text-muted">
              Title in your language and English, sizes, price, colour and fabric, plus the price range similar shops nearby sell
              at. If something is missing, Dukaan asks one simple question instead of guessing.
            </p>
            {meta && (
              <p className="mt-2 text-[11.5px] text-muted">
                {meta.fallback ? "Pre-made sample (live AI busy)" : `Generated live in ${(meta.ms / 1000).toFixed(1)}s by ${meta.model}`}
              </p>
            )}
          </Step>

          <p className="mt-6 flex items-start gap-2 rounded-xl bg-white/70 p-3 text-[12px] leading-snug text-muted">
            <Info size={15} className="mt-0.5 shrink-0 text-plum" />
            Live AI: Gemini 3.5 Flash reads the photo and your sentence. Photos aren&apos;t stored. Orders and payments in the story
            are simulated.
          </p>
        </section>
      </main>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-plum text-[13px] font-bold text-white">{n}</span>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 text-[15px] font-semibold text-ink">{title}</p>
        {children}
      </div>
    </div>
  );
}

function RecTimer() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="text-[12px] text-wa-meta tabular-nums">0:{String(s).padStart(2, "0")}</span>;
}
