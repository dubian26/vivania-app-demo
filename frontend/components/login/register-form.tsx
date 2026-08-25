"use client"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { cn } from "@/lib/utils"
import { userRepository } from "@/repositories/user-repository"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import {
    CheckCircle2,
    Loader2,
    Mail,
    User,
    UserRoundPlus,
} from "lucide-react"

type Step = "REGISTER" | "VERIFY"

export function RegisterForm() {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showError, showMessage, login } = useAppContext()

  const [step, setStep] = useState<Step>("REGISTER")

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(60)

  useEffect(() => {
    if (step === "VERIFY" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, countdown])

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    const authPromise = userRepository.googleAuthenticate(response.credential!)
    const userInfo = await run(authPromise)

    if (userInfo) {
      login(userInfo)
      showMessage(`Bienvenido/a, ${userInfo.firstName}`)
      router.push("/dashboard")
    }
  }

  const handleClickRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      showError("Ingresa tu nombre y apellido")
      return
    }

    if (password !== confirmPassword) {
      showError("Las contraseñas no coinciden")
      return
    }

    const regisPromise = userRepository.register({ email, password, firstName, lastName })
    const result = await run(regisPromise)

    if (result) {
      const msg = "Cuenta creada. Te enviamos un código a tu correo."
      showMessage(result.message || msg)
      setStep("VERIFY")
      setCountdown(60)
    }
  }

  const handleClickVerify = async () => {
    if (code.length !== 6) {
      showError("El código debe tener 6 dígitos")
      return
    }

    const verifyPromise = userRepository.verifyEmail(email, code)
    const result = await run(verifyPromise)

    if (result) {
      const msg = "Correo verificado. Bienvenido/a."
      showMessage(result.message || msg)
      if (result.userInfo) {
        login(result.userInfo)
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }

  const handleClickResend = async () => {
    if (countdown > 0) return

    const resendPromise = userRepository.resendOtp(email)
    const result = await run(resendPromise)

    if (result) {
      const msg = "Código reenviado. Revisa tu correo."
      showMessage(result.message || msg)
      setCountdown(60)
      setCode("")
    }
  }

  return (
    <div
      className={cn(
        "w-full max-w-2xl animate-in duration-500 fade-in slide-in-from-left-5",
        "fill-mode-backwards motion-reduce:animate-none"
      )}
    >
      <Card className="border-2 border-border p-8 shadow-lg md:p-10">
        {step === "REGISTER" && (
          <>
            <div className="mb-8">
              <Title>Crear Cuenta</Title>
              <p className="text-sm text-muted-foreground">
                Completa los campos para registrarte y comenzar a comprar.
              </p>
            </div>

            <div className="mb-6 flex flex-col items-center gap-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => showError("Error al registrarse con Google")}
                useOneTap={false} theme="outline" shape="pill"
              />

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-4 text-muted-foreground">
                    ó
                  </span>
                </div>
              </div>
            </div>

            <form className="space-y-0" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-12 gap-x-4 gap-y-5">
                <div className="col-span-12 space-y-1">
                  <label className="block px-1 text-sm text-foreground">
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
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      disabled={loading}
                      className="pl-10"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-12 space-y-1 md:col-span-6">
                  <label className="block px-1 text-sm text-foreground">
                    Nombres
                  </label>
                  <div className="group relative">
                    <User
                      className={cn(
                        "absolute top-1/2 left-3 -translate-y-1/2",
                        "text-muted-foreground transition-colors group-focus-within:text-primary"
                      )}
                      size={20}
                    />
                    <Input
                      type="text"
                      placeholder="Nombres"
                      value={firstName}
                      disabled={loading}
                      className="pl-10"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-12 space-y-1 md:col-span-6">
                  <label className="block px-1 text-sm text-foreground">
                    Apellidos
                  </label>
                  <div className="group relative">
                    <User
                      className={cn(
                        "absolute top-1/2 left-3 -translate-y-1/2",
                        "text-muted-foreground transition-colors group-focus-within:text-primary"
                      )}
                      size={20}
                    />
                    <Input
                      type="text"
                      placeholder="Apellidos"
                      value={lastName}
                      disabled={loading}
                      className="pl-10"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-span-12 space-y-1 md:col-span-6">
                  <label className="block px-1 text-sm text-foreground">
                    Contraseña
                  </label>
                  <PasswordInput
                    password={password}
                    disabled={loading}
                    onChange={setPassword}
                  />
                </div>

                <div className="col-span-12 space-y-1 md:col-span-6">
                  <label className="block px-1 text-sm text-foreground">
                    Confirmar Contraseña
                  </label>
                  <PasswordInput
                    password={confirmPassword}
                    disabled={loading}
                    onChange={setConfirmPassword}
                  />
                </div>

                <div className="col-span-12 mt-2">
                  <Button
                    type="submit" onClick={handleClickRegister} disabled={loading}
                    className="h-11 w-full cursor-pointer gap-2 text-base font-bold"
                  >
                    {
                      loading ?
                      <Loader2 size={20} className="animate-spin" /> :
                      <UserRoundPlus size={20} strokeWidth={3} />
                    }
                    {loading ? "Registrando..." : "Crear mi cuenta"}
                  </Button>
                </div>
              </div>
            </form>
          </>
        )}

        {
          step === "VERIFY" &&
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className={cn(
              "mb-2 flex size-16 items-center justify-center",
              "rounded-full bg-primary/10 text-primary"
            )}>
              <Mail size={32} />
            </div>

            <div>
              <Title>Verifica tu correo</Title>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Hemos enviado un código de 6 dígitos a <b>{email}</b>.
                Ingrésalo a continuación para continuar.
              </p>
            </div>

            <div className="flex w-full justify-center py-4">
              <InputOTP
                maxLength={6} value={code}
                onChange={setCode} disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="w-full space-y-3">
              <Button
                onClick={handleClickVerify}
                disabled={loading || code.length !== 6}
                className="h-11 w-full cursor-pointer gap-2 text-base font-bold"
              >
                {
                  loading ?
                  <Loader2 size={20} className="animate-spin" /> :
                  <CheckCircle2 size={20} />
                }
                Verificar Código
              </Button>

              <Button
                variant="outline"
                disabled={loading || countdown > 0}
                onClick={handleClickResend}
                className="h-11 w-full cursor-pointer"
              >
                {
                  countdown > 0 ?
                  `Reenviar código en ${countdown}s`:
                  "Reenviar código"
                }
              </Button>

              <Button
                variant="ghost" disabled={loading}
                onClick={() => setStep("REGISTER")}
                className="h-11 w-full cursor-pointer text-muted-foreground"
              >
                Volver al registro
              </Button>
            </div>
          </div>
        }

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Al registrarte, aceptas nuestros{" "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Términos de Servicio
          </a>{" y "}
          <a href="#" className="font-semibold text-primary hover:underline">
            Política de Privacidad
          </a>{"."}
        </p>
      </Card>
    </div>
  )
}
