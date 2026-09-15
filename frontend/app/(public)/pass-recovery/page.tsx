import type { Metadata } from "next"
import { PassRecoveryForm } from './pass-recovery-form'

export const metadata: Metadata = {
  title: "Recuperar contraseña | Vivania",
  description: "Restablece tu contraseña con el código enviado a tu correo.",
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PassRecoveryPage({ searchParams }: Props) {
  const params = await searchParams
  const email = typeof params.email === "string" ? params.email : ""

  return <PassRecoveryForm email={email} />
}
