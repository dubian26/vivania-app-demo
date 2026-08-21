import { Leaf } from "lucide-react"
import Link from "next/link"

import { MobileNavMenu } from "@/components/login/mobile-nav-menu"
import { ThemeToggle } from "@/components/login/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Registrarse", path: "/registrarse" },
  { label: "Acerca de", path: "/acerca-de" },
]

export function LoginNav() {
  return (
    <header className={cn(
        "glass-header fixed top-0 right-0 left-0 z-50 border-b border-primary/10",
        "flex items-center justify-between px-6 py-4 lg:px-20"
      )}
    >
      <div className="flex items-center gap-10">
        <Link href="/login" className="group flex items-center gap-3">
          <div className={cn(
              "flex items-center justify-center rounded-lg bg-primary p-2",
              "text-primary-foreground shadow-lg shadow-primary/20",
              "transition-transform group-hover:scale-110"
            )}
          >
            <Leaf size={20} />
          </div>
          <h2 className="text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
            Vivania
          </h2>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm font-medium text-muted-foreground",
                "transition-colors hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <ThemeToggle />
        <div className="md:hidden">
          <MobileNavMenu items={navItems} />
        </div>
      </div>
    </header>
  )
}
