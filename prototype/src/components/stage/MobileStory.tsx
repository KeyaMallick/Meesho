"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InsightsDashboard } from "@/components/dashboard/InsightsDashboard";
import { ImpactScreen } from "@/components/screens/ImpactScreen";
import type { StoryState } from "@/story/derive";
import { BEATS, CHAPTERS } from "@/story/script";
import type { Slot } from "@/story/types";
import { PhoneFrame } from "./Frames";
import { ChapterTimeline, RevenueBar, Wordmark } from "./parts";
import { clockTime, sideScreen, whatsappView } from "./slots";

type Props = {
  state: StoryState;
  prev: StoryState | null;
  animate: boolean;
  showTranslation: boolean;
  onNext: () => void;
  onPrev: () => void;
  onJump: (i: number) => void;
  onRestart: () => void;
};

/** Phone layout: one screen at a time, tabs follow the active screen each beat. */
export function MobileStory({ state, prev, animate, showTranslation, onNext, onPrev, onJump, onRestart }: Props) {
  const views: { slot: Slot; v: ReturnType<typeof sideScreen> }[] = [
    { slot: "center" as Slot, v: whatsappView(state, animate ? prev : null, showTranslation) },
    { slot: "right" as Slot, v: sideScreen(state.right, state, animate) },
    { slot: "left" as Slot, v: sideScreen(state.left, state, animate) },
  ].filter((x) => x.v);

  const focus = state.beat.focus === "wide" ? "center" : state.beat.focus;
  const [picked, setPicked] = useState<{ beat: number; slot: Slot } | null>(null);
  const activeSlot = picked && picked.beat === state.index ? picked.slot : focus;
  const active = views.find((x) => x.slot === activeSlot) ?? views[0];
  const ch = CHAPTERS[BEATS[state.index].chapter - 1];
  const justEarned = animate && prev ? state.earned.filter((e) => !prev.earned.includes(e)) : [];

  return (
    <div className="flex min-h-dvh flex-col bg-desk">
      <header className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link href="/">
          <Wordmark size="sm" />
        </Link>
        <span className="text-[11px] text-muted">Ramesh Garments · Kharagpur</span>
      </header>
      <ChapterTimeline index={state.index} onJump={onJump} compact />
      <p className="px-4 pt-2 text-[11px] font-semibold tracking-wide text-plum uppercase">
        {ch.day} · {ch.title}
      </p>

      {state.wide ? (
        <div className="mx-4 mt-2 h-[68dvh] overflow-hidden rounded-2xl border border-black/5 bg-white">
          {state.wide.kind === "dashboard" ? (
            <div className="h-full overflow-y-auto">
              <InsightsDashboard step={state.wide.step} compact />
            </div>
          ) : (
            <ImpactScreen step={state.wide.step} onReplay={onRestart} compact />
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-1.5 px-4 pt-2">
            {views.map((x) => (
              <button
                key={x.slot}
                type="button"
                onClick={() => setPicked({ beat: state.index, slot: x.slot })}
                className={`flex-1 truncate rounded-full px-2 py-1 text-[11px] font-medium ${
                  x.slot === active.slot ? "bg-plum text-white" : "bg-white text-muted"
                }`}
              >
                {x.v!.label.replace("Ramesh's ", "").replace("Sourav's ", "").replace("Meesho app · ", "")}
              </button>
            ))}
          </div>
          <div className="flex justify-center px-4 pt-3">
            {active.v!.framed ? (
              <PhoneFrame width={Math.min(360, typeof window !== "undefined" ? window.innerWidth - 32 : 340)} height={560} time={clockTime(state.beat.clock)} dark={active.v!.darkStatus}>
                {active.v!.node}
              </PhoneFrame>
            ) : (
              <div className="flex h-[560px] items-center">{active.v!.node}</div>
            )}
          </div>
        </>
      )}

      <div className="mx-4 mt-3 rounded-xl bg-white p-3">
        <p className="text-[14px] leading-snug font-medium">{state.beat.caption}</p>
        {ch.solves && <p className="mt-1 text-[11px] text-muted">Solves: {ch.solves}</p>}
      </div>
      <div className="mx-4 mt-2">
        <RevenueBar earned={state.earned} justEarned={justEarned} compact />
      </div>

      <div className="sticky bottom-0 mt-auto flex items-center justify-between gap-3 bg-desk/95 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onPrev}
          disabled={state.index === 0}
          aria-label="Back"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[12px] text-muted tabular-nums">
          {state.index + 1} / {BEATS.length}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={state.index === BEATS.length - 1}
          className="flex h-11 items-center gap-1 rounded-full bg-plum px-5 text-[14px] font-semibold text-white disabled:opacity-30"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
