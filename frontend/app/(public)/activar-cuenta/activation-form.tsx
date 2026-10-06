"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { createUserRepo } from "@/repositories/user-repository"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Props {
  email: string
}

export function ActivationForm({ email: initialEmail }: Props) {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showError, showMessage } = useAppContext()
  const [enteredEmail, setEnteredEmail] = useState("")
  const email = (initialEmail || enteredEmail).trim()
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleActivate = async () => {
    if (password !== confirmPassword) {
      showError("Las contraseñas no coinciden")
      return
    }

    const result = await run(
      createUserRepo().verifyEmail({
        email,
        code,
        purpose: "ALTA_ADMIN",
        password,
      })
    )

    if (!result) return
    showMessage(result.message)
    router.push(result.userInfo ? "/dashboard" : "/login")
    router.refresh()
  }

  const handleResend = async () => {
    if (countdown > 0) return
    const result = await run(
      createUserRepo().resendOtp({
        email,
        purpose: "ALTA_ADMIN",
      })
    )

    if (!result) return
    showMessage(result.message)
    setCountdown(60)
    setCode("")
  }

  return (
    <Card className="flex w-full max-w-md flex-col gap-6 border-2 border-border p-6 shadow-lg sm:p-8">
      <div>
        <Title>Activa tu cuenta</Title>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Ingresa el código enviado a tu correo y elige tu contraseña de acceso.
        </p>
      </div>

      {initialEmail ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Correo de la cuenta</p>
          <p className="text-sm font-medium break-words text-foreground">
            {email}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="activation-email">Correo electrónico</Label>
          <Input
            id="activation-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEnteredEmail(event.target.value)}
            disabled={loading}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="activation-code">Código de verificación</Label>
        <InputOTP
          id="activation-code"
          maxLength={6}
          value={code}
          onChange={setCode}
          disabled={loading}
        >
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Contraseña</Label>
        <PasswordInput
          password={password}
          onChange={setPassword}
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Confirmar contraseña</Label>
        <PasswordInput
          password={confirmPassword}
          onChange={setConfirmPassword}
          disabled={loading}
        />
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          className="h-11 w-full"
          onClick={handleActivate}
          disabled={
            loading || code.length !== 6 || !password || !confirmPassword
          }
        >
          {loading && (
            <Loader2 className="animate-spin" data-icon="inline-start" />
          )}
          Activar cuenta
        </Button>
        <Button
          className="h-11 w-full"
          variant="outline"
          onClick={handleResend}
          disabled={loading || countdown > 0 || !email.trim()}
        >
          {countdown > 0
            ? `Reenviar código en ${countdown}s`
            : "Reenviar código"}
        </Button>
      </div>
    </Card>
  )
}
