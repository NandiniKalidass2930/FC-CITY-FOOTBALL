"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Trophy, Target, Calendar, Star, Quote, Clock, MapPin, Activity, Award, Heart, Sparkles } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useLanguage, useTranslations } from "@/contexts/language-context"
import { useRef, useState, useEffect, useMemo } from "react"
import { useInView } from "framer-motion"
import { usePathname } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent, getLocalizedText } from "@/lib/sanity-locale"
import { TeamGroupPhotosMarquee } from "@/components/team/TeamGroupPhotosMarquee"

/* ---------------- Reusable Glow Card ---------------- */

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group rounded-3xl p-[2px] ${className}`}>
      {/* OUTER NEON FRAME */}
      <div
        className="
          absolute inset-0
          rounded-3xl
          bg-gradient-to-r
          from-[#3b3dac]
          via-[#6b6dff]
          to-[#3b3dac]
          opacity-40
          blur-lg
          group-hover:opacity-90
          transition-all
          duration-500
        "
      />

      {/* BACKGROUND GLOW */}
      <div
        className="
          absolute inset-0
          rounded-3xl
          bg-[#3b3dac]/40
          blur-3xl
          scale-110
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-500
        "
      />

      {/* MAIN CARD */}
      <div
        className="
          relative z-10
          rounded-3xl
          bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
          p-6 sm:p-8
          border border-gray-200 dark:border-[#3b3dac]/30
          backdrop-blur-xl
          transition-all
          duration-500
          shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50
          group-hover:border-[#3b3dac]/70
          group-hover:shadow-[0_0_80px_rgba(59,61,172,0.3)]
          dark:group-hover:shadow-[0_0_80px_rgba(59,61,172,0.9)]
          h-full
        "
      >
        {children}
      </div>
    </div>
  )
}

/* ---------------- Counter Component ---------------- */

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

/* ---------------- Animation Variants ---------------- */

const fadeInDown = {
  hidden: { opacity: 0, y: -20, scale: 0.98 }, // Reduced movement and duration
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3 }, // Reduced from 0.8s
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -20 }, // Reduced from -80
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }, // Reduced from 0.8s
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 20 }, // Reduced from 80
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }, // Reduced from 0.8s
  },
}

const zoomIn = {
  hidden: { opacity: 0, scale: 0.95 }, // Reduced from 0.8
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 }, // Reduced from 0.7s
  },
}

const zoomOut = {
  hidden: { opacity: 0, scale: 1.2 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 }, // Reduced from 0.1s for faster loading
  },
}

/* ---------------- Data ---------------- */

// Default fallback training schedule
const defaultTrainingSchedule = [
  { day: "monday", time: "18:00 - 20:00", location: "field", type: "tactical" },
  { day: "tuesday", time: "18:00 - 20:00", location: "field", type: "technical" },
  { day: "wednesday", time: "19:00 - 21:00", location: "gym", type: "physical" },
  { day: "thursday", time: "18:00 - 20:00", location: "field", type: "tactical" },
  { day: "friday", time: "18:00 - 20:00", location: "field", type: "technical" },
  { day: "saturday", time: "10:00 - 12:00", location: "field", type: "tactical" },
  { day: "sunday", time: "Rest Day", location: "-", type: "-" },
]

// Icon mapping for achievements
const achievementIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Award,
  Calendar,
  Star,
}

type TeamCategory = "all" | "under21" | "under17" | "under15" | "under13" | "under11" | "over30" | "over50" | "fcCityGirls"

interface Player {
  _id: string
  name: { en?: string; de?: string } | string
  number: number
  position: { en?: string; de?: string } | string
  highlight?: { en?: string; de?: string } | string
  description?: { en?: string; de?: string } | string
  image?: any
  category?: string
}

interface TeamGroupPhoto {
  _id: string
  title?: string
  badgeName?: string
  category: string
  image?: any
  groupPhotos?: any[]
}

interface Coach {
  _id: string
  name: { en?: string; de?: string } | string
  role: { en?: string; de?: string } | string
  bio?: { en?: string; de?: string } | string
  image?: any
}

interface TeamPageData {
  heroBackgroundImage?: any
  heroTitle?: { en?: string; de?: string } | string
  heroSubtitle?: { en?: string; de?: string } | string
  playerHighlights?: Array<{
    player?: { _ref: string }
    image?: any
    badge?: { en?: string; de?: string } | string
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    order?: number
  }>
  trainingSchedule?: Array<{
    day?: string
    time?: string
    location?: string
    category?: string
    order?: number
  }>
  achievements?: Array<{
    title?: { en?: string; de?: string } | string
    value?: number
    suffix?: string
    iconType?: string
    order?: number
  }>
}

// Helper function to map TeamCategory to Sanity category string
function mapTeamCategoryToSanityCategory(category: TeamCategory): string | undefined {
  const categoryMap: Record<TeamCategory, string> = {
    "all": "",
    "under21": "Under 21",
    "under17": "Under 17",
    "under15": "Under 15",
    "under13": "Under 13",
    "under11": "Under 11",
    "over30": "Over 30",
    "over50": "Over 50",
    "fcCityGirls": "FC City Girls",
  }
  return categoryMap[category] || undefined
}

export default function TeamPage() {
  const { getMessages, language } = useLanguage()
  const { t } = useTranslations("our-team")
  const pathname = usePathname()
  const heroRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<TeamCategory>("all")
  const [categoryChangeKey, setCategoryChangeKey] = useState(0) // Track category changes for image reload
  
  // Sanity data state
  const [players, setPlayers] = useState<Player[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [teamGroupPhotos, setTeamGroupPhotos] = useState<TeamGroupPhoto[]>([])
  const [teamPageData, setTeamPageData] = useState<TeamPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dataRefreshKey, setDataRefreshKey] = useState(0) // Force refresh key
  
  // Get team messages for translations (for non-Sanity content)
  const teamMessages = getMessages("ourTeam")
  
  // Fetch data from Sanity - refetch when language, pathname, or refresh key changes
  useEffect(() => {
    let isMounted = true // Prevent state updates if component unmounts
    
    async function fetchSanityData() {
      try {
        setLoading(true)
        
        // Fetch players with localized fields
        const playersQuery = `*[_type == "player"] | order(number asc) {
          _id,
          name,
          number,
          position,
          highlight,
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
          category
        }`
        // Fetch with no cache for instant updates
        const playersData = await client.fetch(playersQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        if (isMounted) {
          setPlayers(playersData || [])
        }

        // Fetch team group photos (independent of players)
        const teamGroupPhotosQuery = `*[_type == "teamGroupPhoto"] {
          _id,
          title,
          badgeName,
          category,
          groupPhotos[] {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          image {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          }
        }`
        const teamGroupPhotosData = await client.fetch(teamGroupPhotosQuery, {}, {
          next: { revalidate: 0 },
          cache: 'no-store' as any
        })
        if (isMounted) {
          setTeamGroupPhotos(teamGroupPhotosData || [])
        }
        
        // Fetch coaches with localized fields
        const coachesQuery = `*[_type == "coach"] | order(name.en asc) {
          _id,
          name,
          role,
          bio,
          image {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          }
        }`
        const coachesData = await client.fetch(coachesQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        if (isMounted) {
          setCoaches(coachesData || [])
        }
        
        // Fetch team page data with complete playerHighlights - includes _key for proper mapping
        const teamPageQuery = `*[_type == "teamPage"][0] {
          heroBackgroundImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          heroTitle,
          heroSubtitle,
          playerHighlights[] | order(order asc) {
            _key,
            player-> {
              _id,
              name,
              number,
              position,
              description,
              image {
                asset-> {
                  _id,
                  _type,
                  url
                },
                hotspot,
                crop
              }
            },
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            badge,
            title,
            description,
            order
          },
          trainingSchedule[] | order(order asc) {
            day,
            time,
            location,
            category,
            order
          },
          achievements[] | order(order asc) {
            title,
            value,
            suffix,
            iconType,
            order
          }
        }`
        const teamPageDataResult = await client.fetch(teamPageQuery, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        if (isMounted) {
          setTeamPageData(teamPageDataResult || null)
        }
        
      } catch (error) {
        console.error("Error fetching Sanity data:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    fetchSanityData()
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false
    }
  }, [language, pathname, dataRefreshKey]) // Add pathname and refresh key to dependencies
  
  // Add window focus listener to refresh data when user returns to tab
  useEffect(() => {
    const handleFocus = () => {
      setDataRefreshKey(prev => prev + 1) // Trigger refresh
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])
  
  // Filter players based on active category
  const filteredPlayers = useMemo(() => {
    if (activeCategory === "all") {
      return players
    }
    
    const sanityCategory = mapTeamCategoryToSanityCategory(activeCategory)
    const filtered = players.filter(player => player.category === sanityCategory)
    return filtered
  }, [activeCategory, players])
  
  // Reset loading state when category changes to show loading indicator
  useEffect(() => {
    if (!loading && filteredPlayers.length === 0 && players.length > 0) {
      // Category has no players, but we have players loaded
      // This is fine, just show empty state
    }
  }, [activeCategory, filteredPlayers, loading, players])

  // Category filters - dynamically loaded from translations
  const categories: { key: TeamCategory; label: string }[] = useMemo(() => {
    const ourTeamSection = teamMessages?.ourTeamSection
    if (!ourTeamSection?.categories) return []
    
    return [
      { key: "all", label: ourTeamSection.categories.all || "All" },
      { key: "under21", label: ourTeamSection.categories.under21 || "Under 21" },
      { key: "under17", label: ourTeamSection.categories.under17 || "Under 17" },
      { key: "under15", label: ourTeamSection.categories.under15 || "Under 15" },
      { key: "under13", label: ourTeamSection.categories.under13 || "Under 13" },
      { key: "under11", label: ourTeamSection.categories.under11 || "Under 11" },
      { key: "over30", label: ourTeamSection.categories.over30 || "Over 30" },
      { key: "over50", label: ourTeamSection.categories.over50 || "Over 50" },
      { key: "fcCityGirls", label: (ourTeamSection.categories as any).fcCityGirls || "FC City Girls" },
    ]
  }, [teamMessages])

  const teamGroupPhotoByCategory = useMemo(() => {
    const map = new Map<string, TeamGroupPhoto>()
    for (const doc of teamGroupPhotos) {
      const hasAnyPhotos =
        (Array.isArray(doc?.groupPhotos) && doc.groupPhotos.length > 0) || Boolean(doc?.image)
      if (doc?.category && hasAnyPhotos && !map.has(doc.category)) {
        map.set(doc.category, doc)
      }
    }
    return map
  }, [teamGroupPhotos])

  // Group photo data (stored in teamGroupPhoto docs)
  const activeCategoryGroupPhotos = useMemo(() => {
    if (activeCategory === "all") return null
    const sanityCategory = mapTeamCategoryToSanityCategory(activeCategory)
    if (!sanityCategory) return null
    const doc = teamGroupPhotoByCategory.get(sanityCategory)
    const photos = (doc?.groupPhotos && doc.groupPhotos.length > 0)
      ? doc.groupPhotos
      : doc?.image
        ? [doc.image]
        : []
    return photos.length > 0 ? photos : null
  }, [activeCategory, teamGroupPhotoByCategory])

  const allCategoryGroupPhotos = useMemo(() => {
    return categories
      .filter((c) => c.key !== "all")
      .map((c) => {
        const sanityCategory = mapTeamCategoryToSanityCategory(c.key)
        const doc = sanityCategory ? teamGroupPhotoByCategory.get(sanityCategory) : undefined
        const groupPhoto =
          (doc?.groupPhotos && doc.groupPhotos.length > 0)
            ? doc.groupPhotos[0]
            : doc?.image || null
        const badgeName = doc?.badgeName || ""
        return {
          key: c.key,
          label: c.label,
          groupPhoto,
          badgeName,
        }
      })
  }, [categories, teamGroupPhotoByCategory])

  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  // Background parallax movement (subtle)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  
  // Subtle left-to-right drift animation
  const driftX = useMotionValue(0)
  const driftSpring = useSpring(driftX, { stiffness: 50, damping: 20 })
  const driftTransform = useTransform(driftSpring, [0, 2], ["0%", "2%"])
  
  // Initialize drift animation on mount (runs once)
  useEffect(() => {
    driftX.set(2) // Very subtle 2% drift
  }, [driftX])

  // Get highlights data from Sanity or fallback to translations
  const highlights = useMemo(() => {
    // Use Sanity data if available
    if (teamPageData?.playerHighlights && teamPageData.playerHighlights.length > 0) {
      return teamPageData.playerHighlights.map((highlight: any, index: number) => {
        // Use highlight image if available, otherwise use player image, otherwise fallback
        const imageSource = highlight.image?.asset 
          ? highlight.image 
          : highlight.player?.image?.asset 
            ? highlight.player.image 
            : null
        
        // Optimize Sanity images with proper dimensions and quality for fast loading
        const imageUrl = imageSource 
          ? urlFor(imageSource)
              .width(800)  // Optimized width for 3-column grid
              .height(600) // Optimized height
              .quality(85)  // High quality
              .format('webp') // Modern format for faster loading
              .url()
          : ["/images/training/train6.jpg", "/images/training/train9.jpg", "/images/training/train8.jpg"][index] || "/images/training/train6.jpg"
        
        // Use title override if available, otherwise use player name
        const title = highlight.title 
          ? getLocalizedContent(highlight.title, language)
          : highlight.player?.name 
            ? getLocalizedContent(highlight.player.name, language)
            : ""
        
        // Use description override if available, otherwise use player description
        const description = highlight.description 
          ? getLocalizedText(highlight.description, language)
          : highlight.player?.description 
            ? getLocalizedText(highlight.player.description, language)
            : ""
        
        // Use badge if available
        const badge = highlight.badge 
          ? getLocalizedContent(highlight.badge, language)
          : ""
        
        return {
          _key: highlight._key || `highlight-${index}`,
          src: imageUrl,
          caption: highlight.player?.position ? getLocalizedContent(highlight.player.position, language) : "",
          badge: badge,
          title: title,
          description: description,
          player: highlight.player,
        }
      })
    }
    
    // Fallback to translations if no Sanity data
    const highlightsData = teamMessages?.highlights?.items || []
    const images = [
      "/images/training/train6.jpg",
      "/images/training/train9.jpg",
      "/images/training/train8.jpg",
    ]
    return highlightsData.map((highlight: any, index: number) => ({
      _key: `fallback-${index}`,
      src: images[index] || "/images/training/train6.jpg",
      caption: highlight.caption,
      badge: highlight.badge,
      title: highlight.title,
      description: highlight.description,
    }))
  }, [teamPageData?.playerHighlights, teamMessages, language])

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#0f172a] text-gray-900 dark:text-white">
      <main className="flex-1">
        {/* ================= HERO SECTION - Cinematic ================= */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image with Zoom + Parallax + Drift */}
          <motion.div
            key={`hero-bg-${pathname}`} // Force re-render on route change
            className="absolute inset-0"
            style={{
              backgroundImage: teamPageData?.heroBackgroundImage?.asset 
                ? `url('${urlFor(teamPageData.heroBackgroundImage).url()}')`
                : "url('/images/main.jpg')",
              backgroundSize: "cover",
              // Shift image upward so faces/upper body stay in frame (smaller Y% = higher focus)
              backgroundPosition: "50% 20%",
              y: backgroundY, // Parallax scroll
              opacity: backgroundOpacity,
              x: driftTransform, // Subtle left-to-right drift
              willChange: "transform, opacity", // Performance optimization for 60fps
            }}
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{ 
              duration: 8, 
              ease: "easeOut"
            }}
          />

          {/* Light Vignette Effect */}
          <div 
            className="absolute inset-0 z-[5]"
            style={{
              boxShadow: "inset 0 0 200px rgba(0, 0, 0, 0.4), inset 0 0 100px rgba(0, 0, 0, 0.3)"
            }}
          />

          {/* Gradient Overlay - Enhanced */}
          <motion.div 
            className="absolute inset-0 z-[6] bg-gradient-to-b from-black/50 via-black/40 to-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Additional Radial Gradient Overlay */}
          <div 
            className="absolute inset-0 z-[6]"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.6) 100%)"
            }}
          />

          {/* Content Container */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            {/* Main Heading - Fade In + Slide Up */}
            <motion.h1 
              className="text-white text-4xl sm:text-5xl md:text-6xl font-black mb-4 drop-shadow-2xl"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1.2, 
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth entrance
                delay: 0.3
              }}
              style={{ willChange: "opacity, transform" }} // Performance optimization
            >
              {teamPageData?.heroTitle ? getLocalizedContent(teamPageData.heroTitle, language) : t("title")}
            </motion.h1>

            {/* Subtitle - Delayed Fade In + Slide Up */}
            <motion.p 
              className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.6 // Slight delay after heading
              }}
              style={{ willChange: "opacity, transform" }} // Performance optimization
            >
              {teamPageData?.heroSubtitle ? getLocalizedContent(teamPageData.heroSubtitle, language) : t("subtitle")}
            </motion.p>
          </div>
        </section>

        {/* ================= OUR TEAM SECTION WITH CATEGORY TABS ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0f172a] relative">
          {/* Category Filter Tabs */}
          <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm mb-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} // Reduced for faster load
                className="text-center mb-6"
              >
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase">
                  {t("ourTeamSection.title")}
                </h2>
              </motion.div>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 relative">
                {categories.map((category) => {
                  const isActive = activeCategory === category.key
                  return (
                    <motion.button
                      key={category.key}
                      onClick={() => {
                        setActiveCategory(category.key)
                        setCategoryChangeKey(prev => prev + 1) // Increment to force image reload
                      }}
                      className={`relative px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold rounded-full transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-[#3b3dac] text-white shadow-lg shadow-[#3b3dac]/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-[#3b3dac]/50 dark:hover:border-[#3b3dac]/50 hover:text-[#3b3dac] dark:hover:text-[#6fdcff]'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active Glow Effect */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[#3b3dac]/20 blur-xl -z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: [0.5, 0.8, 0.5], scale: 1 }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <span className="relative z-10">{category.label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Group Photo Section (must be BELOW the category buttons) */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-8">
            {activeCategory === "all" ? (
              <div className="max-w-7xl mx-auto">
                <TeamGroupPhotosMarquee
                  items={allCategoryGroupPhotos
                    .filter((x) => Boolean(x.groupPhoto))
                    .map((x) => ({
                      key: `${x.key}-${categoryChangeKey}`,
                      badge: (x.badgeName || x.label || "").toUpperCase(),
                      imageUrl: x.groupPhoto
                        ? urlFor(x.groupPhoto).width(1200).height(675).quality(80).format("webp").url()
                        : "",
                      alt: `${x.label} group photo`,
                    }))}
                  // slow, smooth marquee-style speed
                  pxPerSecond={22}
                />
              </div>
            ) : (
              <motion.div
                key={`group-photo-single-${activeCategory}-${categoryChangeKey}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto"
              >
                {!activeCategoryGroupPhotos || activeCategoryGroupPhotos.length === 0 ? (
                  <div className="w-full rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-gray-600 dark:text-gray-400">No group photos found.</p>
                  </div>
                ) : activeCategoryGroupPhotos.length === 1 ? (
                  <div className="relative group rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 transition-all duration-500 border border-gray-200 dark:border-gray-700">
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        key={`group-photo-${activeCategory}-${categoryChangeKey}-${pathname}`}
                        src={urlFor(activeCategoryGroupPhotos[0])
                          .width(1600)
                          .height(900)
                          .quality(85)
                          .format("webp")
                          .url()}
                        alt="Team group photo"
                        fill
                        loading="lazy"
                        className="object-cover object-top transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                        sizes="(max-width: 1280px) 100vw, 1280px"
                        quality={90}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-hide">
                    <div className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] sm:auto-cols-[minmax(420px,1fr)] gap-4 sm:gap-6 w-max py-1">
                      {activeCategoryGroupPhotos.map((img, idx) => (
                        <div
                          key={`active-group-row-${activeCategory}-${idx}-${categoryChangeKey}`}
                          className="relative group rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 transition-all duration-500 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="relative w-full aspect-[16/9] overflow-hidden">
                            <Image
                              src={urlFor(img)
                                .width(1600)
                                .height(900)
                                .quality(80)
                                .format("webp")
                                .url()}
                              alt="Team group photo"
                              fill
                              loading="lazy"
                              className="object-cover object-top transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 520px"
                              quality={85}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Players Grid */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-12">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading players...</p>
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No players found in this category.</p>
              </div>
            ) : (
              <motion.div
                key={`players-grid-${activeCategory}-${categoryChangeKey}`} // Force re-render when category changes
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto"
              >
                {filteredPlayers.map((player, index) => (
                  <motion.div
                    key={`${player._id}-${activeCategory}-${categoryChangeKey}`} // Include category and change key
                    variants={zoomIn}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative group"
                  >
                    {/* Modern Player Card - Image First Layout */}
                    <div className="relative h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 transition-all duration-500 border border-gray-200 dark:border-gray-700">
                      {/* Border Glow on Hover */}
                      <div className="absolute -inset-0.5 rounded-2xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/30 blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100" /> {/* Reduced from 500ms */}
                      
                      {/* Outer Glow */}
                      <div className="absolute -inset-1 rounded-2xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" /> {/* Reduced from 500ms */}

                      {/* Player Image Container - Full Width, Aspect Ratio 3:4 */}
                      <div className="relative w-full aspect-[3/4] overflow-hidden">
                        {player.image ? (
                          <Image
                            key={`player-${player._id}-${activeCategory}-${categoryChangeKey}-${pathname}`} // Include all identifiers to force re-render
                            src={urlFor(player.image)
                              .width(600)  // Optimized width for player cards
                              .height(800) // Optimized height (3:4 aspect)
                              .quality(85) // High quality
                              .format('webp') // Modern format
                              .url()}
                            alt={`${getLocalizedContent(player.position, language)} - Jersey #${player.number}`}
                            fill
                            className="object-cover transition-all duration-300 group-hover:scale-110" // Reduced from 700ms
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            priority={index < 4 && activeCategory === "all"} // Priority for first 4 players
                            loading={index < 4 && activeCategory === "all" ? "eager" : "lazy"} // Eager load first 4
                            quality={90} // High quality for player images
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        
                        {/* Gradient Overlay - Always Visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        
                        {/* Gradient Overlay on Hover - Enhanced */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> {/* Reduced from 500ms */}
                        
                        {/* Jersey Number Badge */}
                        {player.number && (
                          <div className="absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center border-2 border-white/30 shadow-xl z-10">
                            <span className="text-white font-black text-base sm:text-lg">{player.number}</span>
                          </div>
                        )}

                        {/* Player Info Overlay - Always Visible, Enhanced on Hover */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 z-10">
                          {/* Player Highlight Badge */}
                          {player.highlight && getLocalizedContent(player.highlight, language) && (
                            <div className="mb-2">
                              <span className="inline-block px-2 py-1 rounded-full bg-[#3b3dac]/80 text-white text-xs font-bold uppercase tracking-wider opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                                {getLocalizedContent(player.highlight, language)}
                              </span>
                            </div>
                          )}
                          
                          {/* Player Name */}
                          {player.name && (
                            <h3 className="text-white font-black text-lg sm:text-xl mb-1 drop-shadow-lg opacity-90 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                              {getLocalizedContent(player.name, language)}
                            </h3>
                          )}
                          
                          {/* Jersey Number */}
                          {player.number && (
                            <h4 className="text-white font-bold text-base sm:text-lg mb-1 drop-shadow-lg opacity-80 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-300">
                              #{player.number}
                            </h4>
                          )}

                          {/* Position */}
                          {player.position && (
                            <p className="text-white/90 font-semibold text-sm sm:text-base drop-shadow-md opacity-80 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 transition-all duration-300 delay-75">
                              {getLocalizedContent(player.position, language)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Player Description Below Image */}
                      {player.description && getLocalizedText(player.description, language) && (
                        <div className="p-4 sm:p-5 bg-white dark:bg-gray-800">
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {getLocalizedText(player.description, language)}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ================= PLAYER HIGHLIGHTS ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-gray-200 dark:bg-[#1e293b] relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 text-[#3b3dac] dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("highlights.subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {t("highlights.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t("highlights.description")}
              </p>
            </div>

            {highlights.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                {highlights.map((highlight: any, index: number) => (
                  <motion.div
                    key={highlight._key || `highlight-${index}-${dataRefreshKey}`}
                    initial={{ opacity: 1, y: 0 }} // Start visible, no delay
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative group"
                  >
                    <GlowCard>
                      <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                        <Image
                          key={`highlight-img-${highlight._key || index}-${pathname}-${dataRefreshKey}`}
                          src={highlight.src}
                          alt={highlight.caption || highlight.title || "Player highlight"}
                          fill
                          priority={true} // Always priority for instant loading
                          loading="eager" // Always eager load
                          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          quality={90}
                          unoptimized={highlight.src?.includes('cdn.sanity.io') ? false : undefined} // Let Next.js optimize non-Sanity images
                          style={{
                            filter: "drop-shadow(0 0 0 rgba(59, 61, 172, 0))",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          {highlight.badge && (
                            <div className="flex items-center gap-2 mb-2">
                              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-bold">{highlight.badge}</span>
                            </div>
                          )}
                          {highlight.title && (
                            <h3 className="text-white text-xl font-black">{highlight.title}</h3>
                          )}
                          {highlight.caption && (
                            <p className="text-white/80 text-sm mt-1">{highlight.caption}</p>
                          )}
                        </div>
                      </div>
                      {highlight.description && (
                        <p className="text-gray-700 dark:text-gray-300">
                          {highlight.description}
                        </p>
                      )}
                    </GlowCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No player highlights available at the moment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ================= ACHIEVEMENTS ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-white dark:bg-[#0f172a] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDown}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 text-[#3b3dac] dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("achievements.subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {t("achievements.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t("achievements.description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {(teamPageData?.achievements && teamPageData.achievements.length > 0
                ? teamPageData.achievements.map((achievement: any) => {
                    const Icon = achievementIconMap[achievement.iconType || "Trophy"] || Trophy
                    const label = achievement.title 
                      ? (typeof achievement.title === "string" 
                          ? achievement.title 
                          : getLocalizedContent(achievement.title, language))
                      : ""
                    return {
                      icon: Icon,
                      label: label,
                      value: achievement.value || 0,
                      suffix: achievement.suffix || "",
                    }
                  })
                : [
                    { icon: Trophy, label: t("achievements.leagueChampions"), value: 3, suffix: "+" },
                    { icon: Award, label: t("achievements.cupWinners"), value: 5, suffix: "+" },
                    { icon: Calendar, label: t("achievements.seasonsPlayed"), value: 12, suffix: "" },
                    { icon: Star, label: t("achievements.totalWins"), value: 150, suffix: "+" },
                  ]
              ).map((stat, index) => (
                <motion.div
                  key={index}
                  variants={zoomIn}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="relative group"
                >
                  <GlowCard className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center shadow-lg shadow-[#3b3dac]/50">
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl sm:text-5xl font-black text-[#3b3dac] dark:text-blue-400 mb-2">
                      <Counter end={stat.value} suffix={stat.suffix !== undefined ? stat.suffix : (stat.label.includes("Seasons") ? "" : "+")} />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold">{stat.label}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= TRAINING SCHEDULE ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-gray-50 dark:bg-[#1e293b] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDown}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 text-[#3b3dac] dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("trainingSchedule.subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {t("trainingSchedule.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t("trainingSchedule.description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <GlowCard>
                <div className="overflow-x-auto overscroll-x-contain touch-pan-x scrollbar-hide">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-4 px-4 font-black text-gray-900 dark:text-white">{t("trainingSchedule.time")}</th>
                        <th className="text-left py-4 px-4 font-black text-gray-900 dark:text-white">{t("trainingSchedule.location")}</th>
                        <th className="text-left py-4 px-4 font-black text-gray-900 dark:text-white">{t("trainingSchedule.type")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(teamPageData?.trainingSchedule && teamPageData.trainingSchedule.length > 0
                        ? teamPageData.trainingSchedule
                        : defaultTrainingSchedule
                      ).map((schedule: any, index: number) => (
                        <motion.tr
                          key={schedule.day}
                          variants={slideInRight}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-[#3b3dac]/5 dark:hover:bg-[#3b3dac]/10 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-[#3b3dac]" />
                              <span className="font-semibold text-gray-900 dark:text-white capitalize">{t(`trainingSchedule.${schedule.day}`)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-[#3b3dac]" />
                              <span className="text-gray-700 dark:text-gray-300">{schedule.time}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-[#3b3dac]" />
                              <span className="text-gray-700 dark:text-gray-300 capitalize">
                                {schedule.location !== "-" ? t(`trainingSchedule.${schedule.location}`) : "-"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Activity className="h-5 w-5 text-[#3b3dac]" />
                              <span className="text-gray-700 dark:text-gray-300 capitalize">
                                {(() => {
                                    // Use category from Sanity, or type from default schedule
                                    const categoryOrType = schedule.category || schedule.type
                                    
                                    // Check if it's Sunday and category is empty/null - show "Rest Day"
                                    const isSunday = schedule.day?.toLowerCase() === "sunday"
                                    
                                    // Handle null, undefined, empty string, or "-"
                                    if (!categoryOrType || categoryOrType === "-" || categoryOrType === null || categoryOrType === "") {
                                      // For Sunday, prefer "Rest" over "Null"
                                      if (isSunday) {
                                        const restTranslation = t("trainingSchedule.Rest")
                                        // If translation found, return it; otherwise fallback to Null
                                        return restTranslation !== "trainingSchedule.Rest" ? restTranslation : t("trainingSchedule.Null")
                                      }
                                      return t("trainingSchedule.Null")
                                    }
                                    
                                    // Normalize the category/type key (capitalize first letter)
                                    const categoryKey = categoryOrType.charAt(0).toUpperCase() + categoryOrType.slice(1).toLowerCase()
                                    const translationKey = `trainingSchedule.${categoryKey}`
                                    const translated = t(translationKey)
                                    
                                    // Check if translation was found (not returning the key itself)
                                    // The translation function returns the key if not found
                                    const isTranslationFound = translated !== translationKey && 
                                                              translated !== `trainingSchedule.${categoryKey}` &&
                                                              !translated.startsWith("trainingSchedule.")
                                    
                                    if (isTranslationFound) {
                                      return translated
                                    }
                                    
                                    // Fallback to "Null" if translation not found
                                    const nullTranslation = t("trainingSchedule.Null")
                                    // If Null translation also not found, return a hardcoded fallback
                                    return nullTranslation !== "trainingSchedule.Null" ? nullTranslation : (language === "de" ? "Kein Training" : "No Training")
                                  })()}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </section>

        {/* ================= COACHING STAFF ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-white dark:bg-[#0f172a] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDown}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white text-center mb-4 uppercase">
                {t("coachesSection")}
              </h2>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading coaches...</p>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
              >
                {coaches.map((coach, index: number) => (
                  <motion.div
                    key={coach._id}
                    variants={zoomIn}
                    whileHover={{ y: -12, scale: 1.03 }}
                    className="relative group"
                  >
                    <GlowCard>
                      <div className="text-center">
                        {/* Trainer Image */}
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#3b3dac]/30 group-hover:border-[#3b3dac]/70 transition-all duration-500">
                          {coach.image ? (
                            <Image
                              key={`coach-${coach._id}-${pathname}`} // Force re-render on route change
                              src={urlFor(coach.image)
                                .width(256)  // Optimized for circular images
                                .height(256)
                                .quality(85)
                                .format('webp')
                                .url()}
                              alt={getLocalizedContent(coach.name, language)}
                              fill
                              className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                              sizes="(max-width: 640px) 112px, 128px"
                              quality={90}
                              style={{
                                filter: "drop-shadow(0 0 0 rgba(59, 61, 172, 0))",
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                          {/* Subtle Shadow Glow */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                               style={{ boxShadow: '0 8px 24px rgba(59, 61, 172, 0.3)' }} />
                        </div>

                        {/* Trainer Name */}
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#3b3dac] dark:group-hover:text-blue-400 transition-colors duration-300">
                          {getLocalizedContent(coach.name, language)}
                        </h3>

                        {/* Role */}
                        {coach.role && getLocalizedContent(coach.role, language) && (
                          <p className="text-[#3b3dac] dark:text-blue-400 font-semibold text-base sm:text-lg mb-3">
                            {getLocalizedContent(coach.role, language)}
                          </p>
                        )}
                        
                        {/* Description/Bio */}
                        {coach.bio && getLocalizedText(coach.bio, language) && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            {getLocalizedText(coach.bio, language)}
                          </p>
                        )}
                      </div>
                    </GlowCard>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ================= CLUB VISION ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-gray-200/90 dark:bg-[#1e293b] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDown}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 text-[#3b3dac] dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("vision.subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {t("vision.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t("vision.description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 sm:gap-8 items-stretch"
            >
              {[
                { icon: Target, title: t("vision.mission"), text: t("vision.missionText") },
                { icon: Heart, title: t("vision.values"), text: t("vision.valuesText") },
                { icon: Sparkles, title: t("vision.goals"), text: t("vision.goalsText") },
              ].map((item: any, index: number) => (
                <motion.div
                  key={index}
                  variants={slideInLeft}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group h-full"
                >
                  <GlowCard className="h-full">
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-[#3b3dac]/50">
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{item.title}</h3>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="py-20 sm:py-24 md:py-28 bg-white dark:bg-[#0f172a] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDown}
              className="text-center mb-12 sm:mb-16"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-[#3b3dac]/10 dark:bg-[#3b3dac]/20 text-[#3b3dac] dark:text-blue-400 font-semibold text-sm uppercase tracking-wider mb-4">
                {t("testimonials.subtitle")}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                {t("testimonials.title")}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                {t("testimonials.description")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto"
            >
              {[
                { name: t("testimonials.player1.name"), role: t("testimonials.player1.role"), quote: t("testimonials.player1.quote"), image: "/images/home1.jpg" },
                { name: t("testimonials.player2.name"), role: t("testimonials.player2.role"), quote: t("testimonials.player2.quote"), image: "/images/home2.jpg" },
                { name: t("testimonials.coach.name"), role: t("testimonials.coach.role"), quote: t("testimonials.coach.quote"), image: "/images/ball.jpg" },
                { name: t("testimonials.fan.name"), role: t("testimonials.fan.role"), quote: t("testimonials.fan.quote"), image: "/images/home1.jpg" },
              ].map((testimonial: any, index: number) => (
                <motion.div
                  key={index}
                  variants={zoomOut}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  <GlowCard>
                    <Quote className="h-12 w-12 text-[#3b3dac] dark:text-blue-400 mb-4 opacity-50" />
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#3b3dac]/30 group-hover:border-[#3b3dac]/70 transition-all duration-500">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-110"
                          style={{
                            filter: "drop-shadow(0 0 0 rgba(59, 61, 172, 0))",
                          }}
                        />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                             style={{ boxShadow: '0 4px 12px rgba(59, 61, 172, 0.3)' }} />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white">{testimonial.name}</h4>
                        <p className="text-[#3b3dac] dark:text-blue-400 font-semibold">{testimonial.role}</p>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= CALL TO ACTION ================= */}
        
      </main>

      <Footer />
    </div>
  )
}
