"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Progress } from "@base-ui/react/progress"
import { ArrowDown, Check, LoaderCircle } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

const PULL_THRESHOLD = 140
const PULL_RESISTANCE = 0.25
const PULL_IDLE_TIMEOUT = 1100
const MAX_PULL_OFFSET = 20
const numberFormatter = new Intl.NumberFormat("es-CO")

interface Props {
  loading: boolean
  hasMore: boolean
  loadedRows: number
  totalRows: number
  onLoadMore: () => void
}

export function ScrollPagination({
  loading,
  hasMore,
  loadedRows,
  totalRows,
  onLoadMore,
}: Props) {
  const [pullDistance, setPullDistance] = useState(0)
  const pullDistanceRef = useRef(0)
  const pullTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetPull = useCallback(() => {
    if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)

    pullDistanceRef.current = 0
    setPullDistance(0)
  }, [])

  const handleLoadMore = useCallback(() => {
    if (loading || !hasMore) return

    resetPull()
    onLoadMore()
  }, [loading, hasMore, onLoadMore, resetPull])

  useEffect(() => {
    if (!hasMore || loading) return

    const handleWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return

      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const isAtPageBottom =
        scrollTop + window.innerHeight >=
        document.documentElement.scrollHeight - 2

      if (!isAtPageBottom || event.deltaY <= 0) {
        resetPull()
        return
      }

      event.preventDefault()

      pullDistanceRef.current = Math.min(
        pullDistanceRef.current + event.deltaY * PULL_RESISTANCE,
        PULL_THRESHOLD * 1.5
      )
      setPullDistance(pullDistanceRef.current)

      if (pullDistanceRef.current >= PULL_THRESHOLD) {
        handleLoadMore()
        return
      }

      if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)
      pullTimeoutRef.current = setTimeout(resetPull, PULL_IDLE_TIMEOUT)
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
      if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)
    }
  }, [handleLoadMore, hasMore, loading, resetPull])

  const pullProgress =
    hasMore && !loading ? Math.min(pullDistance / PULL_THRESHOLD, 1) : 0
  const loadedLabel = numberFormatter.format(loadedRows)
  const totalLabel = numberFormatter.format(totalRows)
  const status = loading
    ? "Cargando más registros…"
    : totalRows === 0
      ? "Sin resultados"
      : hasMore
        ? `${loadedLabel} de ${totalLabel} registros cargados`
        : "Todos los registros cargados"

  return (
    <section
      className="@container w-full pt-2 pb-4"
      aria-label="Paginación de registros"
    >
      <p className="sr-only" role="status" aria-atomic="true">
        {status}
      </p>
      <div
        className={cn(
          "flex min-h-16 w-full flex-col gap-3 rounded-xl border px-4 py-2.5",
          "bg-card/75 shadow-sm shadow-foreground/5 backdrop-blur-md",
          "supports-backdrop-filter:bg-card/40",
          "transition-[transform,border-color] duration-200 ease-out",
          "motion-reduce:transform-none! motion-reduce:transition-none",
          "@min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:justify-between @min-[640px]:gap-4",
          pullProgress > 0 ? "border-primary/45" : "border-primary/20"
        )}
        style={{
          transform: `translateY(-${pullProgress * MAX_PULL_OFFSET}px)`,
        }}
        aria-busy={loading}
      >
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {totalRows === 0 ? (
              "0 registros encontrados"
            ) : (
              <>
                Mostrando{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {loadedLabel}
                </span>{" "}
                de{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {totalLabel}
                </span>{" "}
                {totalRows === 1 ? "registro" : "registros"}
              </>
            )}
          </p>
          {totalRows > 0 ? (
            <Progress.Root
              value={Math.min(loadedRows, totalRows)}
              max={totalRows}
              aria-label="Registros cargados"
              aria-valuetext={`${loadedLabel} de ${totalLabel} registros cargados`}
              className="w-full @min-[640px]:w-56"
            >
              <Progress.Track className="h-1 overflow-hidden rounded-full bg-primary/10">
                <Progress.Indicator className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" />
              </Progress.Track>
            </Progress.Root>
          ) : null}
        </div>

        {hasMore || loading ? (
          <div className="flex flex-col items-center gap-1.5 @min-[640px]:items-end">
            <Button
              variant="outline"
              disabled={loading}
              onClick={handleLoadMore}
              className="w-full @min-[640px]:w-auto @min-[640px]:min-w-48"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    data-icon="inline-start"
                    aria-hidden="true"
                    className="motion-safe:animate-spin"
                  />
                  Cargando…
                </>
              ) : (
                <>
                  Cargar más registros
                  <ArrowDown data-icon="inline-end" aria-hidden="true" />
                </>
              )}
            </Button>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground [@media(hover:hover)_and_(pointer:fine)]:flex">
              <PullIndicator progress={pullProgress} />
              <span>
                {loading
                  ? "Cargando más registros…"
                  : pullProgress > 0
                    ? "Continúa para cargar más"
                    : "Sigue desplazándote al final para cargar más"}
              </span>
            </div>
          </div>
        ) : totalRows > 0 ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="size-4 text-primary" />
            Todos los registros cargados
          </p>
        ) : null}
      </div>
    </section>
  )
}

function PullIndicator({ progress }: { progress: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0">
      <circle
        cx="10"
        cy="10"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary/15"
      />
      <circle
        cx="10"
        cy="10"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset={1 - progress}
        transform="rotate(-90 10 10)"
        className="text-primary transition-[stroke-dashoffset] duration-150 motion-reduce:transition-none"
      />
    </svg>
  )
}
