import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"

interface TitleProps extends Omit<ComponentPropsWithoutRef<"h1">, "children"> {
  as?: TitleTag
  children: ReactNode
}

export function Title({ children, className, as: Tag = "h1", ...props }: TitleProps) {
  return (
    <Tag
      className={cn(
        "mb-1 inline-block self-start text-lg font-bold md:text-xl",
        "[&_svg]:shrink-0 [&_svg]:text-primary",
        "bg-linear-to-r from-primary to-emerald-400 to-150%",
        "bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
