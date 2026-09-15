"use client"

import { SidebarContext } from "@/components/layout/sidebar-context"
import { cn } from "@/lib/utils"
import * as Icon from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"

interface Props {
  iconName: string
  text: string
  alert: boolean
  to?: string
}

export function SidebarItem({ iconName, text, alert, to = "/" }: Props) {
  const path = usePathname()
  const isActive = path === to || (to !== "/" && path.startsWith(`${to}/`))
  const { expanded } = useContext(SidebarContext)

  const lucideIconName = iconName as keyof typeof Icon
  const LucideIcon = (Icon[lucideIconName] as Icon.LucideIcon) || Icon.LayoutGrid

  return (
    <Link
      href={to}
      className={cn(
        "relative flex items-center p-2 my-1 text-foreground",
        "font-medium rounded-md cursor-pointer transition-colors group",
        isActive
          ? "bg-linear-to-tr from-primary/40 to-primary/10 border-r-4 border-primary text-primary"
          : "hover:bg-primary/20"
      )}
    >
      <LucideIcon size={20} />
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all",
          expanded ? "w-52 ml-3" : "w-0"
        )}
      >
        {text}
      </span>

      {alert && (
        <div
          className={cn(
            "absolute right-2 size-2 rounded bg-primary",
            expanded ? "" : "top-2"
          )}
        />
      )}

      {!expanded && (
        <div
          className={cn(
            "absolute left-full rounded-md px-2 py-1 ml-6",
            "bg-primary/10 text-primary text-sm",
            "invisible opacity-20 -translate-x-3 transition-all",
            "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
          )}
        >
          {text}
        </div>
      )}
    </Link>
  )
}
