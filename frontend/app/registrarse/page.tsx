import type { Metadata } from "next"

import { RegisterForm } from "@/components/login/register-form"

export const metadata: Metadata = {
  title: "Crear cuenta | Vivania",
  description: "Regístrate para comenzar a comprar en la tienda online.",
}

export default function RegisterPage() {
  return <RegisterForm />
}
