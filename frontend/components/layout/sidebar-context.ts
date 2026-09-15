"use client"

import { createContext } from "react"

interface SidebarContextValue {
  expanded: boolean
}

export const SidebarContext = createContext<SidebarContextValue>({
  expanded: true,
})
