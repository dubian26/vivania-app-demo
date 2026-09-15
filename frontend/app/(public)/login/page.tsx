import type { Metadata } from "next"
import { LoginFeatures } from "./login-features"
import { LoginForm } from "./login-form"

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
