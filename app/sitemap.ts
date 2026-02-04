import { MetadataRoute } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fccityboys.ch'

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['en', 'de']
  const routes = [
    '',
    '/about',
    '/contact',
    '/gallery',
    '/our-team',
    '/training',
    '/faq',
  ]

  const sitemapEntries: MetadataRoute.Sitemap = []

  // Generate entries for each route and language
  routes.forEach((route) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${baseUrl}/en${route}`,
            de: `${baseUrl}/de${route}`,
            'x-default': `${baseUrl}/en${route}`,
          },
        },
      })
    })
  })

  return sitemapEntries
}
