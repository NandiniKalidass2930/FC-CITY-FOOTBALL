import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ 
  projectId: projectId || 'vumt2wwt',
  dataset: dataset || 'production'
})

/**
 * Centralized helper function to generate optimized image URLs from Sanity image sources
 * Works seamlessly with next/image component
 * 
 * @param source - Sanity image source (can be image object, asset reference, or URL string)
 * @returns Image URL builder with chainable methods
 * 
 * @example
 * // Basic usage
 * urlFor(image).url()
 * 
 * // With transformations
 * urlFor(image).width(800).height(600).quality(90).url()
 * 
 * // For next/image
 * <Image src={urlFor(image).url()} alt="..." />
 */
export const urlFor = (source: SanityImageSource | null | undefined): {
  url: () => string
  width: (w: number) => any
  height: (h: number) => any
  quality: (q: number) => any
  format: (f: 'webp' | 'jpg' | 'png' | 'avif') => any
  fit: (f: string) => any
  crop: (c: string) => any
} => {
  if (!source) {
    // Return a safe fallback builder
    const fallbackBuilder = builder.image('')
    return {
      url: () => '',
      width: () => fallbackBuilder,
      height: () => fallbackBuilder,
      quality: () => fallbackBuilder,
      format: () => fallbackBuilder,
      fit: () => fallbackBuilder,
      crop: () => fallbackBuilder,
    }
  }
  
  try {
    return builder.image(source)
  } catch (error) {
    console.error('Error creating image URL:', error)
    const fallbackBuilder = builder.image('')
    return {
      url: () => '',
      width: () => fallbackBuilder,
      height: () => fallbackBuilder,
      quality: () => fallbackBuilder,
      format: () => fallbackBuilder,
      fit: () => fallbackBuilder,
      crop: () => fallbackBuilder,
    }
  }
}

/**
 * Check if a Sanity image source is valid
 * @param source - Sanity image source to validate
 * @returns true if the image source is valid
 */
export const isValidImage = (source: SanityImageSource | null | undefined): boolean => {
  if (!source) return false
  
  // Check if it's an object with asset reference
  if (typeof source === 'object' && 'asset' in source) {
    return source.asset !== null && source.asset !== undefined
  }
  
  // Check if it's a direct asset reference
  if (typeof source === 'object' && '_ref' in source) {
    return source._ref !== null && source._ref !== undefined
  }
  
  // Check if it's a string URL
  if (typeof source === 'string') {
    return source.length > 0
  }
  
  return false
}

/**
 * Get optimized image URL with sensible defaults
 * @param source - Sanity image source
 * @param width - Desired width (default: 1200)
 * @param height - Desired height (optional)
 * @param quality - Image quality 1-100 (default: 85)
 * @returns Optimized image URL string
 */
export const getOptimizedImageUrl = (
  source: SanityImageSource | null | undefined,
  width: number = 1200,
  height?: number,
  quality: number = 85
): string => {
  if (!isValidImage(source)) return ''
  
  const imageBuilder = urlFor(source)
  let builder = imageBuilder.width(width).quality(quality)
  
  if (height) {
    builder = builder.height(height)
  }
  
  return builder.url()
}
