"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Language } from "@/lib/i18n"
import { getTranslation, getMessages } from "@/lib/i18n-loader"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: {
    (namespace: string, key: string): string
    (key: string): string
  }
  getMessages: (namespace: string) => any
  getHref: (path: string, targetLang?: Language) => string
}

const LanguageContext = React.createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [language, setLanguageState] = React.useState<Language>("en")
  const [mounted, setMounted] = React.useState(false)

  // Extract language from URL pathname
  React.useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split('/').filter(Boolean)
      const firstSegment = pathSegments[0]
      
      if (firstSegment === 'en' || firstSegment === 'de') {
        setLanguageState(firstSegment as Language)
      } else {
        // Default to English if no language in URL
        setLanguageState('en')
      }
    }
    setMounted(true)
  }, [pathname])

  // Update HTML lang attribute
  React.useEffect(() => {
    if (mounted && typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language, mounted])

  // Change language by updating URL
  const setLanguage = React.useCallback(
    (lang: Language) => {
      if (!pathname) return

      const pathSegments = pathname.split('/').filter(Boolean)
      const currentLang = pathSegments[0]

      // If current path starts with a language code, replace it
      if (currentLang === 'en' || currentLang === 'de') {
        pathSegments[0] = lang
      } else {
        // If no language in path, prepend it
        pathSegments.unshift(lang)
      }

      const newPath = '/' + pathSegments.join('/')
      router.push(newPath)
    },
    [pathname, router]
  )

  // Translation function - supports both old format t("key") and new format t("namespace", "key")
  const t = React.useCallback(
    (namespaceOrKey: string, key?: string): string => {
      // If key is provided, use new format: t("namespace", "key")
      if (key !== undefined) {
        return getTranslation(language, namespaceOrKey as any, key)
      }
      
      // Otherwise, try to infer namespace from the key (backward compatibility)
      // Try to match common patterns
      const keyParts = namespaceOrKey.split('.')
      if (keyParts.length > 1) {
        const possibleNamespace = keyParts[0]
        const possibleKey = keyParts.slice(1).join('.')
        
        // Try common namespaces
        const namespaces: Array<keyof typeof import('@/lib/i18n-loader').messages.en> = [
          'home', 'about', 'ourTeam', 'gallery', 'training', 'faq', 'contact', 'navbar', 'footer'
        ]
        
        if (namespaces.includes(possibleNamespace as any)) {
          return getTranslation(language, possibleNamespace as any, possibleKey)
        }
      }
      
      // Fallback: try to find in any namespace (for backward compatibility)
      // This is less efficient but maintains compatibility
      const namespaces: Array<keyof typeof import('@/lib/i18n-loader').messages.en> = [
        'home', 'about', 'ourTeam', 'gallery', 'training', 'faq', 'contact', 'navbar', 'footer'
      ]
      
      for (const ns of namespaces) {
        try {
          const result = getTranslation(language, ns, namespaceOrKey)
          if (result !== namespaceOrKey) {
            return result
          }
        } catch {
          // Continue to next namespace
        }
      }
      
      return namespaceOrKey
    },
    [language]
  )

  // Get messages for a namespace
  const getMessagesForNamespace = React.useCallback(
    (namespace: string) => {
      return getMessages(language, namespace as any)
    },
    [language]
  )

  // Function to generate language-prefixed hrefs
  const getHref = React.useCallback(
    (path: string, targetLang?: Language) => {
      const lang = targetLang || language
      // Remove leading slash if present
      const cleanPath = path.startsWith('/') ? path.slice(1) : path
      // Ensure path doesn't already have a language prefix
      const pathWithoutLang = cleanPath.startsWith('en/') || cleanPath.startsWith('de/')
        ? cleanPath.split('/').slice(1).join('/')
        : cleanPath
      return `/${lang}${pathWithoutLang ? '/' + pathWithoutLang : ''}`
    },
    [language]
  )

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getMessages: getMessagesForNamespace,
        getHref,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Hook for namespace-bound translations
// Maps folder names (kebab-case) to namespace keys (camelCase)
const namespaceMap: Record<string, keyof typeof import('@/lib/i18n-loader').messages.en> = {
  "our-team": "ourTeam",
  "ourTeam": "ourTeam",
  "home": "home",
  "about": "about",
  "gallery": "gallery",
  "training": "training",
  "faq": "faq",
  "contact": "contact",
  "navbar": "navbar",
  "footer": "footer",
}

export function useTranslations(namespace: string) {
  const { language } = useLanguage()
  
  // Map namespace to the correct key (handle both "our-team" and "ourTeam")
  const mappedNamespace = namespaceMap[namespace] || namespace
  
  const t = React.useCallback(
    (key: string): string => {
      return getTranslation(language, mappedNamespace as any, key)
    },
    [language, mappedNamespace]
  )
  
  return { t }
}
