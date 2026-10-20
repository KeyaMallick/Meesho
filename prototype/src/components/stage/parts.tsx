"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Expand, HelpCircle, Languages, RotateCcw, Store, X } from "lucide-react";
import Link from "next/link";
import { CHAPTERS, BEATS, firstBeatOfChapter } from "@/story/script";
import type { Stream } from "@/story/types";

export const STREAMS: { key: Stream; label: string; price: string }[] = [
  { key: "starter", label: "Starter Pack", price: "₹299 once" },
  { key: "pro", label: "Dukaan AI Pro", price: "₹199 / month" },
  { key: "supplier", label: "Supplier access", price: "₹12K / yr" },
  { key: "insights", label: "Demand insights", price: "₹15L–2Cr / yr" },
];

export function Wordmark({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" | "lg" }) {
  const s = { sm: ["text-[11px]", "text-[16px]"], md: ["text-[13px]", "text-[20px]"], lg: ["text-[22px]", "text-[56px]"] }[size];
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`${s[0]} font-bold lowercase ${light ? "text-white" : "text-plum"}`}>meesho</span>
      <span className={`${s[1]} -mt-0.5 font-black tracking-wide text-orange`}>DUKAAN</span>
    </span>
  );
}

export function TopBar({
  index,
  onRestart,
  onHelp,
  showTranslation,
  onToggleTranslation,
}: {
  index: number;
  onRestart: () => void;
  onHelp: () => void;
  showTranslation: boolean;
  onToggleTranslation: () => void;
}) {
  const ch = CHAPTERS[BEATS[index].chapter - 1];
  return (
    <div className="flex h-14 items-center gap-4 px-8">
      <Link href="/" className="flex items-center gap-2">
        <Wordmark />
      </Link>
      <div className="mx-auto flex items-center gap-2 text-[14px] text-muted">
        <Store size={15} className="text-plum" />
        <span>
          <b className="font-semibold text-ink">Ramesh Garments</b> · Gole Bazaar, Kharagpur
        </span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[11px]">Persona based on 70 interviews</span>
      </div>
      <div className="flex items-center gap-1">
        <IconBtn label={showTranslation ? "Hide English translations (T)" : "Show English translations (T)"} onClick={onToggleTranslation} active={showTranslation}>
          <Languages size={17} />
        </IconBtn>
        <IconBtn label="Restart (R)" onClick={onRestart}>
          <RotateCcw size={17} />
        </IconBtn>
        <IconBtn label="Fullscreen (F)" onClick={toggleFullscreen}>
          <Expand size={17} />
        </IconBtn>
        <IconBtn label="Keyboard shortcuts (?)" onClick={onHelp}>
          <HelpCircle size={17} />
        </IconBtn>
      </div>
      <span className="sr-only">{ch.title}</span>
    </div>
  );
}

export function toggleFullscreen() {
  if (typeof document === "undefined") return;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

function IconBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white focus-visible:ring-2 focus-visible:ring-plum focus-visible:outline-none ${
        active ? "text-plum" : "text-muted"
      }`}
    >
      {children}
    </button>
  );
}

export function ChapterTimeline({ index, onJump, compact = false }: { index: number; onJump: (i: number) => void; compact?: boolean }) {
  const current = BEATS[index].chapter;
  return (
    <div className={`flex items-stretch gap-1.5 ${compact ? "px-3" : "px-8"}`}>
      {CHAPTERS.map((c) => {
        const first = firstBeatOfChapter(c.n);
        const count = c.beats.length;
        const done = c.n < current;
        const active = c.n === current;
        const progress = active ? (index - first + 1) / count : done ? 1 : 0;
        return (
          <button
            key={c.n}
            type="button"
            onClick={() => onJump(first)}
            className="group flex flex-1 flex-col gap-1 text-left focus-visible:outline-none"
            title={`${c.day} · ${c.title}`}
          >
            <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
              <motion.div className="h-full rounded-full bg-plum" initial={false} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            {!compact && (
              <span className={`flex items-baseline gap-1.5 text-[12px] ${active ? "font-semibold text-ink" : "text-muted group-hover:text-ink"}`}>
                <span className={`text-[10.5px] ${active ? "text-plum" : ""}`}>{c.day}</span>
                {c.short}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function CaptionStrip({
  index,
  onNext,
  onPrev,
  big = true,
}: {
  index: number;
  onNext: () => void;
  onPrev: () => void;
  big?: boolean;
}) {
  const beat = BEATS[index];
  const ch = CHAPTERS[beat.chapter - 1];
  return (
    <div className="flex h-full items-center gap-6 rounded-2xl bg-white px-6 shadow-[0_2px_10px_rgba(42,20,38,.06)]">
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-[12px]">
          <span className="font-semibold tracking-wide text-plum uppercase">
            {ch.day} · {ch.title}
          </span>
          {ch.solves && (
            <span className="truncate rounded-full bg-orange-soft px-2 py-0.5 text-[11px] text-ink">
              <b className="font-semibold">Solves:</b> {ch.solves}
            </span>
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={beat.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className={`${big ? "text-[21px]" : "text-[16px]"} leading-snug font-medium text-ink`}
          >
            {beat.caption}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-[12px] text-muted tabular-nums">
          {index + 1} / {BEATS.length}
        </span>
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-ink transition hover:bg-[#f7f3f6] disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === BEATS.length - 1}
          aria-label="Next"
          className="flex h-11 items-center gap-1 rounded-full bg-plum pr-4 pl-5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:opacity-30"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export function RevenueBar({ earned, justEarned, compact = false }: { earned: Stream[]; justEarned: Stream[]; compact?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "h-full gap-3 px-2"}`}>
      {!compact && <span className="mr-1 text-[11.5px] font-bold tracking-[.12em] text-muted">MEESHO EARNS</span>}
      {STREAMS.map((s) => {
        const on = earned.includes(s.key);
        const pop = justEarned.includes(s.key);
        return (
          <motion.div
            key={s.key}
            initial={false}
            animate={pop ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`flex items-center gap-2 rounded-full border ${compact ? "px-2 py-0.5 text-[10.5px]" : "px-3.5 py-1.5 text-[13px]"} ${
              on ? "border-orange bg-orange text-plum" : "border-black/10 bg-white/70 text-muted"
            }`}
          >
            {on && <Check size={compact ? 11 : 14} strokeWidth={3} />}
            <span className="font-semibold">{s.label}</span>
            {!compact && <span className={on ? "text-plum/80" : ""}>{s.price}</span>}
          </motion.div>
        );
      })}
      <div className={`${compact ? "w-full pt-0.5 text-[10.5px]" : "ml-auto text-[13px]"} flex items-center gap-2 font-semibold text-emerald-700`}>
        <span className="rounded-full bg-emerald-50 px-3 py-1">0% commission</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">₹0 extra for buyers</span>
      </div>
    </div>
  );
}

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const keys = [
    ["→  /  Space", "Next"],
    ["←", "Back"],
    ["Shift + → / ←", "Next / previous chapter"],
    ["1 – 9", "Jump to chapter"],
    ["R", "Restart"],
    ["F", "Fullscreen"],
    ["C", "Hide / show caption"],
    ["T", "Hide / show English translations"],
    ["?", "This help"],
  ];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={onClose}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[15px] font-semibold">Presenter shortcuts</p>
              <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <ul className="flex flex-col gap-1.5">
              {keys.map(([k, v]) => (
                <li key={k} className="flex justify-between text-[13px]">
                  <kbd className="rounded bg-[#f1ecf0] px-1.5 py-0.5 font-mono text-[12px]">{k}</kbd>
                  <span className="text-muted">{v}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11.5px] text-muted">Add ?auto=1 to the URL for a self-running walkthrough.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
