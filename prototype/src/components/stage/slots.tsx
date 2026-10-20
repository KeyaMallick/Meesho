"use client";

import type { ReactNode } from "react";
import { BuyerApp } from "@/components/screens/BuyerApp";
import { MitraApp } from "@/components/screens/MitraApp";
import { CounterQR, TrendScreen } from "@/components/screens/SmallScreens";
import { WhatsAppScreen } from "@/components/whatsapp/WhatsAppScreen";
import type { StoryState } from "@/story/derive";
import type { Screen } from "@/story/types";

export type SlotView = { key: string; node: ReactNode; label: string; framed: boolean; darkStatus: boolean };

export function sideScreen(screen: Screen, state: StoryState, animate: boolean): SlotView | null {
  switch (screen.kind) {
    case "none":
      return null;
    case "mitra":
      return {
        key: "mitra",
        node: <MitraApp step={screen.step} animateIn={animate} />,
        label: "Sourav's Meesho Mitra app",
        framed: true,
        darkStatus: false,
      };
    case "qr":
      return { key: "qr", node: <CounterQR animateIn={animate} />, label: "Counter QR standee at the shop", framed: false, darkStatus: false };
    case "buyer": {
      const priya = screen.view !== "store";
      return {
        key: "buyer",
        node: <BuyerApp screen={screen} world={state.world} animateIn={animate} />,
        label: priya ? "Priya's Meesho app · Hijli" : "Meesho app · what buyers see",
        framed: true,
        darkStatus: false,
      };
    }
    case "trend":
      return { key: "trend", node: <TrendScreen />, label: "Dukaan AI · local demand", framed: true, darkStatus: false };
  }
}

export function whatsappView(state: StoryState, prev: StoryState | null, showTranslation: boolean): SlotView {
  const highlight = state.left.kind === "mitra" && state.left.step >= 7;
  return {
    key: "wa",
    node: (
      <WhatsAppScreen
        view={state.world.waView}
        messages={state.chat}
        animateFrom={prev ? prev.chat.length : state.chat.length}
        showTranslation={showTranslation}
        newChatHighlight={highlight}
      />
    ),
    label: "Ramesh's WhatsApp",
    framed: true,
    darkStatus: state.world.waView === "chat",
  };
}

export function clockTime(clock: string) {
  const parts = clock.split(" ");
  return parts[parts.length - 1] || "9:41";
}
