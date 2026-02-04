import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/language-context";
import { SiteSettingsProvider } from "@/contexts/site-settings-context";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isDe = lang === "de";
  
  return generateSEOMetadata({
    title: isDe ? "FC City Boys Zurich - Professioneller Fussballverein" : "FC City Boys Zurich - Professional Football Club",
    description: isDe 
      ? "Offizielle Website von FC City Boys Zurich - Professioneller Fussballverein in Zürich, Schweiz. Gegründet 1989. Exzellenz, Leidenschaft und Gemeinschaftsgeist."
      : "Official website of FC City Boys Zurich - Professional football club in Zurich, Switzerland. Founded 1989. Dedicated to excellence, passion, and community spirit.",
    path: "",
    lang,
    keywords: isDe 
      ? ["FC City Boys", "Fussballverein Zürich", "Schweizer Fussball", "Fussballtraining", "Fussballakademie"]
      : ["FC City Boys", "Zurich football", "Swiss football club", "football training", "football academy"],
  });
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // Generate structured data
  const organizationData = generateStructuredData("SportsOrganization");
  const websiteData = generateStructuredData("WebSite");
  
  return (
    <>
      {/* Structured Data */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <LanguageProvider>
        <SiteSettingsProvider>
          {children}
          <ScrollToTop />
        </SiteSettingsProvider>
      </LanguageProvider>
    </>
  );
}
