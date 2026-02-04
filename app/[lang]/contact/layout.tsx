import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "Kontakt - FC City Boys Zurich" : "Contact Us - FC City Boys Zurich",
    description: isDe
      ? "Kontaktieren Sie FC City Boys Zurich. Besuchen Sie uns in Geroldsweg 13a, 8196 Wil-ZH, Schweiz. Telefon, E-Mail und Öffnungszeiten."
      : "Contact FC City Boys Zurich. Visit us at Geroldsweg 13a, 8196 Wil-ZH, Switzerland. Phone, email, and office hours.",
    path: "/contact",
    lang,
    image: "/images/contact/cont1.jpg",
    keywords: isDe
      ? ["FC City Boys Kontakt", "Fussballverein Adresse", "Kontaktformular"]
      : ["FC City Boys contact", "football club address", "contact form"],
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
