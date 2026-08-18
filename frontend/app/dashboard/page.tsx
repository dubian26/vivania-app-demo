"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAppContext } from "@/contexts/app-context"

const subscribe = () => () => {}

export default function DashboardPage() {
  const { userSession, logout } = useAppContext()
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

  if (!mounted) return null

  if (!userSession) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
          <Title>Sesión no iniciada</Title>
          <p className="text-sm text-muted-foreground">
            Debes iniciar sesión para acceder a esta sección.
          </p>
          <Link href="/login">
            <Button className="cursor-pointer">Ir al inicio de sesión</Button>
          </Link>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <Title>¡Hola, {userSession.firstName}!</Title>
        <p className="text-sm text-muted-foreground">
          Has iniciado sesión correctamente como{" "}
          <span className="font-semibold text-foreground">
            {userSession.email}
          </span>
          .
        </p>
        {userSession.roleName && (
          <p className="text-xs text-muted-foreground">
            Rol: {userSession.roleName}
          </p>
        )}
        <Button variant="outline" className="cursor-pointer" onClick={logout}>
          Cerrar sesión
        </Button>
      </Card>
    </main>
  )
}
