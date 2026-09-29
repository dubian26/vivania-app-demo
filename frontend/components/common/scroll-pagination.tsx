"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import { LoadingDots } from "./loading-dots"

const PULL_THRESHOLD = 140
const PULL_RESISTANCE = 0.25
const PULL_IDLE_TIMEOUT = 1100

interface Props {
  loading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function ScrollPagination({ loading, hasMore, onLoadMore }: Props) {
  const [pullDistance, setPullDistance] = useState(0)
  const pullDistanceRef = useRef(0)
  const pullTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetPull = useCallback(() => {
    if (pullTimeoutRef.current) clearTimeout(pullTimeoutRef.current)

    pullDistanceRef.current = 0
    setPullDistance(0)
  }, [])

  const handleLoadMore = useCallback(() => {
    resetPull()
    onLoadMore()
  }, [onLoadMore, resetPull])

  useEffect(() => {
    if (!hasMore || loading) return

    const handleWheel = (event: WheelEvent) => {
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

  if (!hasMore && !loading) {
    return (
      <section
        className={cn(
          "flex min-h-16 w-full items-center justify-center text-center",
          "text-sm text-muted-foreground"
        )}
        aria-live="polite"
      >
        No hay más registros
      </section>
    )
  }

  return (
    <section
      className="relative flex w-full justify-center py-6"
      aria-label="Paginación de registros"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 h-40",
          "bg-linear-to-t from-background via-background/80 to-transparent"
        )}
        aria-hidden="true"
      />
      <div className="relative flex flex-col items-center gap-4">
        {
          loading ?
            <LoadingState /> :
            <LoadMoreState
              pullDistance={pullDistance}
              onLoadMore={handleLoadMore}
            />
        }
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Cargando más registros</span>
      <LoadingDots />
      <p className="text-sm text-muted-foreground">Cargando más registros…</p>
    </div>
  )
}

interface LoadMoreStateProps {
  pullDistance: number
  onLoadMore: () => void
}

function LoadMoreState({ pullDistance, onLoadMore }: LoadMoreStateProps) {
  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1)
  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col items-center gap-3 rounded-2xl border",
        "border-border/60 bg-background/65 px-8 py-5 shadow-lg shadow-foreground/5",
        "backdrop-blur-md transition-transform duration-150 ease-out",
        "supports-backdrop-filter:bg-background/55"
      )}
      style={{ transform: `translateY(-${pullDistance}px)` }}
    >
      <Button variant="outline" size="sm" onClick={onLoadMore}>
        Cargar más registros
      </Button>

      <div
        className="h-1 w-32 overflow-hidden rounded-full bg-muted"
        aria-hidden="true"
      >
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        O desliza hacia abajo desde el final
      </p>
    </div>
  )
}
