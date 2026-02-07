"use client"

import Image from "next/image"
import { useLayoutEffect, useMemo, useRef, useState } from "react"

export type TeamMarqueeItem = {
  key: string
  badge: string
  imageUrl: string
  alt?: string
}

export function TeamGroupPhotosMarquee({
  items,
  pxPerSecond = 22,
  className = "",
}: {
  items: TeamMarqueeItem[]
  pxPerSecond?: number
  className?: string
}) {
  const setRef = useRef<HTMLDivElement | null>(null)
  const [durationSec, setDurationSec] = useState<number>(45)

  const safeItems = useMemo(() => items.filter((i) => Boolean(i.imageUrl)), [items])

  // Keep speed consistent (px/sec) by deriving duration from the width of ONE set.
  useLayoutEffect(() => {
    const el = setRef.current
    if (!el) return

    const update = () => {
      const w = el.scrollWidth || el.getBoundingClientRect().width || 0
      if (!w) return
      const d = w / Math.max(1, pxPerSecond)
      // clamp to avoid absurdly fast/slow animations on edge cases
      setDurationSec(Math.max(12, Math.min(120, d)))
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
  }, [pxPerSecond, safeItems.length])

  if (safeItems.length === 0) return null

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div
        className="team-marquee-track gap-4 sm:gap-6 py-2"
        style={{ ["--team-marquee-duration" as any]: `${durationSec}s` }}
      >
        {/* One full set (measured) */}
        <div ref={setRef} className="flex gap-4 sm:gap-6 w-max">
          {safeItems.map((item) => (
            <div
              key={`marquee-${item.key}`}
              className="relative shrink-0 min-w-[280px] sm:min-w-[360px] lg:min-w-[420px]"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt || item.badge}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#3b3dac]/80 text-white text-xs font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate set for seamless infinite loop */}
        <div aria-hidden="true" className="flex gap-4 sm:gap-6 w-max">
          {safeItems.map((item) => (
            <div
              key={`marquee-dup-${item.key}`}
              className="relative shrink-0 min-w-[280px] sm:min-w-[360px] lg:min-w-[420px]"
            >
              <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt || item.badge}
                    fill
                    loading="lazy"
                    className="object-cover"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#3b3dac]/80 text-white text-xs font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

