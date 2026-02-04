"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Masonry from "react-masonry-css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, useTranslations } from "@/contexts/language-context"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SpotlightCard } from "@/components/spotlight-card"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent } from "@/lib/sanity-locale"

type GalleryCategory = "all" | "training" | "match" | "event"

interface GalleryImage {
  _id: string
  src: string
  alt: string
  category: GalleryCategory
  caption: string
  order?: number
  isFeatured?: boolean
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
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)
  const [galleryImages, setGalleryImages] = React.useState<GalleryImage[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch gallery images from Sanity
  React.useEffect(() => {
    async function fetchGalleryImages() {
      try {
        setLoading(true)
        const query = `*[_type == "gallery"] | order(order asc) {
          _id,
          title,
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
          order,
          isFeatured
        }`
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        
        // Transform Sanity data to GalleryImage format
        const transformedImages: GalleryImage[] = (data || []).map((item: any) => {
          // Use urlFor to generate optimized image URL
          const imageUrl = item.image?.asset ? urlFor(item.image).url() : ""
          
          return {
            _id: item._id,
            src: imageUrl,
            alt: item.alt 
              ? getLocalizedContent(item.alt, language)
              : (item.title ? getLocalizedContent(item.title, language) : "Gallery image"),
            category: (item.category || "training") as GalleryCategory,
            caption: item.caption 
              ? getLocalizedContent(item.caption, language)
              : (item.title ? getLocalizedContent(item.title, language) : ""),
            order: item.order || 0,
            isFeatured: item.isFeatured || false,
          }
        })
        
        setGalleryImages(transformedImages)
      } catch (error) {
        console.error("Error fetching gallery images:", error)
        setGalleryImages([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchGalleryImages()
  }, [language])

  // Filter images based on active filter
  const filteredImages = React.useMemo(() => {
    if (activeFilter === "all") return galleryImages
    return galleryImages.filter(img => img.category === activeFilter)
  }, [activeFilter, galleryImages])

  const filters: { key: GalleryCategory; label: string }[] = [
    { key: "all", label: t("filters.all") },
    { key: "training", label: t("filters.training") },
    { key: "match", label: t("filters.match") },
    { key: "event", label: t("filters.event") },
  ]

  // Get current image index for lightbox navigation
  const currentImageIndex = React.useMemo(() => {
    if (selectedImage === null) return -1
    return filteredImages.findIndex(img => img._id === selectedImage)
  }, [selectedImage, filteredImages])

  const nextImage = React.useCallback(() => {
    if (currentImageIndex < filteredImages.length - 1) {
      setSelectedImage(filteredImages[currentImageIndex + 1]._id)
    } else {
      setSelectedImage(filteredImages[0]._id)
    }
  }, [currentImageIndex, filteredImages])

  const prevImage = React.useCallback(() => {
    if (currentImageIndex > 0) {
      setSelectedImage(filteredImages[currentImageIndex - 1]._id)
    } else {
      setSelectedImage(filteredImages[filteredImages.length - 1]._id)
    }
  }, [currentImageIndex, filteredImages])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
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
        setSelectedImage(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage, nextImage, prevImage])

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

    if (isLeftSwipe && selectedImage !== null) nextImage()
    if (isRightSwipe && selectedImage !== null) prevImage()
  }


  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Navigation />
      
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
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600 dark:text-gray-400">No images found.</p>
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
                    {filteredImages.map((image, index) => {
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
                        key={image._id}
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
                            onClick={() => setSelectedImage(image._id)}
                          >
                          {/* Border Glow on Hover */}
                          <div className="absolute -inset-0.5 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/30 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
                          
                          {/* Outer Glow */}
                          <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

                          {/* Image */}
                          <div className="relative w-full h-full">
                            <motion.div
                              className="relative w-full h-full"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {image.src ? (
                                <Image
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  className="object-cover transition-all duration-700 group-hover:brightness-110"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                  loading="lazy"
                                  unoptimized={image.src.includes('cdn.sanity.io')}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <p className="text-gray-400">No image</p>
                                </div>
                              )}
                              
                              {/* Dark Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Content Overlay - Appears on Hover */}
                              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                                {/* Category Badge */}
                                <div className="mb-2">
                                  <span className="inline-block px-3 py-1 rounded-full bg-[#3b3dac] text-white text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    {t(`categories.${image.category}`)}
                                  </span>
                                </div>
                                
                                {/* Caption */}
                                <p className="text-white font-bold text-base sm:text-lg drop-shadow-lg">
                                  {image.caption}
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

      </main>

      {/* ================= UPGRADED LIGHTBOX MODAL ================= */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent
          className="max-w-7xl w-full p-0 bg-transparent border-none shadow-none"
          showCloseButton={false}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">
            {selectedImage !== null 
              ? galleryImages.find(img => img._id === selectedImage)?.alt || "Gallery Image"
              : "Gallery Image Viewer"
            }
          </DialogTitle>
          <AnimatePresence mode="wait">
            {selectedImage !== null && (
              <motion.div
                key={selectedImage}
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
                    onClick={() => setSelectedImage(null)}
                    aria-label="Close image"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </motion.div>

                {/* Navigation Buttons */}
                {filteredImages.length > 1 && (
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
                        aria-label="Previous image"
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
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </motion.div>
                  </>
                )}

                {/* Image Container with Smooth Zoom */}
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
                  {filteredImages[currentImageIndex]?.src ? (
                    <Image
                      src={filteredImages[currentImageIndex].src}
                      alt={filteredImages[currentImageIndex].alt || ""}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <p className="text-gray-400">No image</p>
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
                    {filteredImages[currentImageIndex]?.caption || ""}
                  </p>
                </motion.div>

                {/* Image Counter */}
                {filteredImages.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute top-4 left-4 z-10"
                  >
                    <p className="text-gray-900 text-sm bg-white/95 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-200/50 font-semibold shadow-lg">
                      {currentImageIndex + 1} / {filteredImages.length}
                    </p>
                  </motion.div>
                )}

                {/* Thumbnail Preview Strip */}
                {filteredImages.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-4xl overflow-x-auto px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/50 shadow-xl"
                  >
                    {filteredImages.map((img, idx) => (
                      <motion.button
                        key={img._id}
                        onClick={() => setSelectedImage(img._id)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          idx === currentImageIndex
                            ? "border-[#3b3dac] scale-110 shadow-lg shadow-[#3b3dac]/30"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                        {idx === currentImageIndex && (
                          <motion.div
                            className="absolute inset-0 border-2 border-[#3b3dac] rounded-lg"
                            layoutId="activeThumbnail"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
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
