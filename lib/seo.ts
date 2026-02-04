import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fccityboys.ch";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  lang: string;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const { title, description, keywords, path, lang, image, noindex, nofollow } = config;
  
  const url = `${baseUrl}/${lang}${path}`;
  const imageUrl = image ? `${baseUrl}${image}` : `${baseUrl}/images/logo.png`;
  
  const metadata: Metadata = {
    title: `${title} | FC City Boys Zurich`,
    description,
    keywords: keywords || [
      "FC City Boys",
      "Zurich football",
      "Swiss football club",
      "football training",
      "football academy",
      "professional football",
      lang === "de" ? "Fussballverein Zürich" : "football club Zurich",
    ],
    authors: [{ name: "FC City Boys Zurich" }],
    creator: "FC City Boys Zurich",
    publisher: "FC City Boys Zurich",
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "de" ? "de_CH" : "en_US",
      url,
      title,
      description,
      siteName: "FC City Boys Zurich",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        "en": `${baseUrl}/en${path}`,
        "de": `${baseUrl}/de${path}`,
        "x-default": `${baseUrl}/en${path}`,
      },
    },
  };

  return metadata;
}

export function generateHreflangTags(path: string) {
  const languages = ["en", "de"];
  return languages.map((lang) => ({
    rel: "alternate",
    hreflang: lang,
    href: `${baseUrl}/${lang}${path}`,
  }));
}

export function generateStructuredData(type: "Organization" | "SportsOrganization" | "WebSite" | "BreadcrumbList", data?: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
  };

  switch (type) {
    case "Organization":
    case "SportsOrganization":
      return {
        ...baseStructuredData,
        "@type": "SportsOrganization",
        name: "FC City Boys Zurich",
        url: baseUrl,
        logo: `${baseUrl}/images/logo.png`,
        description: "Professional football club based in Zurich, Switzerland. Founded in 1989, dedicated to excellence, passion, and community spirit.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Geroldsweg 13a",
          addressLocality: "Wil",
          postalCode: "8196",
          addressCountry: "CH",
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+41-XX-XXX-XX-XX",
          contactType: "Customer Service",
          areaServed: "CH",
          availableLanguage: ["en", "de"],
        },
        sameAs: [
          "https://www.facebook.com/fccityboys",
          "https://www.instagram.com/fccityboys",
          "https://www.twitter.com/fccityboys",
          "https://www.youtube.com/fccityboys",
        ],
        ...data,
      };
    
    case "WebSite":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        name: "FC City Boys Zurich",
        url: baseUrl,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
        ...data,
      };
    
    case "BreadcrumbList":
      return {
        ...baseStructuredData,
        "@type": "BreadcrumbList",
        itemListElement: data?.items || [],
      };
    
    default:
      return baseStructuredData;
  }
}
