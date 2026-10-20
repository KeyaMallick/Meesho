import { create } from "zustand";
import { BEATS } from "./script";

type StoryStore = {
  index: number;
  /** True when the last move was a single step forward, so new things should animate in. */
  animate: boolean;
  showCaption: boolean;
  showTranslation: boolean;
  go: (index: number) => void;
  next: () => void;
  prev: () => void;
  toggleCaption: () => void;
  toggleTranslation: () => void;
};

const clamp = (i: number) => Math.max(0, Math.min(i, BEATS.length - 1));

export const useStory = create<StoryStore>((set, get) => ({
  index: 0,
  animate: false,
  showCaption: true,
  showTranslation: true,
  go: (index) => set({ index: clamp(index), animate: clamp(index) === get().index + 1 }),
  next: () => get().go(get().index + 1),
  prev: () => set({ index: clamp(get().index - 1), animate: false }),
  toggleCaption: () => set((s) => ({ showCaption: !s.showCaption })),
  toggleTranslation: () => set((s) => ({ showTranslation: !s.showTranslation })),
}));
