"use client"

import { useState, useEffect, useMemo } from "react"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, Trophy, Users, Heart, ChevronDown } from "lucide-react"
import Image from "next/image"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { PremiumImageCard } from "@/components/premium-image-card"
import { client } from "@/sanity/lib/client"

/* ---------------- Animation Variants ---------------- */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

/* ---------------- Icon Map ---------------- */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Info,
  Trophy,
  Users,
  Heart,
}

/* ---------------- Premium Glass Panel Card ---------------- */
function PremiumCard({ children, isOpen = false }: { children: React.ReactNode; isOpen?: boolean }) {
  return (
    <motion.div 
      className="relative group rounded-3xl"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      {/* Soft Outer Glow - No Border */}
      <div
        className={`
          absolute -inset-2
          rounded-3xl
          bg-[#3b3dac]/8
          blur-2xl
          transition-all
          duration-600
          ease-in-out
          ${isOpen ? 'opacity-50 bg-[#3b3dac]/12' : 'opacity-0 group-hover:opacity-30 group-hover:bg-[#3b3dac]/10'}
        `}
      />

      {/* Background Glow Layer */}
      <div
        className={`
          absolute -inset-1
          rounded-3xl
          bg-[#3b3dac]/4
          blur-xl
          transition-all
          duration-600
          ease-in-out
          ${isOpen ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'}
        `}
      />

      {/* Main Card - Premium Glass Panel */}
      <div
        className={`
          relative z-10
          rounded-3xl
          bg-white/98
          backdrop-blur-xl
          p-6 sm:p-8 md:p-10
          transition-all
          duration-500
          ease-in-out
          shadow-lg shadow-gray-200/30
          ${isOpen 
            ? 'shadow-[0_20px_60px_rgba(59,61,172,0.08)] brightness-[1.01]' 
            : 'group-hover:shadow-[0_24px_72px_rgba(59,61,172,0.06)] group-hover:brightness-[1.005]'
          }
        `}
      >
        {children}
      </div>
    </motion.div>
  )
}

interface FAQItem {
  _id: string
  question: { en: string; de: string }
  answer: { en: string; de: string }
  icon: string
  order: number
}

export default function FAQPage() {
  const { t, language } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch FAQs from Sanity
  useEffect(() => {
    async function fetchFAQs() {
      try {
        setLoading(true)
        const query = `*[_type == "faq" && !(_id in path("drafts.**"))] | order(order asc) {
          _id,
          question {
            en,
            de
          },
          answer {
            en,
            de
          },
          icon,
          order
        }`
        
        const data = await client.fetch(query, {}, { 
          next: { revalidate: 0 },
          cache: 'no-store' as any 
        })
        
        if (data && Array.isArray(data) && data.length > 0) {
          setFaqs(data)
        } else {
          console.warn("⚠️ No FAQs found in Sanity. Please create FAQ documents in Sanity Studio.")
          setFaqs([])
        }
      } catch (error) {
        console.error("❌ Error fetching FAQs:", error)
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchFAQs()
  }, [])

  // Map Sanity FAQs to component format with language support
  const originalQuestions = React.useMemo(() => {
    if (!faqs || faqs.length === 0) {
      return []
    }
    
    const lang = language || "en"
    
    return faqs.map((faq) => {
      const Icon = iconMap[faq.icon] || Info
      
      const question = faq.question?.[lang as "en" | "de"] || faq.question?.en || faq.question?.de || ""
      const answer = faq.answer?.[lang as "en" | "de"] || faq.answer?.en || faq.answer?.de || ""
      
      return {
        q: question,
        a: answer,
        icon: Icon,
        _id: faq._id,
      }
    }).filter(faq => faq.q && faq.a) // Filter out FAQs with missing content
  }, [faqs, language])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <main className="flex-1">
        {/* ================= PREMIUM HERO SECTION ================= */}
        <section className="relative pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-32 bg-gradient-to-br from-white via-blue-50/20 to-white overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.015]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjM2IzZGFjIi8+PC9zdmc+')]" />
          </div>

          {/* Decorative Gradient Orbs */}
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#3b3dac]/6 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* LEFT SIDE - Heading and Subtitle */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="space-y-6"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight" style={{ color: '#3b3dac' }}>
                  {t("faq.title")}
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-black text-base sm:text-lg md:text-xl leading-relaxed"
                >
                  {t("faq.subtitle")}
                </motion.p>
              </motion.div>

              {/* RIGHT SIDE - Premium Card/Image Container */}
              <PremiumImageCard
                src="/images/faq/faq.jpg"
                alt={t("faq.heroImageAlt")}
                priority
              />
            </div>
          </div>
        </section>

        {/* ================= ORIGINAL FAQ SECTION ================= */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-gray-50/20 to-white relative">
        <div className="w-full mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 relative z-10">

            <div>
              {/* Section Header */}
              <div className="flex items-center gap-5 mb-8 sm:mb-10 pb-6 border-b border-gray-200/60">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b3dac]/12 to-blue-50/40 flex items-center justify-center shadow-md border border-[#3b3dac]/10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Info className="h-8 w-8 text-[#3b3dac]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#3b3dac] tracking-tight">
                  {t("faq.generalQuestions")}
                </h2>
              </div>

              {/* Original FAQ Items */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Loading FAQs...</p>
                </div>
              ) : originalQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No FAQs available. Please add FAQs in Sanity Studio.</p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {originalQuestions.map((faq, index) => {
                    const Icon = faq.icon
                    const isOpen = openIndex === index

                    return (
                      <div
                        key={faq._id || `faq-${index}`}
                        className="relative group"
                      >
                        <PremiumCard isOpen={isOpen}>
                          <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full text-left focus:outline-none focus:ring-2 focus:ring-[#3b3dac]/15 focus:ring-offset-2 rounded-3xl transition-all duration-200"
                            aria-expanded={isOpen}
                            aria-controls={`faq-answer-${index}`}
                          >
                            <div className="flex items-start gap-5 sm:gap-6">
                              {/* Icon */}
                              <motion.div 
                                className="flex-shrink-0 mt-1"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className={`
                                  relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl 
                                  bg-gradient-to-br from-[#3b3dac]/8 via-[#3b3dac]/4 to-blue-50/50 
                                  flex items-center justify-center 
                                  transition-all duration-500 ease-in-out
                                  ${isOpen ? 'bg-gradient-to-br from-[#3b3dac]/15 to-[#3b3dac]/10 shadow-md' : 'group-hover:bg-gradient-to-br group-hover:from-[#3b3dac]/12 group-hover:to-[#3b3dac]/8'}
                                  shadow-sm group-hover:shadow-md
                                `}>
                                  <Icon className={`
                                    h-6 w-6 sm:h-7 sm:w-7 
                                    text-[#3b3dac] 
                                    transition-all duration-400 ease-in-out
                                    ${isOpen ? 'scale-105' : 'group-hover:scale-105'}
                                  `} />
                                  {/* Subtle Glow */}
                                  <motion.div 
                                    className="absolute inset-0 rounded-xl bg-[#3b3dac]/8 blur-md"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isOpen ? 0.5 : 0 }}
                                    whileHover={{ opacity: 0.3 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                  />
                                </div>
                              </motion.div>

                              {/* Question */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <motion.h3 
                                    className={`
                                      text-lg sm:text-xl md:text-2xl 
                                      font-bold 
                                      pr-8 
                                      transition-all duration-300 ease-in-out
                                      leading-tight
                                      ${isOpen ? 'text-[#3b3dac]' : 'text-gray-900 group-hover:text-[#3b3dac]'}
                                    `}
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                  >
                                    {faq.q}
                                  </motion.h3>
                                  <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="flex-shrink-0"
                                  >
                                    <ChevronDown
                                      className={`
                                        h-5 w-5 sm:h-6 sm:w-6 
                                        text-[#3b3dac] 
                                        transition-all duration-300 ease-in-out
                                        ${isOpen ? 'scale-105' : 'group-hover:scale-105'}
                                      `}
                                    />
                                  </motion.div>
                                </div>

                                {/* Animated Underline */}
                                <motion.div 
                                  className="mt-4 h-[2px] bg-gradient-to-r from-[#3b3dac] via-blue-400/60 to-transparent"
                                  initial={{ width: 0 }}
                                  animate={{ width: isOpen ? "100%" : 0 }}
                                  whileHover={{ width: "100%" }}
                                  transition={{ duration: 0.4, ease: "easeInOut" }}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Answer */}
                          <AnimatePresence mode="wait">
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ 
                                  duration: 0.4,
                                  ease: "easeInOut"
                                }}
                                className="overflow-hidden"
                                id={`faq-answer-${index}`}
                              >
                                <motion.div 
                                  className="pt-7 mt-7 border-t border-gray-200/60"
                                  initial={{ x: -8, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                                >
                                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                                    {faq.a}
                                  </p>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </PremiumCard>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
