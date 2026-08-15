"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

import { cn } from "@/lib/utils"

const subscribe = () => () => {}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Tema claro" : "Tema oscuro"}
      className={cn(
        "theme-toggle-btn flex size-10 items-center justify-center rounded-lg",
        "cursor-pointer transition-all hover:scale-110 active:scale-90"
      )}
    >
      {mounted && isDark ? (
        <Sun className="size-5 text-primary" />
      ) : (
        <Moon className="size-5 text-primary" />
      )}
    </button>
  )
}
