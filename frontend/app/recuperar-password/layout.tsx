import { AuthLayout } from "@/components/login/auth-layout"
import type { ReactNode } from "react"

export default function RecuperarPasswordLayout({
  children,
}: {
  children: ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
