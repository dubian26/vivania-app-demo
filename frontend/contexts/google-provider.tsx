"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import type { ReactNode } from "react"

import { GOOGLE_CLIENT_ID } from "@/lib/constants"

interface Props {
  children: ReactNode
}

export function GoogleProvider({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  )
}
