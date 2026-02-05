"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Mail, MapPin, Send, Clock, HelpCircle, Phone, Facebook, Instagram, Twitter, Youtube, ExternalLink, CheckCircle2 } from "lucide-react"
import Image from "next/image"

import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { PremiumImageCard } from "@/components/premium-image-card"
import { client } from "@/sanity/lib/client"
import { getLocalizedContent, getLocalizedText } from "@/lib/sanity-locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

/* ---------------- Subtle Animation Variants ---------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
}

/* ---------------- Enhanced Interactive Card Component ---------------- */
function CleanCard({ 
  children, 
  className = "",
  icon: Icon,
  iconColor = "text-[#3b3dac]"
}: { 
  children: React.ReactNode
  className?: string
  icon?: any
  iconColor?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)
  const [ripple, setRipple] = React.useState<{ x: number; y: number } | null>(null)

  // 3D Tilt Effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setRipple({ x, y })
    setTimeout(() => setRipple(null), 600)
  }

  return (
    <motion.div 
      ref={ref}
      className={`relative group rounded-2xl ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Gradient Border Animation */}
      <motion.div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)",
          backgroundSize: "200% 200%",
        }}
        animate={isHovered ? {
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Soft Blue Glow Shadow */}
      <motion.div
        className="absolute -inset-2 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
        animate={isHovered ? {
          scale: [1, 1.1, 1],
          opacity: [0, 0.6, 0.4],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Light Pulse Animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/0 via-blue-400/0 to-blue-400/0 group-hover:from-blue-400/10 group-hover:via-blue-400/5 group-hover:to-blue-400/10 transition-all duration-500 pointer-events-none"
        animate={isHovered ? {
          opacity: [0.5, 1, 0.5],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ripple Effect */}
      {ripple && (
        <motion.div
          className="absolute rounded-full bg-blue-500/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            width: 200,
            height: 200,
            opacity: [0.5, 0],
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* Main Card - Clean Design */}
      <motion.div 
        className="relative rounded-2xl bg-white p-6 sm:p-8 border border-gray-200 shadow-md h-full flex flex-col justify-center overflow-hidden"
        style={{ transform: "translateZ(0)" }}
        whileHover={{ 
          scale: 1.04,
          y: -6,
          boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Blue Gradient Border on Hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out -z-10 blur-sm" />
        <div className="absolute inset-[1px] rounded-2xl bg-white" />
        
        {/* Icon Badge with Pulse */}
        {Icon && (
          <motion.div 
            className="mb-6 flex justify-center relative z-10"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.div 
              className="w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 relative overflow-hidden"
              animate={isHovered ? {
                boxShadow: [
                  "0 0 0px rgba(59, 130, 246, 0)",
                  "0 0 20px rgba(59, 130, 246, 0.4)",
                  "0 0 0px rgba(59, 130, 246, 0)",
                ],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className={`h-7 w-7 ${iconColor} relative z-10`} />
            </motion.div>
          </motion.div>
        )}
        <div style={{ transform: "translateZ(20px)" }} className="relative z-10 [&_h3]:group-hover:text-blue-600 [&_h2]:group-hover:text-blue-600 [&_h3]:transition-colors [&_h2]:transition-colors [&_h3]:duration-300 [&_h2]:duration-300 [&_h3]:ease-in-out [&_h2]:ease-in-out">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------------- Animated Form Input Component ---------------- */
function AnimatedInput({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  required = false,
  delay = 0 
}: {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  delay?: number
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const hasValue = value.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <Label 
        className={`absolute left-4 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? 'top-2 text-xs text-[#3b3dac] font-semibold'
            : 'top-4 text-base text-gray-500'
        }`}
      >
        {label}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`rounded-xl border-gray-200 focus:border-[#3b3dac] focus:ring-2 focus:ring-[#3b3dac]/20 bg-white h-14 text-gray-900 transition-all duration-300 pt-6 ${
          isFocused || hasValue ? 'pt-6' : ''
        }`}
      />
    </motion.div>
  )
}

/* ---------------- Animated Textarea Component ---------------- */
function AnimatedTextarea({ 
  label, 
  value, 
  onChange, 
  required = false,
  delay = 0 
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  delay?: number
}) {
  const [isFocused, setIsFocused] = React.useState(false)
  const hasValue = value.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <Label 
        className={`absolute left-4 top-4 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? 'text-xs text-[#3b3dac] font-semibold'
            : 'text-base text-gray-500'
        }`}
      >
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        rows={6}
        className={`rounded-xl border-gray-200 focus:border-[#3b3dac] focus:ring-2 focus:ring-[#3b3dac]/20 bg-white text-gray-900 transition-all duration-300 resize-none pt-8 ${
          isFocused || hasValue ? 'pt-8' : ''
        }`}
      />
    </motion.div>
  )
}

interface SocialLink {
  platform: "Facebook" | "Instagram" | "Twitter" | "YouTube"
  url: string
  icon?: string
}

interface ContactPageData {
  title?: { en?: string; de?: string } | string
  description?: { en?: string; de?: string } | string
  address?: { en?: string; de?: string } | string
  phone?: string
  email?: string
  mapEmbedUrl?: string
  openingHours?: { en?: string; de?: string } | string
  socialLinks?: SocialLink[]
}

/* ---------------- Page Component ---------------- */
export default function ContactPage() {
  const { t, getHref, language } = useLanguage()
  const [contactData, setContactData] = useState<ContactPageData | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch all contact page data from Sanity (including email, phone, address, mapEmbedUrl)
  useEffect(() => {
    async function fetchContactData() {
      try {
        setLoading(true)
        const query = `*[_type == "contactPage"][0] {
          title,
          description,
          address,
          phone,
          email,
          mapEmbedUrl,
          openingHours,
          socialLinks[] {
            platform,
            url,
            icon
          }
        }`
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        setContactData(data || null)
      } catch (error) {
        console.error("Error fetching contact page data:", error)
        setContactData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContactData()
  }, [language])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setIsSuccess(false)

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        setError(t("contact", "form.error") || "Please fill in all fields")
        setIsSubmitting(false)
        return
      }

      // Submit to API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          setError(data.errors.join(', '))
        } else if (data.error === 'Server configuration error') {
          setError('Server configuration error: Please set up SANITY_API_WRITE_TOKEN in .env.local file. See SETUP_CONTACT_FORM.md for instructions.')
        } else {
          setError(data.error || data.message || t("contact", "form.error") || "Failed to send message. Please try again.")
        }
        setIsSubmitting(false)
        return
      }

      // Success - clear form and show success message
      setIsSuccess(true)
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      console.error('Error submitting form:', err)
      setError(t("contact", "form.error") || "Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Map platform names to icon components
  const platformIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Facebook,
    Instagram,
    Twitter,
    YouTube: Youtube,
  }

  // Get social links from Sanity or use fallback
  const socialLinks = useMemo(() => {
    if (contactData?.socialLinks && contactData.socialLinks.length > 0) {
      return contactData.socialLinks.map((link) => {
        const Icon = platformIconMap[link.platform]
        return {
          icon: Icon || Facebook, // Fallback to Facebook if platform not found
          href: link.url,
          label: t("contact", `social.${link.platform.toLowerCase()}`) || link.platform,
          platform: link.platform,
        }
      })
    }
    // Fallback to default links if no Sanity data
    return [
      { icon: Facebook, href: "#", label: t("contact", "social.facebook"), platform: "Facebook" },
      { icon: Instagram, href: "#", label: t("contact", "social.instagram"), platform: "Instagram" },
      { icon: Twitter, href: "#", label: t("contact", "social.twitter"), platform: "Twitter" },
      { icon: Youtube, href: "#", label: t("contact", "social.youtube"), platform: "YouTube" },
    ]
  }, [contactData?.socialLinks, t])

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <main className="flex-1">
        {/* ================= MODERN FOOTBALL CLUB HERO BANNER ================= */}
        <section className="relative min-h-[600px] sm:min-h-[700px] md:min-h-[800px] overflow-hidden">
          {/* Blue Gradient Background - Matching Reference */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" />
          
          {/* Diagonal Layered Shapes - Exact Reference Style */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Large Diagonal White Shape */}
            <div className="absolute top-0 right-0 w-[900px] h-[700px] bg-white/15 transform rotate-12 origin-top-right" />
            {/* Medium Diagonal Light Blue Shape */}
            <div className="absolute top-10 right-10 w-[700px] h-[500px] bg-blue-300/20 transform rotate-[-10deg] origin-top-right" />
            {/* Small Diagonal White Accent */}
            <div className="absolute top-40 right-40 w-[500px] h-[350px] bg-white/10 transform rotate-8 origin-top-right" />
            {/* Additional Diagonal Layer */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-400/15 transform rotate-[-15deg] origin-bottom-right" />
          </div>

          {/* Subtle Diagonal Pattern Lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)`
          }} />

<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center min-h-[600px] sm:min-h-[700px] md:min-h-[800px] py-16 sm:py-20 md:py-24">

{/* CENTER HERO */}
<div className="flex justify-center items-center w-full">

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="relative z-20 w-full max-w-3xl flex justify-center"
  >

    {/* Glass White Content Container */}
    <motion.div 
      className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 sm:p-10 md:p-12 shadow-2xl border border-white/40 w-full text-center group cursor-pointer"
      whileHover={{ 
        y: -6,
        boxShadow: "0 25px 50px rgba(59, 61, 172, 0.15)",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Border Glow on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out pointer-events-none" style={{ boxShadow: "0 0 0 1px rgba(59, 61, 172, 0.3), 0 0 20px rgba(59, 61, 172, 0.2)" }} />

      {/* Small Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span className="text-[#3b3dac] font-bold uppercase tracking-widest text-sm sm:text-base">
          {t("contact", "hero.heading")}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mt-4 mb-2"
      >
        {contactData?.title ? (
          (() => {
            const titleText = getLocalizedContent(contactData.title, language)
            const lines = titleText.split('\n')
            if (lines.length > 1) {
              return (
                <>
                  {lines[0]}<br />
                  <span className="text-[#3b3dac]">{lines.slice(1).join('\n')}</span>
                </>
              )
            }
            return titleText
          })()
        ) : (
          <>
            {t("contact", "hero.titleLine1")}<br />
            <span className="text-[#3b3dac]">{t("contact", "hero.titleLine2")}</span>
          </>
        )}
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl text-center mx-auto"
      >
        {contactData?.description ? getLocalizedText(contactData.description, language) : t("contact", "hero.description")}
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="pt-6 flex justify-center"
      >
        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
          {t("contact", "hero.button")}
        </Button>
      </motion.div>

    </motion.div>

  </motion.div>

</div>

          </div>
        </section>

        {/* ================= CONTACT CARDS SECTION ================= */}
        <section className="py-16 sm:py-20 bg-gray-180 relative overflow-hidden rounded-2xl shadow-sm">
          {/* Parallax Background Elements */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ transform: "translateZ(0)" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            style={{ transform: "translateZ(0)" }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 p-6 sm:p-8" style={{ perspective: "1000px" }}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 sm:mb-14 auto-rows-fr"
            >
              {/* Email Card */}
              <CleanCard icon={Mail}>
                <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">
                  {t("contact", "cards.email")}
                </h3>
                {loading ? (
                  <p className="text-gray-400 text-base text-center">Loading...</p>
                ) : contactData?.email ? (
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-[#3b3dac] text-base font-semibold hover:text-[#4c4ebd] transition-colors duration-200 text-center block break-all"
                  >
                    {contactData.email}
                  </a>
                ) : (
                  <a
                    href={`mailto:${t("contact", "address.email")}`}
                    className="text-[#3b3dac] text-base font-semibold hover:text-[#4c4ebd] transition-colors duration-200 text-center block break-all"
                  >
                    {t("contact", "address.email")}
                  </a>
                )}
              </CleanCard>

              {/* Phone Card */}
              <CleanCard icon={Phone} iconColor="text-green-600">
                <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">
                  {t("contact", "cards.phone")}
                </h3>
                {loading ? (
                  <p className="text-gray-400 text-base text-center">Loading...</p>
                ) : contactData?.phone ? (
                  <a
                    href={`tel:${contactData.phone}`}
                    className="text-gray-700 text-base font-semibold hover:text-[#3b3dac] transition-colors duration-200 text-center block"
                  >
                    {contactData.phone}
                  </a>
                ) : (
                  <a
                    href={`tel:${t("contact", "address.phone")}`}
                    className="text-gray-700 text-base font-semibold hover:text-[#3b3dac] transition-colors duration-200 text-center block"
                  >
                    {t("contact", "address.phone")}
                  </a>
                )}
              </CleanCard>

              {/* Location Card */}
              <CleanCard icon={MapPin} iconColor="text-red-600">
                <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">
                  {t("contact", "address.title")}
                </h3>
                {loading ? (
                  <p className="text-gray-400 text-sm text-center">Loading...</p>
                ) : contactData?.address ? (
                  <p className="text-gray-600 text-sm leading-relaxed text-center whitespace-pre-line">
                    {getLocalizedText(contactData.address, language) || ""}
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm leading-relaxed text-center">
                    {t("contact", "address.street")}<br />
                    {t("contact", "address.city")}<br />
                    {t("contact", "address.country")}
                  </p>
                )}
              </CleanCard>

              {/* Office Hours Card */}
              <CleanCard icon={Clock} iconColor="text-orange-600">
                <h3 className="text-xl font-bold mb-3 text-gray-900 text-center">
                  {t("contact", "officeHours.title")}
                </h3>
                {contactData?.openingHours ? (
                  <div className="text-gray-600 text-sm space-y-2 text-center whitespace-pre-line">
                    {getLocalizedText(contactData.openingHours, language)}
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm space-y-2 text-center">
                    <p><strong>{t("contact", "officeHours.weekdays")}</strong><br />{t("contact", "officeHours.weekdaysTime")}</p>
                    <p><strong>{t("contact", "officeHours.weekend")}</strong><br />{t("contact", "officeHours.weekendTime")}</p>
                  </div>
                )}
              </CleanCard>
            </motion.div>

            {/* ================= FORM SECTION ================= */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto p-6 sm:p-8"
            >
              <CleanCard icon={Send} className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900 leading-tight tracking-wide">
                    {t("contact", "form.send")}
                  </h2>
                  <p className="text-gray-600 text-base">
                    {t("contact", "form.description")}
                  </p>
                </div>

                <AnimatePresence>
                  {isSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-semibold">{t("contact", "form.success")}</p>
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
                    >
                      <HelpCircle className="h-5 w-5 text-red-600" />
                      <p className="text-red-800 font-semibold">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatedInput
                    label={t("contact", "form.name")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    delay={0.1}
                  />

                  <AnimatedInput
                    label={t("contact", "form.email")}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    delay={0.2}
                  />

                  <AnimatedInput
                    label={t("contact", "form.subject")}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    delay={0.3}
                  />

                  <AnimatedTextarea
                    label={t("contact", "form.message")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    delay={0.4}
                  />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#3b3dac] hover:bg-[#4c4ebd] text-white py-5 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? t("contact", "form.sending") : t("contact", "form.send")}
                      <Send className="ml-2 h-5 w-5" />
                    </Button>
                </form>
              </CleanCard>
            </motion.div>
          </div>
        </section>

        {/* ================= LARGE IMAGE SECTION ================= */}
        <section className="relative w-full overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative w-full h-[70vh]"
          >
            <PremiumImageCard
              src="/images/contact/cont1.jpg"
              alt={t("contact", "image.alt")}
              height="h-full"
              rounded="rounded-3xl"
              priority
            >
              {/* Dark-to-transparent Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/50 transition-all duration-500 ease-out" />
              
              {/* Centered Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-center px-4"
                >
                  {/* Main Heading */}
                  <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 drop-shadow-lg">
                    <span className="text-white">
                      {t("contact", "image.heading")}
                    </span>
                  </h2>
                  
                  {/* Subheading */}
                  <p className="text-white/90 text-xl sm:text-2xl md:text-3xl font-medium drop-shadow-md">
                    {t("contact", "image.subheading")}
                  </p>
                </motion.div>
              </div>
            </PremiumImageCard>
          </motion.div>
        </section>

        {/* ================= FULL-WIDTH MAP SECTION ================= */}
        <section className="py-16 sm:py-20 bg-gray-50/50 rounded-2xl shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-200">
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 leading-tight tracking-wide">
                    {t("contact", "map.title")}
                  </h2>
                  {contactData?.address ? (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {getLocalizedText(contactData.address, language)?.split('\n')[0] || ""}
                    </p>
                  ) : (
                    <p className="text-gray-600 text-sm sm:text-base">
                      {t("contact", "address.street")}, {t("contact", "address.city")}
                    </p>
                  )}
                </div>
                <div className="relative w-full h-[450px] sm:h-[500px] md:h-[600px] p-4">
                  {contactData?.mapEmbedUrl ? (
                    <iframe
                      src={contactData.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.5rem' }}
                      loading="lazy"
                      allowFullScreen
                      className="w-full h-full"
                      title={t("contact", "map.iframeTitle")}
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps?q=Geroldsweg+13a,+8196+Wil-ZH,+Switzerland&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0, borderRadius: '0.5rem' }}
                      loading="lazy"
                      allowFullScreen
                      className="w-full h-full"
                      title={t("contact", "map.iframeTitle")}
                    />
                  )}
                </div>
                <div className="p-6 border-t border-gray-200">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(t("contact", "address.location"))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#3b3dac] hover:text-[#4c4ebd] font-semibold transition-colors duration-200"
                  >
                    {t("contact", "map.getDirections")}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= CONNECT WITH US SECTION ================= */}
        <section className="py-16 sm:py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-7xl mx-auto text-center"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 sm:mb-12 text-[#3b3dac] leading-tight tracking-wide">
                {t("contact", "connect.title")}
              </h2>
              
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative w-full"
              >
                <PremiumImageCard
                  src="/images/contact/cont4.jpg"
                  alt={t("contact", "image.connectAlt")}
                  height="h-[420px] sm:h-[480px] md:h-[550px] lg:h-[600px]"
                  rounded="rounded-3xl"
                >
                  {/* Dark Overlay Gradient from Bottom to Top on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-transparent group-hover:from-black/40 group-hover:via-black/20 group-hover:to-transparent transition-all duration-500 ease-out" />
                </PremiumImageCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= FOLLOW US SECTION ================= */}
        <section className="py-16 sm:py-20 bg-gray-50/50 rounded-2xl shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Follow Us Heading - Premium Style */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-8 tracking-wide leading-tight text-[#3b3dac]"
              >
                {t("contact", "social.title")}
              </motion.h2>
              
              {/* Social Media Icons Row - Circular Buttons */}
              {socialLinks.length > 0 ? (
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <motion.div
                        key={`${social.platform}-${index}`}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ scale: 1.15 }}
                        className="group"
                      >
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full w-16 h-16 sm:w-20 sm:h-20 p-0 bg-[#3b3dac] border-0 shadow-md hover:shadow-xl hover:shadow-[#3b3dac]/50 transition-all duration-300 ease-in-out hover:bg-[#4c4ebd]"
                        >
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center"
                            aria-label={social.label}
                          >
                            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                          </a>
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    {t("contact", "social.noLinks") || "No social media links available"}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
