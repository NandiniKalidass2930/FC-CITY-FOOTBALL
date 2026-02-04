import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Unser Team - FC City Boys Zurich" : "Our Team - FC City Boys Zurich",
    description: isDe
      ? "Lernen Sie die talentierten Spieler und Trainer von FC City Boys Zurich kennen. Unsere erste Mannschaft, Trainer und Erfolge."
      : "Meet the talented players and coaches of FC City Boys Zurich. Our first team, coaching staff, and achievements.",
    path: "/our-team",
    lang,
    image: "/images/home1.jpg",
    keywords: isDe
      ? ["FC City Boys Team", "Fussballspieler", "Trainer", "Mannschaft"]
      : ["FC City Boys team", "football players", "coaches", "squad"],
  });
}

export default function OurTeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
