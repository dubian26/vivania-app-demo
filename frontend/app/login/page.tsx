import { LoginFeatures } from "@/app/login/login-features"
import { LoginForm } from "@/app/login/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Iniciar sesión | Vivania",
  description: "Ingresa tus credenciales para acceder a tu cuenta.",
}

export default function LoginPage() {
  return (
    <>
      <LoginForm />
      <LoginFeatures />
    </>
  )
}
