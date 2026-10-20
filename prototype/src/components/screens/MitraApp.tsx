"use client";

import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { BadgeIndianRupee, Camera, Check, FileCheck2, Landmark, MapPin, QrCode, Store, UserCheck } from "lucide-react";
import { useEffect } from "react";
import { ProductArt } from "@/components/art/ProductArt";
import { SHOP_ITEMS } from "@/data/products";
import type { MitraStep } from "@/story/types";

const STEPS = [
  { icon: Store, title: "Shop details", sub: "Ramesh Garments · Gole Bazaar" },
  { icon: UserCheck, title: "KYC", sub: "PAN + Aadhaar photo · verified" },
  { icon: FileCheck2, title: "GST enrolment ID", sub: "For shops without GST · applied" },
  { icon: Landmark, title: "Bank account", sub: "SBI ••4821 · ₹1 test credit ✓" },
  { icon: Camera, title: "Listings", sub: "Photos, titles, sizes, prices" },
  { icon: QrCode, title: "Counter QR standee", sub: "Printed & placed at the counter" },
  { icon: BadgeIndianRupee, title: "Starter Pack ₹299", sub: "Paid by UPI · receipt on WhatsApp" },
];

export function MitraApp({ step, animateIn }: { step: MitraStep; animateIn: boolean }) {
  const listingDone = step >= 5;
  return (
    <div className="flex h-full flex-col bg-[#f7f3f6]">
      <div className="shrink-0 bg-plum px-3 pt-2 pb-3 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-orange">MEESHO MITRA</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">Sourav · KGP-031</span>
        </div>
        <p className="mt-1 text-[15px] font-semibold leading-tight">New shop visit</p>
        <p className="flex items-center gap-1 text-[11px] text-white/80">
          <MapPin size={11} /> Gole Bazaar, Kharagpur · 721301
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full rounded-full bg-orange"
            initial={false}
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: animateIn ? 0.9 : 0 }}
          />
        </div>
        <p className="mt-1 text-[10px] text-white/70">{step}/7 done · ~{Math.max(0, 30 - step * 4)} min left</p>
      </div>

      <div className="hide-scrollbar flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1.5">
          {STEPS.map((s, i) => {
            const done = i < step;
            const delay = animateIn ? Math.max(0, i - (step - 3)) * 0.35 : 0;
            return (
              <li key={s.title} className="rounded-lg bg-white p-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      done ? "bg-emerald-100 text-emerald-700" : "bg-[#f1ecf0] text-muted"
                    }`}
                  >
                    <s.icon size={14} />
                  </div>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-[12.5px] font-semibold text-ink">{s.title}</p>
                    <p className="truncate text-[10.5px] text-muted">{done ? s.sub : "Pending"}</p>
                  </div>
                  <AnimatePresence>
                    {done && (
                      <motion.span
                        initial={animateIn ? { scale: 0 } : false}
                        animate={{ scale: 1 }}
                        transition={{ delay, type: "spring", stiffness: 400, damping: 18 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                      >
                        <Check size={12} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                {i === 4 && step >= 4 && <ListingGrid done={listingDone} animateIn={animateIn && step === 5} />}
                {i === 6 && step >= 7 && (
                  <motion.div
                    initial={animateIn ? { opacity: 0, y: 6 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: animateIn ? 0.8 : 0 }}
                    className="mt-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[10.5px] text-emerald-800"
                  >
                    ✓ ₹299 received · 3 months Pro free · order guarantee on
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
        {step >= 7 && (
          <motion.div
            initial={animateIn ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ delay: animateIn ? 1.1 : 0 }}
            className="mt-2 rounded-lg bg-orange px-3 py-2 text-center text-[12px] font-semibold text-plum"
          >
            Shop live in 29 min · ₹300 payout to Sourav
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ListingGrid({ done, animateIn }: { done: boolean; animateIn: boolean }) {
  const count = useMotionValue(done && !animateIn ? 20 : 0);
  const rounded = useTransform(count, (v) => Math.round(v));
  useEffect(() => {
    if (!done) return;
    if (!animateIn) {
      count.set(20);
      return;
    }
    const c = animate(count, 20, { duration: 1.6, ease: "easeOut" });
    return () => c.stop();
  }, [done, animateIn, count]);

  return (
    <div className="mt-1.5">
      <div className="mb-1 flex items-baseline justify-between text-[10.5px] text-muted">
        <span>Items listed</span>
        <span className="text-[13px] font-bold text-ink">
          <motion.span>{rounded}</motion.span>/20
        </span>
      </div>
      <div className="grid grid-cols-10 gap-[3px]">
        {SHOP_ITEMS.map((p, i) => (
          <motion.div
            key={p.id}
            className="aspect-square"
            initial={animateIn ? { opacity: 0, scale: 0.6 } : false}
            animate={{ opacity: done ? 1 : 0.15, scale: 1 }}
            transition={{ delay: animateIn ? i * 0.07 : 0 }}
          >
            <ProductArt art={p.art} photo={p.photo} rounded="rounded-[3px]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
