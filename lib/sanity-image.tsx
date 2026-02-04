import Image, { ImageProps } from 'next/image'
import { urlFor, isValidImage } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

interface SanityImageProps extends Omit<ImageProps, 'src'> {
  image: SanityImageSource | null | undefined
  width?: number
  height?: number
  quality?: number
  alt: string
  unoptimized?: boolean
}

/**
 * SanityImage Component
 * 
 * A wrapper around next/image that properly handles Sanity images
 * Uses Sanity's built-in optimization and bypasses Next.js optimization
 * to avoid private IP resolution issues
 * 
 * @example
 * <SanityImage
 *   image={sanityImage}
 *   alt="Description"
 *   fill
 *   className="object-cover"
 * />
 */
export function SanityImage({
  image,
  width,
  height,
  quality = 85,
  alt,
  unoptimized = true, // Default to true to use Sanity's optimization
  ...props
}: SanityImageProps) {
  if (!isValidImage(image)) {
    return (
      <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    )
  }

  // Use Sanity's optimization with urlFor
  const imageUrl = width && height
    ? urlFor(image).width(width).height(height).quality(quality).url()
    : width
    ? urlFor(image).width(width).quality(quality).url()
    : height
    ? urlFor(image).height(height).quality(quality).url()
    : urlFor(image).quality(quality).url()

  return (
    <Image
      src={imageUrl}
      alt={alt}
      unoptimized={unoptimized}
      {...props}
    />
  )
}
