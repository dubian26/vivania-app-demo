"use client"

import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { Menu } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

interface MobileNavMenuProps {
  items: { label: string; path: string }[]
}

export function MobileNavMenu({ items }: MobileNavMenuProps) {
  return (
    <MenuPrimitive.Root>
      <MenuPrimitive.Trigger
        aria-label="Abrir menú"
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-lg",
          "text-primary transition-colors hover:bg-primary/10"
        )}
      >
        <Menu className="size-6" />
      </MenuPrimitive.Trigger>
      <MenuPrimitive.Portal>
        <MenuPrimitive.Positioner align="end" sideOffset={8}>
          <MenuPrimitive.Popup
            className={cn(
              "z-50 w-48 rounded-lg border border-border bg-popover",
              "p-1 text-popover-foreground shadow-lg outline-none",
              "origin-top transition-[opacity,scale] data-ending-style:scale-95",
              "data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
            )}
          >
            {items.map((item) => (
              <MenuPrimitive.Item
                key={item.path}
                render={
                  <Link
                    href={item.path}
                    className={cn(
                      "flex cursor-pointer rounded-md px-3 py-2 text-sm outline-none",
                      "data-highlighted:bg-primary/10 data-highlighted:text-primary"
                    )}
                  />
                }
              >
                {item.label}
              </MenuPrimitive.Item>
            ))}
          </MenuPrimitive.Popup>
        </MenuPrimitive.Positioner>
      </MenuPrimitive.Portal>
    </MenuPrimitive.Root>
  )
}
