"use client"

import { ProfileMenu } from "@/components/layout/profile-menu"
import { SidebarContext } from "@/components/layout/sidebar-context"
import { cn } from "@/lib/utils"
import { UserInfoModel } from '@/models/user-info-model'
import { Leaf, Menu, Settings } from "lucide-react"
import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"

interface Props {
  userSession: UserInfoModel
  children: ReactNode
}

export function Sidebar({ userSession, children }: Props) {
  const [expanded, setExpanded] = useState(true)
  const contextValue = useMemo(() => ({ expanded }), [expanded])

  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 z-50 glass-header flex flex-col",
        "overflow-hidden transition-all duration-300",
        expanded ? "w-72" : "md:w-16 w-0"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Alternar menú"
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "size-10 min-w-10 rounded-full cursor-pointer flex items-center",
            "justify-center text-primary hover:bg-primary/10 transition-colors"
          )}
        >
          <Menu size={20} />
        </button>
        <div className="group flex items-center gap-3">
          <div
            className={cn(
              "hidden sm:flex bg-primary p-2 rounded-lg items-center justify-center",
              "text-primary-foreground shadow-lg shadow-primary/20",
              "transition-transform group-hover:scale-110"
            )}
          >
            <Leaf size={20} />
          </div>
          <Link href="/dashboard" className="text-lg sm:text-xl font-bold tracking-tight truncate">
            Vivania
          </Link>
        </div>
      </div>

      <nav className="flex-1 min-h-0 flex flex-col pt-3">
        <SidebarContext.Provider value={contextValue}>
          <ul className="flex-1 overflow-y-auto px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-primary flex justify-end items-center p-3">
          <ProfileMenu userSession={userSession}>
            <span
              aria-label="Perfil"
              className={cn(
                "size-10 min-w-10 rounded-full flex items-center justify-center",
                "text-primary cursor-pointer hover:bg-primary/10 transition-colors"
              )}
            >
              <Settings size={20} />
            </span>
          </ProfileMenu>
        </div>
      </nav>
    </aside>
  )
}
