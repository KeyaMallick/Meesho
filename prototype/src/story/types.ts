export type Slot = "left" | "center" | "right";
export type Focus = Slot | "wide";
export type Stream = "starter" | "pro" | "insights" | "supplier";
export type Side = "shop" | "bot";

/** Facts about the world that several screens read from. */
export type World = {
  listed: number; // items on the storefront from the Mitra visit
  heroLive: boolean; // Ramesh's own kurti listing is live
  heroStock: number;
  order: "none" | "placed" | "picked" | "delivered";
  pro: boolean;
  waView: "list" | "chat";
};

export type Listing = {
  productId: string;
  title: string;
  titleLocal: string;
  sizes: string[];
  price: number;
  near?: [number, number];
  attributes?: { label: string; value: string }[];
  description?: string;
  /** Uploaded photo (Try page); otherwise the product art is used. */
  imageSrc?: string;
};

type MsgBase = { id: string; time: string };

export type Msg =
  | (MsgBase & { t: "date"; text: string })
  | (MsgBase & { t: "text"; from: Side; text: string; en?: string; buttons?: string[]; picked?: number })
  | (MsgBase & { t: "voice"; from: Side; dur: string; transcript: string; en?: string; audio?: string })
  | (MsgBase & { t: "image"; from: Side; productId?: string; src?: string })
  | (MsgBase & { t: "listing"; from: "bot"; listing: Listing; picked?: number; status?: string })
  | (MsgBase & { t: "order"; from: "bot"; productId: string; size: string; price: number; place: string })
  | (MsgBase & { t: "packing"; from: "bot" })
  | (MsgBase & { t: "stock"; from: "bot"; productId: string; before: number; after: number })
  | (MsgBase & { t: "trend"; from: "bot"; picked?: number })
  | (MsgBase & { t: "wholesale"; from: "bot" })
  | (MsgBase & { t: "review"; from: "bot" })
  | (MsgBase & { t: "value"; from: "bot" })
  | (MsgBase & { t: "upi"; from: "bot"; amount: number; label: string });

export type MitraStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Screen =
  | { kind: "none" }
  | { kind: "mitra"; step: MitraStep }
  | { kind: "qr" }
  | { kind: "buyer"; view: "store" | "nearby" | "product" | "ordered" | "tracking"; highlight?: string }
  | { kind: "trend" };

export type Wide =
  | { kind: "dashboard"; step: 1 | 2 | 3 }
  | { kind: "impact"; step: 1 | 2 | 3 };

export type Beat = {
  id: string;
  focus: Focus;
  clock: string;
  caption: string;
  captionHi?: string;
  chat?: Msg[];
  patch?: { id: string; set: Partial<Record<string, unknown>> }[];
  left?: Screen;
  right?: Screen;
  wide?: Wide;
  world?: Partial<World>;
  earn?: Stream[];
  handoff?: { from: Slot; to: Slot; label: string };
};

export type Chapter = {
  n: number;
  short: string;
  title: string;
  day: string;
  solves?: string;
  beats: Beat[];
};
