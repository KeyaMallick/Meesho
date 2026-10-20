"use client";

import { useEffect, useMemo, useState } from "react";
import { deriveState } from "@/story/derive";
import { BEATS, CHAPTERS, firstBeatOfChapter } from "@/story/script";
import { useStory } from "@/story/store";
import { DesktopStage } from "./DesktopStage";
import { MobileStory } from "./MobileStory";
import { HelpOverlay, toggleFullscreen } from "./parts";

const MOBILE_BREAKPOINT = 900;

export function StoryApp() {
  const { index, animate, showCaption, showTranslation, go, next, prev, toggleTranslation } = useStory();
  const [mode, setMode] = useState<"desktop" | "mobile" | null>(null);
  const [help, setHelp] = useState(false);

  // Read ?b= (1-based beat) once, and pick a layout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = Number(params.get("b"));
    if (b >= 1 && b <= BEATS.length) useStory.setState({ index: b - 1, animate: false });
    const pick = () => setMode(window.innerWidth < MOBILE_BREAKPOINT ? "mobile" : "desktop");
    pick();
    window.addEventListener("resize", pick);
    return () => window.removeEventListener("resize", pick);
  }, []);

  // Keep the URL in sync so refresh never loses the place.
  useEffect(() => {
    if (mode === null) return;
    const params = new URLSearchParams(window.location.search);
    params.set("b", String(index + 1));
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [index, mode]);

  // Optional self-running walkthrough: ?auto=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("auto") !== "1") return;
    const t = setInterval(() => {
      const s = useStory.getState();
      if (s.index < BEATS.length - 1) s.next();
      else clearInterval(t);
    }, 5200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const s = useStory.getState();
      const chapter = BEATS[s.index].chapter;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        if (e.shiftKey) s.go(firstBeatOfChapter(Math.min(chapter + 1, CHAPTERS.length)));
        else s.next();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        if (e.shiftKey) s.go(firstBeatOfChapter(Math.max(chapter - 1, 1)));
        else s.prev();
      } else if (/^[1-9]$/.test(e.key)) {
        s.go(firstBeatOfChapter(Number(e.key)));
      } else if (e.key === "r" || e.key === "R") {
        s.go(0);
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "c" || e.key === "C") {
        s.toggleCaption();
      } else if (e.key === "t" || e.key === "T") {
        s.toggleTranslation();
      } else if (e.key === "?") {
        setHelp((h) => !h);
      } else if (e.key === "Escape") {
        setHelp(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const state = useMemo(() => deriveState(index), [index]);
  const prevState = useMemo(() => (animate && index > 0 ? deriveState(index - 1) : null), [animate, index]);

  if (mode === null) return <div className="fixed inset-0 bg-desk" />;

  return (
    <>
      {mode === "desktop" ? (
        <DesktopStage
          state={state}
          prev={prevState}
          animate={animate}
          showCaption={showCaption}
          showTranslation={showTranslation}
          onNext={next}
          onPrev={prev}
          onJump={go}
          onRestart={() => go(0)}
          onHelp={() => setHelp(true)}
          onToggleTranslation={toggleTranslation}
        />
      ) : (
        <MobileStory
          state={state}
          prev={prevState}
          animate={animate}
          showTranslation={showTranslation}
          onNext={next}
          onPrev={prev}
          onJump={go}
          onRestart={() => go(0)}
        />
      )}
      <HelpOverlay open={help} onClose={() => setHelp(false)} />
      <span className="sr-only" aria-live="polite">
        {state.beat.caption}
      </span>
    </>
  );
}
