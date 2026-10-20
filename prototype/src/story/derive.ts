import { BEATS, type FlatBeat } from "./script";
import type { Msg, Screen, Stream, Wide, World } from "./types";

export type StoryState = {
  beat: FlatBeat;
  index: number;
  world: World;
  chat: Msg[];
  left: Screen;
  right: Screen;
  wide: Wide | null;
  earned: Stream[];
};

export const INITIAL_WORLD: World = {
  listed: 0,
  heroLive: false,
  heroStock: 7,
  order: "none",
  pro: false,
  waView: "list",
};

/** Fold beats 0..index into the full screen state. Pure, so back/jump/deep-link all work. */
export function deriveState(index: number): StoryState {
  const i = Math.max(0, Math.min(index, BEATS.length - 1));
  let world = { ...INITIAL_WORLD };
  let chat: Msg[] = [];
  let left: Screen = { kind: "none" };
  let right: Screen = { kind: "none" };
  let wide: Wide | null = null;
  const earned = new Set<Stream>();

  for (let k = 0; k <= i; k++) {
    const b = BEATS[k];
    if (b.world) world = { ...world, ...b.world };
    if (b.patch) {
      chat = chat.map((m) => {
        const p = b.patch!.find((x) => x.id === m.id);
        return p ? ({ ...m, ...p.set } as Msg) : m;
      });
    }
    if (b.chat) chat = [...chat, ...b.chat];
    if (b.left) left = b.left;
    if (b.right) right = b.right;
    wide = b.wide ?? null;
    b.earn?.forEach((e) => earned.add(e));
  }

  return { beat: BEATS[i], index: i, world, chat, left, right, wide, earned: [...earned] };
}
