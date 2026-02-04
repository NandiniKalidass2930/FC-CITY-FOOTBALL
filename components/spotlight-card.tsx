"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion"

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  spotlightSize?: number
  spotlightIntensity?: number
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(59, 61, 172, 0.4)",
  spotlightSize = 300,
  spotlightIntensity = 0.6,
}: SpotlightCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations for spotlight position
  const springConfig = { damping: 25, stiffness: 200 }
  const spotlightX = useSpring(useTransform(mouseX, (x) => x - spotlightSize / 2), springConfig)
  const spotlightY = useSpring(useTransform(mouseY, (y) => y - spotlightSize / 2), springConfig)

  // Create dynamic background using motion template
  const background = useMotionTemplate`radial-gradient(${spotlightSize}px ${spotlightSize}px at ${spotlightX}px ${spotlightY}px, ${spotlightColor}, transparent 70%)`

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      mouseX.set(x)
      mouseY.set(y)
    },
    [mouseX, mouseY]
  )

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
    // Reset to center on leave
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      mouseX.set(rect.width / 2)
      mouseY.set(rect.height / 2)
    }
  }, [mouseX, mouseY])

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Spotlight Effect - Only visible on hover */}
      {isHovered && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-inherit"
          style={{
            background,
            mixBlendMode: "overlay",
            zIndex: 10,
            opacity: spotlightIntensity,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: spotlightIntensity }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  )
}
