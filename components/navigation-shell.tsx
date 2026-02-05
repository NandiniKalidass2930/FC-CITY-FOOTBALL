import { headers } from "next/headers"

import { Navigation } from "@/components/navigation"
import { NavigationMobile } from "@/components/navigation-mobile"

function isMobileUserAgent(ua: string) {
  return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(ua)
}

/**
 * Server-selected navbar for better mobile performance.
 * Mobile gets a lightweight navbar (no framer-motion), desktop keeps the existing one unchanged.
 */
export async function NavigationShell() {
  const ua = (await headers()).get("user-agent") || ""
  const mobile = isMobileUserAgent(ua)

  return mobile ? <NavigationMobile /> : <Navigation />
}

