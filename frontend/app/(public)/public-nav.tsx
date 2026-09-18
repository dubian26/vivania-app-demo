import { Title } from "@/components/common/title"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { cn } from "@/lib/utils"
import { BuildingComplexIcon } from "lucide-react"
import Link from "next/link"
import { MobileNavMenu } from "./mobile-nav-menu"

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Registrarse", path: "/signup" },
  { label: "Acerca de", path: "/about" },
]

export function PublicNav() {
  return (
    <header className={cn(
        "glass-header fixed top-0 right-0 left-0 z-50 border-b border-primary/10",
        "flex items-center justify-between px-6 py-4 lg:px-20"
      )}
    >
      <div className="flex items-center gap-10">
        <Link href="/login" className="group flex items-center gap-3">
          <BuildingComplexIcon
            strokeWidth={2}
            className="size-8! text-primary"
          />
          <Title
            as="span" translate="no"
            className="mb-0 self-center truncate text-xl leading-none tracking-tight md:text-2xl"
          >
            Vivania
          </Title>
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
