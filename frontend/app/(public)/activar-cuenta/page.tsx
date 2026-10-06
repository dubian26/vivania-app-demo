import type { Metadata } from "next"
import { ActivationForm } from "./activation-form"

export const metadata: Metadata = {
  title: "Activar cuenta | Vivania",
  description:
    "Verifica tu correo y elige tu contraseña para activar tu cuenta.",
}

interface Props {
  searchParams: Promise<{ email?: string | string[] }>
}

export default async function ActivationPage({ searchParams }: Props) {
  const params = await searchParams
  const email = typeof params.email === "string" ? params.email : ""

  return <ActivationForm email={email} />
}
