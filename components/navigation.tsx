"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"

const navItems = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "ourTeam", href: "/our-team" },
  { key: "gallery", href: "/gallery" },
  { key: "training", href: "/training" },
  { key: "faq", href: "/faq" },
  { key: "contact", href: "/contact" },
]

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()
  const { t, language, getHref } = useLanguage()

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    handleScroll() // Check initial scroll position
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
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
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <div className="relative h-10 md:h-12" style={{ width: 'auto' }}>
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
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const localizedHref = getHref(item.href)
              const isActive = pathname === localizedHref || pathname.endsWith(item.href)
              return (
                <Link key={item.href} href={localizedHref}>
                  <Button
                    variant="ghost"
                    className={`relative px-5 py-3 text-base font-bold transition-all duration-300 group ${
                      isActive ? "text-[#3b3dac]" : "text-gray-900 hover:text-[#3b3dac]"
                    }`}
                  >
                    <span className="relative z-10">{t("navbar", item.key)}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#3b3dac] rounded-full shadow-lg shadow-[#3b3dac]/50"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    {!isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b3dac] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out rounded-full shadow-md shadow-[#3b3dac]/30"
                      />
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-1">
            <LanguageToggle />
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-11 w-11 min-h-[44px] min-w-[44px] touch-manipulation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t overflow-hidden"
            >
                  <nav className="px-2 pt-2 pb-4 space-y-2">
                    {navItems.map((item, index) => {
                      const localizedHref = getHref(item.href)
                      const isActive = pathname === localizedHref || pathname.endsWith(item.href)
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
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
                    </motion.div>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
