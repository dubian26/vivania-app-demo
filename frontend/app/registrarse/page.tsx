import { RegisterForm } from "@/components/login/register-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Crear cuenta | Vivania",
  description: "Regístrate para comenzar a administrar tu condominio.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
