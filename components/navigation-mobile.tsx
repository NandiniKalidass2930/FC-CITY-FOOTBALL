"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "ourTeam", href: "/our-team" },
  { key: "gallery", href: "/gallery" },
  { key: "training", href: "/training" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
]

/**
 * Mobile-optimized navbar:
 * - No framer-motion dependency (keeps bundle smaller and hydration work lower on mobile)
 * - Same layout/classes/colors as the desktop navbar
 * - Keeps the mobile menu expand/collapse via lightweight CSS transitions
 */
export function NavigationMobile() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const { t, getHref } = useLanguage()

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      data-site-nav="main"
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-gray-200"
          : "bg-white/98 backdrop-blur-sm border-gray-200/50"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Logo + Text */}
          <Link href={getHref("/")} className="flex items-center gap-3 group">
            <div className="flex items-center gap-3">
              <div className="relative h-10 md:h-12" style={{ width: "auto" }}>
                <Image
                  src="/images/logo.png"
                  alt="FC City Boys Zurich Logo"
                  width={120}
                  height={56}
                  className="h-full w-auto object-contain"
                  priority
                  unoptimized={false}
                />
              </div>
              <span className="font-semibold text-base md:text-lg text-gray-900 group-hover:text-[#3b3dac] transition-colors duration-300 tracking-wide hidden sm:block bg-gradient-to-r from-gray-800 via-[#3b3dac] to-gray-800 bg-clip-text text-transparent">
                FC City Boys Zurich
              </span>
            </div>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-1">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="h-6 w-6" />
              ) : (
                <HamburgerIcon className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden border-t overflow-hidden transition-[max-height,opacity] duration-200 ease-out ${
            mobileMenuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-2 pt-2 pb-4 space-y-2">
            {navItems.map((item) => {
              const localizedHref = getHref(item.href)
              const isActive = pathname === localizedHref || pathname.endsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={localizedHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block"
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start text-base font-medium min-h-[44px] touch-manipulation ${
                      isActive ? "bg-[#3b3dac]/10 text-[#3b3dac]" : "text-gray-900"
                    }`}
                  >
                    {t("navbar", item.key)}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </nav>
  )
}

