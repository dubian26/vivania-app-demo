import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface TitleProps {
  children: ReactNode
  className?: string
}

export function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={cn(
        "mb-3 inline-block self-start text-2xl font-extrabold md:text-3xl",
        "[&_svg]:shrink-0 [&_svg]:text-primary",
        "bg-linear-to-r from-primary to-emerald-400 to-150%",
        "bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </h1>
  )
}
