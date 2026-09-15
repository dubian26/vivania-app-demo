import type { Metadata } from "next"
import { SignupForm } from './signup-form'

export const metadata: Metadata = {
  title: "Crear cuenta | Vivania",
  description: "Regístrate para comenzar a administrar tu condominio.",
}

export default function SignupPage() {
  return <SignupForm />
}
