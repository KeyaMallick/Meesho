import type { Metadata } from "next";
import { StoryApp } from "@/components/stage/StoryApp";

export const metadata: Metadata = {
  title: "The 90-day story · Meesho Dukaan",
};

export default function StoryPage() {
  return <StoryApp />;
}
