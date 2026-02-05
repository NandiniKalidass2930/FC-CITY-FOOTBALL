"use client"

import * as React from "react"
import { useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from "framer-motion"
import { Calendar, Clock, MapPin, Users, Trophy, Target, TrendingUp, Award, Quote, ArrowRight, ChevronLeft, ChevronRight, Zap, Activity, BarChart3, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useLanguage, useTranslations } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { PremiumImageCard } from "@/components/premium-image-card"
import { SpotlightCard } from "@/components/spotlight-card"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getLocalizedContent, getLocalizedText } from "@/lib/sanity-locale"

/* ---------------- Animation Variants ---------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
}

const fadeInDown = {
  hidden: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6 },
  },
}

const zoomIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

/* ---------------- Premium Glassmorphism Card Component ---------------- */
function PremiumCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative group rounded-3xl ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Soft Outer Glow - No Border */}
      <div className="absolute -inset-2 rounded-3xl bg-[#3b3dac]/8 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-600 ease-in-out" />
      
      {/* Background Glow Layer */}
      <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/4 blur-xl opacity-0 group-hover:opacity-25 transition-all duration-600 ease-in-out" />
      
      {/* Glassmorphism Card - Clean Edges */}
      <div className="relative z-10 rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-lg shadow-gray-200/30 group-hover:shadow-[0_24px_72px_rgba(59,61,172,0.08)] group-hover:brightness-[1.005] transition-all duration-500 ease-in-out">
        {/* Gradient Layer */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#3b3dac]/3 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------- 3D Tilt Image Card ---------------- */
function TiltImageCard({ image, caption, index }: { image: string; caption: string; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [isHovered, setIsHovered] = React.useState(false)
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -16, rotateX: 5, rotateY: 5 }}
      className="relative group cursor-pointer"
    >
      {/* Soft Outer Glow - No Border */}
      <div className="absolute -inset-3 rounded-2xl bg-[#3b3dac]/8 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-600 ease-in-out" />
      
      {/* Background Glow Layer */}
      <div className="absolute -inset-2 rounded-2xl bg-[#3b3dac]/5 blur-xl opacity-0 group-hover:opacity-30 transition-all duration-600 ease-in-out" />
      
      {/* Expanding Blue Shadow */}
      <div className="absolute -inset-4 rounded-2xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-3xl transition-all duration-500 ease-in-out" />
      
      <div className="relative rounded-2xl overflow-hidden shadow-lg group-hover:shadow-[0_24px_72px_rgba(59,61,172,0.12)] bg-white transition-all duration-500 ease-in-out">
        <SpotlightCard
          className="h-full w-full"
          spotlightColor="rgba(59, 61, 172, 0.5)"
          spotlightSize={350}
          spotlightIntensity={0.7}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
          {/* Strong Zoom Animation */}
          <motion.div
            animate={isHovered ? { 
              scale: [1, 1.2, 1.15],
            } : { scale: 1 }}
            transition={{ 
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className="h-full w-full"
          >
            <Image
              src={image}
              alt={caption}
              fill
              className="object-cover brightness-100 group-hover:brightness-110 transition-all duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>
          
          {/* Light Ripple Overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: "radial-gradient(circle, transparent 0%, rgba(59, 61, 172, 0.05) 50%, rgba(59, 61, 172, 0.1) 100%)",
            }}
            animate={isHovered ? {
              opacity: [0, 0.6, 0.3, 0],
              scale: [0.8, 1.2, 1.4],
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
          
          {/* Light Reflection Sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            animate={isHovered ? { x: "200%" } : { x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Caption */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10"
            initial={{ y: "100%" }}
            whileHover={{ y: 0 }}
          >
            <p className="text-white font-bold text-sm drop-shadow-lg">{caption}</p>
          </motion.div>
        </div>
        </SpotlightCard>
      </div>
    </motion.div>
  )
}

/* ---------------- Animated Background Elements ---------------- */
function AnimatedBackground() {
  const [shapes, setShapes] = React.useState<Array<{
    width: number
    height: number
    left: number
    top: number
    x: number
    y: number
    duration: number
  }>>([])

  React.useEffect(() => {
    // Generate random values only on client side to avoid hydration mismatch
    setShapes(
      Array.from({ length: 6 }, () => ({
        width: Math.random() * 200 + 100,
        height: Math.random() * 200 + 100,
        left: Math.random() * 100,
        top: Math.random() * 100,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        duration: Math.random() * 10 + 15,
      }))
    )
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Waves */}
      <motion.div
        className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#3b3dac]/5 to-transparent"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Animated Blue Shapes */}
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[#3b3dac]/10 to-blue-200/10 blur-2xl"
          style={{
            width: `${shape.width}px`,
            height: `${shape.height}px`,
            left: `${shape.left}%`,
            top: `${shape.top}%`,
          }}
          animate={{
            x: [0, shape.x, 0],
            y: [0, shape.y, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Glowing Waves */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#3b3dac]/10 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  )
}

/* ---------------- Carousel Component ---------------- */
function Carousel({ children, autoplay = true }: { children: React.ReactNode[]; autoplay?: boolean }) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    if (!autoplay || isPaused) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length)
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoplay, isPaused, children.length])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % children.length)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + children.length) % children.length)
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>

      {children.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-white transition-all border border-gray-200 hover:border-[#3b3dac]"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg hover:bg-white transition-all border border-gray-200 hover:border-[#3b3dac]"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center z-10">
            {children.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`mx-0.5 md:mx-1 h-1.5 w-1.5 md:h-2 md:w-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-[#3b3dac] w-6 md:w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ---------------- Counter Component ---------------- */
function Counter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = React.useState(0)
  const ref = React.useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (!isInView) return

    let start: number | null = null

    const animate = (time: number) => {
      if (!start) start = time

      const progress = Math.min((time - start) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))

      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

interface TrainingPageData {
  heroTitle?: { en?: string; de?: string } | string
  heroSubtitle?: { en?: string; de?: string } | string
  heroDescription?: { en?: string; de?: string } | string
  heroImage?: any
  heroButton1Text?: { en?: string; de?: string } | string
  heroButton1Link?: string
  heroButton2Text?: { en?: string; de?: string } | string
  heroButton2Link?: string
  highlights?: Array<{
    image?: any
    caption?: { en?: string; de?: string } | string
    order?: number
  }>
  overview?: {
    image?: any
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    buttonText?: { en?: string; de?: string } | string
    buttonLink?: string
  }
  indoorSessions?: Array<{
    day?: { en?: string; de?: string } | string
    time?: string
    location?: { en?: string; de?: string } | string
    address?: { en?: string; de?: string } | string
    order?: number
  }>
  outdoorSessions?: Array<{
    day?: { en?: string; de?: string } | string
    time?: string
    location?: { en?: string; de?: string } | string
    address?: { en?: string; de?: string } | string
    order?: number
  }>
  facilities?: Array<{
    image?: any
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    order?: number
  }>
  statistics?: Array<{
    iconType?: string
    label?: { en?: string; de?: string } | string
    value?: number
    suffix?: string
    order?: number
  }>
  roadmap?: {
    title?: { en?: string; de?: string } | string
    subtitle?: { en?: string; de?: string } | string
    phases?: Array<{
      iconType?: string
      title?: { en?: string; de?: string } | string
      description?: { en?: string; de?: string } | string
      order?: number
    }>
  }
  weeklyGallery?: Array<{
    image?: any
    caption?: { en?: string; de?: string } | string
    order?: number
  }>
  testimonials?: Array<{
    name?: { en?: string; de?: string } | string
    role?: { en?: string; de?: string } | string
    quote?: { en?: string; de?: string } | string
    image?: any
    order?: number
  }>
  cta?: {
    title?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    button1Text?: { en?: string; de?: string } | string
    button1Link?: string
    button2Text?: { en?: string; de?: string } | string
    button2Link?: string
  }
  trainers?: Array<{
    _id: string
    name?: { en?: string; de?: string } | string
    role?: { en?: string; de?: string } | string
    description?: { en?: string; de?: string } | string
    image?: any
    order?: number
  }>
}

export default function TrainingPage() {
  const { getMessages, getHref, language } = useLanguage()
  const { t } = useTranslations("training")
  const [trainingData, setTrainingData] = useState<TrainingPageData | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch training page data from Sanity
  useEffect(() => {
    async function fetchTrainingData() {
      try {
        setLoading(true)
        const query = `*[_type == "trainingPage"][0] {
          heroTitle,
          heroSubtitle,
          heroDescription,
          heroImage {
            asset-> {
              _id,
              _type,
              url
            },
            hotspot,
            crop
          },
          heroButton1Text,
          heroButton1Link,
          heroButton2Text,
          heroButton2Link,
          highlights[] | order(order asc) {
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            caption,
            order
          },
          overview {
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
          indoorSessions[] | order(order asc) {
            day,
            time,
            location,
            address,
            order
          },
          outdoorSessions[] | order(order asc) {
            day,
            time,
            location,
            address,
            order
          },
          facilities[] | order(order asc) {
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
            order
          },
          statistics[] | order(order asc) {
            iconType,
            label,
            value,
            suffix,
            order
          },
          roadmap {
            title,
            subtitle,
            phases[] | order(order asc) {
              iconType,
              title,
              description,
              order
            }
          },
          weeklyGallery[] | order(order asc) {
            image {
              asset-> {
                _id,
                _type,
                url
              },
              hotspot,
              crop
            },
            caption,
            order
          },
          testimonials[] | order(order asc) {
            name,
            role,
            quote,
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
          },
          cta {
            title,
            description,
            button1Text,
            button1Link,
            button2Text,
            button2Link
          },
          trainers[]-> | order(order asc) {
            _id,
            _type,
            name,
            role,
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
          }[!(_type == null)]
        }`
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        
        // Debug logging
        console.log("✅ Training page data fetched:", data)
        console.log("✅ Trainers array:", data?.trainers)
        console.log("✅ Number of trainers:", data?.trainers?.length || 0)
        if (data?.trainers && data.trainers.length > 0) {
          console.log("✅ First trainer sample:", data.trainers[0])
        } else {
          console.warn("⚠️ No trainers found. Check if trainers are published and referenced in Training Page.")
        }
        
        setTrainingData(data || null)
      } catch (error) {
        console.error("Error fetching training data:", error)
        setTrainingData(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrainingData()
  }, [language])

  // Get training sessions from translations (fallback)
  const trainingMessages = getMessages("training")
  const indoorSessions = trainingData?.indoorSessions && trainingData.indoorSessions.length > 0
    ? trainingData.indoorSessions
    : (trainingMessages?.indoor?.sessions || [])
  const outdoorSessions = trainingData?.outdoorSessions && trainingData.outdoorSessions.length > 0
    ? trainingData.outdoorSessions
    : (trainingMessages?.outdoor?.sessions || [])

  // Trainers from Sanity
  const trainers = useMemo(() => {
    console.log("🔄 Processing trainers, trainingData:", trainingData)
    
    // Get current language, default to "en"
    const lang = language || "en"
    
    if (trainingData?.trainers && Array.isArray(trainingData.trainers) && trainingData.trainers.length > 0) {
      // Filter out null/undefined references and map to display format
      const validTrainers = trainingData.trainers
        .filter((trainer: any) => trainer && trainer._id && trainer._type === "trainer")
        .map((trainer: any) => {
          // Access multilingual fields directly with safe optional chaining
          const trainerName = trainer?.name?.[lang] || trainer?.name?.en || "Trainer"
          const trainerRole = trainer?.role?.[lang] || trainer?.role?.en || ""
          const trainerDescription = trainer?.description?.[lang] || trainer?.description?.en || ""
          
          // Get image URL using urlFor, with fallback
          let imageUrl = "/images/training/coach4.jpg"
          if (trainer?.image?.asset) {
            try {
              imageUrl = urlFor(trainer.image).url()
            } catch (error) {
              console.warn("⚠️ Error generating image URL:", error)
              imageUrl = "/images/training/coach4.jpg"
            }
          }
          
          const processedTrainer = {
            name: trainerName,
            role: trainerRole,
            description: trainerDescription,
            image: imageUrl,
          }
          console.log("✅ Processed trainer:", processedTrainer)
          return processedTrainer
        })
      
      console.log("✅ Valid trainers count:", validTrainers.length)
      return validTrainers
    }
    
    console.warn("⚠️ No trainers found in trainingData")
    // Fallback: return empty array if no trainers from Sanity
    return []
  }, [trainingData, language])

  // Training highlights from Sanity
  const trainingHighlights = useMemo(() => {
    if (trainingData?.highlights && trainingData.highlights.length > 0) {
      return trainingData.highlights.map((item) => ({
        src: item.image?.asset ? urlFor(item.image).url() : "",
        caption: item.caption ? getLocalizedContent(item.caption, language) : "",
      }))
    }
    // Fallback to translations
    const highlightsData = trainingMessages?.highlights?.items || []
    const images = [
      "/images/training/train6.jpg",
      "/images/training/train9.jpg",
      "/images/training/train8.jpg",
    ]
    return highlightsData.map((item: any, index: number) => ({
      src: images[index] || "/images/training/train6.jpg",
      caption: item.caption || "",
    }))
  }, [trainingData, trainingMessages, language])

  // Facilities from Sanity
  const facilities = useMemo(() => {
    if (trainingData?.facilities && trainingData.facilities.length > 0) {
      return trainingData.facilities.map((facility) => ({
        src: facility.image?.asset ? urlFor(facility.image).url() : "",
        title: facility.title ? getLocalizedContent(facility.title, language) : "",
        description: facility.description ? getLocalizedContent(facility.description, language) : "",
      }))
    }
    // Fallback to translations
    const facilitiesMessages = trainingMessages?.facilities
    return [
      { src: "/images/training/f3.jpg", title: facilitiesMessages?.items?.[0]?.title || "Indoor Training Hall", description: facilitiesMessages?.items?.[0]?.description || "State-of-the-art indoor facility" },
      { src: "/images/training/f2.jpg", title: facilitiesMessages?.items?.[1]?.title || "Outdoor Pitch", description: facilitiesMessages?.items?.[1]?.description || "Professional grass field" },
      { src: "/images/training/f1.jpg", title: facilitiesMessages?.items?.[2]?.title || "Fitness Center", description: facilitiesMessages?.items?.[2]?.description || "Modern gym equipment" },
    ]
  }, [trainingData, trainingMessages, language])

  // Weekly gallery from Sanity
  const weeklyGallery = useMemo(() => {
    if (trainingData?.weeklyGallery && trainingData.weeklyGallery.length > 0) {
      return trainingData.weeklyGallery.map((item) => ({
        src: item.image?.asset ? urlFor(item.image).url() : "",
        caption: item.caption ? getLocalizedContent(item.caption, language) : "",
      }))
    }
    // Fallback to translations
    return [
      { src: "/images/training/train5.jpg", caption: trainingMessages?.gallery?.items?.[0]?.caption || "Monday Training" },
      { src: "/images/training/f5.jpg", caption: trainingMessages?.gallery?.items?.[1]?.caption || "Wednesday Session" },
      { src: "/images/training/train2.jpg", caption: trainingMessages?.gallery?.items?.[2]?.caption || "Friday Practice" },
      { src: "/images/training/train1.jpg", caption: trainingMessages?.gallery?.items?.[3]?.caption || "Weekend Match Prep" },
    ]
  }, [trainingData, trainingMessages, language])

  // Testimonials from Sanity
  const testimonials = useMemo(() => {
    if (trainingData?.testimonials && trainingData.testimonials.length > 0) {
      return trainingData.testimonials.map((testimonial) => ({
        name: testimonial.name ? getLocalizedContent(testimonial.name, language) : "",
        role: testimonial.role ? getLocalizedContent(testimonial.role, language) : "",
        quote: testimonial.quote ? getLocalizedContent(testimonial.quote, language) : "",
        image: testimonial.image?.asset ? urlFor(testimonial.image).url() : "",
      }))
    }
    // Fallback to translations
    const testimonialsData = trainingMessages?.testimonials?.items || []
    return testimonialsData.map((testimonial: any, index: number) => ({
      name: testimonial.name,
      role: testimonial.role,
      quote: testimonial.quote,
      image: ["/images/home1.jpg", "/images/home2.jpg", "/images/ball.jpg"][index] || "/images/home1.jpg",
    }))
  }, [trainingData, trainingMessages, language])

  // Icon mapping for statistics
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    Trophy,
    TrendingUp,
    Award,
  }

  // Icon mapping for roadmap
  const roadmapIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Target,
    Activity,
    BarChart3,
    GraduationCap,
  }


  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <main className="flex-1">
        {/* ================= CINEMATIC HERO SECTION ================= */}
        <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#3b3dac] via-blue-600 to-[#3b3dac]">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20" />
          
          {/* Light Gradient Orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* LEFT SIDE - Content */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-6 sm:space-y-8 mt-4 lg:mt-6"
            >
              <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-white"
              >
                {trainingData?.heroTitle ? getLocalizedContent(trainingData.heroTitle, language) : t("title")}
              </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed font-medium"
                >
                  {trainingData?.heroSubtitle ? getLocalizedContent(trainingData.heroSubtitle, language) : t("subtitle")}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="text-base sm:text-lg text-white/80 leading-relaxed"
                >
                  {trainingData?.heroDescription ? getLocalizedText(trainingData.heroDescription, language) : t("description")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                >
                  <Link href={trainingData?.heroButton1Link ? getHref(trainingData.heroButton1Link) : getHref("/contact")}>
                    <Button
                      size="lg"
                      className="bg-white text-[#3b3dac] hover:bg-gray-100 shadow-xl px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {trainingData?.heroButton1Text ? getLocalizedContent(trainingData.heroButton1Text, language) : t("hero.joinTraining")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={trainingData?.heroButton2Link ? getHref(trainingData.heroButton2Link) : getHref("/our-team")}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-xl px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {trainingData?.heroButton2Text ? getLocalizedContent(trainingData.heroButton2Text, language) : t("hero.meetCoaches")}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* RIGHT SIDE - Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <SpotlightCard
                  className="h-full w-full"
                  spotlightColor="rgba(59, 61, 172, 0.5)"
                  spotlightSize={400}
                  spotlightIntensity={0.7}
                >
                  <PremiumImageCard
                    src={trainingData?.heroImage?.asset ? urlFor(trainingData.heroImage).url() : "/images/training/train1.jpg"}
                    alt={trainingData?.heroTitle ? getLocalizedContent(trainingData.heroTitle, language) : t("hero.imageAlt")}
                    height="h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    rounded="rounded-3xl"
                    priority
                  />
                </SpotlightCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= TRAINING HIGHLIGHTS CAROUSEL ================= */}
        <section className="py-20 sm:py-24 md:py-28 lg:py-32 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("highlights.title")}
                </span>
              </h2>
            </motion.div>

            <div className="max-w-[700px] sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] mx-auto">
              <Carousel autoplay={true}>
                {trainingHighlights.map((item: any, index: number) => (
                  <motion.div 
                    key={index} 
                    className="relative h-[400px] sm:h-[450px] md:h-[550px] lg:h-[650px] w-full rounded-2xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                  {/* Soft Outer Glow */}
                  <div className="absolute -inset-3 rounded-2xl bg-[#3b3dac]/8 blur-2xl opacity-0 group-hover:opacity-40 transition-all duration-600 ease-in-out" />
                  
                  {/* Expanding Shadow */}
                  <div className="absolute -inset-4 rounded-2xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-3xl transition-all duration-500 ease-in-out" />
                  
                  <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg group-hover:shadow-[0_24px_72px_rgba(59,61,172,0.12)] transition-all duration-500 ease-in-out bg-black/95">
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1.05],
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="h-full w-full relative"
                    >
                      {item.src ? (
                        <Image
                          src={item.src}
                          alt={item.caption}
                          fill
                          className="object-contain brightness-100 group-hover:brightness-110 transition-all duration-500"
                          sizes="(max-width: 768px) 100vw, 1000px"
                          priority={index === 0}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <p className="text-gray-400">No image</p>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 pointer-events-none">
                    <h3 className="text-white text-2xl font-black mb-2 drop-shadow-lg">{item.caption}</h3>
                  </div>
                  </motion.div>
                ))}
              </Carousel>
            </div>
          </div>
        </section>

        {/* ================= TRAINING OVERVIEW BANNER ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50/30 to-white relative">
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden border-2 border-gray-200/50 shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-0">
                <motion.div 
                  className="relative h-64 md:h-96 group overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Soft Outer Glow */}
                  <div className="absolute -inset-2 rounded-2xl bg-[#3b3dac]/8 blur-xl opacity-0 group-hover:opacity-40 transition-all duration-600 ease-in-out" />
                  
                  {/* Expanding Shadow */}
                  <div className="absolute -inset-4 rounded-2xl bg-[#3b3dac]/0 group-hover:bg-[#3b3dac]/20 blur-3xl transition-all duration-500 ease-in-out" />
                  
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1.05],
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    {trainingData?.overview?.image?.asset ? (
                      <Image
                        src={urlFor(trainingData.overview.image).url()}
                        alt={trainingData?.overview?.title ? getLocalizedContent(trainingData.overview.title, language) : t("overview.imageAlt")}
                        fill
                        className="object-cover brightness-100 group-hover:brightness-110 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <Image
                        src="/images/training/train2.jpg"
                        alt={t("overview.imageAlt")}
                        fill
                        className="object-cover brightness-100 group-hover:brightness-110 transition-all duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </motion.div>
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
                </motion.div>
                <div className="bg-gradient-to-br from-[#3b3dac] to-blue-600 p-8 md:p-12 flex flex-col justify-center text-white">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    {trainingData?.overview?.title ? getLocalizedContent(trainingData.overview.title, language) : t("overview.title")}
                  </h2>
                  <p className="text-lg text-white/90 leading-relaxed mb-6">
                    {trainingData?.overview?.description ? getLocalizedText(trainingData.overview.description, language) : t("overview.description")}
                  </p>
                  <Link href={trainingData?.overview?.buttonLink ? getHref(trainingData.overview.buttonLink) : getHref("/contact")}>
                    <Button className="bg-white text-[#3b3dac] hover:bg-gray-100 w-fit">
                      {trainingData?.overview?.buttonText ? getLocalizedContent(trainingData.overview.buttonText, language) : t("overview.button")} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= TRAINING CARDS SECTION (EXISTING) ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50/30 to-white relative">
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20">
              {/* Indoor Training Card */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <PremiumCard>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3b3dac]/20 to-[#3b3dac]/5 flex items-center justify-center border border-[#3b3dac]/30 group-hover:border-[#3b3dac]/60 transition-all duration-500">
                      <Calendar className="h-7 w-7 text-[#3b3dac] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        {t("indoor.title")}
                      </h2>
                      <p className="text-[#3b3dac] font-semibold text-sm mt-1">
                        {t("indoor.season")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {indoorSessions.map((session: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-[#3b3dac] flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 font-semibold">
                              {typeof session.day === "object" ? getLocalizedContent(session.day, language) : session.day}
                            </p>
                            <p className="text-gray-600 text-sm">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-[#3b3dac] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-800 font-medium">
                              {typeof session.location === "object" ? getLocalizedContent(session.location, language) : session.location}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {typeof session.address === "object" ? getLocalizedContent(session.address, language) : session.address}
                            </p>
                          </div>
                        </div>
                        {index < indoorSessions.length - 1 && (
                          <div className="h-px bg-gradient-to-r from-transparent via-[#3b3dac]/30 to-transparent my-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>

              {/* Outdoor Training Card */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                <PremiumCard>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3b3dac]/20 to-[#3b3dac]/5 flex items-center justify-center border border-[#3b3dac]/30 group-hover:border-[#3b3dac]/60 transition-all duration-500">
                      <Calendar className="h-7 w-7 text-[#3b3dac] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                        {t("outdoor.title")}
                      </h2>
                      <p className="text-[#3b3dac] font-semibold text-sm mt-1">
                        {t("outdoor.season")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {outdoorSessions.map((session: any, index: number) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-[#3b3dac] flex-shrink-0" />
                          <div>
                            <p className="text-gray-900 font-semibold">
                              {typeof session.day === "object" ? getLocalizedContent(session.day, language) : session.day}
                            </p>
                            <p className="text-gray-600 text-sm">{session.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-[#3b3dac] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-800 font-medium">
                              {typeof session.location === "object" ? getLocalizedContent(session.location, language) : session.location}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {typeof session.address === "object" ? getLocalizedContent(session.address, language) : session.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </motion.div>
            </div>

            {/* Trainers Section */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-center mb-12 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("trainers.title")}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                {trainers && trainers.length > 0 ? trainers.map((trainer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -12, scale: 1.05 }}
                    className="relative group"
                  >
                    {/* Outer Glow Effect */}
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#3b3dac]/20 via-blue-500/20 to-[#3b3dac]/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 ease-in-out" />
                    
                    {/* Premium Card with Glassmorphism */}
                    <div className="relative h-full min-h-[420px] sm:min-h-[450px] md:min-h-[480px] rounded-3xl bg-gradient-to-br from-white/95 via-white/90 to-gray-50/80 backdrop-blur-xl border border-white/50 shadow-lg shadow-gray-200/50 group-hover:shadow-2xl group-hover:shadow-[#3b3dac]/20 transition-all duration-500 ease-in-out overflow-hidden">
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#3b3dac]/0 via-blue-500/0 to-[#3b3dac]/0 group-hover:from-[#3b3dac]/5 group-hover:via-blue-500/5 group-hover:to-[#3b3dac]/5 transition-all duration-500" />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Coach Image - Larger, More Prominent */}
                        <motion.div 
                          className="relative w-full h-[240px] sm:h-[260px] md:h-[280px] overflow-hidden group/image"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                          {/* Image Glow */}
                          <div className="absolute -inset-2 bg-gradient-to-br from-[#3b3dac]/30 via-blue-500/30 to-[#3b3dac]/30 opacity-0 group-hover/image:opacity-100 blur-lg transition-all duration-500 ease-in-out" />
                          
                          {/* Image Shadow */}
                          <div className="absolute -inset-3 bg-[#3b3dac]/0 group-hover/image:bg-[#3b3dac]/20 blur-2xl transition-all duration-500 ease-in-out" />
                          
                          <motion.div
                            animate={{
                              scale: [1, 1.03, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full w-full relative overflow-hidden"
                          >
                            <Image
                              src={trainer?.image || "/images/training/coach4.jpg"}
                              alt={trainer?.name || "Trainer"}
                              fill
                              className="object-cover brightness-100 group-hover/image:brightness-110 transition-all duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              unoptimized={true}
                            />
                          </motion.div>
                          
                          {/* Gradient Overlay on Image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                        
                        {/* Text Content Section */}
                        <div className="flex-1 flex flex-col p-4 sm:p-5 md:p-6">
                          {/* Coach Name */}
                          <h3 className="text-xl sm:text-2xl md:text-2xl font-black text-gray-900 mb-2 group-hover:text-[#3b3dac] transition-colors duration-300 text-center">
                            {trainer?.name || "Trainer"}
                          </h3>
                          
                          {/* Role/Title */}
                          <div className="mb-3 text-center">
                            <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#3b3dac]/10 to-blue-500/10 border border-[#3b3dac]/20 text-[#3b3dac] font-bold text-xs sm:text-sm group-hover:from-[#3b3dac]/20 group-hover:to-blue-500/20 group-hover:border-[#3b3dac]/40 transition-all duration-300">
                              {trainer?.role || ""}
                            </span>
                          </div>
                          
                          {/* Description Section */}
                          <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed text-center px-1">
                              {trainer?.description || t("trainers.trainerDescription")}
                            </p>
                          </div>
                          
                          {/* Decorative Bottom Accent */}
                          <div className="mt-4 pt-4 border-t border-gray-200/50 group-hover:border-[#3b3dac]/30 transition-colors duration-300">
                            <div className="flex justify-center items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#3b3dac]/40 group-hover:bg-[#3b3dac] transition-colors duration-300" />
                              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-[#3b3dac]/40 to-transparent group-hover:via-[#3b3dac] transition-all duration-300" />
                              <div className="w-2 h-2 rounded-full bg-[#3b3dac]/40 group-hover:bg-[#3b3dac] transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500">No trainers available</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= FACILITIES SHOWCASE ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("facilities.title")}
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {t("facilities.subtitle")}
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 sm:gap-8"
            >
              {facilities.map((facility, index) => (
                <motion.div key={index} variants={zoomIn}>
                  <TiltImageCard
                    image={facility.src}
                    caption={facility.title}
                    index={index}
                  />
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-black text-gray-900 mb-2">{facility.title}</h3>
                    <p className="text-gray-600 text-sm">{facility.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= PERFORMANCE STATISTICS ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-blue-50/20 to-white relative">
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("statistics.title")}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {(trainingData?.statistics && trainingData.statistics.length > 0
                ? trainingData.statistics.map((stat, index) => {
                    const Icon = stat.iconType ? iconMap[stat.iconType] : Users
                    const label = stat.label 
                      ? getLocalizedContent(stat.label, language)
                      : (trainingMessages?.statistics?.items?.[index]?.label || "Stat")
                    
                    return (
                      <motion.div key={index} variants={fadeInUp}>
                        <PremiumCard>
                          <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center shadow-lg shadow-[#3b3dac]/30">
                              {Icon && <Icon className="h-8 w-8 text-white" />}
                            </div>
                            <div className="text-4xl sm:text-5xl font-black text-[#3b3dac] mb-2">
                              <Counter end={stat.value || 0} suffix={stat.suffix || ""} />
                            </div>
                            <p className="text-gray-700 font-semibold">{label}</p>
                          </div>
                        </PremiumCard>
                      </motion.div>
                    )
                  })
                : [
                    { icon: Users, label: trainingMessages?.statistics?.items?.[0]?.label || "Active Players", value: 150, suffix: "+" },
                    { icon: Trophy, label: trainingMessages?.statistics?.items?.[1]?.label || "Training Sessions", value: 500, suffix: "+" },
                    { icon: TrendingUp, label: trainingMessages?.statistics?.items?.[2]?.label || "Improvement Rate", value: 85, suffix: "%" },
                    { icon: Award, label: trainingMessages?.statistics?.items?.[3]?.label || "Certified Coaches", value: 12, suffix: "+" },
                  ].map((stat, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <PremiumCard>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center shadow-lg shadow-[#3b3dac]/30">
                            <stat.icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-4xl sm:text-5xl font-black text-[#3b3dac] mb-2">
                            <Counter end={stat.value} suffix={stat.suffix} />
                          </div>
                          <p className="text-gray-700 font-semibold">{stat.label}</p>
                        </div>
                      </PremiumCard>
                    </motion.div>
                  ))
              )}
            </motion.div>
          </div>
        </section>

        {/* ================= PLAYER DEVELOPMENT ROADMAP ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {trainingData?.roadmap?.title ? getLocalizedContent(trainingData.roadmap.title, language) : t("roadmap.title")}
                </span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {trainingData?.roadmap?.subtitle ? getLocalizedContent(trainingData.roadmap.subtitle, language) : t("roadmap.subtitle")}
              </p>
            </motion.div>

                <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto space-y-6"
            >
              {(trainingData?.roadmap?.phases && trainingData.roadmap.phases.length > 0
                ? trainingData.roadmap.phases.map((phase, index) => {
                    const Icon = phase.iconType ? roadmapIconMap[phase.iconType] : Target
                    return (
                      <motion.div key={index} variants={slideInLeft}>
                        <PremiumCard>
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3b3dac]/30">
                              {Icon && <Icon className="h-8 w-8 text-white" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-black text-gray-900 mb-2">
                                {phase.title ? getLocalizedContent(phase.title, language) : ""}
                              </h3>
                              <p className="text-gray-600 leading-relaxed">
                                {phase.description ? getLocalizedText(phase.description, language) : ""}
                              </p>
                            </div>
                            <div className="text-3xl font-black text-[#3b3dac]/20">{String(index + 1).padStart(2, "0")}</div>
                          </div>
                        </PremiumCard>
                      </motion.div>
                    )
                  })
                : (trainingMessages?.roadmap?.phases || []).map((phase: any, index: number) => {
                    const icons = [Target, Activity, BarChart3, GraduationCap]
                    const Icon = icons[index] || Target
                    return (
                      <motion.div key={index} variants={slideInLeft}>
                        <PremiumCard>
                          <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3b3dac] to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3b3dac]/30">
                              <Icon className="h-8 w-8 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-2xl font-black text-gray-900 mb-2">{phase.title}</h3>
                              <p className="text-gray-600 leading-relaxed">{phase.description}</p>
                            </div>
                            <div className="text-3xl font-black text-[#3b3dac]/20">{String(index + 1).padStart(2, "0")}</div>
                          </div>
                        </PremiumCard>
                      </motion.div>
                    )
                  })
              )}
            </motion.div>
          </div>
        </section>

        {/* ================= WEEKLY TRAINING GALLERY ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50/30 to-white relative">
          <AnimatedBackground />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("gallery.title")}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
            >
              {weeklyGallery.map((item, index) => (
                item.src ? (
                  <TiltImageCard
                    key={index}
                    image={item.src}
                    caption={item.caption}
                    index={index}
                  />
                ) : null
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#3b3dac] to-gray-900 bg-clip-text text-transparent">
                  {t("testimonials.title")}
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-6 sm:gap-8"
            >
              {testimonials.map((testimonial: any, index: number) => (
                <motion.div key={index} variants={zoomIn}>
                  <PremiumCard>
                    <Quote className="h-12 w-12 text-[#3b3dac] mb-4 opacity-50" />
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="relative w-12 h-12 rounded-full overflow-hidden group"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        {/* Soft Outer Glow */}
                        <div className="absolute -inset-1 rounded-full bg-[#3b3dac]/8 blur-lg opacity-0 group-hover:opacity-30 transition-all duration-500 ease-in-out" />
                        
                        {testimonial.image ? (
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1.02],
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="h-full w-full"
                          >
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover brightness-100 group-hover:brightness-110 transition-all duration-500 rounded-full shadow-sm group-hover:shadow-md"
                            />
                          </motion.div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </motion.div>
                      <div>
                        <h4 className="font-black text-gray-900">{testimonial.name}</h4>
                        <p className="text-[#3b3dac] font-semibold text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </PremiumCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ================= JOIN TRAINING CTA ================= */}
        <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
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

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <motion.div
                variants={zoomIn}
                className="inline-block mb-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Zap className="h-10 w-10 text-white" />
              </div>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
                {trainingData?.cta?.title ? getLocalizedContent(trainingData.cta.title, language) : t("cta.title")}
              </h2>
              <p className="text-white/90 text-xl sm:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
                {trainingData?.cta?.description ? getLocalizedText(trainingData.cta.description, language) : t("cta.description")}
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.div variants={slideInLeft}>
                  <Link href={trainingData?.cta?.button1Link ? getHref(trainingData.cta.button1Link) : getHref("/contact")}>
                    <Button
                      size="lg"
                      className="bg-white text-[#3b3dac] hover:bg-gray-100 shadow-xl px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {trainingData?.cta?.button1Text ? getLocalizedContent(trainingData.cta.button1Text, language) : t("cta.joinTraining")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
                <motion.div variants={slideInRight}>
                  <Link href={trainingData?.cta?.button2Link ? getHref(trainingData.cta.button2Link) : getHref("/our-team")}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-transparent border-2 border-white text-white hover:bg-white/10 shadow-xl px-8 py-6 text-lg font-bold rounded-2xl transition-all duration-300 hover:scale-105"
                    >
                      {trainingData?.cta?.button2Text ? getLocalizedContent(trainingData.cta.button2Text, language) : t("cta.meetCoaches")}
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
