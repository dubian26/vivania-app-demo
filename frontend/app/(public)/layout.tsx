import { cn } from "cn"
import { type ReactNode } from "react"
import { PublicNav } from "./public-nav"

interface Props {
  children: ReactNode
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none fixed inset-0 -z-1" />
      <PublicNav />

      <main
        className={cn(
          "relative z-10 flex flex-1 flex-col items-center lg:flex-row",
          "justify-center gap-16 px-6 pt-24 pb-6 lg:px-24"
        )}
      >
        {children}
      </main>

      <footer
        className={cn(
          "relative z-10 flex flex-col items-center justify-between",
          "gap-4 border-t border-border px-6 py-4 text-xs font-medium",
          "text-muted-foreground md:flex-row lg:px-20"
        )}
      >
        <p>© 2026 Vivania. Demo de aplicación de gestión de condominios.</p>
      </footer>
    </div>
  )
}
