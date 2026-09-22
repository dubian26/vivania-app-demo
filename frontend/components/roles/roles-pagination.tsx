import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "cn"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const BASE_PATH = "/roles"

interface Props {
  page: number
  hasMore: boolean
  search?: string
}

function buildHref(page: number, search?: string) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `${BASE_PATH}?${query}` : BASE_PATH
}

export function RolesPagination({ page, hasMore, search }: Props) {
  const previousHref = buildHref(page - 1, search)
  const nextHref = buildHref(page + 1, search)

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">Página {page}</p>
      <div className="flex items-center gap-2">
        {page <= 1 ? (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeft data-icon="inline-start" />
            Anterior
          </Button>
        ) : (
          <Link
            href={previousHref}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <ChevronLeft data-icon="inline-start" />
            Anterior
          </Link>
        )}
        {hasMore ? (
          <Link
            href={nextHref}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Siguiente
            <ChevronRight data-icon="inline-end" />
          </Link>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Siguiente
            <ChevronRight data-icon="inline-end" />
          </Button>
        )}
      </div>
    </div>
  )
}
