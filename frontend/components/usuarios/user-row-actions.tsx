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
import { UserModel } from "@/models/user-model"
import { createUserRepo } from "@/repositories/user-repository"
import { Loader2, Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserFormDialog } from "./user-form-dialog"

interface Props {
  user: UserModel
}

export function UserRowActions({ user }: Props) {
  const router = useRouter()
  const { run, loading } = useAsync()
  const { showMessage } = useAppContext()
  const { authorizedTo } = useAuth()
  const canEdit = authorizedTo("/usuarios/editar")
  const canDeactivate = authorizedTo("/usuarios/inactivar")
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDeactivate = async () => {
    const repository = createUserRepo()
    const promise = repository.update({ id: user.id, active: false })
    const result = await run(promise)
    if (!result) return

    showMessage(result.message)
    setConfirmOpen(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        {canEdit && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Editar ${user.email}`}
                  className="cursor-pointer"
                  onClick={() => setEditOpen(true)}
                />
              }
            >
              <Pencil />
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>
        )}
        {canDeactivate && (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Inactivar ${user.email}`}
                  disabled={!user.active}
                  className="cursor-pointer text-destructive hover:text-destructive disabled:text-muted-foreground"
                  onClick={() => setConfirmOpen(true)}
                />
              }
            >
              <Trash2 />
            </TooltipTrigger>
            <TooltipContent>Inactivar</TooltipContent>
          </Tooltip>
        )}
      </div>

      <AlertDialog
        open={confirmOpen}
        onOpenChange={(open) => !open && setConfirmOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inactivar usuario</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que deseas inactivar al usuario {user.email}? No podrá
              acceder al sistema hasta que se active nuevamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeactivate}
              disabled={loading}
            >
              {loading && (
                <Loader2 className="animate-spin" data-icon="inline-start" />
              )}
              Inactivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UserFormDialog
        open={editOpen}
        user={user}
        onOpenChange={setEditOpen}
        onSaved={() => router.refresh()}
      />
    </>
  )
}
