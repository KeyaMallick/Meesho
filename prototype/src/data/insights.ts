export type Locality = {
  name: string;
  col: number;
  row: number;
  demand: number; // 0-100 index for the selected category
  stores: number; // Dukaan shops reporting
  stockouts: number;
  topItem: string;
  band: [number, number];
  change: number; // % vs last week
};

/** Illustrative data. Cells with fewer than 10 stores are hidden (privacy rule). */
export const LOCALITIES: Locality[] = [
  { name: "Talbagicha", col: 1, row: 0, demand: 33, stores: 12, stockouts: 1, topItem: "Printed dupattas", band: [180, 240], change: 4 },
  { name: "Chowringhee", col: 2, row: 0, demand: 47, stores: 15, stockouts: 2, topItem: "Rayon kurtis", band: [380, 450], change: 9 },
  { name: "Saradapally", col: 3, row: 0, demand: 0, stores: 7, stockouts: 0, topItem: "", band: [0, 0], change: 0 },
  { name: "Hijli", col: 0, row: 1, demand: 68, stores: 18, stockouts: 4, topItem: "Cotton kurtis <₹500", band: [400, 470], change: 22 },
  { name: "Prem Bazar", col: 1, row: 1, demand: 78, stores: 27, stockouts: 5, topItem: "Tant sarees", band: [750, 950], change: 18 },
  { name: "Gole Bazaar", col: 2, row: 1, demand: 92, stores: 23, stockouts: 7, topItem: "Cotton kurtis <₹500", band: [420, 480], change: 40 },
  { name: "Malancha", col: 3, row: 1, demand: 64, stores: 16, stockouts: 3, topItem: "Kids frocks", band: [260, 320], change: 12 },
  { name: "Inda", col: 0, row: 2, demand: 71, stores: 21, stockouts: 4, topItem: "Cotton kurtis <₹500", band: [400, 460], change: 25 },
  { name: "Kharida", col: 1, row: 2, demand: 55, stores: 14, stockouts: 2, topItem: "Men's kurtas", band: [480, 560], change: 7 },
  { name: "Gate Bazar", col: 2, row: 2, demand: 59, stores: 19, stockouts: 3, topItem: "Printed sarees", band: [600, 700], change: 10 },
  { name: "Puri Gate", col: 3, row: 2, demand: 40, stores: 11, stockouts: 1, topItem: "Dupattas", band: [190, 250], change: 3 },
  { name: "Nimpura", col: 1, row: 3, demand: 36, stores: 10, stockouts: 1, topItem: "Leggings", band: [180, 220], change: -2 },
  { name: "Tangasole", col: 2, row: 3, demand: 52, stores: 13, stockouts: 2, topItem: "Kids lehengas", band: [620, 720], change: 6 },
  { name: "Subhaspally", col: 3, row: 3, demand: 0, stores: 6, stockouts: 0, topItem: "", band: [0, 0], change: 0 },
];

export const MIN_STORES = 10;

/** Sequential plum ramp, light → dark (one hue, magnitude). */
export const DEMAND_RAMP = ["#f6e9f3", "#e7c3dd", "#cf8fbf", "#a3508f", "#6e1a5e"];
export const DEMAND_STEPS = [20, 40, 60, 80, 101];

export function demandColor(v: number) {
  const i = DEMAND_STEPS.findIndex((s) => v < s);
  return DEMAND_RAMP[i < 0 ? DEMAND_RAMP.length - 1 : i];
}

export function demandInk(v: number) {
  return v >= 60 ? "#ffffff" : "#2a1426";
}

export const RISING = [
  { item: "Cotton kurtis under ₹500", change: 40 },
  { item: "Printed cotton dupattas", change: 22 },
  { item: "Kids festive lehengas", change: 18 },
  { item: "Synthetic sarees", change: -15 },
];

export const STOCKOUTS = [
  { item: "Cotton kurti · size L", stores: "7 of 23 stores", where: "Gole Bazaar" },
  { item: "Tant saree · red border", stores: "5 of 27 stores", where: "Prem Bazar" },
  { item: "Cotton kurti · size XL", stores: "4 of 21 stores", where: "Inda" },
];

export const PRICE_BANDS = [
  { band: "300", share: 8 },
  { band: "350", share: 14 },
  { band: "400", share: 24 },
  { band: "450", share: 27 },
  { band: "500", share: 15 },
  { band: "550", share: 7 },
  { band: "600+", share: 5 },
];

/** Price bands each sandbox category typically sells at nearby (₹). Not model output. */
export const NEAR_PRICE: Record<string, [number, number]> = {
  kurti: [420, 480],
  saree: [750, 900],
  kids_wear: [260, 320],
  mens_wear: [480, 560],
  footwear: [220, 280],
  bags: [400, 520],
  stationery: [40, 120],
  home_decor: [250, 400],
  puja: [300, 420],
  accessories: [120, 200],
  other: [200, 400],
};
