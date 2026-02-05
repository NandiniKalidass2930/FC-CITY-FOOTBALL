"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { useState, useEffect, useMemo } from "react"

interface SocialLink {
  platform: "Facebook" | "Instagram" | "Twitter" | "YouTube"
  url: string
}

interface FooterData {
  logo?: {
    asset?: {
      _id: string
      _type: string
      url: string
    }
    alt?: string
  }
  clubName?: string
  description?: string
  email?: string
  socialLinks?: SocialLink[]
  copyrightText?: string
}

// Keep Footer navigation links aligned with Navbar routing (/en, /de) and existing pages
const footerNavLinks = {
  club: [
    { key: "about", href: "/about" },
    { key: "ourTeam", href: "/our-team" },
    { key: "gallery", href: "/gallery" },
    { key: "training", href: "/training" },
  ],
  support: [
    { key: "faq", href: "/faq" },
    { key: "contact", href: "/contact" },
  ],
}

// Avoid rendering placeholder social links (e.g. "#") - show only configured links
const fallbackSocialLinks: Array<{
  icon: any
  href: string
  label: string
  platform?: string
}> = []

export function Footer() {
  const { t, getHref, language } = useLanguage()
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch footer data from Sanity
  useEffect(() => {
    async function fetchFooterData() {
      try {
        setLoading(true)
        const query = `*[_type == "footer"][0] {
          logo {
            asset-> {
              _id,
              _type,
              url
            },
            alt
          },
          clubName,
          description,
          email,
          socialLinks[] {
            platform,
            url
          },
          copyrightText
        }`
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        setFooterData(data || null)
      } catch (error) {
        console.error("Error fetching footer data:", error)
        setFooterData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFooterData()
  }, [language])

  // Get social links from Sanity (ordered), or use fallback
  const socialLinks = useMemo(() => {
    const urlsByPlatform = new Map<string, string>()

    for (const link of footerData?.socialLinks || []) {
      const url = typeof link?.url === "string" ? link.url.trim() : ""
      if (!url || url === "#") continue
      urlsByPlatform.set(link.platform, url)
    }

    const ordered = [
      { platform: "Facebook", icon: Facebook, label: "Facebook" },
      { platform: "Twitter", icon: Twitter, label: "Twitter / X" },
      { platform: "Instagram", icon: Instagram, label: "Instagram" },
      { platform: "YouTube", icon: Youtube, label: "YouTube" },
    ] as const

    const fromSanity = ordered
      .map((item) => {
        const href = urlsByPlatform.get(item.platform)
        return href ? { ...item, href } : null
      })
      .filter(Boolean) as Array<{
      platform: string
      icon: any
      label: string
      href: string
    }>

    return fromSanity.length > 0 ? fromSanity : fallbackSocialLinks
  }, [footerData?.socialLinks])
  
  // Use footer email or fallback to translation
  const email = footerData?.email || t("footer", "email")
  
  // Get club name from footer or fallback
  const clubName = footerData?.clubName || t("footer", "clubName")
  
  // Get description from footer or fallback
  const description = footerData?.description || t("footer", "description")
  
  // Get copyright text
  const copyrightText = footerData?.copyrightText || t("footer", "copyright")
  
  // Get logo URL
  const logoUrl = footerData?.logo?.asset 
    ? urlFor(footerData.logo).url()
    : "/images/logo.png"
  const logoAlt = footerData?.logo?.alt || "FC City Boys Zurich Logo"

  return (
    <footer className="relative bg-gradient-to-br from-[#1a1b4d] via-[#2d2e6b] to-black overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjM2IzZGFjIi8+PC9zdmc+')]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-12">
          {/* Club Branding Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Club Logo */}
            {logoUrl && (
              <div className="relative inline-block">
                <div className="relative h-14 sm:h-16" style={{ width: 'auto' }}>
                  <Image
                    src={logoUrl}
                    alt={logoAlt}
                    width={160}
                    height={75}
                    className="h-full w-auto object-contain"
                    unoptimized={footerData?.logo?.asset ? true : false}
                  />
                </div>
              </div>
            )}

            {/* Club Name */}
            {clubName && (
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {clubName}
              </h3>
            )}

            {/* Description */}
            {description && (
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xs">
                {description}
              </p>
            )}

            {/* Email */}
            {!loading && email && (
              <motion.a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 group"
                whileHover={{ x: 4 }}
              >
                <Mail className="h-5 w-5 text-white" />
                <span className="text-sm sm:text-base">{email}</span>
              </motion.a>
            )}
          </motion.div>

          {/* Club Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 relative">
              {t("footer", "club")}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#3b3dac] to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerNavLinks.club.map((link) => (
                <li key={link.href}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={getHref(link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base relative group inline-block"
                    >
                      {t("navbar", link.key)}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3b3dac] group-hover:w-full transition-all duration-300" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 relative">
              {t("footer", "support")}
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#3b3dac] to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerNavLinks.support.map((link) => (
                <li key={link.href}>
                  <motion.div
                    whileHover={{ x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={getHref(link.href)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-sm sm:text-base relative group inline-block"
                    >
                      {t("navbar", link.key)}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3b3dac] group-hover:w-full transition-all duration-300" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg sm:text-xl font-bold text-white mb-6 relative">
              Follow Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#3b3dac] to-transparent" />
            </h4>

            {/* Social Media Icons - Circular with dark backgrounds */}
            {socialLinks.length > 0 ? (
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={`${social.platform || social.label}-${index}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Icon Background - Dark circular with border */}
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:bg-white group-hover:border-white/60 shadow-sm shadow-black/20">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-[#3b3dac] transition-colors duration-300 relative z-10" />
                        
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 bg-[#3b3dac]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </motion.a>
                  )
                })}
              </div>
            ) : null}
          </motion.div>
        </div>

        {/* Bottom Section - Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-8 sm:pt-10 border-t border-gray-700/50"
        >
          <p className="text-center text-gray-400 text-sm sm:text-base">
            © {new Date().getFullYear()} {clubName || "FC City Boys"}. {copyrightText}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}