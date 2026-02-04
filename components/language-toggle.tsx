"use client"

import * as React from "react"
import { Globe, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import type { Language } from "@/lib/i18n"

const languages: Array<{ code: Language; label: string; codeLabel: string }> = [
  { code: "en", label: "English", codeLabel: "EN" },
  { code: "de", label: "Deutsch", codeLabel: "DE" },
]

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        className="h-11 min-h-[44px] px-3 touch-manipulation gap-2"
      >
        <Globe className="h-5 w-5 text-foreground" />
        <span className="text-sm font-medium text-foreground">EN</span>
        <span className="sr-only">Select language</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-11 min-h-[44px] px-2 sm:px-3 touch-manipulation gap-1.5 sm:gap-2 hover:bg-accent"
        >
          <Globe className="h-5 w-5 text-foreground shrink-0" />
          <span className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {currentLanguage.codeLabel}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="cursor-pointer flex items-center justify-between py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-foreground font-medium">{lang.label}</span>
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                {lang.codeLabel}
              </span>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-[#0054A8] ml-3 shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
