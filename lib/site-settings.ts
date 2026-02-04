import { client } from "@/sanity/lib/client";

export interface SiteSettings {
  email: string;
  phone: string;
  address: {
    en?: string;
    de?: string;
  };
  mapEmbedUrl?: string;
}

/**
 * Fetch site settings from Sanity (singleton document)
 * This should be called once and cached/shared across components
 */
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0] {
      email,
      phone,
      address {
        en,
        de
      },
      mapEmbedUrl
    }`;
    
    const data = await client.fetch(query, {}, { 
      next: { revalidate: 0 },
      cache: 'no-store' as any 
    });
    
    if (!data) {
      console.warn("⚠️ Site settings not found in Sanity. Please create a siteSettings document.");
      return null;
    }
    
    return data as SiteSettings;
  } catch (error) {
    console.error("❌ Error fetching site settings:", error);
    return null;
  }
}
