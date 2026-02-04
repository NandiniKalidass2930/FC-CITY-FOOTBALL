import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Galerie - FC City Boys Zurich" : "Gallery - FC City Boys Zurich",
    description: isDe
      ? "Durchsuchen Sie unsere Fussball-Galerie mit Bildern von Training, Spielen und Veranstaltungen von FC City Boys Zurich."
      : "Browse our football gallery featuring images from training sessions, matches, and events of FC City Boys Zurich.",
    path: "/gallery",
    lang,
    image: "/images/about/ab1.jpg",
    keywords: isDe
      ? ["FC City Boys Galerie", "Fussball Fotos", "Spiel Bilder", "Training Fotos"]
      : ["FC City Boys gallery", "football photos", "match images", "training photos"],
  });
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
