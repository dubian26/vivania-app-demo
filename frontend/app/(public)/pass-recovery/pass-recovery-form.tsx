"use client"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { PasswordInput } from "@/components/ui/password-input"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { cn } from "@/lib/utils"
import { userRepository } from "@/repositories/user-repository"
import { CheckCircle2, Loader2, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Step = "otp" | "password" | "success"

interface Props {
  email: string
}

export function PassRecoveryForm({ email }: Props) {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showError, showMessage } = useAppContext()

  const [step, setStep] = useState<Step>("otp")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, countdown])

  const handleVerifyOtp = async () => {
    if (code.length !== 6) {
      showError("Ingresa el código de 6 dígitos")
      return
    }

    const result = await run(
      userRepository.verifyEmail(email, code, "RECUPERACION")
    )

    if (result) {
      showMessage(result.message || "Código verificado correctamente.")
      setStep("password")
    }
  }

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      showError("Ingresa tu nueva contraseña")
      return
    }

    if (newPassword !== confirmPassword) {
      showError("Las contraseñas no coinciden")
      return
    }

    // verifyEmail already set the session cookies (implicit login),
    // so PATCH /auth/profile is authenticated.
    const result = await run(
      userRepository.updateProfile({ password: newPassword })
    )

    if (result !== undefined) {
      showMessage(result.message || "Contraseña actualizada con éxito")
      setStep("success")
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    const result = await run(userRepository.resendOtp(email, "RECUPERACION"))
    if (result) {
      showMessage(result.message || "Nuevo código enviado")
      setCountdown(60)
      setCode("")
    }
  }

  if (!email && step !== "success") {
    return (
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 py-12 text-center">
        <Title>Error</Title>
        <p className="text-sm text-muted-foreground">
          No se proporcionó un correo electrónico.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="h-11 cursor-pointer"
        >
          Volver al Login
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "w-full max-w-md animate-in duration-500 fade-in slide-in-from-left-5",
        "fill-mode-backwards motion-reduce:animate-none"
      )}
    >
      <Card className="border-2 border-border p-8 shadow-lg">
        {step === "otp" && (
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div
              className={cn(
                "mb-2 flex size-16 items-center justify-center",
                "rounded-full bg-primary/10 text-primary"
              )}
            >
              <Mail size={32} />
            </div>

            <div>
              <Title>Verifica tu correo</Title>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Hemos enviado un código de 6 dígitos a <b>{email}</b>.
                Ingrésalo para restablecer tu contraseña.
              </p>
            </div>

            <div className="flex w-full justify-center py-4">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={handleVerifyOtp}
                disabled={loading || code.length !== 6}
                className="h-11 w-full cursor-pointer gap-2 text-base font-bold"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Verificar código"
                )}
              </Button>

              <Button
                variant="outline"
                disabled={loading || countdown > 0}
                onClick={handleResendOtp}
                className="h-11 w-full cursor-pointer"
              >
                {countdown > 0
                  ? `Reenviar código en ${countdown}s`
                  : "Reenviar código"}
              </Button>

              <Button
                variant="ghost"
                disabled={loading}
                onClick={() => router.push("/login")}
                className="h-11 w-full cursor-pointer text-muted-foreground"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </div>
        )}

        {step === "password" && (
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div
              className={cn(
                "mb-2 flex size-16 items-center justify-center",
                "rounded-full bg-primary/10 text-primary"
              )}
            >
              <Lock size={32} />
            </div>

            <div>
              <Title>Nueva contraseña</Title>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Ingresa tu nueva contraseña de acceso.
              </p>
            </div>

            <div className="w-full space-y-4 text-left">
              <div className="space-y-1">
                <label className="block px-1 text-sm text-foreground">
                  Contraseña
                </label>
                <PasswordInput
                  password={newPassword}
                  disabled={loading}
                  onChange={setNewPassword}
                />
              </div>
              <div className="space-y-1">
                <label className="block px-1 text-sm text-foreground">
                  Confirmar contraseña
                </label>
                <PasswordInput
                  password={confirmPassword}
                  disabled={loading}
                  onChange={setConfirmPassword}
                />
              </div>
            </div>

            <Button
              onClick={handleUpdatePassword}
              disabled={
                loading || !newPassword || newPassword !== confirmPassword
              }
              className="h-11 w-full cursor-pointer gap-2 text-base font-bold"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Actualizar contraseña"
              )}
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center gap-6 py-4 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <div>
              <Title>¡Todo listo!</Title>
              <p className="mt-2 text-sm text-muted-foreground">
                Tu contraseña ha sido actualizada correctamente.
              </p>
            </div>
            <Button
              className="h-11 w-full cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Ir al inicio de sesión
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
