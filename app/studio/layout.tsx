/**
 * Layout for Sanity Studio route
 * This ensures the studio doesn't inherit the language layout
 */

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
