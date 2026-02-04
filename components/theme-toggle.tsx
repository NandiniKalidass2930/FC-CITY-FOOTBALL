"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = !mounted
    ? "light"
    : theme === "system"
    ? resolvedTheme
    : theme

  // Get the current icon based on resolved theme
  const getIcon = () => {
    if (!mounted) return <Sun className="h-4 w-4" />

    if (currentTheme === "dark") {
      return <Moon className="h-4 w-4" />
    }

    if (currentTheme === "light") {
      return <Sun className="h-4 w-4" />
    }

    return <Monitor className="h-4 w-4" />
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full border border-slate-200/70 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 shadow-sm transition-colors"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-11 w-11 min-h-[44px] min-w-[44px] relative touch-manipulation rounded-full border border-slate-200/70 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 shadow-sm transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme || "system"}
              initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {getIcon()}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer transition-colors"
        >
          <Sun className="mr-2 h-4 w-4 text-foreground [&]:text-foreground" />
          <span>Light Mode</span>
          <AnimatePresence>
            {theme === "light" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="ml-auto"
              >
                <Check className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer transition-colors"
        >
          <Moon className="mr-2 h-4 w-4 text-foreground [&]:text-foreground" />
          <span>Dark Mode</span>
          <AnimatePresence>
            {theme === "dark" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="ml-auto"
              >
                <Check className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer transition-colors"
        >
          <Monitor className="mr-2 h-4 w-4 text-foreground [&]:text-foreground" />
          <span>System Mode</span>
          <AnimatePresence>
            {theme === "system" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="ml-auto"
              >
                <Check className="h-4 w-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
