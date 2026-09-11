import { AuthLayout } from "@/components/common/auth-layout"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function PassRecoveryLayout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>
}
