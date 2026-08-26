import { RecuperarPasswordForm } from "@/components/login/recuperar-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Recuperar contraseña | Vivania",
  description: "Restablece tu contraseña con el código enviado a tu correo.",
}

export default async function RecuperarPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const email = typeof params.email === "string" ? params.email : ""

  return <RecuperarPasswordForm email={email} />
}
