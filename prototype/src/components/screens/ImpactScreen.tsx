"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Mic, RotateCcw, User } from "lucide-react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { FIELD_QUOTES, REVENUE_SPLIT, SITE } from "@/data/site";

export function ImpactScreen({ step, onReplay, compact = false }: { step: 1 | 2 | 3; onReplay?: () => void; compact?: boolean }) {
  return (
    <div className={`flex h-full flex-col gap-3 overflow-y-auto bg-[#faf7f9] p-4 text-ink ${compact ? "" : "hide-scrollbar"}`}>
      <div className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-2"}`}>
        <Section title="Ramesh's first 90 days" sub="One shop, from our story">
          <div className="grid grid-cols-2 gap-2">
            <Stat v="1 visit" s="29 minutes to go live" />
            <Stat v="0 forms" s="filled in by Ramesh" />
            <Stat v="14 orders" s="online, per week" />
            <Stat v="₹7,300" s="value to him / month" />
          </div>
          <div className="mt-3 rounded-lg border border-black/5 bg-white p-3">
            <p className="mb-1.5 text-[11.5px] font-semibold">What Meesho earned from Ramesh</p>
            <Row k="Starter Pack" v="₹299 once" />
            <Row k="Dukaan Pro" v="₹149 → ₹199 / month" />
            <Row k="Insights & supplier access" v="paid by brands & wholesalers" />
            <Row k="Commission on his sales" v="₹0" strong />
            <Row k="Extra fee for his buyers" v="₹0" strong />
          </div>
        </Section>

        <AnimatePresence>
          {step >= 2 && (
            <Section title="From one shop to 20 lakh" sub="Base case, from our sizing" animate>
              <Ladder />
              <RevenueBar />
            </Section>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid gap-3 ${compact ? "grid-cols-1" : "grid-cols-[1fr_auto]"}`}
          >
            <div className="rounded-xl border border-black/5 bg-white p-3">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[13px] font-semibold">From the field, Kharagpur 2026</p>
                <p className="text-[11px] text-muted">70 interviews · 150 surveys · 25 store types · 4 markets</p>
              </div>
              <div className={`grid gap-2 ${compact ? "grid-cols-1" : "grid-cols-3"}`}>
                {FIELD_QUOTES.map((q) => (
                  <figure key={q.who} className="flex gap-2 rounded-lg bg-[#f7f3f6] p-2">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-plum-soft">
                      {q.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={q.photo} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-plum/60">
                          <User size={22} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <blockquote className="text-[11.5px] leading-snug font-medium">{q.quote}</blockquote>
                      <figcaption className="mt-0.5 text-[10px] text-muted">
                        {q.who}, {q.where}
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-2 rounded-xl bg-plum p-4 text-white">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-orange">THE ASK</p>
                <p className="text-[17px] leading-tight font-semibold">Approve the 200-shop pilot</p>
                <p className="mt-1 text-[11px] text-white/75">Kharagpur · 90 days · go/stop at Day 90</p>
              </div>
              {SITE.recordingsUrl && (
                <div className="flex items-center gap-2">
                  <div className="rounded bg-white p-1">
                    <QRCodeSVG value={SITE.recordingsUrl} size={52} />
                  </div>
                  <span className="text-[10.5px] text-white/80">Interview recordings</span>
                </div>
              )}
              <div className="flex gap-2">
                {onReplay && (
                  <button
                    type="button"
                    onClick={onReplay}
                    className="flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1.5 text-[11.5px] font-medium hover:bg-white/25"
                  >
                    <RotateCcw size={13} /> Replay
                  </button>
                )}
                <Link
                  href="/try"
                  className="flex items-center gap-1 rounded-md bg-orange px-2.5 py-1.5 text-[11.5px] font-semibold text-plum hover:brightness-105"
                >
                  <Mic size={13} /> Try it yourself
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({
  title,
  sub,
  children,
  animate,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
  animate?: boolean;
}) {
  return (
    <motion.section
      initial={animate ? { opacity: 0, x: 16 } : false}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-xl border border-black/5 bg-white/60 p-3"
    >
      <p className="text-[14px] font-semibold">{title}</p>
      <p className="mb-2 text-[11px] text-muted">{sub}</p>
      {children}
    </motion.section>
  );
}

function Stat({ v, s }: { v: string; s: string }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white px-3 py-2">
      <p className="text-[22px] leading-tight font-bold">{v}</p>
      <p className="text-[10.5px] text-muted">{s}</p>
    </div>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex justify-between border-b border-black/5 py-1 text-[11.5px] last:border-0">
      <span className="text-muted">{k}</span>
      <span className={strong ? "font-bold text-emerald-700" : "font-semibold"}>{v}</span>
    </div>
  );
}

function Ladder() {
  const steps = [
    { n: "200", l: "Pilot", s: "Kharagpur, 90 days" },
    { n: "5,000", l: "5 cities", s: "after a Day-90 GO" },
    { n: "50,000", l: "West Bengal", s: "state rollout" },
    { n: "20 lakh", l: "National", s: "by Year 5" },
  ];
  return (
    <div className="flex items-stretch gap-1">
      {steps.map((s, i) => (
        <div key={s.n} className="flex flex-1 items-center gap-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="flex-1 rounded-lg border border-black/5 bg-white px-2 py-1.5 text-center"
            style={{ boxShadow: i === 3 ? "inset 0 0 0 2px #ff9f00" : undefined }}
          >
            <p className="text-[15px] leading-tight font-bold">{s.n}</p>
            <p className="text-[10.5px] font-medium">{s.l}</p>
            <p className="text-[9.5px] text-muted">{s.s}</p>
          </motion.div>
          {i < steps.length - 1 && <ArrowRight size={13} className="shrink-0 text-muted" />}
        </div>
      ))}
    </div>
  );
}

function RevenueBar() {
  const [hover, setHover] = useState<string | null>(null);
  const total = REVENUE_SPLIT.reduce((a, b) => a + b.value, 0);
  return (
    <div className="mt-3 rounded-lg border border-black/5 bg-white p-3">
      <div className="flex items-baseline justify-between">
        <p className="text-[11.5px] font-semibold">Year-5 new revenue</p>
        <p>
          <span className="text-[24px] font-bold">₹{total} Cr</span>
          <span className="ml-1 text-[11px] text-muted">0.9% of FY26 NMV</span>
        </p>
      </div>
      <div className="relative mt-2 flex h-5 gap-[2px]">
        {REVENUE_SPLIT.map((r, i) => (
          <motion.div
            key={r.key}
            initial={{ width: 0 }}
            animate={{ width: `${(r.value / total) * 100}%` }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
            className="h-full first:rounded-l-[4px] last:rounded-r-[4px]"
            style={{ background: r.color, opacity: hover && hover !== r.key ? 0.55 : 1 }}
          />
        ))}
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5">
        {REVENUE_SPLIT.map((r) => (
          <li
            key={r.key}
            className={`flex items-center gap-1.5 text-[11px] ${hover === r.key ? "font-semibold" : ""}`}
            onMouseEnter={() => setHover(r.key)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: r.color }} />
            <span className="flex-1">{r.key}</span>
            <span className="font-semibold">₹{r.value} Cr</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
