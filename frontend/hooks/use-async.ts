import { useCallback, useState } from "react"

import { useAppContext } from "@/contexts/app-context"

/**
 * Hook for handling async operations with loading state
 * and automatic error alert. Avoids repetitive try-catch blocks
 * in components.
 */
export const useAsync = (initialLoading = false) => {
  const { showError } = useAppContext()
  const [loading, setLoading] = useState(initialLoading)

  const run = useCallback(
    async <T>(promise: Promise<T>): Promise<T | undefined> => {
      // Force async to avoid the "cascading renders" warning
      // if used inside a useEffect
      await Promise.resolve()
      setLoading(true)
      try {
        return await promise
      } catch (error) {
        showError(error)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [showError]
  )

  return { run, loading }
}
