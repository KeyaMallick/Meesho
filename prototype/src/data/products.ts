export type ArtShape =
  | "kurti"
  | "kurta"
  | "saree"
  | "frock"
  | "lehenga"
  | "shirt"
  | "dupatta"
  | "bag"
  | "chappal"
  | "bangles"
  | "thali";

export type ProductArtSpec = {
  shape: ArtShape;
  color: string;
  accent?: string;
  trim?: string;
  pattern?: "plain" | "print" | "check" | "stripe" | "floral" | "border";
  bg?: string;
};

export type Product = {
  id: string;
  title: string;
  titleHi: string;
  price: number;
  sizes: string[];
  art: ProductArtSpec;
  /** Optional real photo, e.g. "/products/kurti-blue.jpg" */
  photo?: string;
};

/** The hero item Ramesh lists himself on Day 2. */
export const HERO: Product = {
  id: "kurti-blue",
  title: "Blue Cotton Kurti",
  titleHi: "नीली कॉटन कुर्ती",
  price: 450,
  sizes: ["M", "L"],
  art: { shape: "kurti", color: "#2f6fc4", accent: "#ffffff", pattern: "print", trim: "#f4c542" },
};

/** The 20 items the Mitra lists during the Day-0 visit. */
export const SHOP_ITEMS: Product[] = [
  { id: "kurti-pink", title: "Pink Printed Kurti", titleHi: "गुलाबी प्रिंटेड कुर्ती", price: 399, sizes: ["S", "M", "L"], art: { shape: "kurti", color: "#e0679a", accent: "#fff3d7", pattern: "floral" } },
  { id: "saree-tant", title: "Orange Tant Saree", titleHi: "नारंगी तांत साड़ी", price: 899, sizes: ["Free"], art: { shape: "saree", color: "#f08a24", trim: "#7a1530", pattern: "plain" } },
  { id: "kurti-yellow", title: "Yellow Anarkali Kurti", titleHi: "पीली अनारकली कुर्ती", price: 549, sizes: ["M", "L", "XL"], art: { shape: "kurti", color: "#f1b81c", accent: "#b5341f", pattern: "border" } },
  { id: "saree-red", title: "Red Cotton Saree", titleHi: "लाल कॉटन साड़ी", price: 799, sizes: ["Free"], art: { shape: "saree", color: "#c4262e", trim: "#f4c542", pattern: "print", accent: "#f4c542" } },
  { id: "frock-pink", title: "Girls Party Frock", titleHi: "बच्चों की फ्रॉक", price: 299, sizes: ["2-3Y", "4-5Y"], art: { shape: "frock", color: "#f39bc0", accent: "#ffffff", pattern: "print" } },
  { id: "kurta-white", title: "Men's Cotton Kurta", titleHi: "पुरुषों का कॉटन कुर्ता", price: 499, sizes: ["M", "L", "XL"], art: { shape: "kurta", color: "#f3efe6", accent: "#b08d57", bg: "#e6ddd0" } },
  { id: "dupatta-print", title: "Printed Cotton Dupatta", titleHi: "प्रिंटेड दुपट्टा", price: 199, sizes: ["Free"], art: { shape: "dupatta", color: "#6b3fa0", accent: "#f4c542", trim: "#f4c542", pattern: "floral" } },
  { id: "saree-teal", title: "Teal Printed Saree", titleHi: "टील प्रिंटेड साड़ी", price: 649, sizes: ["Free"], art: { shape: "saree", color: "#1d8a8a", trim: "#f2e3c6", pattern: "print", accent: "#f2e3c6" } },
  { id: "shirt-check", title: "Boys Check Shirt", titleHi: "लड़कों की चेक शर्ट", price: 249, sizes: ["6-7Y", "8-9Y"], art: { shape: "shirt", color: "#3b6fb6", accent: "#ffffff", pattern: "check" } },
  { id: "kurti-green", title: "Green Cotton Kurti", titleHi: "हरी कॉटन कुर्ती", price: 429, sizes: ["M", "L"], art: { shape: "kurti", color: "#3f9a5a", accent: "#ffffff", pattern: "stripe" } },
  { id: "lehenga-kids", title: "Kids Lehenga Choli", titleHi: "बच्चों का लहंगा", price: 699, sizes: ["3-4Y", "5-6Y"], art: { shape: "lehenga", color: "#d63b6d", trim: "#f4c542", pattern: "print", accent: "#f4c542" } },
  { id: "saree-maroon", title: "Maroon Silk-look Saree", titleHi: "मैरून साड़ी", price: 1199, sizes: ["Free"], art: { shape: "saree", color: "#7a1530", trim: "#e3b23c", pattern: "floral", accent: "#e3b23c" } },
  { id: "kurta-mustard", title: "Men's Mustard Kurta", titleHi: "सरसों रंग कुर्ता", price: 549, sizes: ["M", "L"], art: { shape: "kurta", color: "#d9a425", accent: "#5a3a12" } },
  { id: "frock-yellow", title: "Girls Cotton Frock", titleHi: "कॉटन फ्रॉक", price: 279, sizes: ["2-3Y", "4-5Y"], art: { shape: "frock", color: "#f6cf4a", accent: "#e0679a", pattern: "floral" } },
  { id: "chappal-ladies", title: "Ladies Flat Chappal", titleHi: "लेडीज़ चप्पल", price: 249, sizes: ["5", "6", "7"], art: { shape: "chappal", color: "#c98b5a", accent: "#7a3b1d", trim: "#f4c542" } },
  { id: "dupatta-phulkari", title: "Phulkari Dupatta", titleHi: "फुलकारी दुपट्टा", price: 249, sizes: ["Free"], art: { shape: "dupatta", color: "#e2483d", accent: "#ffd23f", trim: "#2f6fc4", pattern: "floral" } },
  { id: "bangles-set", title: "Glass Bangles Set", titleHi: "कांच की चूड़ियाँ", price: 149, sizes: ["2.4", "2.6"], art: { shape: "bangles", color: "#c4262e", accent: "#e3b23c" } },
  { id: "kurti-maroon", title: "Maroon Rayon Kurti", titleHi: "मैरून रेयॉन कुर्ती", price: 479, sizes: ["M", "L", "XL"], art: { shape: "kurti", color: "#8c2140", accent: "#e3b23c", pattern: "border" } },
  { id: "chappal-kids", title: "Kids Chappal", titleHi: "बच्चों की चप्पल", price: 179, sizes: ["10", "11", "12"], art: { shape: "chappal", color: "#58b6e8", accent: "#f2475b", trim: "#ffd23f" } },
  { id: "saree-white", title: "Laal Paar White Saree", titleHi: "लाल पाड़ सफ़ेद साड़ी", price: 999, sizes: ["Free"], art: { shape: "saree", color: "#f7f3ea", trim: "#c4262e", pattern: "plain", bg: "#efe3d3" } },
];

export const ALL_PRODUCTS: Product[] = [HERO, ...SHOP_ITEMS];

export function productById(id: string): Product {
  const p = ALL_PRODUCTS.find((x) => x.id === id) ?? SAMPLE_PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown product ${id}`);
  return p;
}

/** Sample photos for the Try page. */
export const SAMPLE_PRODUCTS: Product[] = [
  { ...HERO, id: "sample-kurti" },
  { id: "sample-saree", title: "Red Cotton Saree", titleHi: "लाल कॉटन साड़ी", price: 800, sizes: ["Free"], art: { shape: "saree", color: "#c4262e", trim: "#f4c542", pattern: "print", accent: "#f4c542" } },
  { id: "sample-bag", title: "Kids School Bag", titleHi: "स्कूल बैग", price: 450, sizes: ["Free"], art: { shape: "bag", color: "#2f6fc4", accent: "#ff9f00" } },
  { id: "sample-thali", title: "Brass Puja Thali", titleHi: "पूजा थाली", price: 350, sizes: ["Free"], art: { shape: "thali", color: "#d9a93a", bg: "#f6ead0" } },
  { id: "sample-chappal", title: "Ladies Flat Chappal", titleHi: "लेडीज़ चप्पल", price: 250, sizes: ["5", "6", "7"], art: { shape: "chappal", color: "#c98b5a", accent: "#7a3b1d", trim: "#f4c542" } },
];
