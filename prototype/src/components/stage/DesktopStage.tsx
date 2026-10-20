"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { InsightsDashboard } from "@/components/dashboard/InsightsDashboard";
import { ImpactScreen } from "@/components/screens/ImpactScreen";
import type { StoryState } from "@/story/derive";
import type { Slot } from "@/story/types";
import { LaptopFrame, PhoneFrame } from "./Frames";
import { CaptionStrip, ChapterTimeline, RevenueBar, TopBar } from "./parts";
import { clockTime, sideScreen, whatsappView, type SlotView } from "./slots";

export const CANVAS = { w: 1600, h: 1000 };

const SLOT_X: Record<Slot, number> = { left: 390, center: 800, right: 1210 };
const PHONE = {
  center: { w: 350, h: 650 },
  side: { w: 310, h: 600 },
};
const ZONE_TOP = 112;

type Props = {
  state: StoryState;
  prev: StoryState | null;
  animate: boolean;
  showCaption: boolean;
  showTranslation: boolean;
  onNext: () => void;
  onPrev: () => void;
  onJump: (i: number) => void;
  onRestart: () => void;
  onHelp: () => void;
  onToggleTranslation: () => void;
};

/** Fixed 1600×1000 canvas, scaled to fit the window so it looks identical on any screen share. */
export function DesktopStage(props: Props) {
  const scale = useFitScale();
  const { state, prev, animate } = props;
  const focus = state.beat.focus;
  const justEarned = animate && prev ? state.earned.filter((e) => !prev.earned.includes(e)) : [];

  return (
    <div className="fixed inset-0 overflow-hidden bg-desk">
      <div
        className="absolute top-1/2 left-1/2"
        style={{ width: CANVAS.w, height: CANVAS.h, transform: `translate(-50%, -50%) scale(${scale})`, transformOrigin: "center" }}
      >
        <div className="absolute inset-x-0 top-0">
          <TopBar
            index={state.index}
            onRestart={props.onRestart}
            onHelp={props.onHelp}
            showTranslation={props.showTranslation}
            onToggleTranslation={props.onToggleTranslation}
          />
          <ChapterTimeline index={state.index} onJump={props.onJump} />
        </div>

        <AnimatePresence mode="wait">
          {state.wide ? (
            <motion.div
              key="wide"
              className="absolute inset-x-0 flex justify-center"
              style={{ top: ZONE_TOP + 4 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4 }}
            >
              <LaptopFrame width={1260} height={640} url={state.wide.kind === "dashboard" ? undefined : "meesho-dukaan.example/summary · illustrative"}>
                {state.wide.kind === "dashboard" ? (
                  <InsightsDashboard step={state.wide.step} />
                ) : (
                  <ImpactScreen step={state.wide.step} onReplay={props.onRestart} />
                )}
              </LaptopFrame>
            </motion.div>
          ) : (
            <motion.div key="phones" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.3 }}>
              <SlotBox slot="left" view={sideScreen(state.left, state, animate)} focus={focus} time={clockTime(state.beat.clock)} />
              <SlotBox slot="center" view={whatsappView(state, animate ? prev : null, props.showTranslation)} focus={focus} time={clockTime(state.beat.clock)} />
              <SlotBox slot="right" view={sideScreen(state.right, state, animate)} focus={focus} time={clockTime(state.beat.clock)} />
              {animate && state.beat.handoff && <Handoff key={state.beat.id} {...state.beat.handoff} />}
            </motion.div>
          )}
        </AnimatePresence>

        {props.showCaption && (
          <div className="absolute inset-x-8" style={{ top: 800, height: 104 }}>
            <CaptionStrip index={state.index} onNext={props.onNext} onPrev={props.onPrev} />
          </div>
        )}
        <div className="absolute inset-x-8" style={{ top: 920, height: 56 }}>
          <RevenueBar earned={state.earned} justEarned={justEarned} />
        </div>
      </div>
    </div>
  );
}

function SlotBox({ slot, view, focus, time }: { slot: Slot; view: SlotView | null; focus: string; time: string }) {
  const size = slot === "center" ? PHONE.center : PHONE.side;
  const active = focus === slot;
  const top = ZONE_TOP + (slot === "center" ? 0 : (PHONE.center.h - PHONE.side.h) / 2);
  return (
    <div className="absolute" style={{ left: SLOT_X[slot] - size.w / 2, top, width: size.w, height: size.h + 30 }}>
      <AnimatePresence mode="wait">
        {view && (
          <motion.div
            key={view.key}
            className="flex h-full flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: active ? 1 : 0.55,
              y: 0,
              scale: active ? 1 : 0.93,
              filter: active ? "saturate(1)" : "saturate(0.55)",
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
          >
            {view.framed ? (
              <PhoneFrame width={size.w} height={size.h} time={time} dark={view.darkStatus}>
                {view.node}
              </PhoneFrame>
            ) : (
              <div className="flex items-center justify-center" style={{ width: size.w, height: size.h }}>
                {view.node}
              </div>
            )}
            <span className={`mt-2 text-[13px] ${active ? "font-semibold text-ink" : "text-muted"}`}>{view.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Handoff({ from, to, label }: { from: Slot; to: Slot; label: string }) {
  const y = ZONE_TOP + PHONE.center.h * 0.42;
  return (
    <motion.div
      className="pointer-events-none absolute z-20 flex items-center gap-2 rounded-full bg-orange px-4 py-2 text-[14px] font-semibold whitespace-nowrap text-plum shadow-[0_10px_30px_-6px_rgba(255,159,0,.7)]"
      style={{ top: y, left: 0 }}
      initial={{ x: SLOT_X[from], opacity: 0, scale: 0.6, translateX: "-50%" }}
      animate={{ x: [SLOT_X[from], SLOT_X[from], SLOT_X[to], SLOT_X[to]], opacity: [0, 1, 1, 0], scale: [0.6, 1, 1, 0.8] }}
      transition={{ duration: 1.9, times: [0, 0.2, 0.75, 1], ease: "easeInOut", delay: 0.6 }}
    >
      {label} <ArrowRight size={16} />
    </motion.div>
  );
}

function useFitScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / CANVAS.w, window.innerHeight / CANVAS.h));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}
