import type { Metadata, Viewport } from "next";
import { Hind, Hind_Siliguri, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hind = Hind({
  variable: "--font-hind",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Meesho Dukaan · Prototype",
  description:
    "Online in one visit. Run entirely from WhatsApp. A concept prototype by Team 505, IIT Kharagpur, for Meesho DICE Challenge 3.0.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Meesho Dukaan · Prototype",
    description: "Online in one visit. Run entirely from WhatsApp.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#570d48",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${hind.variable} ${hindSiliguri.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
