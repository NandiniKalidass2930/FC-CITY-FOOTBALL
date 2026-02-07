"use client"

import { motion } from "framer-motion"
import { ArrowRight, Users, Target, Sparkles, GraduationCap, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { SpotlightCard } from "@/components/spotlight-card"
import { useState, useEffect } from "react"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent, getLocalizedText } from "@/lib/sanity-locale"

// Default fallback features
const defaultFeatures = [
  { key: "trainingExcellence", icon: Target },
  { key: "teamSpirit", icon: Users },
  { key: "youthDevelopment", icon: GraduationCap },
  { key: "professionalCoaching", icon: Sparkles },
]

// Icon mapping for features
const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Target,
  Users,
  GraduationCap,
  Sparkles,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8 },
  },
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7 },
  },
}

interface HeroData {
  heroMediaType?: "image" | "video"
  heroImage?: any
  heroVideo?: {
    videoFile?: { asset?: { url?: string; _id?: string } }
    videoUrl?: string
    posterImage?: any
  }
  preClubMediaType?: "image" | "video"
  preClubImage?: any
  preClubVideo?: {
    videoFile?: { asset?: { url?: string; _id?: string } }
    videoUrl?: string
    posterImage?: any
  }
  heroTitle?: { en?: string; de?: string } | string
  heroTitleZurich?: { en?: string; de?: string } | string
  heroSubtitle?: { en?: string; de?: string } | string
  heroDescription?: { en?: string; de?: string } | string
  heroButtons?: {
    primary?: {
      text?: { en?: string; de?: string } | string
      link?: string
    }
    secondary?: {
      text?: { en?: string; de?: string } | string
      link?: string
    }
  }
  aboutSection?: {
    image?: any
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    buttonText?: { en?: string; de?: string } | string
    buttonLink?: string
  }
  whyChooseUsSection?: {
    image?: any
    title?: { en?: string; de?: string } | string
    intro?: { en?: string; de?: string } | string
    paragraph1?: { en?: string; de?: string } | string
    paragraph2?: { en?: string; de?: string } | string
  }
  features?: Array<{
    iconType?: string
    key?: string
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    order?: number
  }>
  ctaSection?: {
    backgroundImage?: any
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    button1Text?: { en?: string; de?: string } | string
    button1Link?: string
    button2Text?: { en?: string; de?: string } | string
    button2Link?: string
  }
  goalsValues?: {
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    cards?: Array<{
      number?: string
      title?: { en?: string; de?: string } | string
      description?: { en?: string; de?: string } | string
      image?: any
      order?: number
    }>
  }
}

interface Sponsor {
  _id: string
  name?: { en?: string; de?: string } | string
  logo?: any
  websiteUrl?: string
  order?: number
}

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { t, language } = useLanguage()
  
  // Sanity data state
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)
  const [heroVideoFailed, setHeroVideoFailed] = useState(false)
  const [preClubVideoFailed, setPreClubVideoFailed] = useState(false)

  // Fetch data from Sanity
  useEffect(() => {
    async function fetchSanityData() {
      try {
        setLoading(true)
        
        // Fetch hero section (single document) with video asset URL
        // Fetch with no cache for instant updates
        const heroQuery = `*[_type == "hero"][0] {
          heroMediaType,
          heroImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          heroVideo {
            videoFile {
              asset-> {
                _id,
                _type,
                url
              }
            },
            videoUrl,
            posterImage {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            }
          },
          preClubMediaType,
          preClubImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          preClubVideo {
            videoFile {
              asset-> {
                _id,
                _type,
                url
              }
            },
            videoUrl,
            posterImage {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            }
          },
          "heroTitle": title,
          "heroTitleZurich": titleZurich,
          "heroSubtitle": subtitle,
          "heroDescription": description,
          "heroButtons": {
            "primary": {
              "text": primaryButtonText,
              "link": primaryButtonLink
            },
            "secondary": {
              "text": secondaryButtonText,
              "link": secondaryButtonLink
            }
          },
          aboutSection {
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            title,
            description,
            buttonText,
            buttonLink
          },
          whyChooseUsSection {
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            title,
            intro,
            paragraph1,
            paragraph2
          },
          features[] | order(order asc) {
            iconType,
            key,
            title,
            description,
            order
          },
          ctaSection {
            backgroundImage {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            title,
            description,
            button1Text,
            button1Link,
            button2Text,
            button2Link
          },
          goalsValues {
            title,
            description,
            cards[] | order(order asc) {
              number,
              title,
              description,
              image {
                asset-> {
                  _id,
                  _type,
                  url
                },
                hotspot,
                crop
              },
              order
            }
          }
        }`
        // Fetch with no cache - useCdn: false ensures fresh data
        const hero = await client.fetch(heroQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        setHeroData(hero || null)
        
        // Fetch sponsors (ordered by order field)
        const sponsorsQuery = `*[_type == "sponsor"] | order(order asc) {
          _id,
          name,
          logo {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          websiteUrl,
          order
        }`
        const sponsorsData = await client.fetch(sponsorsQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        setSponsors(sponsorsData || [])
        
      } catch (error) {
        console.error("Error fetching Sanity data:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchSanityData()
    
    // Refresh data when tab regains focus
    const handleFocus = () => {
      fetchSanityData()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [language])

  // Helper to get localized href
  const getHref = (path: string) => `/${language}${path}`

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0f172a]">
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[95svh] md:min-h-[95vh] flex items-center justify-center overflow-hidden opacity-100">
        {/* Background Media (Sanity-controlled) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {(() => {
            const mediaType = heroData?.heroMediaType
            const videoSrc = heroData?.heroVideo?.videoFile?.asset?.url || heroData?.heroVideo?.videoUrl
            const posterSrc = heroData?.heroVideo?.posterImage?.asset
              ? urlFor(heroData.heroVideo.posterImage).width(1920).height(1080).quality(80).format("webp").url()
              : undefined
            const heroImageSrc = heroData?.heroImage?.asset
              ? urlFor(heroData.heroImage).width(1920).height(1080).quality(80).format("webp").url()
              : undefined
            const fallbackImageForVideo = posterSrc || heroImageSrc

            if (mediaType === "video" && videoSrc && !heroVideoFailed) {
              return (
                <video
                  key={videoSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster={fallbackImageForVideo}
                  className="absolute inset-0 w-full h-full object-cover object-[50%_15%] md:object-[50%_12%] lg:object-[50%_10%] [filter:contrast(1.06)_saturate(1.06)_brightness(1.04)]"
                  onError={() => setHeroVideoFailed(true)}
                  aria-hidden="true"
                >
                  <source src={videoSrc} />
                </video>
              )
            }

            // If media is "image", or video failed, show a poster/fallback image when available
            const fallbackImageSrc = mediaType === "video" ? fallbackImageForVideo : heroImageSrc
            if (!fallbackImageSrc) return null

            return (
              <Image
                src={fallbackImageSrc}
                alt="Hero background"
                fill
                sizes="100vw"
                className="object-cover object-[50%_15%] md:object-[50%_12%] lg:object-[50%_10%]"
                loading="lazy"
                priority={false}
              />
            )
          })()}
        </div>

        {/* Soft blue overlay for consistent readability (keeps faces visible) */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-[#0b1e6b]/25" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#0b1e6b]/15 via-[#0b1e6b]/20 to-[#0b1e6b]/30" />

        {/* Centered Content (above media) */}
        <div className="relative z-20 w-full flex items-center justify-center min-h-[95svh] md:min-h-[95vh] text-center text-white">
          <div className="flex flex-col items-center justify-center max-w-4xl w-full">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="translate-y-6 sm:translate-y-8 md:translate-y-10 space-y-6 sm:space-y-8 w-full px-6 sm:px-8"
            >
              {(() => {
                const heroTitle = heroData?.heroTitle ? getLocalizedContent(heroData.heroTitle, language) : ""
                const heroTitleZurich = heroData?.heroTitleZurich ? getLocalizedContent(heroData.heroTitleZurich, language) : ""
                const heroSubtitle = heroData?.heroSubtitle ? getLocalizedContent(heroData.heroSubtitle, language) : ""
                const heroDescription = heroData?.heroDescription ? getLocalizedText(heroData.heroDescription, language) : ""
                const primaryText = heroData?.heroButtons?.primary?.text
                  ? getLocalizedContent(heroData.heroButtons.primary.text, language)
                  : ""
                const primaryLink = heroData?.heroButtons?.primary?.link || ""
                const secondaryText = heroData?.heroButtons?.secondary?.text
                  ? getLocalizedContent(heroData.heroButtons.secondary.text, language)
                  : ""
                const secondaryLink = heroData?.heroButtons?.secondary?.link || ""

                const hasAnyHeroContent = Boolean(
                  heroTitle ||
                    heroTitleZurich ||
                    heroSubtitle ||
                    heroDescription ||
                    (primaryText && primaryLink) ||
                    (secondaryText && secondaryLink)
                )

                // Never show the "missing hero content" notice while data is still loading.
                // This prevents a 1s flash on refresh in production.
                if (loading || hasAnyHeroContent) return null

                // Keep the notice available in dev for authors, but never show it in production.
                if (process.env.NODE_ENV === "production") return null

                return (
                  <div className="mx-auto max-w-2xl rounded-2xl border border-white/20 bg-black/35 px-6 py-5 text-white">
                    <p className="text-lg font-bold">Hero content isn’t published in Sanity yet.</p>
                    <p className="mt-2 text-sm text-white/90">
                      Open Sanity Studio → <span className="font-semibold">Hero Section</span> and publish:
                      Title / Subtitle / Description and button text + links.
                    </p>
                  </div>
                )
              })()}
              {(() => {
                const heroTitle = heroData?.heroTitle ? getLocalizedContent(heroData.heroTitle, language) : ""
                const heroTitleZurich = heroData?.heroTitleZurich ? getLocalizedContent(heroData.heroTitleZurich, language) : ""
                const hasTitle = Boolean(heroTitle || heroTitleZurich)

                if (!hasTitle) return null

                return (
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tight tracking-tight text-center"
                  >
                    {heroTitle ? <span className="block text-white drop-shadow-2xl">{heroTitle}</span> : null}
                    {heroTitleZurich ? (
                      <span className="block text-white drop-shadow-2xl mt-2">{heroTitleZurich}</span>
                    ) : null}
                  </motion.h1>
                )
              })()}

              {(() => {
                const heroSubtitle = heroData?.heroSubtitle ? getLocalizedContent(heroData.heroSubtitle, language) : ""
                if (!heroSubtitle) return null

                return (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center"
                  >
                    {heroSubtitle}
                  </motion.h2>
                )
              })()}

              {(() => {
                const heroDescription = heroData?.heroDescription ? getLocalizedText(heroData.heroDescription, language) : ""
                if (!heroDescription) return null

                return (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="text-white max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed drop-shadow-md text-center"
                  >
                    {heroDescription}
                  </motion.p>
                )
              })()}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="flex flex-col sm:flex-row gap-4 pt-6 justify-center"
              >
                {(() => {
                  const primary = heroData?.heroButtons?.primary
                  const primaryText = primary?.text ? getLocalizedContent(primary.text, language) : ""
                  const primaryHref = primary?.link ? getHref(primary.link) : ""
                  if (!primaryText || !primaryHref) return null

                  return (
                    <Link href={primaryHref}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full sm:w-auto px-12 py-5 sm:px-16 sm:py-6 text-lg sm:text-xl bg-[#3b3dac] text-white hover:bg-[#4c4ebd] font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                          {primaryText}{" "}
                          <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    </Link>
                  )
                })()}

                {(() => {
                  const secondary = heroData?.heroButtons?.secondary
                  const secondaryText = secondary?.text ? getLocalizedContent(secondary.text, language) : ""
                  const secondaryHref = secondary?.link ? getHref(secondary.link) : ""
                  if (!secondaryText || !secondaryHref) return null

                  return (
                    <Link href={secondaryHref}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button className="w-full sm:w-auto px-12 py-5 sm:px-16 sm:py-6 text-lg sm:text-xl bg-[#3b3dac] text-white hover:bg-[#4c4ebd] font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                          {secondaryText}{" "}
                          <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </motion.div>
                    </Link>
                  )
                })()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <motion.div variants={slideInLeft} className="relative h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-[#3b3dac]/20 group">
              <SpotlightCard
                className="h-full w-full"
                spotlightColor="rgba(59, 61, 172, 0.5)"
                spotlightSize={400}
                spotlightIntensity={0.7}
              >
                <Image 
                  src={heroData?.aboutSection?.image?.asset 
                    ? urlFor(heroData.aboutSection.image).url() 
                    : "/images/ball.jpg"} 
                  alt={heroData?.aboutSection?.title 
                    ? getLocalizedContent(heroData.aboutSection.title, language) 
                    : "FC City Boys Zurich football team players with football on the field"} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={heroData?.aboutSection?.image?.asset ? true : false} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b3dac]/0 via-transparent to-transparent opacity-0 group-hover:opacity-30 dark:group-hover:opacity-50 transition-opacity duration-700" />
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl" style={{ boxShadow: '0 0 60px rgba(59, 61, 172, 0.6)' }} />
              </SpotlightCard>
            </motion.div>
            <motion.div variants={slideInRight} className="space-y-5">
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#3b3dac] dark:text-white">
                {heroData?.aboutSection?.title ? getLocalizedContent(heroData.aboutSection.title, language) : t("about", "landingTitle")}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-700 dark:text-[#cbd5e1] leading-relaxed">
                {heroData?.aboutSection?.description ? getLocalizedContent(heroData.aboutSection.description, language) : t("about", "landingDescription")}
              </motion.p>
              <motion.div variants={itemVariants} className="pt-2">
                <Link href={heroData?.aboutSection?.buttonLink ? getHref(heroData.aboutSection.buttonLink) : getHref("/about")}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Button className="px-8 py-6 text-lg bg-[#3b3dac] dark:bg-[#3b3dac] hover:bg-[#4c4ebd] dark:hover:bg-[#4c4ebd] text-white font-semibold shadow-lg dark:shadow-[#3b3dac]/50 dark:shadow-xl hover:shadow-xl dark:hover:shadow-[#3b3dac]/70 hover:shadow-[#3b3dac]/50 transition-all duration-300 rounded-xl group">
                      {heroData?.aboutSection?.buttonText ? getLocalizedContent(heroData.aboutSection.buttonText, language) : t("about", "learnMore")} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= PRE-CLUB MEDIA (FULL BLEED) ================= */}
      <section
        className="relative overflow-hidden opacity-100 bg-black"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
        }}
      >
        <div className="relative w-full overflow-hidden flex items-center justify-center text-center min-h-[55vh] sm:min-h-[65vh] md:min-h-[75vh] lg:min-h-[85vh] xl:min-h-[90vh]">
          {/* Media */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {(() => {
              const mediaType = heroData?.preClubMediaType
              const videoSrc = heroData?.preClubVideo?.videoFile?.asset?.url || heroData?.preClubVideo?.videoUrl
              const posterSrc = heroData?.preClubVideo?.posterImage?.asset
                ? urlFor(heroData.preClubVideo.posterImage).width(1920).height(1080).quality(80).format("webp").url()
                : undefined
              const imageSrc = heroData?.preClubImage?.asset
                ? urlFor(heroData.preClubImage).width(1920).height(1080).quality(80).format("webp").url()
                : undefined
              const fallbackImage = posterSrc || imageSrc

              if (mediaType === "video" && videoSrc && !preClubVideoFailed) {
                return (
                  <video
                    key={videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster={fallbackImage}
                    className="absolute inset-0 w-full h-full object-cover [filter:contrast(1.06)_saturate(1.06)_brightness(1.06)]"
                    onError={() => setPreClubVideoFailed(true)}
                    aria-hidden="true"
                  >
                    <source src={videoSrc} />
                  </video>
                )
              }

              if (mediaType === "image" && imageSrc) {
                return (
                  <Image
                    src={imageSrc}
                    alt="Pre-club background"
                    fill
                    sizes="100vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                    priority={false}
                  />
                )
              }

              // Video fallback (poster or image) if video fails or no video is set
              if (mediaType === "video" && fallbackImage) {
                return (
                  <Image
                    src={fallbackImage}
                    alt="Pre-club background"
                    fill
                    sizes="100vw"
                    className="object-cover w-full h-full"
                    loading="lazy"
                    priority={false}
                  />
                )
              }

              return null
            })()}
          </div>
        </div>
      </section>
                  
      {/* ================= WHY CHOOSE US SECTION ================= */}
      <section className="py-16 sm:py-20 md:py-24 bg-gray-200 dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center"
          >
            <motion.div variants={slideInLeft} className="space-y-5 order-2 lg:order-1">
              <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#3b3dac] dark:text-white">
                {heroData?.whyChooseUsSection?.title ? getLocalizedContent(heroData.whyChooseUsSection.title, language) : t("home", "moreThanClub.title")}
              </motion.h2>
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-700 dark:text-[#cbd5e1] leading-relaxed">
                {heroData?.whyChooseUsSection?.intro ? getLocalizedContent(heroData.whyChooseUsSection.intro, language) : t("home", "moreThanClub.intro")}
              </motion.p>
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-700 dark:text-[#cbd5e1] leading-relaxed">
                {heroData?.whyChooseUsSection?.paragraph1 ? getLocalizedContent(heroData.whyChooseUsSection.paragraph1, language) : t("home", "moreThanClub.paragraph1")}
              </motion.p>
              <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-700 dark:text-[#cbd5e1] leading-relaxed">
                {heroData?.whyChooseUsSection?.paragraph2 ? getLocalizedContent(heroData.whyChooseUsSection.paragraph2, language) : t("home", "moreThanClub.paragraph2")}
              </motion.p>
            </motion.div>
            <motion.div variants={slideInRight} className="relative h-[350px] sm:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-[#3b3dac]/20 group order-1 lg:order-2">
              <SpotlightCard
                className="h-full w-full"
                spotlightColor="rgba(59, 61, 172, 0.5)"
                spotlightSize={400}
                spotlightIntensity={0.7}
              >
                <Image 
                  src={heroData?.whyChooseUsSection?.image?.asset 
                    ? urlFor(heroData.whyChooseUsSection.image).url() 
                    : "/images/home1.jpg"} 
                  alt={heroData?.whyChooseUsSection?.title 
                    ? getLocalizedContent(heroData.whyChooseUsSection.title, language) 
                    : "FC City Boys Zurich community and supporters celebrating together at a football event"} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={heroData?.whyChooseUsSection?.image?.asset ? true : false} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3b3dac]/0 via-transparent to-transparent opacity-0 group-hover:opacity-30 dark:group-hover:opacity-50 transition-opacity duration-700" />
                <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl blur-xl" style={{ boxShadow: '0 0 60px rgba(59, 61, 172, 0.6)' }} />
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 sm:py-24 md:py-32 bg-white dark:bg-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
            <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-bold text-center mb-12 sm:mb-16 text-[#3b3dac] dark:text-white">
              {t("home", "features.title")}
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(heroData?.features && heroData.features.length > 0
                ? heroData.features.map((feature, index) => {
                    const Icon = feature.iconType ? featureIconMap[feature.iconType] : (feature.key ? defaultFeatures.find(f => f.key === feature.key)?.icon : Target)
                    const title = feature.title 
                      ? getLocalizedContent(feature.title, language)
                      : (feature.key ? t("home", `features.${feature.key}.title`) : "")
                    const description = feature.description
                      ? getLocalizedContent(feature.description, language)
                      : (feature.key ? t("home", `features.${feature.key}.description`) : "")
                    
                    return (
                      <motion.div key={feature.key || index} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ delay: index * 0.1 }}>
                        <Card className="h-full text-center hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 dark:bg-gray-900/50 hover:border-[#3b3dac] dark:hover:border-[#3b3dac] rounded-2xl group relative overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ boxShadow: 'inset 0 0 40px rgba(59, 61, 172, 0.2)' }} />
                          <CardHeader className="pb-4 relative z-10">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 group-hover:bg-[#3b3dac]/20 dark:group-hover:bg-[#3b3dac]/30 flex items-center justify-center shadow-md dark:shadow-[#3b3dac]/20 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-[#3b3dac]/30">
                              {Icon && <Icon className="h-8 w-8 text-[#3b3dac] dark:text-[#6fdcff] group-hover:scale-110 transition-transform duration-300" />}
                            </div>
                            <CardTitle className="text-xl font-bold text-[#3b3dac] dark:text-white">
                              {title}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-[#cbd5e1]">
                              {description}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    )
                  })
                : defaultFeatures.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <motion.div key={feature.key} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }} transition={{ delay: index * 0.1 }}>
                        <Card className="h-full text-center hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 transition-all duration-300 border-2 border-gray-200 dark:border-gray-800 dark:bg-gray-900/50 hover:border-[#3b3dac] dark:hover:border-[#3b3dac] rounded-2xl group relative overflow-hidden">
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ boxShadow: 'inset 0 0 40px rgba(59, 61, 172, 0.2)' }} />
                          <CardHeader className="pb-4 relative z-10">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 group-hover:bg-[#3b3dac]/20 dark:group-hover:bg-[#3b3dac]/30 flex items-center justify-center shadow-md dark:shadow-[#3b3dac]/20 transition-colors duration-300 group-hover:shadow-lg group-hover:shadow-[#3b3dac]/30">
                              <Icon className="h-8 w-8 text-[#3b3dac] dark:text-[#6fdcff] group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <CardTitle className="text-xl font-bold text-[#3b3dac] dark:text-white">
                              {t("home", `features.${feature.key}.title`)}
                            </CardTitle>
                            <CardDescription className="text-gray-600 dark:text-[#cbd5e1]">
                              {t("home", `features.${feature.key}.description`)}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </motion.div>
                    )
                  })
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= CTA - Join the City Boys Family ================= */}
      <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat bg-center bg-scroll md:bg-fixed" 
          style={{ 
            backgroundImage: heroData?.ctaSection?.backgroundImage?.asset 
              ? `url('${urlFor(heroData.ctaSection.backgroundImage).url()}')`
              : "url('/images/g1.jpg')" 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px] py-16 sm:py-20 md:py-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-20 w-full max-w-3xl mx-auto text-center flex flex-col items-center gap-6 sm:gap-8">
            <motion.h2 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl w-full">
              {heroData?.ctaSection?.title ? getLocalizedContent(heroData.ctaSection.title, language) : t("home", "cta.title")}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
              {heroData?.ctaSection?.description ? getLocalizedContent(heroData.ctaSection.description, language) : t("home", "cta.description")}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full mt-2">
              <Link href={heroData?.ctaSection?.button1Link ? getHref(heroData.ctaSection.button1Link) : getHref("/contact")} className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto px-10 py-6 text-lg bg-white text-[#3b3dac] hover:bg-gray-100 font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl group">
                    {heroData?.ctaSection?.button1Text ? getLocalizedContent(heroData.ctaSection.button1Text, language) : t("home", "cta.joinClub")} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href={heroData?.ctaSection?.button2Link ? getHref(heroData.ctaSection.button2Link) : getHref("/contact")} className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto px-10 py-6 text-lg border-2 border-white bg-transparent hover:bg-white/10 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group">
                    <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" /> {heroData?.ctaSection?.button2Text ? getLocalizedContent(heroData.ctaSection.button2Text, language) : t("home", "cta.contactUs")}
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Rest of the sections would continue here with similar pattern... */}
      {/* For brevity, I'm showing the pattern. The full page would include all sections. */}
       {/* ================= SPONSORS SECTION ================= */}
       <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#f2f4f7] via-[#eef1f5] to-[#f2f4f7] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#020617] relative">
        {/* Subtle Divider Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b3dac]/30 dark:via-[#3b3dac]/50 to-transparent" />
        
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
            >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase mb-4 text-[#3b3dac] dark:text-white">
              {t("home", "sponsors.title")}
            </h2>
            <p className="text-gray-600 dark:text-[#cbd5e1] text-lg sm:text-xl max-w-2xl mx-auto">
              {t("home", "sponsors.description")}
            </p>
          </motion.div>

          {/* Sponsors Marquee Container */}
          {sponsors.length > 0 ? (
            <div className="relative overflow-hidden">
              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f2f4f7] dark:from-[#020617] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f2f4f7] dark:from-[#020617] to-transparent z-10 pointer-events-none" />
              
              {/* Marquee Track */}
              <div className="flex gap-8 sm:gap-12 md:gap-16 marquee-track group">
                {/* First Set of Sponsors */}
                {sponsors.map((sponsor, index) => {
                  const sponsorCardContent = (
                    <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg dark:shadow-[#3b3dac]/20 hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#3b3dac]/50 dark:hover:border-[#3b3dac]/50 transition-all duration-300 flex items-center justify-center p-6 sm:p-8 overflow-hidden group/item hover:scale-105 marquee-item">
                      {/* Blue Glow Border on Hover */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: 'inset 0 0 0 2px rgba(59, 61, 172, 0.3)' }}
                      />
                      
                      {/* Outer Blue Glow on Hover */}
                      <div 
                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md"
                        style={{ boxShadow: '0 0 20px rgba(59, 61, 172, 0.4)' }}
                      />

                      {/* Sponsor Logo Image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {sponsor.logo ? (
                          <Image
                            src={urlFor(sponsor.logo).url()}
                            alt={sponsor.name ? getLocalizedContent(sponsor.name, language) : t("home", "sponsors.alt")}
                            width={400}
                            height={240}
                            className="object-contain w-full h-full rounded-lg transition-all duration-300"
                            sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                            priority={index < 2}
                            unoptimized={true}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {sponsor.name ? getLocalizedContent(sponsor.name, language) : "Sponsor"}
                          </div>
                        )}
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-gray-800/30 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  )
                  
                  return (
                    <div
                      key={`sponsor-${sponsor._id}`}
                      className="flex-shrink-0 w-64 sm:w-80 md:w-96 lg:w-[450px]"
                    >
                      {sponsor.websiteUrl ? (
                        <Link href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                          {sponsorCardContent}
                        </Link>
                      ) : (
                        sponsorCardContent
                      )}
                    </div>
                  )
                })}
                
                {/* Duplicate Set for Seamless Loop */}
                {sponsors.map((sponsor, index) => {
                  const sponsorCardContent = (
                    <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg dark:shadow-[#3b3dac]/20 hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#3b3dac]/50 dark:hover:border-[#3b3dac]/50 transition-all duration-300 flex items-center justify-center p-6 sm:p-8 overflow-hidden group/item hover:scale-105 marquee-item">
                      {/* Blue Glow Border on Hover */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: 'inset 0 0 0 2px rgba(59, 61, 172, 0.3)' }}
                      />
                      
                      {/* Outer Blue Glow on Hover */}
                      <div 
                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md"
                        style={{ boxShadow: '0 0 20px rgba(59, 61, 172, 0.4)' }}
                      />

                      {/* Sponsor Logo Image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {sponsor.logo ? (
                          <Image
                            src={urlFor(sponsor.logo).url()}
                            alt={sponsor.name ? getLocalizedContent(sponsor.name, language) : t("home", "sponsors.alt")}
                            width={400}
                            height={240}
                            className="object-contain w-full h-full rounded-lg transition-all duration-300"
                            sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {sponsor.name ? getLocalizedContent(sponsor.name, language) : "Sponsor"}
                          </div>
                        )}
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-gray-800/30 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  )
                  
                  return (
                    <div
                      key={`sponsor-duplicate-${sponsor._id}`}
                      className="flex-shrink-0 w-64 sm:w-80 md:w-96 lg:w-[450px]"
                    >
                      {sponsor.websiteUrl ? (
                        <Link href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                          {sponsorCardContent}
                        </Link>
                      ) : (
                        sponsorCardContent
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            /* Fallback to existing sponsors if Sanity data is empty */
            <div className="relative overflow-hidden">
              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f2f4f7] dark:from-[#020617] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f2f4f7] dark:from-[#020617] to-transparent z-10 pointer-events-none" />
              
              {/* Marquee Track */}
              <div className="flex gap-8 sm:gap-12 md:gap-16 marquee-track group">
                {/* First Set of Sponsors */}
                {[1, 2, 3, 4, 5, 6].map((sponsor, index) => (
                  <div
                    key={`sponsor-${sponsor}`}
                    className="flex-shrink-0 w-64 sm:w-80 md:w-96 lg:w-[450px]"
                  >
                    <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg dark:shadow-[#3b3dac]/20 hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#3b3dac]/50 dark:hover:border-[#3b3dac]/50 transition-all duration-300 flex items-center justify-center p-6 sm:p-8 overflow-hidden group/item hover:scale-105 marquee-item">
                      {/* Blue Glow Border on Hover */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: 'inset 0 0 0 2px rgba(59, 61, 172, 0.3)' }}
                      />
                      
                      {/* Outer Blue Glow on Hover */}
                      <div 
                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md"
                        style={{ boxShadow: '0 0 20px rgba(59, 61, 172, 0.4)' }}
                      />

                      {/* Sponsor Logo Image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <Image
                          src={`/images/sponsers/sp${sponsor}.jpg`}
                          alt={`${t("home", "sponsors.alt")} ${sponsor}`}
                          width={400}
                          height={240}
                          className="object-contain w-full h-full rounded-lg transition-all duration-300"
                          sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                          priority={index < 2}
                        />
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-gray-800/30 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
                
                {/* Duplicate Set for Seamless Loop */}
                {[1, 2, 3, 4, 5, 6].map((sponsor, index) => (
                  <div
                    key={`sponsor-duplicate-${sponsor}`}
                    className="flex-shrink-0 w-64 sm:w-80 md:w-96 lg:w-[450px]"
                  >
                    <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 rounded-2xl bg-white dark:bg-gray-800/80 backdrop-blur-sm shadow-lg dark:shadow-[#3b3dac]/20 hover:shadow-xl dark:hover:shadow-[#3b3dac]/30 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#3b3dac]/50 dark:hover:border-[#3b3dac]/50 transition-all duration-300 flex items-center justify-center p-6 sm:p-8 overflow-hidden group/item hover:scale-105 marquee-item">
                      {/* Blue Glow Border on Hover */}
                      <div 
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                        style={{ boxShadow: 'inset 0 0 0 2px rgba(59, 61, 172, 0.3)' }}
                      />
                      
                      {/* Outer Blue Glow on Hover */}
                      <div 
                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 blur-md"
                        style={{ boxShadow: '0 0 20px rgba(59, 61, 172, 0.4)' }}
                      />

                      {/* Sponsor Logo Image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <Image
                          src={`/images/sponsers/sp${sponsor}.jpg`}
                          alt={`${t("home", "sponsors.alt")} ${sponsor}`}
                          width={400}
                          height={240}
                          className="object-contain w-full h-full rounded-lg transition-all duration-300"
                          sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                        />
                      </div>

                      {/* Glass Effect Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 dark:from-gray-800/30 to-transparent rounded-2xl pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </section>

      {/* ================= OUR GOALS & VALUES SECTION ================= */}
      <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0f172a] relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
              {heroData?.goalsValues?.title ? getLocalizedContent(heroData.goalsValues.title, language) : t("home", "goalsValues.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
              {heroData?.goalsValues?.description ? getLocalizedContent(heroData.goalsValues.description, language) : t("home", "goalsValues.description")}
            </p>
          </motion.div>

          {/* Cards Grid - Image Cards with Text Overlay */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto"
          >
            {(heroData?.goalsValues?.cards && heroData.goalsValues.cards.length > 0
              ? heroData.goalsValues.cards.map((card, index) => {
                  const defaultImage = ["/images/training/train2.jpg", "/images/training/train4.jpg", "/images/training/train6.jpg", "/images/training/train8.jpg"][index] || "/images/training/train2.jpg"
                  const imageUrl = card.image?.asset 
                    ? urlFor(card.image).url() 
                    : defaultImage
                  const title = card.title 
                    ? getLocalizedContent(card.title, language)
                    : (index < 4 ? t("home", `goalsValues.cards.${index}.title`) : "")
                  const description = card.description
                    ? getLocalizedContent(card.description, language)
                    : (index < 4 ? t("home", `goalsValues.cards.${index}.description`) : "")
                  const number = card.number || (index < 4 ? t("home", `goalsValues.cards.${index}.number`) : "")
                  
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      className="group relative"
                    >
                      {/* Card Container - Full Background Image */}
                      <div className="relative h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 transition-all duration-500">
                        {/* Border Glow on Hover */}
                        <div className="absolute -inset-0.5 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/30 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 z-20" />
                        
                        {/* Outer Glow */}
                        <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 z-10" />

                        {/* Background Image */}
                        <motion.div
                          className="relative w-full h-full rounded-3xl overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:brightness-110 rounded-3xl"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            priority={index < 2}
                          />
                          
                          {/* Dark Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 rounded-3xl" />
                          
                          {/* Content Overlay - Text Directly on Image */}
                          <div className="absolute inset-0 flex flex-col justify-start items-start p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl z-10">
                            {/* Number Badge */}
                            <div className="relative mb-4 sm:mb-6">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#3b3dac] flex items-center justify-center shadow-lg border-2 border-white/50">
                                <span className="text-white font-black text-lg sm:text-xl md:text-2xl">
                                  {number}
                                </span>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg">
                              {title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed max-w-xl drop-shadow-md mb-4 sm:mb-6">
                              {description}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })
              : [0, 1, 2, 3].map((cardIndex, index) => {
                  const item = {
                    number: t("home", `goalsValues.cards.${cardIndex}.number`),
                    title: t("home", `goalsValues.cards.${cardIndex}.title`),
                    description: t("home", `goalsValues.cards.${cardIndex}.description`),
                    hasButton: false,
                    image: ["/images/training/train2.jpg", "/images/training/train4.jpg", "/images/training/train6.jpg", "/images/training/train8.jpg"][cardIndex],
                  };
                  return (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={{ y: -8 }}
                      className="group relative"
                    >
                      {/* Card Container - Full Background Image */}
                      <div className="relative h-96 sm:h-[450px] md:h-[500px] lg:h-[550px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 transition-all duration-500">
                        {/* Border Glow on Hover */}
                        <div className="absolute -inset-0.5 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/30 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100 z-20" />
                        
                        {/* Outer Glow */}
                        <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 z-10" />

                        {/* Background Image */}
                        <motion.div
                          className="relative w-full h-full rounded-3xl overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-700 group-hover:brightness-110 rounded-3xl"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            priority={cardIndex < 2}
                          />
                          
                          {/* Dark Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 rounded-3xl" />
                          
                          {/* Content Overlay - Text Directly on Image */}
                          <div className="absolute inset-0 flex flex-col justify-start items-start p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl z-10">
                            {/* Number Badge */}
                            <div className="relative mb-4 sm:mb-6">
                              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-[#3b3dac] flex items-center justify-center shadow-lg border-2 border-white/50">
                                <span className="text-white font-black text-lg sm:text-xl md:text-2xl">
                                  {item.number}
                                </span>
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4 md:mb-6 leading-tight drop-shadow-lg">
                              {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm sm:text-base md:text-lg text-gray-100 leading-relaxed max-w-xl drop-shadow-md mb-4 sm:mb-6">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
