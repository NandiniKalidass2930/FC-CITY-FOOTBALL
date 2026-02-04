"use client"

import * as React from "react"
import { ArrowUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            type="button"
            size="icon-lg"
            variant="ghost"
            onClick={scrollToTop}
            className="rounded-full bg-[#3b3dac] text-white shadow-lg shadow-[#3b3dac]/40 hover:shadow-[#3b3dac]/70 hover:scale-105 dark:bg-[#1e293b] dark:text-slate-100 dark:shadow-slate-900/60 dark:hover:shadow-slate-900/80 transition-transform transition-shadow duration-200 border border-white/10 dark:border-slate-700/80 backdrop-blur-md"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

