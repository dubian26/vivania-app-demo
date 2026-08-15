"use client"

import { cn } from "@/lib/utils"
import { LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)

  return (
    <div className={cn(
      "w-full max-w-md animate-in duration-500 fade-in slide-in-from-left-5",
      "fill-mode-backwards motion-reduce:animate-none"
    )}>
      <Card className="border-2 border-border p-8 shadow-lg">
        <div className="mb-8">
          <Title>Bienvenido</Title>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>
        </div>

        <div className="mb-6 flex flex-col items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full cursor-pointer rounded-full"
          >
            <GoogleIcon />
            Continuar con Google
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ó</span>
            </div>
          </div>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label
              htmlFor="login-email"
              className="block px-1 text-sm text-foreground"
            >
              Correo Electrónico
            </label>
            <div className="group relative">
              <Mail
                className={cn(
                  "absolute top-1/2 left-3 -translate-y-1/2",
                  "text-muted-foreground transition-colors group-focus-within:text-primary"
                )}
                size={20}
              />
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label
                htmlFor="login-password"
                className="block text-sm text-foreground"
              >
                Contraseña
              </label>
              <button
                type="button" onClick={() => setShowRecoveryDialog(true)}
                className={cn(
                  "cursor-pointer border-none bg-transparent text-xs",
                  "font-semibold text-primary hover:underline"
                )}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <PasswordInput password={password} onChange={setPassword} />
          </div>

          <Button type="submit" className="mt-4 w-full cursor-pointer">
            <LogIn size={20} strokeWidth={3} />
            Iniciar sesión
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?
            <Link
              href="/registrarse"
              className="ml-1 font-bold text-primary hover:underline"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </Card>

      <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              Se enviará un código de verificación a{" "}
              <strong>{email || "tu correo"}</strong> para que puedas
              restablecer tu contraseña.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRecoveryDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={() => setShowRecoveryDialog(false)}>
              Confirmar y enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
