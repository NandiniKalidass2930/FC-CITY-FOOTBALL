"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react"
import Image from "next/image"
import Masonry from "react-masonry-css"
import { Footer } from "@/components/footer"
import { useLanguage, useTranslations } from "@/contexts/language-context"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/spotlight-card"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent } from "@/lib/sanity-locale"

type GalleryCategory = "all" | "training" | "match" | "event" | "video"
type MediaType = "image" | "video"

interface GalleryMediaItem {
  _id: string
  mediaType: MediaType
  category: Exclude<GalleryCategory, "all">
  title?: string
  caption: string
  alt: string
  createdAt?: string
  order?: number
  isFeatured?: boolean
  imageSrc?: string
  videoSrc?: string
  posterSrc?: string
}

function VideoPreview({
  videoSrc,
  posterSrc,
  alt,
  className = "",
}: {
  videoSrc?: string
  posterSrc?: string
  alt: string
  className?: string
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [shouldLoad, setShouldLoad] = React.useState(false)

  React.useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin: "300px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onMouseEnter={() => {
        const v = videoRef.current
        if (!v) return
        v.play().catch(() => {})
      }}
      onMouseLeave={() => {
        const v = videoRef.current
        if (!v) return
        v.pause()
      }}
    >
      {shouldLoad && videoSrc ? (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          poster={posterSrc}
          aria-label={alt}
        >
          <source src={videoSrc} />
        </video>
      ) : posterSrc ? (
        <Image
          src={posterSrc}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Video overlay with play icon */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-14 w-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
          <Play className="h-7 w-7 text-white ml-0.5" />
        </div>
      </div>
    </div>
  )
}


/* ---------------- Animation Variants ---------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
    transition: { staggerChildren: 0.08 },
  },
}

export default function GalleryPage() {
  const { language } = useLanguage()
  const { t } = useTranslations("gallery")
  const [activeFilter, setActiveFilter] = React.useState<GalleryCategory>("all")
  const [selectedMedia, setSelectedMedia] = React.useState<string | null>(null)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)
  const [galleryItems, setGalleryItems] = React.useState<GalleryMediaItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const scrollerSetRef = React.useRef<HTMLDivElement | null>(null)
  const [scrollerSetWidth, setScrollerSetWidth] = React.useState(0)
  const [scrollerDurationSec, setScrollerDurationSec] = React.useState(50)

  // Fetch gallery images from Sanity
  React.useEffect(() => {
    async function fetchGalleryMedia() {
      try {
        setLoading(true)
        const query = `*[_type == "gallery"] | order(order asc, _createdAt desc) {
          _id,
          mediaType,
          title,
          galleryImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          galleryVideo {
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
          image {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          category,
          caption,
          alt,
          "createdAt": _createdAt,
          order,
          isFeatured
        }`
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        
        const transformedItems: GalleryMediaItem[] = (data || []).map((item: any) => {
          const mediaType: MediaType =
            item.mediaType === "video" || item.galleryVideo?.videoFile?.asset?.url || item.galleryVideo?.videoUrl
              ? "video"
              : "image"

          const category = (item.category || "training") as Exclude<GalleryCategory, "all">

          const legacyImage = item.image?.asset ? item.image : null
          const galleryImage = item.galleryImage?.asset ? item.galleryImage : null
          const imageSource = galleryImage || legacyImage

          const imageSrc = imageSource
            ? urlFor(imageSource).width(1200).height(800).quality(80).format("webp").url()
            : undefined

          const videoSrc: string | undefined =
            item.galleryVideo?.videoFile?.asset?.url || item.galleryVideo?.videoUrl || undefined

          const posterSrc: string | undefined = item.galleryVideo?.posterImage?.asset
            ? urlFor(item.galleryVideo.posterImage).width(1200).height(800).quality(80).format("webp").url()
            : imageSrc

          const titleText = item.title ? getLocalizedContent(item.title, language) : ""
          const captionText = item.caption ? getLocalizedContent(item.caption, language) : titleText
          const altText = item.alt ? getLocalizedContent(item.alt, language) : titleText || "Gallery media"

          return {
            _id: item._id,
            mediaType,
            category,
            title: titleText,
            caption: captionText || "",
            alt: altText,
            createdAt: item.createdAt,
            order: item.order || 0,
            isFeatured: item.isFeatured || false,
            imageSrc,
            videoSrc,
            posterSrc,
          }
        })
        
        setGalleryItems(transformedItems)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        setGalleryItems([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchGalleryMedia()
  }, [language])

  // Filter images based on active filter
  const filteredItems = React.useMemo(() => {
    if (activeFilter === "all") return galleryItems
    if (activeFilter === "video") {
      return galleryItems.filter((m) => m.category === "video" || m.mediaType === "video")
    }
    return galleryItems.filter((m) => m.category === activeFilter)
  }, [activeFilter, galleryItems])

  const scrollerItems = React.useMemo(() => {
    // Mixed list used for bottom auto-scroll section
    return galleryItems.filter((m) => {
      if (m.mediaType === "image") return Boolean(m.imageSrc)
      return Boolean(m.videoSrc) && Boolean(m.posterSrc || m.imageSrc)
    })
  }, [galleryItems])

  // Auto-scrolling strip measurement (bottom section)
  React.useEffect(() => {
    if (!scrollerSetRef.current) return
    if (scrollerItems.length === 0) return

    const el = scrollerSetRef.current

    const update = () => {
      const nextWidth = el.scrollWidth || el.getBoundingClientRect().width || 0
      setScrollerSetWidth(nextWidth)

      const isCoarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches
      const pxPerSec = isCoarse ? 18 : 30 // slower on mobile
      const duration = nextWidth > 0 ? nextWidth / pxPerSec : 50
      setScrollerDurationSec(Math.max(35, Math.min(140, duration)))
    }

    update()

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update())
      ro.observe(el)
    } else {
      window.addEventListener("resize", update)
    }

    return () => {
      if (ro) ro.disconnect()
      else window.removeEventListener("resize", update)
    }
  }, [scrollerItems.length])

  const filters: { key: GalleryCategory; label: string }[] = [
    { key: "all", label: t("filters.all") },
    { key: "training", label: t("filters.training") },
    { key: "match", label: t("filters.match") },
    { key: "event", label: t("filters.event") },
    { key: "video", label: t("filters.video") },
  ]

  // Get current image index for lightbox navigation
  const currentImageIndex = React.useMemo(() => {
    if (selectedMedia === null) return -1
    return filteredItems.findIndex((m) => m._id === selectedMedia)
  }, [selectedMedia, filteredItems])

  const nextImage = React.useCallback(() => {
    if (currentImageIndex < filteredItems.length - 1) {
      setSelectedMedia(filteredItems[currentImageIndex + 1]._id)
    } else {
      setSelectedMedia(filteredItems[0]._id)
    }
  }, [currentImageIndex, filteredItems])

  const prevImage = React.useCallback(() => {
    if (currentImageIndex > 0) {
      setSelectedMedia(filteredItems[currentImageIndex - 1]._id)
    } else {
      setSelectedMedia(filteredItems[filteredItems.length - 1]._id)
    }
  }, [currentImageIndex, filteredItems])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMedia === null) return
      if (e.key === "ArrowRight") {
        e.preventDefault()
        nextImage()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prevImage()
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setSelectedMedia(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedMedia, nextImage, prevImage])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && selectedMedia !== null) nextImage()
    if (isRightSwipe && selectedMedia !== null) prevImage()
  }


  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <main className="flex-1">
        {/* ================= HERO SECTION - Contact Page Style ================= */}
        <section className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[700px] overflow-hidden">
          {/* Stadium Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-center bg-fixed"
            style={{
              backgroundImage: "url('/images/about/ab1.jpg')",
            }}
          />

          {/* Dark Gradient Overlay - For Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 z-10" />
          
          {/* Additional Dark Gradient for Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-10" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 h-full flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px] py-16 sm:py-20 md:py-24">
            {/* CENTER HERO */}
            <div className="flex justify-center items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-20 w-full max-w-4xl mx-auto text-center flex flex-col items-center gap-6 sm:gap-8"
              >
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl w-full"
                >
                  {t("title")}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-lg sm:text-xl md:text-2xl text-white leading-relaxed max-w-2xl mx-auto drop-shadow-lg"
                >
                  {t("subtitle")}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= PREMIUM FILTER TABS - Pill Style ================= */}
        <section className="sticky top-0 z-40 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 relative">
              {filters.map((filter) => {
                const isActive = activeFilter === filter.key
                return (
                  <motion.button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
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
                    <span className="relative z-10">{filter.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================= RESPONSIVE MASONRY GALLERY ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0f172a] relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400">Loading gallery...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400">No media found.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFilter}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={staggerContainer}
                >
                  <Masonry
                    breakpointCols={{
                      default: 3,
                      1280: 3,
                      1024: 3,
                      768: 2,
                      640: 1,
                    }}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                  >
                    {filteredItems.map((item, index) => {
                    // Vary image heights for masonry effect - larger sizes
                    const heightVariations = [
                      "h-80 sm:h-96 md:h-[28rem]",
                      "h-96 sm:h-[28rem] md:h-[32rem]",
                      "h-72 sm:h-88 md:h-[26rem]",
                      "h-[28rem] sm:h-[30rem] md:h-[34rem]",
                      "h-[21rem] sm:h-[26rem] md:h-[30rem]",
                    ]
                    const heightClass = heightVariations[index % heightVariations.length]
                    
                    return (
                      <motion.div
                        key={item._id}
                        variants={fadeInUp}
                        whileHover={{ y: -8 }}
                        className="group relative mb-6 sm:mb-8"
                        style={{ breakInside: "avoid" }}
                      >
                        <SpotlightCard
                          className="h-full"
                          spotlightColor="rgba(59, 61, 172, 0.5)"
                          spotlightSize={350}
                          spotlightIntensity={0.7}
                        >
                          {/* Modern Card Container */}
                          <div
                            className={`relative ${heightClass} rounded-3xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl hover:shadow-[#3b3dac]/20 dark:hover:shadow-[#3b3dac]/30 border border-gray-200 dark:border-gray-700 transition-all duration-500 cursor-pointer`}
                            onClick={() => setSelectedMedia(item._id)}
                          >
                          {/* Border Glow on Hover */}
                          <div className="absolute -inset-0.5 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/30 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                          
                          {/* Outer Glow */}
                          <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

                          {/* Media */}
                          <div className="relative w-full h-full">
                            <motion.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {item.mediaType === "video" ? (
                                <VideoPreview
                                  videoSrc={item.videoSrc}
                                  posterSrc={item.posterSrc}
                                  alt={item.alt}
                                  className="transition-all duration-700 group-hover:brightness-110"
                                />
                              ) : item.imageSrc ? (
                                <Image
                                  src={item.imageSrc}
                                  alt={item.alt}
                                  fill
                                  className="object-cover transition-all duration-700 group-hover:brightness-110"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <p className="text-gray-400">No media</p>
                                </div>
                              )}
                              
                              {/* Dark Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content Overlay - Appears on Hover */}
                              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                                {/* Category Badge */}
                                <div className="mb-2">
                                  <span className="inline-block px-3 py-1 rounded-full bg-[#3b3dac] text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    {t(`categories.${item.category}`)}
                                  </span>
                                </div>
                                
                                {/* Caption */}
                                <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
                                  {item.caption}
                                </p>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                        </SpotlightCard>
                      </motion.div>
                    )
                    })}
                  </Masonry>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* ================= AUTO-SCROLL MEDIA STRIP (BOTTOM) ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white dark:bg-[#0f172a] border-t border-gray-200/60 dark:border-gray-800">
          {/* Heading stays in the normal container */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                All Photos &amp; Videos
              </h2>
            </div>
          </div>

          {scrollerItems.length === 0 ? (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">No media found.</p>
              </div>
            </div>
          ) : (
            // Full-bleed marquee viewport (true 100vw, no container constraints)
            <div
              style={{
                width: "100vw",
                maxWidth: "100vw",
                position: "relative",
                left: "50%",
                right: "50%",
                marginLeft: "-50vw",
                marginRight: "-50vw",
              }}
            >
              <div className="overflow-x-hidden overflow-y-visible">
                {/* Keep swipe support, but hide scrollbars (auto-scroll is animation-based) */}
                <div className="overflow-x-auto overflow-y-visible overscroll-x-contain touch-pan-x scrollbar-hide">
                  <div
                    className="flex gap-6 w-max py-6 gallery-marquee-track hover:[animation-play-state:paused]"
                    style={
                      {
                        ["--gallery-marquee-width" as any]: `${scrollerSetWidth}px`,
                        ["--gallery-marquee-duration" as any]: `${scrollerDurationSec}s`,
                      } as React.CSSProperties
                    }
                  >
                    <div ref={scrollerSetRef} className="flex gap-6 w-max">
                      {scrollerItems.map((m, idx) => {
                        const thumb = m.mediaType === "video" ? (m.posterSrc || m.imageSrc) : m.imageSrc
                        if (!thumb) return null
                        return (
                          <button
                            key={`scroller-${m._id}-${idx}`}
                            className="relative w-[300px] sm:w-[420px] min-w-[300px] sm:min-w-[380px] max-w-[300px] sm:max-w-[480px] shrink-0 rounded-[20px] overflow-visible bg-white dark:bg-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] transition-shadow border border-gray-200 dark:border-gray-700"
                            onClick={() => {
                              setActiveFilter("all")
                              setSelectedMedia(m._id)
                            }}
                          >
                            <div className="relative w-full aspect-[16/9]">
                              <Image
                                src={thumb}
                                alt={m.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 300px, 420px"
                                loading="lazy"
                              />
                              {m.mediaType === "video" && (
                                <>
                                  <div className="absolute inset-0 bg-black/25" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow">
                                      <Play className="h-5 w-5 text-white ml-0.5" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>

                    {/* Duplicate set for seamless infinite loop */}
                    <div aria-hidden="true" className="flex gap-6 w-max">
                      {scrollerItems.map((m, idx) => {
                        const thumb = m.mediaType === "video" ? (m.posterSrc || m.imageSrc) : m.imageSrc
                        if (!thumb) return null
                        return (
                          <div
                            key={`scroller-dup-${m._id}-${idx}`}
                            className="relative w-[300px] sm:w-[420px] min-w-[300px] sm:min-w-[380px] max-w-[300px] sm:max-w-[480px] shrink-0 rounded-[20px] overflow-visible bg-white dark:bg-gray-800 shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-200 dark:border-gray-700"
                          >
                            <div className="relative w-full aspect-[16/9]">
                              <Image
                                src={thumb}
                                alt={m.alt}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 300px, 420px"
                                loading="lazy"
                              />
                              {m.mediaType === "video" && (
                                <>
                                  <div className="absolute inset-0 bg-black/25" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-full bg-black/55 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow">
                                      <Play className="h-5 w-5 text-white ml-0.5" />
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <style jsx global>{`
                  @keyframes galleryMarqueeLtr {
                    from {
                      transform: translateX(calc(-1 * var(--gallery-marquee-width, 0px)));
                    }
                    to {
                      transform: translateX(0);
                    }
                  }
                  .gallery-marquee-track {
                    will-change: transform;
                    animation: galleryMarqueeLtr var(--gallery-marquee-duration, 50s) linear infinite;
                  }
                `}</style>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* ================= UPGRADED LIGHTBOX MODAL ================= */}
      <Dialog open={selectedMedia !== null} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent
          className="max-w-7xl w-full p-0 bg-transparent border-none shadow-none"
          showCloseButton={false}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">
            {selectedMedia !== null
              ? filteredItems.find((m) => m._id === selectedMedia)?.alt || "Gallery Media"
              : "Gallery Media Viewer"
            }
          </DialogTitle>
          <AnimatePresence mode="wait">
            {selectedMedia !== null && (
              <motion.div
                key={selectedMedia}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.4
                }}
                className="relative"
              >
                {/* Background Blur */}
                <motion.div
                  className="fixed inset-0 bg-black/60 backdrop-blur-xl -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                {/* Close Button */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-50 bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white min-h-[44px] min-w-[44px] rounded-full border border-gray-200 hover:border-[#3b3dac] transition-all duration-300 shadow-xl"
                    onClick={() => setSelectedMedia(null)}
                    aria-label="Close media"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </motion.div>

                {/* Navigation Buttons */}
                {filteredItems.length > 1 && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white min-h-[44px] min-w-[44px] rounded-full border border-gray-200 hover:border-[#3b3dac] transition-all duration-300 shadow-xl"
                        onClick={prevImage}
                        aria-label="Previous media"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white min-h-[44px] min-w-[44px] rounded-full border border-gray-200 hover:border-[#3b3dac] transition-all duration-300 shadow-xl"
                        onClick={nextImage}
                        aria-label="Next media"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </motion.div>
                  </>
                )}

                {/* Media Container */}
                <motion.div
                  className="relative w-full h-[85vh] max-h-[900px] rounded-2xl overflow-hidden border border-gray-200/50 shadow-2xl bg-white/10 backdrop-blur-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.1
                  }}
                >
                  {filteredItems[currentImageIndex] ? (
                    filteredItems[currentImageIndex].mediaType === "video" ? (
                      <video
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain bg-black"
                        poster={filteredItems[currentImageIndex].posterSrc}
                      >
                        <source src={filteredItems[currentImageIndex].videoSrc} />
                      </video>
                    ) : filteredItems[currentImageIndex].imageSrc ? (
                      <Image
                        src={filteredItems[currentImageIndex].imageSrc as string}
                        alt={filteredItems[currentImageIndex].alt || ""}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <p className="text-gray-400">No media</p>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-400">No media</p>
                    </div>
                  )}
                  
                  {/* Light Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3b3dac]/10 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Caption */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-4 left-4 right-4 text-center z-10"
                >
                  <p className="text-white font-semibold text-lg bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl inline-block border border-gray-200/50 shadow-xl text-gray-900">
                    {filteredItems[currentImageIndex]?.caption || ""}
                  </p>
                </motion.div>

                {/* Counter */}
                {filteredItems.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <p className="text-gray-900 text-sm bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-200/50 font-semibold shadow-lg">
                      {currentImageIndex + 1} / {filteredItems.length}
                    </p>
                  </motion.div>
                )}

                {/* Thumbnail Preview Strip */}
                {filteredItems.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-4xl overflow-x-auto px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-xl"
                  >
                    {filteredItems.map((m, idx) => {
                      const thumb = m.mediaType === "video" ? (m.posterSrc || m.imageSrc) : m.imageSrc
                      if (!thumb) return null
                      return (
                      <motion.button
                        key={m._id}
                        onClick={() => setSelectedMedia(m._id)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          idx === currentImageIndex
                            ? "border-[#3b3dac] scale-110 shadow-lg shadow-[#3b3dac]/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={thumb}
                          alt={m.alt}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {m.mediaType === "video" && (
                          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                        )}
                        {idx === currentImageIndex && (
                          <motion.div
                            className="absolute inset-0 border-2 border-[#3b3dac] rounded-lg"
                            layoutId="activeThumbnail"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
