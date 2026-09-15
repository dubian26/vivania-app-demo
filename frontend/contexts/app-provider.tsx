"use client"

import { Toaster } from "@/components/ui/sonner"
import { AppContext } from "@/contexts/app-context"
import { CustomError } from "@/lib/custom-error"
import { useCallback, useEffect, useMemo, type ReactNode } from "react"
import { toast } from "sonner"

interface Props {
  children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
  // Alert context: turns any error into a toast.
  // If it is a CustomError from the backend, its message is shown
  // (e.g. "Credenciales inválidas." or "Errores de validación en los datos enviados.")
  const showError = useCallback((error: unknown) => {
    if (typeof error === "string") {
      toast.error("¡Ha ocurrido un error!", {
        description: error,
        duration: 5000,
      })
      return
    }

    if (error instanceof CustomError) {
      const message = error.errorModel?.message || error.message
      const details = error.errorModel?.details ?? []

      if (details.length > 0) {
        toast.error(message, {
          description: (
            <ul>
              {details.map((detail, index) => 
                <li key={`${detail.property}-${index}`} className="ml-4 list-disc">
                  {detail.message}
                </li>
              )}
            </ul>
          ),
          duration: 5000,
        })
        return
      }

      toast.error("¡Ha ocurrido un error!", {
        description: message,
        duration: 5000,
      })
      return
    }

    const message = error instanceof Error ?
      error.message : "Ha ocurrido un error inesperado"

    toast.error("¡Ha ocurrido un error!", {
      description: message,
      duration: 5000,
    })
  }, [])

  const showMessage = useCallback((message: string) => {
    toast.success("¡Operación exitosa!", { description: message })
  }, [])

  // Safety net: uncaught async errors are also shown as an alert
  // instead of going unnoticed
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Promise Rejection:", event.reason)
      showError(event.reason)
      event.preventDefault()
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [showError])

  const context = useMemo(
    () => ({ showError, showMessage }),
    [showError, showMessage]
  )

  return (
    <AppContext.Provider value={context}>
      <Toaster position="top-center" />
      {children}
    </AppContext.Provider>
  )
}
