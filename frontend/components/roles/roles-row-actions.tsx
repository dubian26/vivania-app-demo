"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { useAppContext } from "@/contexts/app-context"
import { useAsync } from "@/hooks/use-async"
import { useAuth } from "@/hooks/use-auth"
import type { RoleModel } from "@/models/role-model"
import { createRoleRepo } from "@/repositories/role-repository"
import { Loader2, Lock, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RoleFormDialog } from "./role-form-dialog"

interface Props {
  role: RoleModel
}

// Actions for a roles table row. Serializable props only: the parent table is
// a Server Component, so handlers/dialogs must live inside this island.
export function RolesRowActions({ role }: Props) {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()
  const { authorizedTo } = useAuth()
  const canEdit = authorizedTo("/roles/editar")
  const canDelete = authorizedTo("/roles/inactivar")
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDelete = async () => {
    const result = await run(createRoleRepo().delete(role.id))
    if (!result) return

    showMessage(result.message)
    setConfirmOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Bloquear ${role.name}`}
              />
            }
          >
            <Lock />
          </TooltipTrigger>
          <TooltipContent>Bloquear</TooltipContent>
        </Tooltip>
        {canEdit && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Editar ${role.name}`}
                  onClick={() => setEditOpen(true)}
                />
              }
            >
              <Pencil />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}
        {canDelete && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Eliminar ${role.name}`}
                  onClick={() => setConfirmOpen(true)}
                />
              }
            >
              <Trash2 />
            </TooltipTrigger>
            <TooltipContent>Eliminar</TooltipContent>
          </Tooltip>
        )}
      </div>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => !open && setConfirmOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar rol</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que deseas eliminar el rol {role.name}? Esta acción es
              permanente y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RoleFormDialog
        open={editOpen}
        role={role}
        onOpenChange={setEditOpen}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
