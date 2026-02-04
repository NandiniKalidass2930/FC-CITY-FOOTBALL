"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ReactNode } from "react"

interface PremiumImageCardProps {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  priority?: boolean
  children?: ReactNode
  height?: string
  rounded?: string
  disableHoverZoom?: boolean
  unoptimized?: boolean
}

export function PremiumImageCard({
  src,
  alt,
  className = "",
  imageClassName = "",
  priority = false,
  children,
  height = "h-[300px] sm:h-[360px] md:h-[420px] lg:h-[480px]",
  rounded = "rounded-3xl",
  disableHoverZoom = false,
  unoptimized = false,
}: PremiumImageCardProps) {
  return (
    <motion.div
      whileHover={disableHoverZoom ? {} : {
        scale: 1.05,
        boxShadow: "0px 25px 60px rgba(59,61,172,0.35)",
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`
        relative
        w-full
        ${height}
        ${rounded}
        overflow-hidden
        mx-auto
        border border-[#3b3dac]/20
        group
        bg-white
        shadow-lg
        ${className}
      `}
    >
      {/* Glass/Glow Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-[#3b3dac]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none z-10" />
      
      {/* Border Glow on Hover */}
      <div className="absolute -inset-1 rounded-3xl bg-[#3b3dac]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-sm pointer-events-none z-20" />
      
      {/* Outer Shadow Glow */}
      <div className="absolute -inset-2 rounded-3xl bg-[#3b3dac]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out blur-2xl pointer-events-none z-0" />

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-all duration-700 ease-out ${disableHoverZoom ? '' : 'group-hover:scale-110'} ${imageClassName}`}
        priority={priority}
        unoptimized={unoptimized}
      />

      {/* Moving Light/Shine Reflection Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-30"
        initial={{ x: "-100%", skewX: -20 }}
        whileHover={{ x: "200%", skewX: -20 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Subtle Dark Overlay on Hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 ease-out pointer-events-none z-10" />

      {/* Content Overlay (for text/children) */}
      {children && (
        <div className="absolute inset-0 z-40">
          {children}
        </div>
      )}
    </motion.div>
  )
}
