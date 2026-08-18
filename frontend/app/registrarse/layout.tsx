import type { ReactNode } from "react"

import { AuthLayout } from "@/components/login/auth-layout"

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>
}
