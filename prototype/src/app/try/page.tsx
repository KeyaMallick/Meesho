import type { Metadata } from "next";
import { TryApp } from "@/components/try/TryApp";

export const metadata: Metadata = {
  title: "Try it yourself · Meesho Dukaan",
};

export default function TryPage() {
  return <TryApp />;
}
