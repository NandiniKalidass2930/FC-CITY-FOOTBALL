import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Häufig gestellte Fragen - FC City Boys Zurich" : "FAQ - FC City Boys Zurich",
    description: isDe
      ? "Häufig gestellte Fragen zu FC City Boys Zurich - Mitgliedschaft, Training, Spiele, Jugendakademie und mehr."
      : "Frequently asked questions about FC City Boys Zurich - membership, training, matches, youth academy, and more.",
    path: "/faq",
    lang,
    image: "/images/faq/faq.jpg",
    keywords: isDe
      ? ["FC City Boys FAQ", "Häufige Fragen", "Vereinsinformationen"]
      : ["FC City Boys FAQ", "frequently asked questions", "club information"],
  });
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
