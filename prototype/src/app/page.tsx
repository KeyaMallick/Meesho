import { Keyboard, Mic, Play } from "lucide-react";
import Link from "next/link";
import { PhoneFrame } from "@/components/stage/Frames";
import { Wordmark } from "@/components/stage/parts";
import { WhatsAppScreen } from "@/components/whatsapp/WhatsAppScreen";
import { SITE } from "@/data/site";
import type { Msg } from "@/story/types";

const PREVIEW: Msg[] = [
  { id: "p1", t: "image", from: "shop", productId: "kurti-blue", time: "10:40" },
  { id: "p2", t: "voice", from: "shop", dur: "0:06", time: "10:40", transcript: "Neeli kurti, M aur L, 450 rupaye." },
  {
    id: "p3",
    t: "listing",
    from: "bot",
    time: "10:41",
    listing: { productId: "kurti-blue", title: "Blue Cotton Kurti", titleLocal: "नीली कॉटन कुर्ती", sizes: ["M", "L"], price: 450, near: [420, 480] },
  },
];

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-plum text-white">
      <Arches />
      <div className="relative mx-auto grid min-h-dvh max-w-6xl items-center gap-10 px-4 py-10 md:grid-cols-[1.2fr_1fr] md:px-8">
        <div>
          <Wordmark light size="lg" />
          <p className="mt-2 font-hindi text-[22px] font-semibold text-[#ffb3bd] md:text-[26px]">अपनी दुकान, अब ऑनलाइन</p>
          <div className="my-6 h-1.5 w-24 rounded-full bg-coral" />
          <h1 className="text-[28px] leading-tight font-semibold md:text-[40px]">
            Online in one visit. <span className="text-orange">Run entirely from WhatsApp.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/80 md:text-[17px]">
            A Tier 3-4 shop owner who can only use WhatsApp, selling on Meesho. A Mitra sets the shop up in one visit;
            after that, a photo and one sentence in Hindi become a live listing.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 text-[12.5px]">
            {["70 interviews", "150 survey responses", "25 store types", "₹376 Cr by Year 5"].map((s) => (
              <span key={s} className="rounded-full border border-white/35 px-3 py-1">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/story"
              className="flex items-center gap-2 rounded-full bg-orange px-6 py-3 text-[16px] font-semibold text-plum shadow-lg transition hover:brightness-105"
            >
              <Play size={18} className="fill-plum" /> Watch the 90-day story
            </Link>
            <Link
              href="/try"
              className="flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-[16px] font-semibold text-white transition hover:bg-white/10"
            >
              <Mic size={18} /> Try it yourself
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-[12.5px] text-white/65">
            <Keyboard size={15} /> Presenting? Use the arrow keys. Press ? for all shortcuts.
          </p>
        </div>

        <div className="hidden justify-center md:flex">
          <div className="rotate-[2deg]">
            <PhoneFrame width={330} height={600} time="10:41" dark>
              <WhatsAppScreen messages={PREVIEW} showTranslation={false} />
            </PhoneFrame>
          </div>
        </div>
      </div>
      <footer className="relative px-4 pb-5 text-center text-[11.5px] text-white/55">
        Concept prototype by {SITE.team} for Meesho DICE Challenge 3.0. Not an official Meesho product. Chats and data are illustrative.
      </footer>
    </main>
  );
}

function Arches() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[.08]" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => {
        const x = 50 + i * 6;
        const r = 44 - i * 6;
        const y = 40 + i * 6;
        return <path key={i} d={`M${x} 100 V${y} A${r} ${r} 0 0 1 ${x + 2 * r} ${y} V100`} fill="none" stroke="#ff9f00" strokeWidth=".4" />;
      })}
    </svg>
  );
}
