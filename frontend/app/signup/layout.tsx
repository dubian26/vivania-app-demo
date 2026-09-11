import { AuthLayout } from "@/components/common/auth-layout"
import type { ReactNode } from "react"

export default function SignUpLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
