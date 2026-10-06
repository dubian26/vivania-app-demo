"use client"

import { AuthButton } from "@/components/common/auth-button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { UserFormDialog } from "./user-form-dialog"

interface Props {
  search: string
}

export function UserFilters({ search }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [term, setTerm] = useState(search)
  const [createOpen, setCreateOpen] = useState(false)

  // Server-side search: debounce the input and reflect it in the URL so the
  // server component refetches and the infinite scroll resets to page 1.
  useEffect(() => {
    if (term.trim() === search) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (term.trim()) params.set("search", term.trim())
      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      })
    }, 400)

    return () => clearTimeout(timeout)
  }, [term, search, pathname, router])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Buscar por nombre o email"
            className="pl-9"
            aria-label="Buscar usuarios"
          />
        </div>
        <AuthButton
          permissionPath="/usuarios/nuevo"
          type="button"
          onClick={() => setCreateOpen(true)}
        >
          <Plus data-icon="inline-start" />
          Nuevo Usuario
        </AuthButton>
      </div>
      <UserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
