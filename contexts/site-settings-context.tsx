"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { fetchSiteSettings, SiteSettings } from "@/lib/site-settings"

interface SiteSettingsContextType {
  settings: SiteSettings | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchSiteSettings()
      setSettings(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load site settings"
      setError(errorMessage)
      console.error("Error loading site settings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, refetch: loadSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider")
  }
  return context
}
