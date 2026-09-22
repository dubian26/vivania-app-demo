"use client"

import { auth } from "@/lib/auth"
import type { PermissionModel } from "@/models/permission-model"
import { useEffect } from "react"

interface Props {
  permissions: PermissionModel[]
}

// Bridges the server-fetched permissions into the client-side auth store so
// useAuth()/AuthButton can evaluate them synchronously. Rendered as a client
// boundary on purpose: the auth singleton must never be mutated on the server.
export function AuthPermissionsSync({ permissions }: Props) {
  useEffect(() => {
    auth.setPermisos(permissions)
  }, [permissions])

  return null
}
