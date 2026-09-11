import { AuthLayout } from "@/components/common/auth-layout"
import type { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function AboutLayout({ children }: Props) {
  return <AuthLayout>{children}</AuthLayout>
}
