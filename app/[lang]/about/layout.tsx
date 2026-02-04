import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Über Uns - FC City Boys Zurich" : "About Us - FC City Boys Zurich",
    description: isDe
      ? "Erfahren Sie mehr über FC City Boys Zurich - unsere Geschichte seit 1989, unsere Vision, Mission und unser Engagement für Exzellenz im Fussball und in der Gemeinschaft."
      : "Learn about FC City Boys Zurich - our history since 1989, our vision, mission, and commitment to excellence in football and community.",
    path: "/about",
    lang,
    image: "/images/about/ab2.jpg",
    keywords: isDe
      ? ["FC City Boys Geschichte", "Fussballverein Zürich", "Vereinsgeschichte", "Fussball Vision"]
      : ["FC City Boys history", "Zurich football club", "club history", "football vision"],
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
