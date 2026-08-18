"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"

import { Toaster } from "@/components/ui/sonner"
import { AppContext } from "@/contexts/app-context"
import { CustomError } from "@/lib/custom-error"
import { type UserInfoModel } from "@/models/user-info-model"

const SESSION_KEY = "userSession"

const readStoredSession = (): UserInfoModel | null => {
  // sessionStorage is not available on the server (Client Components
  // are also prerendered on the server)
  if (typeof window === "undefined") return null

  const savedSession = sessionStorage.getItem(SESSION_KEY)
  if (!savedSession) return null

  try {
    return JSON.parse(savedSession) as UserInfoModel
  } catch (error) {
    console.error("Error parsing session:", error)
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

interface Props {
  children: ReactNode
}

export const AppProvider = ({ children }: Props) => {
  const router = useRouter()
  const [userSession, setUserSession] = useState<UserInfoModel | null>(
    readStoredSession
  )

  const login = useCallback((userInfo: UserInfoModel) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userInfo))
    setUserSession(userInfo)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUserSession(null)
    router.push("/login")
  }, [router])

  // Alert context: turns any error into a toast.
  // If it is a CustomError from the backend, its message is shown
  // (e.g. "Credenciales inválidas." or "Errores de validación en los datos enviados.")
  const showError = useCallback((error: unknown) => {
    let message = ""
    if (typeof error === "string") {
      message = error
    } else if (error instanceof CustomError) {
      message = error.errorModel?.message || error.message
    } else if (error instanceof Error) {
      message = error.message
    } else {
      message = "Ha ocurrido un error inesperado"
    }

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
    () => ({ userSession, login, logout, showError, showMessage }),
    [userSession, login, logout, showError, showMessage]
  )

  return (
    <AppContext.Provider value={context}>
      <Toaster position="top-center" richColors={true} />
      {children}
    </AppContext.Provider>
  )
}
