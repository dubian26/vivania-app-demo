"use client"

import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { Loader2, LogIn, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { cn } from "@/lib/utils"
import { userRepository } from "@/repositories/user-repository"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export function LoginForm() {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showError, showMessage, login } = useAppContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)

  const handleClickLogin = async () => {
    if (!email.trim() || !password) {
      showError("Ingresa tu correo electrónico y contraseña")
      return
    }

    const authPromise = userRepository.authenticate(email, password)
    const userInfo = await run(authPromise)

    if (userInfo) {
      login(userInfo)
      showMessage(`Bienvenido/a, ${userInfo.firstName}`)
      router.push("/dashboard")
    }
  }

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const authPromise = userRepository.googleAuthenticate(response.credential!)
    const userInfo = await run(authPromise)

    if (userInfo) {
      login(userInfo)
      showMessage(`Bienvenido/a, ${userInfo.firstName}`)
      router.push("/dashboard")
    }
  }

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
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showError("Error al iniciar sesión con Google")}
            useOneTap
            theme="outline"
            shape="pill"
            width="100%"
          />

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

          <Button
            type="submit"
            onClick={handleClickLogin}
            disabled={loading}
            className="mt-4 w-full cursor-pointer"
          >
            {
              loading ?
              <Loader2 size={20} className="animate-spin" /> :
              <LogIn size={20} strokeWidth={3} />
            }
            {
              loading ?
              "Iniciando sesión..." :
              "Iniciar sesión"
            }
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
