"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import {
  Trophy,
  Users,
  Heart,
  CalendarDays,
  Target,
  Eye,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, useTranslations } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { PremiumImageCard } from "@/components/premium-image-card"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent, getLocalizedText } from "@/lib/sanity-locale"

/* ---------------- Counter ---------------- */

function Counter({
  end,
  duration = 2,
  suffix = "",
}: {
  end: number
  duration?: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement | null>(null)

  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let start: number | null = null

    const animate = (time: number) => {
      if (!start) start = time

      const progress = Math.min(
        (time - start) / (duration * 1000),
        1
      )

      setCount(Math.floor(progress * end))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ---------------- Stats ---------------- */

// Default fallback stats
const defaultStats = [
  { value: 200, suffix: "+", label: "members", icon: Users },
  { value: 50, suffix: "+", label: "tournaments", icon: Trophy },
  { value: 10, suffix: "+", label: "projects", icon: Heart },
  { value: 1989, suffix: "", label: "founded", icon: CalendarDays },
]

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Users,
  Trophy,
  Heart,
  CalendarDays,
}

/* ---------------- Reusable Glow Card ---------------- */

function GlowCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative group overflow-hidden rounded-3xl">

      <div className="absolute inset-0 bg-[#3b3dac]/35 opacity-0 group-hover:opacity-100 blur-3xl scale-110 transition-all duration-500" />

      <div className="relative z-10 rounded-3xl bg-white/95 p-10 border border-[#3b3dac]/40 group-hover:border-[#3b3dac]/80 transition-all duration-500 shadow-lg group-hover:shadow-[0_0_45px_rgba(59,61,172,0.55)]">
        {children}
      </div>

    </div>
  )
}

/* ---------------- Page ---------------- */

interface AboutPageData {
  title?: { en?: string; de?: string } | string
  subtitle?: { en?: string; de?: string } | string
  description?: { en?: string; de?: string } | string
  heroBadge?: { en?: string; de?: string } | string
  heroButtonText?: { en?: string; de?: string } | string
  heroButtonLink?: string
  heroImage?: any
  sectionImages?: Array<{
    image?: any
    alt?: { en?: string; de?: string } | string
    order?: number
  }>
  sectionVideos?: Array<{
    videoFile?: { asset?: { url?: string } }
    videoUrl?: string
    posterImage?: any
    order?: number
  }>
  missionTitle?: { en?: string; de?: string } | string
  missionContent?: { en?: string; de?: string } | string
  visionTitle?: { en?: string; de?: string } | string
  visionContent?: { en?: string; de?: string } | string
  visionMissionTitle?: { en?: string; de?: string } | string
  ctaTitle?: { en?: string; de?: string } | string
  ctaDescription?: { en?: string; de?: string } | string
  ctaButton1Text?: { en?: string; de?: string } | string
  ctaButton1Link?: string
  ctaButton2Text?: { en?: string; de?: string } | string
  ctaButton2Link?: string
  historySection?: {
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    content?: { en?: string; de?: string } | string
  }
  contentCards?: Array<{
    type?: string
    title?: { en?: string; de?: string } | string
    content?: { en?: string; de?: string } | string
    order?: number
  }>
  stats?: Array<{
    value?: number
    suffix?: string
    label?: { en?: string; de?: string } | string
    iconType?: string
    order?: number
  }>
}

export default function AboutPage() {

  const { getHref, language } = useLanguage()
  const { t } = useTranslations("about")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [aboutData, setAboutData] = useState<AboutPageData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch About page data from Sanity
  useEffect(() => {
    async function fetchAboutData() {
      try {
        setLoading(true)
        
        // GROQ query to fetch About page content
        const aboutQuery = `*[_type == "aboutPage"][0] {
          title,
          subtitle,
          description,
          heroBadge,
          heroButtonText,
          heroButtonLink,
          heroImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          sectionImages[] | order(order asc) {
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            alt,
            order
          },
          sectionVideos[] | order(order asc) {
            videoFile {
              asset-> {
                url,
                _id
              }
            },
            videoUrl,
            posterImage {
              asset-> {
                url,
                _id
              }
            },
            order
          },
          missionTitle,
          missionContent,
          visionTitle,
          visionContent,
          visionMissionTitle,
          ctaTitle,
          ctaDescription,
          ctaButton1Text,
          ctaButton1Link,
          ctaButton2Text,
          ctaButton2Link,
          historySection {
            title,
            description,
            content
          },
          contentCards[] | order(order asc) {
            type,
            title,
            content,
            order
          },
          stats[] | order(order asc) {
            value,
            suffix,
            label,
            iconType,
            order
          }
        }`
        
        const data = await client.fetch(aboutQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        setAboutData(data || null)
        
      } catch (error) {
        console.error("Error fetching About page data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAboutData()
  }, [language])

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">

      <Navigation />

      <main className="flex-1">

        {/* ================= HERO ================= */}
        <section className="relative bg-gradient-to-br from-white via-white to-blue-50/10 overflow-hidden">

          <div className="container mx-auto px-6 pt-36 md:pt-40 lg:pt-44 pb-32 grid lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* LEFT */}

            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >

              <span className="text-[#3b3dac] font-bold uppercase tracking-widest">
                {aboutData?.heroBadge ? getLocalizedContent(aboutData.heroBadge, language) : t("hero.badge")}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                {aboutData?.title ? getLocalizedContent(aboutData.title, language) : t("title")}
              </h1>

              <p className="text-gray-700 max-w-xl text-lg leading-relaxed">
                {aboutData?.description ? getLocalizedText(aboutData.description, language) : t("description")}
              </p>

              <Link href={aboutData?.heroButtonLink ? getHref(aboutData.heroButtonLink) : getHref("/contact")}>
                <Button className="bg-[#3b3dac] px-10 py-6 text-lg font-bold">
                  {aboutData?.heroButtonText ? getLocalizedContent(aboutData.heroButtonText, language) : t("hero.joinNow")}
                </Button>
              </Link>

            </motion.div>

            {/* IMAGE */}

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="relative h-[420px] md:h-[480px] lg:h-[520px] cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              {/* FIXED DIAGONAL TRIANGLE */}
              <div
                className="absolute top-0 right-0 z-50 w-0 h-0
                border-r-[160px] md:border-r-[200px] lg:border-r-[240px]
                border-b-[140px] md:border-b-[170px] lg:border-b-[200px]
                border-r-[#3b3dac] border-b-transparent
                opacity-90"
              />

              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-52 h-52 bg-[#3b3dac]/30 blur-3xl rounded-full z-40" />

              {/* Premium Image Card - No Zoom on Hover */}
              <PremiumImageCard
                src={aboutData?.heroImage?.asset ? urlFor(aboutData.heroImage).url() : "/images/about/ab2.jpg"}
                alt={aboutData?.heroImage?.asset?.url ? "FC City Boys Zurich football team squad photo" : "FC City Boys Zurich football team squad photo showing players in team uniforms"}
                height="h-full"
                rounded="rounded-3xl"
                className="border-[#3b3dac]/40 group-hover:border-[#3b3dac]/70 shadow-xl shadow-gray-900/20"
                disableHoverZoom={true}
                unoptimized={aboutData?.heroImage?.asset ? true : false}
              >
                {/* Existing overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-transparent to-[#3b3dac]/40 mix-blend-screen z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,61,172,0.6),transparent_55%),radial-gradient(circle_at_75%_70%,rgba(37,99,235,0.5),transparent_60%)] opacity-80 z-10" />
              </PremiumImageCard>
            </motion.div>

          </div>
        </section>


        {/* ================= STATS ================= */}

        {/* ================= STATS ================= */}

<section className="py-24 relative bg-white">

<div className="max-w-7xl mx-auto px-6 relative">

  {/* OUTER NEON FRAME - KEEP BLUE UNCHANGED */}
  <div className="relative rounded-[32px] p-[2px]">

    {/* Glow Border - KEEP BLUE UNCHANGED */}
    <div className="
      absolute inset-0
      rounded-[32px]
      bg-gradient-to-r 
      from-[#3b3dac]
      via-[#6b6dff]
      to-[#3b3dac]
      blur-xl
      opacity-70
    " />

    {/* Main Frame - LIGHT BACKGROUND */}
    <div className="
      relative
      rounded-[30px]
      bg-white
      border border-[#3b3dac]/40
      backdrop-blur-xl
      p-10
      shadow-lg
    ">

      {/* Inner Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

        {(aboutData?.stats && aboutData.stats.length > 0 
          ? aboutData.stats.map((stat, i) => {
              const Icon = iconMap[stat.iconType || "Users"] || Users
              const label = stat.label 
                ? (typeof stat.label === "string" 
                    ? stat.label 
                    : getLocalizedContent(stat.label, language))
                : defaultStats[i]?.label || ""

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -6 }}
                  className="
                    group
                    rounded-2xl
                    bg-gray-50
                    border border-[#3b3dac]/20
                    p-6
                    text-center
                    transition
                    hover:border-[#3b3dac]/60
                    hover:shadow-[0_0_30px_rgba(59,61,172,0.6)]
                  "
                >

                  <Icon className="mx-auto h-8 w-8 text-[#3b3dac] mb-3" />

                  <h3 className="text-4xl font-black text-[#3b3dac]">
                    <Counter end={stat.value || defaultStats[i]?.value || 0} suffix={stat.suffix || defaultStats[i]?.suffix || ""} />
                  </h3>

                  <p className="uppercase text-xs tracking-widest text-gray-600 mt-2">
                    {label || t(`stats.${defaultStats[i]?.label || ""}`)}
                  </p>

                </motion.div>
              )
            })
          : defaultStats.map((stat, i) => {
              const Icon = stat.icon

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.08, y: -6 }}
                  className="
                    group
                    rounded-2xl
                    bg-gray-50
                    border border-[#3b3dac]/20
                    p-6
                    text-center
                    transition
                    hover:border-[#3b3dac]/60
                    hover:shadow-[0_0_30px_rgba(59,61,172,0.6)]
                  "
                >

                  <Icon className="mx-auto h-8 w-8 text-[#3b3dac] mb-3" />

                  <h3 className="text-4xl font-black text-[#3b3dac]">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </h3>

                  <p className="uppercase text-xs tracking-widest text-gray-600 mt-2">
                    {t(`stats.${stat.label}`)}
                  </p>

                </motion.div>
              )
            })
        )}

      </div>

    </div>

  </div>

</div>

</section>



        {/* ================= ABOUT - PREMIUM CARDS ================= */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="rounded-3xl bg-gray-100 p-8 sm:p-10 lg:p-12 shadow-inner">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-12">
                {/* IMAGE WITH BLUE OVERLAY */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7 }}
                  className="relative h-[340px] sm:h-[380px] md:h-[420px] cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                >
                  <PremiumImageCard
                    src={aboutData?.sectionImages && aboutData.sectionImages[0]?.image?.asset 
                      ? urlFor(aboutData.sectionImages[0].image).url() 
                      : "/images/home2.jpg"}
                    unoptimized={aboutData?.sectionImages && aboutData.sectionImages[0]?.image?.asset ? true : false}
                    alt={aboutData?.sectionImages && aboutData.sectionImages[0]?.alt
                      ? getLocalizedContent(aboutData.sectionImages[0].alt, language)
                      : "FC City Boys Zurich players in action during a football match or training session"}
                    height="h-full"
                    rounded="rounded-3xl"
                    className="shadow-xl"
                  >
                    <div className="absolute inset-0 bg-[#3b3dac]/40 mix-blend-multiply z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 z-10" />
                  </PremiumImageCard>
                </motion.div>

                {/* TEXT CARD: CLUB HISTORY */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <GlowCard>
                    <h2 className="text-3xl sm:text-4xl font-black mb-4 text-gray-900">
                      {aboutData?.historySection?.title ? getLocalizedContent(aboutData.historySection.title, language) : t("history.title")}
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4">
                      {aboutData?.historySection?.description ? getLocalizedText(aboutData.historySection.description, language) : t("description")}
                    </p>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                      {aboutData?.historySection?.content ? getLocalizedText(aboutData.historySection.content, language) : t("history.content")}
                    </p>
                    <div className="h-0.5 w-20 bg-gradient-to-r from-[#3b3dac] to-transparent" />
                  </GlowCard>
                </motion.div>
              </div>

              {/* SECOND ROW: RICH CONTENT CARDS */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {(aboutData?.contentCards && aboutData.contentCards.length > 0
                  ? aboutData.contentCards.map((card, index) => {
                      const title = card.title 
                        ? getLocalizedContent(card.title, language)
                        : (card.type ? t(`about.${card.type}.title`) : "")
                      const content = card.content
                        ? getLocalizedText(card.content, language)
                        : (card.type ? t(`about.${card.type}.content`) : "")
                      
                      return (
                        <motion.div
                          key={card.type || index}
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                        >
                          <GlowCard>
                            <h3 className="text-2xl font-bold mb-3 text-gray-900">
                              {title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-4">
                              {content}
                            </p>
                            <div className="h-0.5 w-16 bg-gradient-to-r from-[#3b3dac] to-transparent" />
                          </GlowCard>
                        </motion.div>
                      )
                    })
                  : [
                      { type: "whyJoin", delay: 0 },
                      { type: "trainingPhilosophy", delay: 0.1 },
                      { type: "communityImpact", delay: 0.2 },
                    ].map((card, index) => (
                      <motion.div
                        key={card.type}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6, delay: card.delay }}
                        whileHover={{ y: -8, scale: 1.02 }}
                      >
                        <GlowCard>
                          <h3 className="text-2xl font-bold mb-3 text-gray-900">
                            {t(`${card.type}.title`)}
                          </h3>
                          <p className="text-gray-600 leading-relaxed mb-4">
                            {t(`${card.type}.content`)}
                          </p>
                          <div className="h-0.5 w-16 bg-gradient-to-r from-[#3b3dac] to-transparent" />
                        </GlowCard>
                      </motion.div>
                    ))
                )}
              </div>
            </div>
          </div>
        </section>


        {/* ================= OUR VISION & MISSION ================= */}
        <section className="py-28 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 text-gray-900">
              {aboutData?.visionMissionTitle ? getLocalizedContent(aboutData.visionMissionTitle, language) : t("visionMission.title")}
            </h2>

            {/* OUTER GLOW FRAME */}
            <div className="relative max-w-6xl mx-auto rounded-[32px] p-[2px]">
              <div
                className="absolute inset-0 rounded-[32px] bg-gradient-to-r from-[#3b3dac] via-[#6b6dff] to-[#3b3dac] blur-xl opacity-70"
              />

              {/* Main Container */}
              <div className="relative rounded-[30px] bg-white border border-[#3b3dac]/40 backdrop-blur-xl p-8 sm:p-10 shadow-lg">
                <div className="grid md:grid-cols-2 gap-10">
                  {/* MISSION */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <GlowCard>
                      <Target className="h-10 w-10 text-[#3b3dac] mb-6" />
                      <h3 className="text-3xl font-black mb-4 text-gray-900">
                        {aboutData?.missionTitle ? getLocalizedContent(aboutData.missionTitle, language) : t("mission.title")}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {aboutData?.missionContent ? getLocalizedText(aboutData.missionContent, language) : t("mission.content")}
                      </p>
                      <div className="h-0.5 w-16 bg-gradient-to-r from-[#3b3dac] to-transparent" />
                    </GlowCard>
                  </motion.div>

                  {/* VISION */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <GlowCard>
                      <Eye className="h-10 w-10 text-[#3b3dac] mb-6" />
                      <h3 className="text-3xl font-black mb-4 text-gray-900">
                        {aboutData?.visionTitle ? getLocalizedContent(aboutData.visionTitle, language) : t("vision.title")}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {aboutData?.visionContent ? getLocalizedText(aboutData.visionContent, language) : t("vision.content")}
                      </p>
                      <div className="h-0.5 w-16 bg-gradient-to-r from-[#3b3dac] to-transparent" />
                    </GlowCard>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA - BECOME PART OF THE JOURNEY ================= */}
        <section className="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] overflow-hidden">
          {/* Blue Gradient Background - Matching Contact Page */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700" />
          
          {/* Diagonal Layered Shapes - Exact Contact Page Style */}
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

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px] py-12 sm:py-16 md:py-20">

            {/* CENTER HERO */}
            <div className="flex justify-center items-center w-full">

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-2"
                  >
                    {aboutData?.ctaTitle ? getLocalizedContent(aboutData.ctaTitle, language) : t("cta.title")}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl text-center mx-auto mb-10"
                  >
                    {aboutData?.ctaDescription ? getLocalizedText(aboutData.ctaDescription, language) : t("cta.description")}
                  </motion.p>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-col sm:flex-row justify-center gap-4"
                  >
                    <Link href={aboutData?.ctaButton1Link ? getHref(aboutData.ctaButton1Link) : getHref("/contact")}>
                      <Button className="bg-gray-900 hover:bg-gray-800 text-white px-10 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                        {aboutData?.ctaButton1Text ? getLocalizedContent(aboutData.ctaButton1Text, language) : t("cta.contactUs")}
                      </Button>
                    </Link>
                    <Link href={aboutData?.ctaButton2Link ? getHref(aboutData.ctaButton2Link) : getHref("/training")}>
                      <Button className="bg-white hover:bg-gray-100 text-[#3b3dac] border-2 border-[#3b3dac] px-10 py-6 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                        {aboutData?.ctaButton2Text ? getLocalizedContent(aboutData.ctaButton2Text, language) : t("cta.exploreTraining")}
                      </Button>
                    </Link>
                  </motion.div>

                </motion.div>

              </motion.div>

            </div>

          </div>
        </section>

      </main>


      {/* IMAGE MODAL */}

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>

        <DialogContent className="max-w-7xl bg-transparent border-none">
          <DialogTitle className="sr-only">Team Image</DialogTitle>

          <Button
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-4 right-4 bg-black/70 rounded-full"
          >
            <X />
          </Button>

          <div className="relative w-full h-[80vh] rounded-xl overflow-hidden border border-[#3b3dac]/40">

            <Image
              src={aboutData?.sectionImages && aboutData.sectionImages[0]?.image?.asset 
                ? urlFor(aboutData.sectionImages[0].image).url() 
                : "/images/home2.jpg"}
              unoptimized={aboutData?.sectionImages && aboutData.sectionImages[0]?.image?.asset ? true : false}
              alt={aboutData?.sectionImages && aboutData.sectionImages[0]?.alt
                ? getLocalizedContent(aboutData.sectionImages[0].alt, language)
                : "FC City Boys Zurich team members posing for a group photo"}
              fill
              className="object-contain"
            />

          </div>

        </DialogContent>

      </Dialog>


      <Footer />

    </div>
  )
}
